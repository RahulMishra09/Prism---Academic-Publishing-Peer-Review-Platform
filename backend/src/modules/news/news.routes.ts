import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { list, getBySlug, adminList, adminGetById, create, update, remove } from "./news.controller.js";

const router = Router();

// Public
router.get("/",       list);
router.get("/:slug",  getBySlug);

// Admin / Editor (order matters — specific paths before :slug)
router.get("/admin/all",  authenticate, requireRole("ADMIN", "EDITOR"), adminList);
router.get("/admin/:id",  authenticate, requireRole("ADMIN", "EDITOR"), adminGetById);
router.post("/",          authenticate, requireRole("ADMIN", "EDITOR"), create);
router.put("/:id",        authenticate, requireRole("ADMIN", "EDITOR"), update);
router.delete("/:id",     authenticate, requireRole("ADMIN"), remove);

export default router;
