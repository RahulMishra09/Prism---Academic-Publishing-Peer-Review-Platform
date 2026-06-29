import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { siteConfig, setConfig } from "./siteConfig.controller.js";

const router = Router();

// Public
router.get("/", siteConfig);

// Admin only
router.put("/:key", authenticate, requireRole("ADMIN"), setConfig);

export default router;
