import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/apiResponse.js";
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
