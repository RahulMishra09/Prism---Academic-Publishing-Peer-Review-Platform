import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "./auth.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

/** POST /auth/register */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors, data: null });
      return;
    }
    const result = await registerUser(parsed.data, req.ip);
    sendSuccess(res, { statusCode: 201, message: "Account created successfully", data: result });
  } catch (err) { next(err); }
};

/** POST /auth/login */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors, data: null });
      return;
    }
    const result = await loginUser(parsed.data, req.ip);
    sendSuccess(res, { statusCode: 200, message: "Login successful", data: result });
  } catch (err) { next(err); }
};

/** POST /auth/refresh  — exchange refresh token for new token pair */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "refreshToken is required", data: null });
      return;
    }
    const result = await refreshAccessToken(parsed.data.refreshToken);
    sendSuccess(res, { statusCode: 200, message: "Token refreshed", data: result });
  } catch (err) { next(err); }
};

/** POST /auth/logout  — revoke refresh token */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success || !req.user) {
      res.status(400).json({ success: false, message: "refreshToken is required", data: null });
      return;
    }
    await logoutUser(parsed.data.refreshToken, req.user.userId, req.ip);
    sendSuccess(res, { statusCode: 200, message: "Logged out successfully", data: null });
  } catch (err) { next(err); }
};
