import { Router } from "express";
import { authLimiter } from "../../middleware/ratelimit.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  register,
  login,
  logout,
  me,
  ipCheck,
  forgotPasswordHandler,
  resetPasswordHandler,
  refresh,
  verifyEmailHandler,
  resendVerificationHandler,
} from "./auth.controller.js";

const router = Router();

// Public (rate-limited)
router.post("/register",         authLimiter, register);
router.post("/login",            authLimiter, login);
router.post("/forgot-password",  authLimiter, forgotPasswordHandler);
router.post("/reset-password",              resetPasswordHandler);
router.post("/refresh",                     refresh);
router.post("/verify-email",               verifyEmailHandler);

// Auth-required
router.post("/logout", authenticate, logout);
router.get("/me",      authenticate, me);
router.post("/resend-verification", authenticate, resendVerificationHandler);

// IP check — public, used for institutional access detection
router.get("/ip-check", ipCheck);

export default router;
