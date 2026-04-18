import { Router } from "express";
import {
  getArticles,
  getArticle,
  getHomepage,
  getSiteConfig,
  getJournals,
} from "./public.controller.js";

const router = Router();

// Articles (approved papers)
router.get("/articles", getArticles);
router.get("/articles/:id", getArticle);

// Homepage aggregate
router.get("/homepage", getHomepage);

// Site config (static)
router.get("/site-config", getSiteConfig);

// Journals (static — no DB table yet)
router.get("/journals", getJournals);

export default router;
