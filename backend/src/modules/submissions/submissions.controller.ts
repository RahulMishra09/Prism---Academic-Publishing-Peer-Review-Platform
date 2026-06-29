import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createSubmissionSchema,
  updateSubmissionSchema,
  addCoAuthorSchema,
} from "./submissions.schema.js";
import {
  createSubmission,
  getSubmission,
  updateSubmission,
  submitSubmission,
  withdrawSubmission,
  uploadSubmissionFile,
  deleteSubmissionFile,
  listSubmissionFiles,
  getSubmissionForReview,
  addCoAuthor,
  removeCoAuthor,
  listAllSubmissions,
  moveToUnderReview,
  makeDecision,
  assignReviewer,
  removeReviewer,
  listReviewers,
  updateReviewStatus,
  submitStructuredReview,
  listStructuredReviews,
  getSubmissionFileDownloadUrl,
  getReviewerDashboard,
  submitRevision,
  approveProof,
} from "./submissions.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const paginationSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(20),
  status:      z.string().optional(),
  journalSlug: z.string().optional(),
});

const validFileTypes = ["MANUSCRIPT", "COVER_LETTER", "SUPPLEMENTARY"] as const;
const fileTypeSchema = z.object({
  fileType: z.enum(validFileTypes).default("MANUSCRIPT"),
});

const decisionSchema = z.object({
  decision: z.enum(["ACCEPTED", "REJECTED", "REVISION_REQUIRED"]),
  notes:    z.string().max(2000).optional(),
});

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) });
      return;
    }
    const submission = await createSubmission(req.user!.userId, parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Submission created", data: submission });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const submission = await getSubmission(req.user!.userId, param(req.params["id"]), String(req.user!.role));
    sendSuccess(res, { statusCode: 200, message: "Submission retrieved", data: submission });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) });
      return;
    }
    const submission = await updateSubmission(req.user!.userId, param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Submission updated", data: submission });
  } catch (err) {
    next(err);
  }
};

export const submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const submission = await submitSubmission(req.user!.userId, param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Submission submitted for review", data: submission });
  } catch (err) {
    next(err);
  }
};

export const withdraw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const submission = await withdrawSubmission(req.user!.userId, param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Submission withdrawn", data: submission });
  } catch (err) {
    next(err);
  }
};

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ code: "BAD_REQUEST", message: "No file uploaded" });
      return;
    }
    const ftQuery = req.query["fileType"] ?? req.body?.fileType;
    const parsed = fileTypeSchema.safeParse({ fileType: ftQuery });
    if (ftQuery && !parsed.success) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: `Invalid fileType. Allowed: ${validFileTypes.join(", ")}` });
      return;
    }
    const fileType = parsed.success ? parsed.data.fileType : "MANUSCRIPT";
    const file = await uploadSubmissionFile(req.user!.userId, param(req.params["id"]), req.file, fileType);
    sendSuccess(res, { statusCode: 201, message: "File uploaded", data: file });
  } catch (err) {
    next(err);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteSubmissionFile(req.user!.userId, param(req.params["id"]), param(req.params["fileId"]));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const addAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = addCoAuthorSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) });
      return;
    }
    const coAuthor = await addCoAuthor(req.user!.userId, param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Co-author added", data: coAuthor });
  } catch (err) {
    next(err);
  }
};

export const removeAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await removeCoAuthor(req.user!.userId, param(req.params["id"]), param(req.params["coAuthorId"]));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" });
      return;
    }
    const { page, pageSize, status, journalSlug } = parsed.data;
    const result = await listAllSubmissions(page, pageSize, status, journalSlug);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const underReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await moveToUnderReview(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Submission moved to UNDER_REVIEW", data: result });
  } catch (err) {
    next(err);
  }
};

export const decision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = decisionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) });
      return;
    }
    const result = await makeDecision(param(req.params["id"]), parsed.data.decision, parsed.data.notes);
    sendSuccess(res, { statusCode: 200, message: "Decision recorded", data: result });
  } catch (err) { next(err); }
};

const assignSchema = z.object({
  reviewerId: z.string(),
  dueDate:    z.string().optional(),
});

const reviewStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "COMPLETED"]),
  notes:  z.string().max(5000).optional(),
});

export const getReviewers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await listReviewers(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Reviewers retrieved", data });
  } catch (err) { next(err); }
};

export const assign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = assignSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await assignReviewer(param(req.params["id"]), parsed.data.reviewerId, parsed.data.dueDate);
    sendSuccess(res, { statusCode: 201, message: "Reviewer assigned", data: result });
  } catch (err) { next(err); }
};

export const unassign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await removeReviewer(param(req.params["id"]), param(req.params["reviewerId"]));
    sendSuccess(res, { statusCode: 200, message: "Reviewer removed", data: null });
  } catch (err) { next(err); }
};

export const reviewStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = reviewStatusSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await updateReviewStatus(param(req.params["id"]), req.user!.userId, parsed.data.status, parsed.data.notes);
    sendSuccess(res, { statusCode: 200, message: "Review status updated", data: result });
  } catch (err) { next(err); }
};

const structuredReviewSchema = z.object({
  recommendation:    z.enum(["ACCEPT", "MINOR_REVISION", "MAJOR_REVISION", "REJECT"]),
  commentsForEditor: z.string().min(10),
  commentsForAuthor: z.string().min(10),
  scoreOriginality:  z.coerce.number().int().min(1).max(5).optional(),
  scoreMethodology:  z.coerce.number().int().min(1).max(5).optional(),
  scoreClarity:      z.coerce.number().int().min(1).max(5).optional(),
  scoreSignificance: z.coerce.number().int().min(1).max(5).optional(),
  isConfidential:    z.boolean().optional(),
});

export const submitReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = structuredReviewSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await submitStructuredReview(param(req.params["id"]), req.user!.userId, parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Review submitted", data: result });
  } catch (err) { next(err); }
};

export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await listStructuredReviews(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Reviews retrieved", data: result });
  } catch (err) { next(err); }
};

// ── List files ───────────────────────────────────────────────
export const listFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = await listSubmissionFiles(req.user!.userId, String(req.user!.role), param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Files retrieved", data: files });
  } catch (err) { next(err); }
};

// ── Get submission for reviewer ──────────────────────────────
export const getForReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getSubmissionForReview(req.user!.userId, param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Submission for review", data });
  } catch (err) { next(err); }
};

// ── File download (signed URL) ────────────────────────────────
export const downloadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, fileId } = req.params as Record<string, string>;
    const url = await getSubmissionFileDownloadUrl(req.user!.userId, String(req.user!.role), id!, fileId!);
    sendSuccess(res, { statusCode: 200, message: "Download URL generated", data: { url } });
  } catch (err) { next(err); }
};

// ── Reviewer dashboard ────────────────────────────────────────
export const reviewerDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getReviewerDashboard(req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "Reviewer dashboard", data });
  } catch (err) { next(err); }
};

// ── Submit revision ───────────────────────────────────────────
const revisionSchema = z.object({
  rebuttalLetter: z.string().min(10).max(10000),
  changesDescription: z.string().max(5000).optional(),
});

export const revision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = revisionSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await submitRevision(req.user!.userId, param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Revision submitted", data: result });
  } catch (err) { next(err); }
};

// ── Proof approval ────────────────────────────────────────────
export const proofApproved = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await approveProof(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Proof approved", data: result });
  } catch (err) { next(err); }
};
