import { Request, Response, NextFunction } from "express";
import { summarizePaper, askPaperQuestion } from "./ai.service.js";
import { AppError } from "../../middleware/error.middleware.js";

// POST /api/ai/summarize
export const summarize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError("No file uploaded. Please upload a PDF.", 400);
    }

    const summary = await summarizePaper(file.buffer, file.mimetype);

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/ask
export const ask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError("No file uploaded. Please upload a PDF.", 400);
    }

    const { question } = req.body as { question?: string };
    if (!question || !question.trim()) {
      throw new AppError("Question is required", 400);
    }

    const answer = await askPaperQuestion(file.buffer, file.mimetype, question);

    res.json({
      success: true,
      data: { question, answer },
    });
  } catch (err) {
    next(err);
  }
};
