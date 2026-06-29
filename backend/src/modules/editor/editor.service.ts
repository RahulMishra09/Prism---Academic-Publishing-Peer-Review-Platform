import { PaperStatus, Role, Prisma } from "../../../generated/prisma/index.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { sendReviewerAssignedEmail } from "../../utils/email.js";
import { env } from "../../config/env.js";
import type { AssignReviewerInput, EditorListPapersQuery } from "./editor.schema.js";

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
    prisma.paper.findMany({ where, select: paperSummarySelect, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.paper.count({ where }),
  ]);

  return { papers, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getPaperDetail = async (paperId: string) => {
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: {
      ...paperSummarySelect,
      assignments: { select: assignmentSelect, orderBy: { assignedAt: "desc" } },
      reviews: {
        select: {
          id: true, strengths: true, weaknesses: true,
          score: true, recommendation: true, createdAt: true,
          reviewer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!paper) throw new AppError("Paper not found", 404);
  return paper;
};

export const assignReviewer = async (paperId: string, input: AssignReviewerInput) => {
  const { reviewerId } = input;

  const paper = await prisma.paper.findUnique({ where: { id: paperId }, select: { id: true, status: true, title: true, abstract: true } });
  if (!paper) throw new AppError("Paper not found", 404);
  if (paper.status !== PaperStatus.SUBMITTED) {
    throw new AppError(`Reviewers can only be assigned to SUBMITTED papers (current: ${paper.status})`, 422);
  }

  const reviewer = await prisma.user.findUnique({ where: { id: reviewerId }, select: { id: true, name: true, email: true, role: true, isBanned: true } });
  if (!reviewer) throw new AppError("Reviewer not found", 404);
  if (reviewer.role !== Role.REVIEWER) throw new AppError("The specified user does not have the REVIEWER role", 422);
  if (reviewer.isBanned) throw new AppError("Cannot assign a banned user as a reviewer", 422);

  const existing = await prisma.reviewerAssignment.findUnique({ where: { paperId_reviewerId: { paperId, reviewerId } }, select: { id: true } });
  if (existing) throw new AppError("This reviewer is already assigned to this paper", 409);

  const assignment = await prisma.reviewerAssignment.create({
    data: { paperId, reviewerId },
    select: {
      id: true, status: true, assignedAt: true,
      paper:    { select: { id: true, title: true, domain: true, status: true } },
      reviewer: { select: { id: true, name: true, email: true } },
    },
  });

  // Send email notification to reviewer
  await sendReviewerAssignedEmail({
    to: reviewer.email,
    reviewerName: reviewer.name,
    paperTitle: paper.title,
    paperAbstract: paper.abstract,
    reviewUrl: `${env.APP_URL}/reviews/my-assignments`,
  });

  return assignment;
};

export const removeReviewer = async (paperId: string, reviewerId: string) => {
  const assignment = await prisma.reviewerAssignment.findUnique({
    where:  { paperId_reviewerId: { paperId, reviewerId } },
    select: { id: true, status: true },
  });
  if (!assignment) throw new AppError("Assignment not found", 404);
  if (assignment.status === "COMPLETED") throw new AppError("Cannot remove a reviewer who has already submitted a review", 422);
  await prisma.reviewerAssignment.delete({ where: { id: assignment.id } });
  return { message: "Reviewer removed successfully" };
};

export const listAssignments = async (paperId: string) => {
  const paper = await prisma.paper.findUnique({ where: { id: paperId }, select: { id: true } });
  if (!paper) throw new AppError("Paper not found", 404);
  return prisma.reviewerAssignment.findMany({ where: { paperId }, select: assignmentSelect, orderBy: { assignedAt: "desc" } });
};
