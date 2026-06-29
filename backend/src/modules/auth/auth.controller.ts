import { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "./auth.schema.js";
import {
  registerUser,
  loginUser,
  getMe,
  checkIp,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  verifyEmail,
  resendVerification,
} from "./auth.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { verifyToken, signToken } from "../../utils/jwt.js";
import { addToBlacklist } from "../../utils/tokenBlacklist.js";

// ── POST /auth/register ──────────────────────────────────────
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const result = await registerUser(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Account created successfully", data: result });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/login ─────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const result = await loginUser(parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Login successful", data: result });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/logout ────────────────────────────────────────
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ code: "BAD_REQUEST", message: "No token provided" });
      return;
    }
    const payload = verifyToken(token);
    const expiresAt = payload.exp ?? Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    addToBlacklist(token, expiresAt);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ── GET /auth/me ─────────────────────────────────────────────
export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getMe(req.user!.userId);

    // Auto-refresh token if role changed in the database
    let accessToken;
    if (user.role !== req.user!.role) {
      accessToken = signToken({ userId: user.id, role: user.role });
    }

    sendSuccess(res, { statusCode: 200, message: "User profile", data: { ...user, accessToken } });
  } catch (err) {
    next(err);
  }
};

// ── GET /auth/ip-check ───────────────────────────────────────
export const ipCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const result = await checkIp(ip);
    sendSuccess(res, { statusCode: 200, message: "IP check result", data: result });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/forgot-password ───────────────────────────────
export const forgotPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const result = await forgotPassword(parsed.data);
    sendSuccess(res, {
      statusCode: 202,
      message: "If that email is registered you will receive a reset link shortly",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/reset-password ────────────────────────────────
export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const result = await resetPassword(parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Password reset successfully", data: result });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/verify-email ──────────────────────────────────
export const verifyEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.body?.token;
    if (!token || typeof token !== "string") {
      res.status(400).json({ code: "BAD_REQUEST", message: "Token is required" });
      return;
    }
    const result = await verifyEmail(token);
    sendSuccess(res, { statusCode: 200, message: "Email verified successfully", data: result });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/resend-verification ──────────────────────────
export const resendVerificationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await resendVerification(req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "Verification email sent", data: result });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/refresh ───────────────────────────────────────
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = refreshTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const result = await refreshAccessToken(parsed.data.refreshToken);
    sendSuccess(res, { statusCode: 200, message: "Tokens refreshed", data: result });
  } catch (err) {
    next(err);
  }
};
