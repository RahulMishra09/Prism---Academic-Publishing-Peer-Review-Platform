import { Request, Response, NextFunction } from "express";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";
import {
  createPaperSchema,
  updatePaperSchema,
  rejectPaperSchema,
  listPapersSchema,
} from "./papers.schema.js";
import {
  createPaper,
  getMyPapers,
  listPapers,
  getPaperById,
  updatePaper,
  submitPaper,
  approvePaper,
  rejectPaper,
} from "./papers.service.js";

//  Helpers 

/**
 * Express 5 types req.params values as `string | string[]`.
 * Route params are always a single string at runtime - this cast is safe.
 */
const param = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;


//  POST /papers 
/**
 * Create a new paper in DRAFT status.
 * Role: AUTHOR
 */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createPaperSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: fieldErrors(parsed.error), data: null });
      return;
    }

    const paper = await createPaper(req.user!.userId, parsed.data);

    sendSuccess(res, {
      statusCode: 201,
      message:    "Paper created successfully",
      data:       paper,
    });
  } catch (err) {
    next(err);
  }
};

//  GET /papers/my 
/**
 * Returns all papers owned by the authenticated author.
 * Role: AUTHOR
 */
export const getMine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const papers = await getMyPapers(req.user!.userId);

    sendSuccess(res, {
      statusCode: 200,
      message:    "Papers retrieved successfully",
      data:       papers,
    });
  } catch (err) {
    next(err);
  }
};

//  GET /papers 
/**
 * Paginated list of papers with optional status / domain filters.
 * Visibility is enforced per role inside the service.
 * Role: ALL authenticated users
 */
export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = listPapersSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: fieldErrors(parsed.error), data: null });
      return;
    }

    const result = await listPapers(
      req.user!.userId,
      req.user!.role,
      parsed.data
    );

    sendSuccess(res, {
      statusCode: 200,
      message:    "Papers retrieved successfully",
      data:       result,
    });
  } catch (err) {
    next(err);
  }
};

//  GET /papers/:id 
/**
 * Returns full paper detail including reviews and assignments.
 * Role: ALL authenticated users (visibility enforced in service)
 */
export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paper = await getPaperById(
      param(req.params.id),
      req.user!.userId,
      req.user!.role
    );

    sendSuccess(res, {
      statusCode: 200,
      message:    "Paper retrieved successfully",
      data:       paper,
    });
  } catch (err) {
    next(err);
  }
};

//  PATCH /papers/:id 
/**
 * Update a paper's content (DRAFT only).
 * Role: AUTHOR (own papers only)
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updatePaperSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: fieldErrors(parsed.error), data: null });
      return;
    }

    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields provided to update",
        data:    null,
      });
      return;
    }

    const paper = await updatePaper(
      param(req.params.id),
      req.user!.userId,
      parsed.data
    );

    sendSuccess(res, {
      statusCode: 200,
      message:    "Paper updated successfully",
      data:       paper,
    });
  } catch (err) {
    next(err);
  }
};

//  POST /papers/:id/submit 
/**
 * Submit a paper for review: DRAFT ï¿½ SUBMITTED.
 * Role: AUTHOR (own papers only)
 */
export const submit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paper = await submitPaper(param(req.params.id), req.user!.userId);

    sendSuccess(res, {
      statusCode: 200,
      message:    "Paper submitted for review",
      data:       paper,
    });
  } catch (err) {
    next(err);
  }
};

//  POST /papers/:id/approve 
/**
 * Approve a submitted paper: SUBMITTED ï¿½ APPROVED.
 * Role: EDITOR
 */
export const approve = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paper = await approvePaper(param(req.params.id));

    sendSuccess(res, {
      statusCode: 200,
      message:    "Paper approved successfully",
      data:       paper,
    });
  } catch (err) {
    next(err);
  }
};

//  POST /papers/:id/reject 
/**
 * Reject a submitted paper: SUBMITTED ï¿½ REJECTED.
 * Role: EDITOR
 */
export const reject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = rejectPaperSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation failed", errors: fieldErrors(parsed.error), data: null });
      return;
    }

    const paper = await rejectPaper(param(req.params.id), parsed.data);

    sendSuccess(res, {
      statusCode: 200,
      message:    "Paper rejected",
      data:       paper,
    });
  } catch (err) {
    next(err);
  }
};
