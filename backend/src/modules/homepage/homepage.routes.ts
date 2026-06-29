import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { homepage, setSection, removeSection } from "./homepage.controller.js";

const router = Router();

// Public
router.get("/", homepage);

// Admin only
router.put("/sections/:section",    authenticate, requireRole("ADMIN"), setSection);
router.delete("/sections/:section", authenticate, requireRole("ADMIN"), removeSection);

export default router;
