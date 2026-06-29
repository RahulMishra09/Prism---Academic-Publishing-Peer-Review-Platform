import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../../generated/prisma/index.js";
import { AppError } from "../../middleware/error.middleware.js";
import { uploadFile, deleteFile, getSignedUrl } from "../../utils/storage.js";
import {
  sendSubmissionReceivedEmail,
  sendSubmissionRevisionRequiredEmail,
  sendSubmissionAcceptedEmail,
  sendSubmissionRejectedEmail,
  sendSubmissionWithdrawnEmail,
  sendSubmissionUnderReviewEmail,
  sendReviewerInvitationEmail,
} from "../../utils/email.js";
import type {
  CreateSubmissionInput,
  UpdateSubmissionInput,
  AddCoAuthorInput,
} from "./submissions.schema.js";

const submissionSelect = {
  id: true,
  title: true,
  abstract: true,
  keywords: true,
  status: true,
  journalSlug: true,
  coverLetter: true,
  submittedAt: true,
  createdAt: true,
  updatedAt: true,
  coAuthors: {
    orderBy: { order: "asc" as const },
    select: { id: true, firstName: true, lastName: true, email: true, affiliation: true, order: true },
  },
  files: {
    orderBy: { uploadedAt: "asc" as const },
    select: { id: true, fileName: true, fileType: true, mimeType: true, fileSize: true, uploadedAt: true },
  },
};

// ── createSubmission ─────────────────────────────────────────
export const createSubmission = async (userId: string, input: CreateSubmissionInput) => {
  // Validate journalSlug exists if provided
  if (input.journalSlug) {
    const journal = await prisma.journal.findUnique({
      where: { slug: input.journalSlug },
      select: { slug: true },
    });
    if (!journal) throw new AppError("Journal not found — invalid journalSlug", 422);
  }

  return prisma.submission.create({
    data: { ...input, submittedBy: userId },
    select: submissionSelect,
  });
};

// ── getSubmission ────────────────────────────────────────────
export const getSubmission = async (userId: string, submissionId: string, role: string) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: submissionSelect,
  });

  if (!submission) throw new AppError("Submission not found", 404);

  // Authors see only their own; editors/admins see all
  if (!["EDITOR", "ADMIN"].includes(String(role))) {
    const s = await prisma.submission.findFirst({
      where: { id: submissionId, submittedBy: userId },
    });
    if (!s) throw new AppError("Submission not found", 404);
  }

  return submission;
};

// ── updateSubmission ─────────────────────────────────────────
export const updateSubmission = async (
  userId: string,
  submissionId: string,
  input: UpdateSubmissionInput
) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (s.status !== "DRAFT") throw new AppError("Only DRAFT submissions can be edited", 422);

  return prisma.submission.update({
    where: { id: submissionId },
    data: input,
    select: submissionSelect,
  });
};

// ── submitSubmission ─────────────────────────────────────────
export const submitSubmission = async (userId: string, submissionId: string) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (s.status !== "DRAFT") throw new AppError("Only DRAFT submissions can be submitted", 422);

  // Require at least one file
  const fileCount = await prisma.submissionFile.count({ where: { submissionId } });
  if (fileCount === 0) throw new AppError("Please upload at least one file before submitting", 422);

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
    select: { ...submissionSelect, author: { select: { name: true, email: true } } },
  });

  void sendSubmissionReceivedEmail({
    to:              updated.author.email,
    authorName:      updated.author.name,
    submissionTitle: updated.title,
    submissionId,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { author: _a, ...rest } = updated;
  return rest;
};

// ── withdrawSubmission ───────────────────────────────────────
export const withdrawSubmission = async (userId: string, submissionId: string) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (!["DRAFT", "SUBMITTED"].includes(s.status)) {
    throw new AppError("Cannot withdraw a submission that is under review or decided", 422);
  }

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { status: "WITHDRAWN" },
    select: {
      id: true, status: true, updatedAt: true, title: true,
      author: { select: { name: true, email: true } },
    },
  });

  void sendSubmissionWithdrawnEmail({
    to:              updated.author.email,
    authorName:      updated.author.name,
    submissionTitle: updated.title,
    submissionId,
  });

  return { id: updated.id, status: updated.status, updatedAt: updated.updatedAt };
};

// ── uploadSubmissionFile ─────────────────────────────────────
export const uploadSubmissionFile = async (
  userId: string,
  submissionId: string,
  file: Express.Multer.File,
  fileType: string
) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (!["DRAFT", "REVISION_REQUIRED"].includes(s.status)) {
    throw new AppError("Files can only be uploaded to DRAFT or REVISION_REQUIRED submissions", 422);
  }

  const path    = `submissions/${submissionId}/${Date.now()}-${file.originalname}`;
  const fileUrl = await uploadFile(file.buffer, path, file.mimetype);

  return prisma.submissionFile.create({
    data: {
      fileName:    file.originalname,
      fileUrl,
      mimeType:    file.mimetype,
      fileSize:    file.size,
      fileType:    fileType.toUpperCase(),
      submissionId,
    },
    select: { id: true, fileName: true, fileType: true, mimeType: true, fileSize: true, fileUrl: true, uploadedAt: true },
  });
};

// ── deleteSubmissionFile ─────────────────────────────────────
export const deleteSubmissionFile = async (
  userId: string,
  submissionId: string,
  fileId: string
) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (!["DRAFT", "REVISION_REQUIRED"].includes(s.status)) {
    throw new AppError("Files can only be deleted from DRAFT or REVISION_REQUIRED submissions", 422);
  }

  const file = await prisma.submissionFile.findFirst({
    where: { id: fileId, submissionId },
  });
  if (!file) throw new AppError("File not found", 404);

  await deleteFile(file.fileUrl);
  await prisma.submissionFile.delete({ where: { id: fileId } });
};

// ── listSubmissionFiles ─────────────────────────────────────
export const listSubmissionFiles = async (userId: string, role: string, submissionId: string) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: { id: true, submittedBy: true },
  });
  if (!submission) throw new AppError("Submission not found", 404);

  // Authors see own, editors/admins/reviewers (assigned) see all
  if (!["EDITOR", "ADMIN", "REVIEWER"].includes(role) && submission.submittedBy !== userId) {
    throw new AppError("Submission not found", 404);
  }

  // If reviewer, verify they are assigned
  if (role === "REVIEWER" && submission.submittedBy !== userId) {
    const assigned = await prisma.submissionReviewer.findFirst({
      where: { submissionId, reviewerId: userId, status: { in: ["INVITED", "ACCEPTED"] } },
    });
    if (!assigned) throw new AppError("Submission not found", 404);
  }

  return prisma.submissionFile.findMany({
    where: { submissionId },
    orderBy: { uploadedAt: "asc" },
    select: { id: true, fileName: true, fileType: true, mimeType: true, fileSize: true, uploadedAt: true },
  });
};

// ── getSubmissionForReview ───────────────────────────────────
export const getSubmissionForReview = async (reviewerId: string, submissionId: string) => {
  // Verify reviewer is assigned to this submission
  const assignment = await prisma.submissionReviewer.findFirst({
    where: { submissionId, reviewerId, status: { in: ["INVITED", "ACCEPTED"] } },
  });
  if (!assignment) throw new AppError("You are not assigned to review this submission", 403);

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      title: true,
      abstract: true,
      keywords: true,
      status: true,
      journalSlug: true,
      submittedAt: true,
      createdAt: true,
      coAuthors: {
        orderBy: { order: "asc" },
        select: { firstName: true, lastName: true, affiliation: true },
      },
      files: {
        orderBy: { uploadedAt: "asc" },
        select: { id: true, fileName: true, fileType: true, mimeType: true, fileSize: true, uploadedAt: true },
      },
    },
  });
  if (!submission) throw new AppError("Submission not found", 404);

  return { ...submission, reviewerAssignment: { status: assignment.status, dueDate: assignment.dueDate, assignedAt: assignment.assignedAt } };
};

// ── addCoAuthor ──────────────────────────────────────────────
export const addCoAuthor = async (
  userId: string,
  submissionId: string,
  input: AddCoAuthorInput
) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (s.status !== "DRAFT") throw new AppError("Co-authors can only be modified on DRAFT submissions", 422);

  return prisma.submissionAuthor.create({
    data: { ...input, submissionId },
  });
};

// ── removeCoAuthor ───────────────────────────────────────────
export const removeCoAuthor = async (
  userId: string,
  submissionId: string,
  coAuthorId: string
) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);

  const coAuthor = await prisma.submissionAuthor.findFirst({
    where: { id: coAuthorId, submissionId },
  });
  if (!coAuthor) throw new AppError("Co-author not found", 404);

  await prisma.submissionAuthor.delete({ where: { id: coAuthorId } });
};

// ── Editor: listAllSubmissions ───────────────────────────────
const validStatuses = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "REVISION_REQUIRED", "ACCEPTED", "REJECTED", "WITHDRAWN"];

export const listAllSubmissions = async (
  page: number,
  pageSize: number,
  status?: string,
  journalSlug?: string
) => {
  const where: Record<string, unknown> = {};
  if (status) {
    const upperStatus = status.toUpperCase().replace("-", "_");
    if (validStatuses.includes(upperStatus)) {
      where["status"] = upperStatus;
    }
  }
  if (journalSlug) where["journalSlug"] = journalSlug;

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
      select: {
        ...submissionSelect,
        author: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── Editor: moveToUnderReview ────────────────────────────────
// Transitions a SUBMITTED submission to UNDER_REVIEW (editor assigns reviewers).
export const moveToUnderReview = async (submissionId: string) => {
  const s = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { author: { select: { name: true, email: true } } },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (s.status !== "SUBMITTED") {
    throw new AppError("Only SUBMITTED submissions can be moved to UNDER_REVIEW", 422);
  }

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data:  { status: "UNDER_REVIEW" },
    select: { id: true, status: true, updatedAt: true },
  });

  void sendSubmissionUnderReviewEmail({
    to:              s.author.email,
    authorName:      s.author.name,
    submissionTitle: s.title,
    submissionId,
  });

  return updated;
};

// ── Editor: assignReviewer ───────────────────────────────────
export const assignReviewer = async (
  submissionId: string,
  reviewerId: string,
  dueDate?: string
) => {
  const [submission, reviewer] = await Promise.all([
    prisma.submission.findUnique({ where: { id: submissionId }, select: { id: true, title: true, status: true } }),
    prisma.user.findUnique({ where: { id: reviewerId }, select: { id: true, name: true, email: true, role: true } }),
  ]);
  if (!submission) throw new AppError("Submission not found", 404);
  if (!reviewer)   throw new AppError("Reviewer not found", 404);

  let assignment;
  try {
    assignment = await prisma.submissionReviewer.create({
      data: {
        submissionId,
        reviewerId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      select: { id: true, status: true, assignedAt: true, dueDate: true, reviewer: { select: { id: true, name: true, email: true } } },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new AppError("Reviewer already assigned to this submission", 409);
    }
    throw err;
  }

  void sendReviewerInvitationEmail({
    to:              reviewer.email,
    reviewerName:    reviewer.name,
    submissionTitle: submission.title,
    submissionId,
    dueDate,
  });

  return assignment;
};

// ── Editor: removeReviewer ───────────────────────────────────
export const removeReviewer = async (submissionId: string, reviewerId: string) => {
  const assignment = await prisma.submissionReviewer.findUnique({
    where: { submissionId_reviewerId: { submissionId, reviewerId } },
    select: { id: true },
  });
  if (!assignment) throw new AppError("Reviewer assignment not found", 404);
  await prisma.submissionReviewer.delete({ where: { id: assignment.id } });
};

// ── Editor: listReviewers ────────────────────────────────────
export const listReviewers = async (submissionId: string) => {
  const submission = await prisma.submission.findUnique({ where: { id: submissionId }, select: { id: true } });
  if (!submission) throw new AppError("Submission not found", 404);

  return prisma.submissionReviewer.findMany({
    where: { submissionId },
    orderBy: { assignedAt: "asc" },
    select: {
      id: true, status: true, assignedAt: true, respondedAt: true,
      completedAt: true, dueDate: true, notes: true,
      reviewer: { select: { id: true, name: true, email: true } },
    },
  });
};

// ── Reviewer: submitStructuredReview ─────────────────────────
export const submitStructuredReview = async (
  submissionId: string,
  reviewerId: string,
  input: {
    recommendation: "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT";
    commentsForEditor: string;
    commentsForAuthor: string;
    scoreOriginality?: number;
    scoreMethodology?: number;
    scoreClarity?: number;
    scoreSignificance?: number;
    isConfidential?: boolean;
  }
) => {
  // Verify reviewer is assigned and has accepted
  const assignment = await prisma.submissionReviewer.findUnique({
    where: { submissionId_reviewerId: { submissionId, reviewerId } },
    select: { id: true, status: true },
  });
  if (!assignment) throw new AppError("You are not assigned to this submission", 403);
  if (assignment.status === "INVITED") throw new AppError("Please accept the review invitation before submitting", 422);
  if (assignment.status === "DECLINED") throw new AppError("You have declined this review", 422);
  if (assignment.status === "COMPLETED") throw new AppError("You have already completed this review", 422);

  const existing = await prisma.submissionReview.findUnique({
    where: { submissionId_reviewerId: { submissionId, reviewerId } },
    select: { id: true },
  });

  const data = {
    recommendation:    input.recommendation,
    commentsForEditor: input.commentsForEditor,
    commentsForAuthor: input.commentsForAuthor,
    scoreOriginality:  input.scoreOriginality,
    scoreMethodology:  input.scoreMethodology,
    scoreClarity:      input.scoreClarity,
    scoreSignificance: input.scoreSignificance,
    isConfidential:    input.isConfidential ?? false,
  };

  const review = existing
    ? await prisma.submissionReview.update({ where: { id: existing.id }, data })
    : await prisma.submissionReview.create({ data: { ...data, submissionId, reviewerId } });

  // Auto-mark reviewer assignment as COMPLETED
  await prisma.submissionReviewer.update({
    where: { id: assignment.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  return review;
};

// ── Editor: listStructuredReviews ─────────────────────────────
export const listStructuredReviews = async (submissionId: string) => {
  const submission = await prisma.submission.findUnique({ where: { id: submissionId }, select: { id: true } });
  if (!submission) throw new AppError("Submission not found", 404);

  return prisma.submissionReview.findMany({
    where: { submissionId },
    orderBy: { submittedAt: "asc" },
    select: {
      id: true, recommendation: true, commentsForAuthor: true, commentsForEditor: true,
      scoreOriginality: true, scoreMethodology: true, scoreClarity: true, scoreSignificance: true,
      isConfidential: true, submittedAt: true, updatedAt: true,
      reviewer: { select: { id: true, name: true, email: true } },
    },
  });
};

// ── Reviewer: updateReviewStatus ─────────────────────────────
// Reviewer accepts/declines/completes their own assignment.
export const updateReviewStatus = async (
  submissionId: string,
  reviewerId: string,
  status: "ACCEPTED" | "DECLINED" | "COMPLETED",
  notes?: string
) => {
  const assignment = await prisma.submissionReviewer.findUnique({
    where: { submissionId_reviewerId: { submissionId, reviewerId } },
    select: { id: true, status: true },
  });
  if (!assignment) throw new AppError("Reviewer assignment not found", 404);

  const data: Record<string, unknown> = { status };
  if (status === "ACCEPTED" || status === "DECLINED") data["respondedAt"] = new Date();
  if (status === "COMPLETED") data["completedAt"] = new Date();
  if (notes !== undefined) data["notes"] = notes;

  return prisma.submissionReviewer.update({
    where: { id: assignment.id },
    data,
    select: { id: true, status: true, respondedAt: true, completedAt: true, notes: true },
  });
};

// ── File download: signed URL ────────────────────────────────
export const getSubmissionFileDownloadUrl = async (
  userId: string,
  role: string,
  submissionId: string,
  fileId: string
) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: { id: true, submittedBy: true },
  });
  if (!submission) throw new AppError("Submission not found", 404);

  // Authors see only their own; editors/admins see all
  if (!["EDITOR", "ADMIN"].includes(role) && submission.submittedBy !== userId) {
    throw new AppError("Submission not found", 404);
  }

  const file = await prisma.submissionFile.findFirst({
    where: { id: fileId, submissionId },
    select: { id: true, fileName: true, fileUrl: true, mimeType: true, fileType: true },
  });
  if (!file) throw new AppError("File not found", 404);

  // Extract storage path from public URL
  const bucketPath = file.fileUrl.split("/object/public/")[1] ?? file.fileUrl;
  const signedUrl = await getSignedUrl(bucketPath, 3600);

  return { signedUrl, fileName: file.fileName, mimeType: file.mimeType, fileType: file.fileType, expiresIn: 3600 };
};

// ── Reviewer: dashboard ──────────────────────────────────────
export const getReviewerDashboard = async (reviewerId: string) => {
  const [pending, accepted, completed, declined, recentReviews] = await Promise.all([
    prisma.submissionReviewer.count({ where: { reviewerId, status: "INVITED" } }),
    prisma.submissionReviewer.count({ where: { reviewerId, status: "ACCEPTED" } }),
    prisma.submissionReviewer.count({ where: { reviewerId, status: "COMPLETED" } }),
    prisma.submissionReviewer.count({ where: { reviewerId, status: "DECLINED" } }),
    prisma.submissionReviewer.findMany({
      where: { reviewerId },
      orderBy: { assignedAt: "desc" },
      take: 10,
      select: {
        id: true, status: true, assignedAt: true, dueDate: true, completedAt: true,
        submission: {
          select: {
            id: true, title: true, status: true, journalSlug: true,
            author: { select: { id: true, name: true } },
          },
        },
      },
    }),
  ]);

  return {
    stats: { pending, accepted, completed, declined, total: pending + accepted + completed + declined },
    assignments: recentReviews,
  };
};

// ── Author: submitRevision ───────────────────────────────────
export const submitRevision = async (
  userId: string,
  submissionId: string,
  input: { rebuttalLetter: string; changesDescription?: string }
) => {
  const s = await prisma.submission.findFirst({
    where: { id: submissionId, submittedBy: userId },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (s.status !== "REVISION_REQUIRED") {
    throw new AppError("Revision can only be submitted when status is REVISION_REQUIRED", 422);
  }

  // Require at least one file uploaded AFTER the revision was requested
  const newFileCount = await prisma.submissionFile.count({
    where: { submissionId, uploadedAt: { gte: s.updatedAt } },
  });
  if (newFileCount === 0) throw new AppError("Please upload a revised manuscript before submitting revision", 422);

  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
      coverLetter: input.rebuttalLetter,
    },
    select: { id: true, status: true, submittedAt: true, updatedAt: true },
  });
};

// ── Editor: makeDecision ─────────────────────────────────────
export const makeDecision = async (
  submissionId: string,
  decision: "ACCEPTED" | "REJECTED" | "REVISION_REQUIRED",
  notes?: string
) => {
  const s = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      author: { select: { name: true, email: true } },
      coAuthors: true,
      files: { where: { fileType: "MANUSCRIPT" }, take: 1 },
    },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (!["SUBMITTED", "UNDER_REVIEW"].includes(s.status)) {
    throw new AppError("Decision can only be made on SUBMITTED or UNDER_REVIEW submissions", 422);
  }

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { status: decision },
    select: { id: true, status: true, updatedAt: true },
  });

  const emailBase = {
    to:              s.author.email,
    authorName:      s.author.name,
    submissionTitle: s.title,
    submissionId,
  };

  if (decision === "ACCEPTED") {
    void sendSubmissionAcceptedEmail(emailBase);

    // Auto-create a draft Article from the accepted submission (in transaction)
    try {
      const doi = `10.pending/${submissionId}`;
      await prisma.$transaction(async (tx) => {
        const existing = await tx.article.findUnique({ where: { doi }, select: { id: true } });
        if (!existing) {
          await tx.article.create({
            data: {
              doi,
              title:       s.title,
              abstract:    s.abstract ?? "",
              keywords:    s.keywords,
              discipline:  "Pending",
              pdfUrl:      s.files[0]?.fileUrl ?? null,
              isPublished: false,
            },
          });
        }
      });
    } catch {
      // Non-critical — article creation failure should not break the decision flow
    }
  } else if (decision === "REJECTED") {
    void sendSubmissionRejectedEmail({ ...emailBase, reason: notes });
  } else if (decision === "REVISION_REQUIRED") {
    void sendSubmissionRevisionRequiredEmail({ ...emailBase, notes });
  }

  return updated;
};

// ── Editor: approveProof ─────────────────────────────────────
// Marks an ACCEPTED submission as proof-approved, ready for publishing.
export const approveProof = async (submissionId: string) => {
  const s = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: { id: true, status: true, title: true },
  });
  if (!s) throw new AppError("Submission not found", 404);
  if (s.status !== "ACCEPTED") {
    throw new AppError("Proof can only be approved on ACCEPTED submissions", 422);
  }

  // Find the auto-created draft article and publish it
  const doi = `10.pending/${submissionId}`;
  const article = await prisma.article.findUnique({ where: { doi }, select: { id: true, isPublished: true } });

  if (article && !article.isPublished) {
    await prisma.article.update({
      where: { id: article.id },
      data: { isPublished: true, publishedAt: new Date() },
    });
  }

  return { submissionId, proofApproved: true, articlePublished: !!article };
};
