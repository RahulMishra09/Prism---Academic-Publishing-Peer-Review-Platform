import { Router } from "express";
import { citeArticle } from "./cite.controller.js";
import { authenticate, optionalAuthenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import {
  list, top, getByDoi, metrics, download, publish,
  adminList, adminGetById, create, update, remove,
  getFigures, createFigure, deleteFigure,
  getSupplementary, createSupplementary, deleteSupplementary,
} from "./articles.controller.js";

const router = Router();

// Public
router.get("/",              list);
router.get("/top",           top);             // ?rankBy=views|citations|downloads&limit=10&discipline=
router.get("/:doi/metrics",  metrics);         // per-article metrics snapshot
router.get("/:doi/cite",     citeArticle);     // ?format=apa|mla|bibtex|ris
router.get("/:doi/download", optionalAuthenticate, download); // access-controlled

// Requires auth (any role)
router.get("/:doi",          getByDoi);        // increments view count

// Admin / Editor only — specific paths before any param routes
router.get("/admin/all",     authenticate, requireRole("EDITOR", "ADMIN"), adminList);
router.get("/admin/:id",     authenticate, requireRole("EDITOR", "ADMIN"), adminGetById);
router.post("/",             authenticate, requireRole("EDITOR", "ADMIN"), create);
router.put("/:id",           authenticate, requireRole("EDITOR", "ADMIN"), update);
router.delete("/:id",        authenticate, requireRole("ADMIN"), remove);
router.post("/:id/publish",                  authenticate, requireRole("EDITOR", "ADMIN"), publish);

// Figures (public read, editor/admin write)
router.get("/:id/figures",                   getFigures);
router.post("/:id/figures",                  authenticate, requireRole("EDITOR", "ADMIN"), createFigure);
router.delete("/:id/figures/:figureId",      authenticate, requireRole("EDITOR", "ADMIN"), deleteFigure);

// Supplementary files (public read, editor/admin write)
router.get("/:id/supplementary",             getSupplementary);
router.post("/:id/supplementary",            authenticate, requireRole("EDITOR", "ADMIN"), createSupplementary);
router.delete("/:id/supplementary/:fileId",  authenticate, requireRole("EDITOR", "ADMIN"), deleteSupplementary);

export default router;
