import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/apiResponse.js";
import { isBlacklisted } from "../utils/tokenBlacklist.js";
import { Role } from "../../generated/prisma/index.js";

/**
 * authenticate
 * ------------
 * Reads the `Authorization: Bearer <token>` header, verifies the JWT,
 * and populates `req.user` with `{ userId, role }` for downstream handlers.
 *
 * Responds with 401 when:
 *  - No / malformed Authorization header
 *  - Token is expired, tampered or invalid
 */
/**
 * optionalAuthenticate
 * --------------------
 * Like authenticate but doesn't reject unauthenticated requests —
 * it simply leaves req.user undefined so handlers can check it themselves.
 */
export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();

  const token = authHeader.split(" ")[1];
  if (!token || isBlacklisted(token)) return next();

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role as Role };
  } catch {
    // Invalid token — just skip, don't block
  }
  next();
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, { statusCode: 401, message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    sendError(res, { statusCode: 401, message: "Malformed authorization header" });
    return;
  }

  // Check if token is blacklisted (logged out)
  if (isBlacklisted(token)) {
    sendError(res, { statusCode: 401, message: "Token has been revoked" });
    return;
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role as Role,
    };

    next();
  } catch (err: unknown) {
    const isExpired =
      err instanceof Error && err.name === "TokenExpiredError";

    sendError(res, {
      statusCode: 401,
      message: isExpired ? "Token has expired" : "Invalid token",
    });
  }
};
