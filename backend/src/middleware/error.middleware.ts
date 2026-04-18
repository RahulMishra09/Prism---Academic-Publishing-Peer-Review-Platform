import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

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
export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * errorHandler
 * ------------
 * Global Express error-handling middleware.
 * Must be registered as the LAST middleware in app.ts via:
 *   app.use(errorHandler)
 *
 * Behaviour:
 *  - AppError (operational) ’ returns the error message with its status code
 *  - Unknown errors          ’ logs full stack, returns 500
 *    - In development: exposes the raw error message for easier debugging
 *    - In production:  hides internals, returns a generic safe message
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // --- Operational error (thrown intentionally) ---
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
    return;
  }

  // --- Unexpected / programming error ---
  console.error(`[Unhandled Error] ${err.name}: ${err.message}`, err.stack);

  const message =
    env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message;

  res.status(500).json({
    success: false,
    message,
    data: null,
  });
};
