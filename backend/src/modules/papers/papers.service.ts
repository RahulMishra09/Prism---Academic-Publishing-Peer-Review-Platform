import { PaperStatus, Role, Prisma } from "../../../generated/prisma/index.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import type {
  CreatePaperInput,
  UpdatePaperInput,
  RejectPaperInput,
  ListPapersQuery,
} from "./papers.schema.js";

//  Shared select avoids over-fetching across all queries 
const paperSelect = {
  id:             true,
  title:          true,
  abstract:       true,
  domain:         true,
  keywords:       true,
  status:         true,
  rejectionReason: true,
  createdAt:      true,
  updatedAt:      true,
  approvedAt:     true,
  author: {
    select: { id: true, name: true, email: true },
  },
} as const;

//  createPaper 
/**
 * Creates a new paper in DRAFT status for the authenticated author.
 */
export const createPaper = async (
  authorId: string,
  input: CreatePaperInput
) => {
  const paper = await prisma.paper.create({
    data: {
      title:      input.title,
      abstract:   input.abstract,
      domain:     input.domain,
      keywords:   input.keywords,
      submittedBy: authorId,
    },
    select: paperSelect,
  });

  return paper;
};

//  getMyPapers 
/**
 * Returns all papers belonging to the authenticated author,
 * newest first.
 */
export const getMyPapers = async (authorId: string) => {
  return prisma.paper.findMany({
    where:   { submittedBy: authorId },
    select:  paperSelect,
    orderBy: { createdAt: "desc" },
  });
};

//  listPapers 
/**
 * Paginated list of papers.
 *
 * Visibility rules:
 *  - AUTHOR  ’ their own papers only
 *  - REVIEWER ’ SUBMITTED papers only (assigned or unassigned)
 *  - EDITOR / ADMIN ’ all papers, filterable by status / domain
 *  - READER  ’ APPROVED papers only
 */
export const listPapers = async (
  requesterId: string,
  requesterRole: Role,
  query: ListPapersQuery
) => {
  const { status, domain, page, limit } = query;
  const skip = (page - 1) * limit;

  // Using Prisma.PaperWhereInput keeps this fully type-safe and
  // allows the assignments relation filter needed for the REVIEWER case.
  let where: Prisma.PaperWhereInput = {};

  switch (requesterRole) {
    case Role.AUTHOR:
      where.submittedBy = requesterId;
      if (status) where.status = status as PaperStatus;
      break;

    case Role.REVIEWER:
      // Reviewers can only see SUBMITTED papers they are explicitly assigned to
      where = {
        status: PaperStatus.SUBMITTED,
        assignments: { some: { reviewerId: requesterId } },
      };
      break;

    case Role.READER:
      // Readers can only browse published papers
      where.status = PaperStatus.APPROVED;
      break;

    case Role.EDITOR:
    case Role.ADMIN:
    default:
      // Full visibility with optional filters
      if (status) where.status = status as PaperStatus;
      break;
  }

  if (domain) {
    where.domain = { contains: domain, mode: "insensitive" };
  }

  const [papers, total] = await Promise.all([
    prisma.paper.findMany({
      where,
      select:  paperSelect,
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

//  getPaperById 
/**
 * Returns a single paper with its reviews and reviewer assignments.
 *
 * Visibility:
 *  - AUTHOR   ’ own papers only
 *  - READER   ’ APPROVED papers only
 *  - REVIEWER ’ SUBMITTED papers only
 *  - EDITOR / ADMIN ’ any paper
 */
export const getPaperById = async (
  paperId: string,
  requesterId: string,
  requesterRole: Role
) => {
  // ── Step 1: fetch base paper for access checks (no sensitive relations yet) ──
  const base = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, status: true, submittedBy: true },
  });

  if (!base) throw new AppError("Paper not found", 404);

  // ── Step 2: role-specific access guards ──────────────────────────────────────
  if (requesterRole === Role.READER && base.status !== PaperStatus.APPROVED) {
    throw new AppError("Paper not found", 404); // don't leak existence
  }

  if (requesterRole === Role.AUTHOR && base.submittedBy !== requesterId) {
    throw new AppError("You do not have access to this paper", 403);
  }

  if (requesterRole === Role.REVIEWER) {
    // Reviewer may only view papers they are explicitly assigned to
    const assignment = await prisma.reviewerAssignment.findUnique({
      where:  { paperId_reviewerId: { paperId, reviewerId: requesterId } },
      select: { id: true },
    });
    if (!assignment) throw new AppError("Paper not found", 404);
    if (base.status !== PaperStatus.SUBMITTED) {
      throw new AppError("Paper not found", 404);
    }
  }

  // ── Step 3: fetch full paper with role-appropriate relations ──────────────────

  // EDITOR / ADMIN — full details including assignment roster
  if (requesterRole === Role.EDITOR || requesterRole === Role.ADMIN) {
    return prisma.paper.findUnique({
      where:  { id: paperId },
      select: {
        ...paperSelect,
        reviews: {
          select: {
            id: true, strengths: true, weaknesses: true,
            score: true, recommendation: true, createdAt: true,
            reviewer: { select: { id: true, name: true, email: true } },
          },
        },
        assignments: {
          select: {
            id: true, status: true, assignedAt: true,
            reviewer: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  // AUTHOR — reviews without reviewer identity; no assignment roster (double-blind)
  if (requesterRole === Role.AUTHOR) {
    return prisma.paper.findUnique({
      where:  { id: paperId },
      select: {
        ...paperSelect,
        reviews: {
          select: {
            id: true, strengths: true, weaknesses: true,
            score: true, recommendation: true, createdAt: true,
            // reviewer identity intentionally omitted — double-blind
          },
        },
      },
    });
  }

  // REVIEWER — paper details + only their own review; no assignment roster
  if (requesterRole === Role.REVIEWER) {
    return prisma.paper.findUnique({
      where:  { id: paperId },
      select: {
        ...paperSelect,
        reviews: {
          where:  { reviewerId: requesterId },
          select: {
            id: true, strengths: true, weaknesses: true,
            score: true, recommendation: true, createdAt: true,
          },
        },
      },
    });
  }

  // READER — approved paper only, no reviews or assignments
  return prisma.paper.findUnique({
    where:  { id: paperId },
    select: paperSelect,
  });
};

//  updatePaper 
/**
 * Updates a paper's content. Only the owning author may do this,
 * and only while the paper is in DRAFT status.
 */
export const updatePaper = async (
  paperId: string,
  authorId: string,
  input: UpdatePaperInput
) => {
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, submittedBy: true, status: true },
  });

  if (!paper) {
    throw new AppError("Paper not found", 404);
  }

  if (paper.submittedBy !== authorId) {
    throw new AppError("You do not have permission to edit this paper", 403);
  }

  if (paper.status !== PaperStatus.DRAFT) {
    throw new AppError(
      "Only papers in DRAFT status can be edited",
      400
    );
  }

  return prisma.paper.update({
    where:  { id: paperId },
    data:   input,
    select: paperSelect,
  });
};

//  submitPaper 
/**
 * Transitions a paper from DRAFT ’ SUBMITTED.
 * Only the owning author may submit, and only from DRAFT status.
 */
export const submitPaper = async (paperId: string, authorId: string) => {
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, submittedBy: true, status: true },
  });

  if (!paper) {
    throw new AppError("Paper not found", 404);
  }

  if (paper.submittedBy !== authorId) {
    throw new AppError("You do not have permission to submit this paper", 403);
  }

  if (paper.status !== PaperStatus.DRAFT) {
    throw new AppError(
      `Paper cannot be submitted from its current status (${paper.status})`,
      400
    );
  }

  return prisma.paper.update({
    where:  { id: paperId },
    data:   { status: PaperStatus.SUBMITTED },
    select: paperSelect,
  });
};

//  approvePaper 
/**
 * Transitions a paper from SUBMITTED ’ APPROVED.
 * Only EDITOR / ADMIN may approve.
 * Sets approvedAt timestamp.
 */
export const approvePaper = async (paperId: string) => {
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, status: true },
  });

  if (!paper) {
    throw new AppError("Paper not found", 404);
  }

  if (paper.status !== PaperStatus.SUBMITTED) {
    throw new AppError(
      `Only SUBMITTED papers can be approved (current: ${paper.status})`,
      400
    );
  }

  // Require at least one completed review before approval — peer review is
  // mandatory for acceptance decisions.
  const completedReviews = await prisma.review.count({ where: { paperId } });
  if (completedReviews === 0) {
    throw new AppError(
      "Paper must have at least one submitted review before it can be approved",
      400
    );
  }

  return prisma.paper.update({
    where:  { id: paperId },
    data: {
      status:     PaperStatus.APPROVED,
      approvedAt: new Date(),
    },
    select: paperSelect,
  });
};

//  rejectPaper 
/**
 * Transitions a paper from SUBMITTED ’ REJECTED.
 * Requires a rejection reason.
 * Only EDITOR / ADMIN may reject.
 */
export const rejectPaper = async (
  paperId: string,
  input: RejectPaperInput
) => {
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, status: true },
  });

  if (!paper) {
    throw new AppError("Paper not found", 404);
  }

  if (paper.status !== PaperStatus.SUBMITTED) {
    throw new AppError(
      `Only SUBMITTED papers can be rejected (current: ${paper.status})`,
      400
    );
  }

  // Editors may reject a paper at any point (e.g. out-of-scope, plagiarism)
  // without requiring peer review first — no review count guard here.

  return prisma.paper.update({
    where:  { id: paperId },
    data: {
      status:          PaperStatus.REJECTED,
      rejectionReason: input.rejectionReason,
    },
    select: paperSelect,
  });
};
