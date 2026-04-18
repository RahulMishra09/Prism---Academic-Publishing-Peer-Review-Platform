import { AssignmentStatus, PaperStatus, Role } from "../../../generated/prisma/index.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
// Shared select 
const reviewSelect = {
    id: true,
    strengths: true,
    weaknesses: true,
    score: true,
    recommendation: true,
    createdAt: true,
    paper: {
        select: { id: true, title: true, domain: true, status: true },
    },
    reviewer: {
        select: { id: true, name: true, email: true },
    },
    assignment: {
        select: { id: true, status: true, assignedAt: true },
    },
};
//  getMyAssignments 
/**
 * Returns all ReviewerAssignments for the authenticated reviewer,
 * including the paper summary and whether a review has already been submitted.
 */
export const getMyAssignments = async (reviewerId) => {
    return prisma.reviewerAssignment.findMany({
        where: { reviewerId },
        select: {
            id: true,
            status: true,
            assignedAt: true,
            paper: {
                select: {
                    id: true,
                    title: true,
                    abstract: true,
                    domain: true,
                    keywords: true,
                    status: true,
                },
            },
            review: {
                select: { id: true, score: true, recommendation: true, createdAt: true },
            },
        },
        orderBy: { assignedAt: "desc" },
    });
};
// submitReview 
/**
 * Creates a Review for a paper via an existing PENDING assignment.
 *
 * Guards:
 * - Assignment must exist and belong to this reviewer
 * - Assignment must be PENDING (not already reviewed)
 * - Paper must be in SUBMITTED status
 * - Reviewer must not have already reviewed this paper
 *
 * After creation, marks the assignment as COMPLETED.
 */
export const submitReview = async (assignmentId, reviewerId, input) => {
    // Load the assignment with its paper
    const assignment = await prisma.reviewerAssignment.findUnique({
        where: { id: assignmentId },
        select: {
            id: true,
            status: true,
            reviewerId: true,
            paperId: true,
            paper: {
                select: { id: true, status: true },
            },
            review: { select: { id: true } },
        },
    });
    if (!assignment) {
        throw new AppError("Assignment not found", 404);
    }
    if (assignment.reviewerId !== reviewerId) {
        throw new AppError("You are not assigned to this paper", 403);
    }
    if (assignment.status === AssignmentStatus.COMPLETED) {
        throw new AppError("You have already submitted a review for this assignment", 409);
    }
    if (assignment.paper.status !== PaperStatus.SUBMITTED) {
        throw new AppError("Reviews can only be submitted for papers in SUBMITTED status", 400);
    }
    // Double-check no review exists (covers race conditions)
    if (assignment.review) {
        throw new AppError("A review for this assignment already exists", 409);
    }
    // Create review and mark assignment COMPLETED in a single transaction
    const [review] = await prisma.$transaction([
        prisma.review.create({
            data: {
                strengths: input.strengths,
                weaknesses: input.weaknesses,
                score: input.score,
                recommendation: input.recommendation,
                paperId: assignment.paperId,
                reviewerId,
                assignmentId,
            },
            select: reviewSelect,
        }),
        prisma.reviewerAssignment.update({
            where: { id: assignmentId },
            data: { status: AssignmentStatus.COMPLETED },
        }),
    ]);
    return review;
};
// getReviewsForPaper
/**
 * Returns all reviews for a given paper.
 *
 * Visibility:
 * - AUTHOR  � own papers only; reviewer identity is hidden
 * - EDITOR / ADMIN � full details
 * - REVIEWER � can only see their own review for this paper
 */
export const getReviewsForPaper = async (paperId, requesterId, requesterRole) => {
    // Verify paper exists
    const paper = await prisma.paper.findUnique({
        where: { id: paperId },
        select: { id: true, submittedBy: true, status: true },
    });
    if (!paper) {
        throw new AppError("Paper not found", 404);
    }
    // Role-specific access checks
    // READERs have no business reading raw peer reviews
    if (requesterRole === Role.READER) {
        throw new AppError("Access denied", 403);
    }
    if (requesterRole === Role.AUTHOR && paper.submittedBy !== requesterId) {
        throw new AppError("You do not have access to this paper's reviews", 403);
    }
    // REVIEWER — sees only their own review for this paper
    if (requesterRole === Role.REVIEWER) {
        return prisma.review.findMany({
            where: { paperId, reviewerId: requesterId },
            select: reviewSelect,
            orderBy: { createdAt: "desc" },
        });
    }
    // AUTHOR — sees review content but reviewer identity is hidden (double-blind)
    // NOTE: reviewer identity must be omitted from the select entirely;
    // setting a key to `false` in a Prisma select is silently ignored.
    if (requesterRole === Role.AUTHOR) {
        return prisma.review.findMany({
            where: { paperId },
            select: {
                id: true,
                strengths: true,
                weaknesses: true,
                score: true,
                recommendation: true,
                createdAt: true,
                paper: { select: { id: true, title: true, domain: true, status: true } },
                assignment: { select: { id: true, status: true, assignedAt: true } },
                // reviewer key intentionally absent — omission hides the relation
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // EDITOR / ADMIN — full details
    return prisma.review.findMany({
        where: { paperId },
        select: reviewSelect,
        orderBy: { createdAt: "desc" },
    });
};
//getMyReviews
/**
 * Returns all reviews submitted by the authenticated reviewer.
 */
export const getMyReviews = async (reviewerId) => {
    return prisma.review.findMany({
        where: { reviewerId },
        select: reviewSelect,
        orderBy: { createdAt: "desc" },
    });
};
//# sourceMappingURL=reviews.service.js.map