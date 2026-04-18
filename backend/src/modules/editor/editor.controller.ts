import { Request, Response, NextFunction } from "express";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";
import { assignReviewerSchema, editorListPapersSchema } from "./editor.schema.js";
import {
  listAllPapers,
  getPaperDetail,
  assignReviewer,
  removeReviewer,
  listAssignments,
} from "./editor.service.js";

// Express 5 types req.params values as string | string[].
// Route params are always a single string at runtime -- this cast is safe.
const param = (value: string | string[]): string =>
  Array.isArray(value) ? value[0]! : value;

// GET /editor/papers
// Paginated list of all papers with optional status / domain filters.
// Role: EDITOR, ADMIN
export const listPapers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = editorListPapersSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:  fieldErrors(parsed.error),
        data:    null,
      });
      return;
    }

    const result = await listAllPapers(parsed.data);

    sendSuccess(res, {
      statusCode: 200,
      message:    "Papers retrieved successfully",
      data:       result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /editor/papers/:paperId
// Full paper detail -- includes all assignments and reviews with reviewer identity.
// Role: EDITOR, ADMIN
export const getPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paper = await getPaperDetail(param(req.params.paperId));

    sendSuccess(res, {
      statusCode: 200,
      message:    "Paper retrieved successfully",
      data:       paper,
    });
  } catch (err) {
    next(err);
  }
};

// POST /editor/papers/:paperId/assign-reviewer
// Assign a reviewer to a submitted paper.
// Role: EDITOR, ADMIN
export const assign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = assignReviewerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:  fieldErrors(parsed.error),
        data:    null,
      });
      return;
    }

    const assignment = await assignReviewer(
      param(req.params.paperId),
      parsed.data
    );

    sendSuccess(res, {
      statusCode: 201,
      message:    "Reviewer assigned successfully",
      data:       assignment,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /editor/papers/:paperId/assignments/:reviewerId
// Remove a reviewer assignment (only if review not yet submitted).
// Role: EDITOR, ADMIN
export const unassign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await removeReviewer(
      param(req.params.paperId),
      param(req.params.reviewerId)
    );

    sendSuccess(res, {
      statusCode: 200,
      message:    result.message,
      data:       null,
    });
  } catch (err) {
    next(err);
  }
};

// GET /editor/papers/:paperId/assignments
// List all reviewer assignments for a paper with their review status.
// Role: EDITOR, ADMIN
export const getAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const assignments = await listAssignments(param(req.params.paperId));

    sendSuccess(res, {
      statusCode: 200,
      message:    "Assignments retrieved successfully",
      data:       assignments,
    });
  } catch (err) {
    next(err);
  }
};
