import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  userId: string;
  role: string;
}

/** Sign a short-lived access token (15 minutes) */
export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" } as jwt.SignOptions);
};

/** Sign a refresh token (7 days) */
export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" } as jwt.SignOptions);
};

/** Verify an access token */
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as JwtPayload;
};

/** Verify a refresh token */
export const verifyRefreshToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  return decoded as JwtPayload;
};

/**
 * @deprecated Use signAccessToken instead.
 * Kept for backward compatibility during migration.
 */
export const signToken = (payload: JwtPayload): string => signAccessToken(payload);
