import { Request, Response, NextFunction } from "express";
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
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map