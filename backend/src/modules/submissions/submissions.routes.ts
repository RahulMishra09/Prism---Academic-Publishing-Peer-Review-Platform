import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { uploadLimiter } from "../../middleware/ratelimit.middleware.js";
import { Role } from "../../../generated/prisma/index.js";
import {
  create,
  getOne,
  update,
  submit,
  withdraw,
  uploadFile,
  deleteFile,
  listFiles,
  getForReview,
  addAuthor,
  removeAuthor,
  listAll,
  underReview,
  decision,
  getReviewers,
  assign,
  unassign,
  reviewStatus,
  submitReview,
  getReviews,
  downloadFile,
  reviewerDashboard,
  revision,
  proofApproved,
} from "./submissions.controller.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// ── Reviewer dashboard (no :id param — must come before /:id routes) ──
router.get("/reviewer/dashboard",                        requireRole(Role.REVIEWER, Role.ADMIN), reviewerDashboard);

// ── Author routes ────────────────────────────────────────────
router.post("/",                                         requireRole(Role.AUTHOR, Role.ADMIN), create);
router.get("/:id",                                       getOne);
router.put("/:id/draft",                                 requireRole(Role.AUTHOR, Role.ADMIN), update);
router.post("/:id/submit",                               requireRole(Role.AUTHOR, Role.ADMIN), submit);
router.post("/:id/withdraw",                             requireRole(Role.AUTHOR, Role.ADMIN), withdraw);
router.post("/:id/revision",                             requireRole(Role.AUTHOR, Role.ADMIN), revision);
router.get("/:id/files",                                 listFiles);
router.post("/:id/files",   uploadLimiter, upload.single("file"), requireRole(Role.AUTHOR, Role.ADMIN), uploadFile);
router.delete("/:id/files/:fileId",                      requireRole(Role.AUTHOR, Role.ADMIN), deleteFile);
router.get("/:id/files/:fileId/download",                downloadFile);
router.post("/:id/co-authors",                           requireRole(Role.AUTHOR, Role.ADMIN), addAuthor);
router.delete("/:id/co-authors/:coAuthorId",             requireRole(Role.AUTHOR, Role.ADMIN), removeAuthor);

// ── Editor / Admin routes ────────────────────────────────────
router.get("/",                                          requireRole(Role.EDITOR, Role.ADMIN), listAll);
router.post("/:id/under-review",                         requireRole(Role.EDITOR, Role.ADMIN), underReview);
router.post("/:id/decision",                             requireRole(Role.EDITOR, Role.ADMIN), decision);
router.post("/:id/proof-approved",                       requireRole(Role.EDITOR, Role.ADMIN), proofApproved);
router.get("/:id/reviewers",                             requireRole(Role.EDITOR, Role.ADMIN), getReviewers);
router.post("/:id/reviewers",                            requireRole(Role.EDITOR, Role.ADMIN), assign);
router.delete("/:id/reviewers/:reviewerId",              requireRole(Role.EDITOR, Role.ADMIN), unassign);

// ── Reviewer routes ──────────────────────────────────────────
router.get("/:id/review",                                getForReview);
router.post("/:id/review-status",                        reviewStatus);
router.post("/:id/review",                               submitReview);
router.get("/:id/reviews",                               requireRole(Role.EDITOR, Role.ADMIN), getReviews);

export default router;
