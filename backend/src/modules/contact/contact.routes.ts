import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { contact, adminListMessages, adminUpdateStatus } from "./contact.controller.js";
import { contactLimiter } from "../../middleware/ratelimit.middleware.js";

const router = Router();

// Public (rate limited)
router.post("/", contactLimiter, contact);

// Admin
router.get("/",          authenticate, requireRole("ADMIN"), adminListMessages);
router.patch("/:id",     authenticate, requireRole("ADMIN"), adminUpdateStatus);

export default router;
