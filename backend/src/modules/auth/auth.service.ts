import crypto from "crypto";
import { prisma } from "../../config/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken, verifyToken } from "../../utils/jwt.js";
import { AppError } from "../../middleware/error.middleware.js";
import { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } from "../../utils/email.js";
import { env } from "../../config/env.js";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schema.js";

// ── register ────────────────────────────────────────────────
export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError("Email is already registered", 409);

  const hashedPassword = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const accessToken  = signToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  // Generate email verification token
  const verifyToken_ = crypto.randomBytes(32).toString("hex");
  const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await prisma.verificationToken.create({
    data: { token: verifyToken_, userId: user.id, expiresAt: verifyExpires },
  });

  const verifyUrl = `${env.APP_URL}/verify-email?token=${verifyToken_}`;

  // Fire-and-forget welcome + verification email
  void sendWelcomeEmail(user.email, user.name);
  void sendVerificationEmail(user.email, user.name, verifyUrl);

  return { user, accessToken, refreshToken };
};

// ── login ───────────────────────────────────────────────────
export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true, name: true, email: true, password: true, role: true, isBanned: true,
      firstName: true, lastName: true, orcid: true, affiliation: true, avatarUrl: true,
    },
  });

  if (!user) throw new AppError("Invalid email or password", 401);
  if (user.isBanned) throw new AppError("Your account has been suspended", 403);

  const isMatch = await comparePassword(input.password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const accessToken  = signToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: {
      id: user.id, name: user.name, email: user.email, role: user.role,
      firstName: user.firstName, lastName: user.lastName,
      orcid: user.orcid, affiliation: user.affiliation, avatarUrl: user.avatarUrl,
    },
    accessToken,
    refreshToken,
  };
};

// ── getMe ───────────────────────────────────────────────────
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, role: true, isBanned: true,
      firstName: true, lastName: true, orcid: true, affiliation: true, avatarUrl: true, bio: true,
      createdAt: true, updatedAt: true,
    },
  });

  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ── ipCheck ─────────────────────────────────────────────────
export const checkIp = async (ip: string) => {
  // In a real system this would query an IP-to-institution database.
  // Returning a structured placeholder so the frontend contract is satisfied.
  return {
    institution: {
      id: null,
      name: null,
      ipAddress: ip,
      type: "unknown",
      hasAccess: false,
    },
  };
};

// ── forgotPassword ───────────────────────────────────────────
export const forgotPassword = async (input: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Always return success to prevent email enumeration
  if (!user) return { accepted: true };

  // Invalidate any existing unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;

  // Fire-and-forget — token is still valid even if email fails
  void sendPasswordResetEmail(user.email, user.name, resetUrl);

  return { accepted: true };
};

// ── resetPassword ────────────────────────────────────────────
export const resetPassword = async (input: ResetPasswordInput) => {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: input.token },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const hashed = await hashPassword(input.password);

  await Promise.all([
    prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
    // Revoke all refresh tokens so existing sessions are invalidated
    prisma.refreshToken.updateMany({ where: { userId: record.userId }, data: { isRevoked: true } }),
  ]);

  return { success: true };
};

// ── refreshAccessToken ───────────────────────────────────────
export const refreshAccessToken = async (token: string) => {
  const record = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: { select: { id: true, role: true, isBanned: true } } },
  });

  if (!record || record.isRevoked || record.expiresAt < new Date()) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (record.user.isBanned) {
    throw new AppError("Your account has been suspended", 403);
  }

  // Rotate: revoke old, issue new
  const newRefreshToken = await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({ where: { id: record.id }, data: { isRevoked: true } });
    return createRefreshTokenTx(tx, record.userId);
  });

  const accessToken = signToken({ userId: record.user.id, role: record.user.role });

  return { accessToken, refreshToken: newRefreshToken };
};

// ── verifyEmail ──────────────────────────────────────────────
export const verifyEmail = async (token: string) => {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  await Promise.all([
    prisma.user.update({ where: { id: record.userId }, data: { isVerified: true } }),
    prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } }),
  ]);

  return { verified: true };
};

// ── resendVerification ───────────────────────────────────────
export const resendVerification = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, isVerified: true },
  });
  if (!user) throw new AppError("User not found", 404);
  if (user.isVerified) throw new AppError("Email is already verified", 409);

  // Invalidate existing tokens
  await prisma.verificationToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.verificationToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`;
  void sendVerificationEmail(user.email, user.name, verifyUrl);

  return { sent: true };
};

// ── helpers ──────────────────────────────────────────────────
const createRefreshToken = async (userId: string): Promise<string> => {
  const token     = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  return token;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRefreshTokenTx = async (tx: any, userId: string): Promise<string> => {
  const token     = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await tx.refreshToken.create({ data: { token, userId, expiresAt } });
  return token;
};

// Keep named export for backward compatibility with logout
export { verifyToken };
