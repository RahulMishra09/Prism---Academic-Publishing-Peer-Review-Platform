import { prisma } from "../../config/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";
import { AppError } from "../../middleware/error.middleware.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

/**
 * registerUser
 * ------------
 * Creates a new user account with READER role (default).
 * Throws 409 if the email is already registered.
 * Returns the created user (no password) + signed JWT.
 */
export const registerUser = async (input: RegisterInput) => {
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
      // role defaults to READER via Prisma schema
    },
    select: {
      id:        true,
      name:      true,
      email:     true,
      role:      true,
      createdAt: true,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });

  return { user, token };
};

/**
 * loginUser
 * ---------
 * Validates credentials and returns the user + signed JWT.
 * Uses the same generic error for wrong email AND wrong password
 * to prevent user enumeration attacks.
 * Throws 403 if the account is banned.
 */
export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Generic message  do NOT reveal whether email exists
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

  const token = signToken({ userId: user.id, role: user.role });

  return {
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
    token,
  };
};
