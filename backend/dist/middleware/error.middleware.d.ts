import { Request, Response, NextFunction } from "express";
/**
 * AppError
 * --------
 * Operational (known) error class. Throw this anywhere in services or
 * controllers to send a structured error response with a specific HTTP
 * status code.
 *
 * Example:
 *   throw new AppError("Paper not found", 404)
 *   throw new AppError("Email already in use", 409)
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number);
}
/**
 * errorHandler
 * ------------
 * Global Express error-handling middleware.
 * Must be registered as the LAST middleware in app.ts via:
 *   app.use(errorHandler)
 *
 * Behaviour:
 *  - AppError (operational) � returns the error message with its status code
 *  - Unknown errors          � logs full stack, returns 500
 *    - In development: exposes the raw error message for easier debugging
 *    - In production:  hides internals, returns a generic safe message
 */
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map