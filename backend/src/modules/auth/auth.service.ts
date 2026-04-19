import { prisma } from "../../config/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { AppError } from "../../middleware/error.middleware.js";
import { createAuditLog } from "../admin/admin.service.js";
import { sendWelcomeEmail } from "../emails/email.service.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Store a new refresh token in the database */
async function storeRefreshToken(userId: string, token: string): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
}

/**
 * registerUser
 * Creates a new user account with READER role (default).
 * Returns access token + refresh token.
 */
export const registerUser = async (input: RegisterInput, ip?: string) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name:     input.name,
      email:    input.email,
      password: hashedPassword,
    },
    select: {
      id:        true,
      name:      true,
      email:     true,
      role:      true,
      createdAt: true,
    },
  });

  const payload  = { userId: user.id, role: user.role };
  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await storeRefreshToken(user.id, refreshToken);

  await createAuditLog({ action: "USER_CREATED", actorId: user.id, targetId: user.id, targetType: "user", ip });
  sendWelcomeEmail(user.email, user.name);

  return { user, accessToken, refreshToken };
};

/**
 * loginUser
 * Validates credentials and returns access + refresh tokens.
 */
export const loginUser = async (input: LoginInput, ip?: string) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isBanned) {
    throw new AppError("Your account has been suspended", 403);
  }

  const isMatch = await comparePassword(input.password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const payload      = { userId: user.id, role: user.role };
  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await storeRefreshToken(user.id, refreshToken);

  await createAuditLog({
    action:     "LOGIN",
    actorId:    user.id,
    targetId:   user.id,
    targetType: "user",
    ip,
  });

  return {
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * refreshAccessToken
 * Validates a refresh token, rotates it (revoke old, issue new), returns new tokens.
 */
export const refreshAccessToken = async (oldRefreshToken: string) => {
  // Verify JWT signature first
  let payload: { userId: string; role: string };
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  // Look up in DB and ensure it's not revoked / expired
  const stored = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
    include: { user: { select: { id: true, name: true, email: true, role: true, isBanned: true } } },
  });

  if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
    throw new AppError("Refresh token is invalid or expired", 401);
  }

  if (stored.user.isBanned) {
    throw new AppError("Your account has been suspended", 403);
  }

  // Revoke the old token (rotation)
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data:  { isRevoked: true, revokedAt: new Date() },
  });

  // Issue new token pair
  const newPayload      = { userId: stored.user.id, role: stored.user.role };
  const newAccessToken  = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);
  await storeRefreshToken(stored.user.id, newRefreshToken);

  return {
    user: {
      id:    stored.user.id,
      name:  stored.user.name,
      email: stored.user.email,
      role:  stored.user.role,
    },
    accessToken:  newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * logoutUser
 * Revokes the provided refresh token.
 */
export const logoutUser = async (refreshToken: string, userId: string, ip?: string) => {
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken, userId, isRevoked: false },
    data:  { isRevoked: true, revokedAt: new Date() },
  });

  await createAuditLog({
    action:     "LOGOUT",
    actorId:    userId,
    targetId:   userId,
    targetType: "user",
    ip,
  });
};
