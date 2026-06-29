import { Router } from "express";
import { upload } from "../../middleware/upload.middleware.js";
import { summarize, ask } from "./ai.controller.js";

const router = Router();

// POST /api/ai/summarize — upload PDF → get structured summary
router.post("/summarize", upload.single("file"), summarize);

// POST /api/ai/ask — upload PDF + question → get answer
router.post("/ask", upload.single("file"), ask);

export default router;
