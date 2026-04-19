import { PaperStatus, Role, Prisma } from "../../../generated/prisma/index.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { sendReviewerAssignedEmail } from "../emails/email.service.js";
import { createAuditLog } from "../admin/admin.service.js";
import type { AssignReviewerInput, EditorListPapersQuery } from "./editor.schema.js";

// Shared select for paper list items
const paperSummarySelect = {
  id:              true,
  title:           true,
  abstract:        true,
  domain:          true,
  keywords:        true,
  status:          true,
  rejectionReason: true,
  createdAt:       true,
  updatedAt:       true,
  approvedAt:      true,
  author: {
    select: { id: true, name: true, email: true },
  },
  _count: {
    select: { assignments: true, reviews: true },
  },
} as const;

// Shared select for assignment detail
const assignmentSelect = {
  id:         true,
  status:     true,
  assignedAt: true,
  reviewer: {
    select: { id: true, name: true, email: true },
  },
  review: {
    select: { id: true, score: true, recommendation: true, createdAt: true },
  },
} as const;

export const listAllPapers = async (query: EditorListPapersQuery) => {
  const { status, domain, page, limit } = query;
  const skip = (page - 1) * limit;
  const where: Prisma.PaperWhereInput = {};
  if (status) where.status = status as PaperStatus;
  if (domain) where.domain = { contains: domain, mode: "insensitive" };

  const [papers, total] = await Promise.all([
    prisma.paper.findMany({
      where,
      select:  paperSummarySelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.paper.count({ where }),
  ]);

  return {
    papers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// getPaperDetail
// Returns full paper detail including all assignments and reviews.
// Accessible by EDITOR and ADMIN only.
export const getPaperDetail = async (paperId: string) => {
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: {
      ...paperSummarySelect,
      assignments: {
        select:  assignmentSelect,
        orderBy: { assignedAt: "desc" },
      },
      reviews: {
        select: {
          id:             true,
          strengths:      true,
          weaknesses:     true,
          score:          true,
          recommendation: true,
          createdAt:      true,
          reviewer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!paper) throw new AppError("Paper not found", 404);

  return paper;
};

// assignReviewer
// Assigns a reviewer to a paper.
// Guards:
//   - Paper must exist and be in SUBMITTED status
//   - Reviewer must exist and have the REVIEWER role
//   - Reviewer must not be banned
//   - Reviewer must not already be assigned to this paper
export const assignReviewer = async (
  paperId: string,
  input: AssignReviewerInput
) => {
  const { reviewerId } = input;

  // Verify paper exists and is SUBMITTED
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, status: true, title: true },
  });

  if (!paper) throw new AppError("Paper not found", 404);

  if (paper.status !== PaperStatus.SUBMITTED) {
    throw new AppError(
      `Reviewers can only be assigned to SUBMITTED papers (current status: ${paper.status})`,
      422
    );
  }

  // Verify reviewer exists and has REVIEWER role
  const reviewer = await prisma.user.findUnique({
    where:  { id: reviewerId },
    select: { id: true, name: true, email: true, role: true, isBanned: true },
  });

  if (!reviewer) throw new AppError("Reviewer not found", 404);

  if (reviewer.role !== Role.REVIEWER) {
    throw new AppError(
      "The specified user does not have the REVIEWER role",
      422
    );
  }

  if (reviewer.isBanned) {
    throw new AppError("Cannot assign a banned user as a reviewer", 422);
  }

  // Check for duplicate assignment
  const existing = await prisma.reviewerAssignment.findUnique({
    where:  { paperId_reviewerId: { paperId, reviewerId } },
    select: { id: true },
  });

  if (existing) {
    throw new AppError("This reviewer is already assigned to this paper", 409);
  }

  // Create the assignment
  const assignment = await prisma.reviewerAssignment.create({
    data: { paperId, reviewerId },
    select: {
      id:         true,
      status:     true,
      assignedAt: true,
      paper: {
        select: { id: true, title: true, domain: true, status: true },
      },
      reviewer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Fire-and-forget email + audit log
  sendReviewerAssignedEmail(reviewer.email, reviewer.name, paper.title, paperId);
  createAuditLog({ action: "REVIEWER_ASSIGNED", targetId: paperId, targetType: "paper", meta: { reviewerId } });

  return assignment;
};

// removeReviewer
// Removes a reviewer assignment from a paper.
// Guards:
//   - Assignment must exist
//   - Assignment must be PENDING (cannot remove after review is submitted)
export const removeReviewer = async (
  paperId: string,
  reviewerId: string
) => {
  const assignment = await prisma.reviewerAssignment.findUnique({
    where:  { paperId_reviewerId: { paperId, reviewerId } },
    select: { id: true, status: true },
  });

  if (!assignment) {
    throw new AppError("Assignment not found", 404);
  }

  if (assignment.status === "COMPLETED") {
    throw new AppError(
      "Cannot remove a reviewer who has already submitted a review",
      422
    );
  }

  await prisma.reviewerAssignment.delete({
    where: { id: assignment.id },
  });

  return { message: "Reviewer removed successfully" };
};

// listAssignments
// Returns all reviewer assignments for a given paper.
export const listAssignments = async (paperId: string) => {
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true },
  });

  if (!paper) throw new AppError("Paper not found", 404);

  return prisma.reviewerAssignment.findMany({
    where:   { paperId },
    select:  assignmentSelect,
    orderBy: { assignedAt: "desc" },
  });
};
