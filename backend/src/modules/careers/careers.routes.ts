import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { list, getById, adminList, adminGetById, create, update, remove } from "./careers.controller.js";

const router = Router();

// Public
router.get("/",    list);
router.get("/:id", getById);

// Admin / Editor
router.get("/admin/all",  authenticate, requireRole("ADMIN", "EDITOR"), adminList);
router.get("/admin/:id",  authenticate, requireRole("ADMIN", "EDITOR"), adminGetById);
router.post("/",          authenticate, requireRole("ADMIN", "EDITOR"), create);
router.put("/:id",        authenticate, requireRole("ADMIN", "EDITOR"), update);
router.delete("/:id",     authenticate, requireRole("ADMIN"), remove);

export default router;
