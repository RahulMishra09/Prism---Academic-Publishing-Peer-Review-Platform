import { Request, Response, NextFunction } from "express";
import { Role } from "../../generated/prisma/index.js";
import { sendError } from "../utils/apiResponse.js";

/**
 * requireRole(...roles)
 * ---------------------
 * Factory that returns a middleware which guards a route to only the
 * specified roles. Must be used AFTER `authenticate` so that `req.user`
 * is already populated.
 *
 * Usage:
 *   router.get("/admin", authenticate, requireRole(Role.ADMIN), handler)
 *   router.get("/review", authenticate, requireRole(Role.REVIEWER, Role.EDITOR), handler)
 *
 * Responds with:
 *  - 401  if `req.user` is missing (authenticate was not applied)
 *  - 403  if the user's role is not in the allowed list
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, { statusCode: 401, message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, {
        statusCode: 403,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
      return;
    }

    next();
  };
};
