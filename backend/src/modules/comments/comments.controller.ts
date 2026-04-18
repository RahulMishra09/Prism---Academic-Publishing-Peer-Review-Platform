import { Request, Response, NextFunction } from "express";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";
import { createCommentSchema, listCommentsSchema } from "./comments.schema.js";
import { listComments, createComment, deleteComment } from "./comments.service.js";

// Express 5 types req.params values as string | string[].
// Route params are always a single string at runtime -- this cast is safe.
const param = (value: string | string[]): string =>
  Array.isArray(value) ? value[0]! : value;

// GET /comments/papers/:paperId
// Returns paginated top-level comments with nested replies for an APPROVED paper.
// Role: all authenticated users
export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = listCommentsSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:  fieldErrors(parsed.error),
        data:    null,
      });
      return;
    }

    const result = await listComments(param(req.params.paperId), parsed.data);

    sendSuccess(res, {
      statusCode: 200,
      message:    "Comments retrieved successfully",
      data:       result,
    });
  } catch (err) {
    next(err);
  }
};

// POST /comments/papers/:paperId
// Post a new comment or reply on an APPROVED paper.
// Role: READER, AUTHOR, EDITOR, ADMIN
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:  fieldErrors(parsed.error),
        data:    null,
      });
      return;
    }

    const comment = await createComment(
      param(req.params.paperId),
      req.user!.userId,
      req.user!.role,
      parsed.data
    );

    sendSuccess(res, {
      statusCode: 201,
      message:    "Comment posted successfully",
      data:       comment,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /comments/:commentId
// Delete a comment. Owner, EDITOR, and ADMIN only.
// Deleting a parent comment also removes all its replies.
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteComment(
      param(req.params.commentId),
      req.user!.userId,
      req.user!.role
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
