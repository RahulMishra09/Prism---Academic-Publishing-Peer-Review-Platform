import { Router } from "express";
import { getChapter } from "./books.controller.js";

const router = Router();

router.get("/:doi", getChapter);

export default router;
