import rateLimit, { type Options, ipKeyGenerator } from "express-rate-limit";
import type { Request, Response } from "express";
import { Role } from "../../generated/prisma/index.js";

const skipAll = process.env["SKIP_RATE_LIMIT"] === "true";
const isDev = process.env["NODE_ENV"] !== "production";

// ── Role-based multipliers ───────────────────────────────────
// Higher roles get more generous limits. READER is the baseline (1×).
const roleMultiplier: Record<Role, number> = {
  [Role.READER]:   1,
  [Role.AUTHOR]:   1.5,
  [Role.REVIEWER]: 2,
  [Role.EDITOR]:   3,
  [Role.ADMIN]:    5,
};

/** Returns a key based on user ID (authenticated) or normalized IP (anonymous). */
const roleAwareKey = (req: Request): string =>
  req.user?.userId ?? ipKeyGenerator(req.ip ?? "unknown");

/**
 * Builds a `max` function that scales the base limit by the user's role.
 * Anonymous users receive the base limit.
 */
const roleAwareMax = (base: number) => (req: Request): number => {
  if (skipAll || isDev) return 100_000;
  const multiplier = req.user?.role ? roleMultiplier[req.user.role] : 1;
  return Math.ceil(base * multiplier);
};

// Shared config — JSON error response
const baseOpts = (message: string): Partial<Options> => ({
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ code: "RATE_LIMIT_EXCEEDED", message });
  },
});

/**
 * Global limiter — all routes
 * Base: 200 req / 15 min  (ADMIN → 1000, EDITOR → 600, REVIEWER → 400, AUTHOR → 300, READER/anon → 200)
 */
export const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             roleAwareMax(200),
  keyGenerator:    roleAwareKey,
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { xForwardedForHeader: false },
  ...baseOpts("Too many requests — please slow down and try again later"),
});

/**
 * Auth limiter — login, register, forgot-password, reset-password
 * 10 req / 15 min / IP  (always IP-keyed — no role boost for auth endpoints)
 */
export const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             isDev ? 100_000 : 10,
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { xForwardedForHeader: false },
  ...baseOpts("Too many authentication attempts — please try again in 15 minutes"),
});

/**
 * File upload limiter — submission file uploads
 * Base: 20 uploads / 15 min  (ADMIN → 100, EDITOR → 60, AUTHOR → 30, …)
 */
export const uploadLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             roleAwareMax(20),
  keyGenerator:    roleAwareKey,
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { xForwardedForHeader: false },
  ...baseOpts("Too many file uploads — please wait before uploading more"),
});

/**
 * Search limiter — full-text search and suggestions
 * Base: 60 req / 1 min  (ADMIN → 300, EDITOR → 180, REVIEWER → 120, …)
 */
export const searchLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             roleAwareMax(60),
  keyGenerator:    roleAwareKey,
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { xForwardedForHeader: false },
  ...baseOpts("Search rate limit exceeded — please wait a moment before searching again"),
});

/**
 * Contact form limiter — prevent spam
 * Base: 5 / hour  (ADMIN → 25, EDITOR → 15, …)
 */
export const contactLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             roleAwareMax(5),
  keyGenerator:    roleAwareKey,
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { xForwardedForHeader: false },
  ...baseOpts("Too many contact form submissions — please try again later"),
});
