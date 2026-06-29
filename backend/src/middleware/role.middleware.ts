import { Request, Response, NextFunction } from "express";
import { Role } from "../../generated/prisma/index.js";
import { sendError } from "../utils/apiResponse.js";

/**
 * requireRole(...roles)
 * ---------------------
 * Factory that returns a middleware which guards a route to only the
 * specified roles. Must be used AFTER `authenticate` so that `req.user`
 * is already populated.
 * Express middleware must always have exactly three arguments: (req, res, next).
If we wrote it normally, we couldn't pass in the roles we want to allow. 
The factory allows us to "inject" the specific roles before the middleware actually runs.
 *
If we didn't use an outer function, we would have to write a brand new middleware for every single combination of roles:

 * Usage:
 *   router.get("/admin", authenticate, requireRole(Role.ADMIN), handler)
 * this route requires the user to be an admin so we check if current user is an admin
 *   router.get("/review", authenticate, requireRole(Role.REVIEWER, Role.EDITOR), handler)
 *
 * Responds with:
 *  - 401  if `req.user` is missing (authenticate was not applied)
 *  - 403  if the user's role is not in the allowed list
 */
export const requireRole = (...allowedRoles: Role[]) => { 
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) { // extra check to see if the user is authenticated
      sendError(res, { statusCode: 401, message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) { // check if the user's role is in the allowed list
      sendError(res, {
        statusCode: 403,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
      return;
    }

    next();
  };
};
