import { Request, Response, NextFunction } from "express";
/**
 * POST /auth/register
 * -------------------
 * Validates body with Zod, delegates to registerUser service.
 * Returns 201 with user object and JWT on success.
 */
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /auth/login
 * ----------------
 * Validates body with Zod, delegates to loginUser service.
 * Returns 200 with user object and JWT on success.
 */
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map