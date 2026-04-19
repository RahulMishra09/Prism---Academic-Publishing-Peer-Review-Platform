import { Router } from "express";
import { register, login, refresh, logout } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

// POST /auth/register
router.post("/register", authLimiter, register);

// POST /auth/login
router.post("/login", authLimiter, login);

// POST /auth/refresh  — exchange refresh token for new access + refresh tokens
router.post("/refresh", authLimiter, refresh);

// POST /auth/logout   — revoke refresh token (requires valid access token)
router.post("/logout", authenticate, logout);

export default router;
