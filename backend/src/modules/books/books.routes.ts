import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import {
  listBooksHandler, getBook, getChapters,
  adminListBooks, createBookHandler, updateBookHandler, deleteBookHandler,
  createChapterHandler, updateChapterHandler, deleteChapterHandler,
} from "./books.controller.js";

const router = Router();

// Public
router.get("/",               listBooksHandler);
router.get("/:isbn",          getBook);
router.get("/:isbn/chapters", getChapters);

// Admin
router.get("/admin/all",                    authenticate, requireRole("ADMIN", "EDITOR"), adminListBooks);
router.post("/",                            authenticate, requireRole("ADMIN", "EDITOR"), createBookHandler);
router.put("/:id",                          authenticate, requireRole("ADMIN", "EDITOR"), updateBookHandler);
router.delete("/:id",                       authenticate, requireRole("ADMIN"), deleteBookHandler);
router.post("/:id/chapters",                authenticate, requireRole("ADMIN", "EDITOR"), createChapterHandler);
router.put("/:id/chapters/:chapterId",      authenticate, requireRole("ADMIN", "EDITOR"), updateChapterHandler);
router.delete("/:id/chapters/:chapterId",   authenticate, requireRole("ADMIN"), deleteChapterHandler);

export default router;
