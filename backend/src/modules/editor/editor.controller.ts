import { Request, Response, NextFunction } from "express";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";
import { assignReviewerSchema, editorListPapersSchema } from "./editor.schema.js";
import { listAllPapers, getPaperDetail, assignReviewer, removeReviewer, listAssignments } from "./editor.service.js";

const param = (value: string | string[]): string =>
  Array.isArray(value) ? value[0]! : value;

export const listPapers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = editorListPapersSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: fieldErrors(parsed.error), data: null });
      return;
    }
    const result = await listAllPapers(parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Papers retrieved successfully", data: result });
  } catch (err) { next(err); }
};

export const getPaper = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paper = await getPaperDetail(param(req.params.paperId));
    sendSuccess(res, { statusCode: 200, message: "Paper retrieved successfully", data: paper });
  } catch (err) { next(err); }
};

export const assign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = assignReviewerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: fieldErrors(parsed.error), data: null });
      return;
    }
    const assignment = await assignReviewer(param(req.params.paperId), parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Reviewer assigned successfully", data: assignment });
  } catch (err) { next(err); }
};

export const unassign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await removeReviewer(param(req.params.paperId), param(req.params.reviewerId));
    sendSuccess(res, { statusCode: 200, message: result.message, data: null });
  } catch (err) { next(err); }
};

export const getAssignments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assignments = await listAssignments(param(req.params.paperId));
    sendSuccess(res, { statusCode: 200, message: "Assignments retrieved successfully", data: assignments });
  } catch (err) { next(err); }
};
