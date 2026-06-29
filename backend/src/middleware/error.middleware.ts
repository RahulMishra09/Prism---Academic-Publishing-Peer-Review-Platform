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
  readonly code: string;
  readonly isOperational: boolean = true;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code ?? httpCodeToErrorCode(statusCode);
    this.name = "AppError";
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Global error handler ──────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code:    err.code,
      message: err.message,
      details: null,
    });
    return;
  }

  console.error(`[Unhandled Error] ${err.name}: ${err.message}`, err.stack);

  const message =
    env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message;

  res.status(500).json({
    code:    "INTERNAL_SERVER_ERROR",
    message,
    details: null,
  });
};

// ── helpers ───────────────────────────────────────────────────
function httpCodeToErrorCode(status: number): string {
  const map: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHENTICATED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "TOO_MANY_REQUESTS",
    500: "INTERNAL_SERVER_ERROR",
  };
  return map[status] ?? "ERROR";
}
