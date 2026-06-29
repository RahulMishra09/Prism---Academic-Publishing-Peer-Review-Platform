import { Router } from "express";
import { getAuthorProfile } from "./authors.controller.js";

const router = Router();

// GET /api/authors/:authorId — public author profile
router.get("/:authorId", getAuthorProfile);

export default router;
