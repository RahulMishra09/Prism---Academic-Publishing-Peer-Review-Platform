import { Router } from "express";
import { searchHandler, postSearchHandler, suggestions, relatedArticles } from "./search.controller.js";
import { authLimiter } from "../../middleware/ratelimit.middleware.js";

const router = Router();

router.get("/suggestions",       authLimiter, suggestions);
router.get("/related/:doi",      relatedArticles);
router.get("/",                  searchHandler);
router.post("/",                 postSearchHandler);

export default router;
