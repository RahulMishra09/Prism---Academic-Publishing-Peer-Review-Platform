import { Role } from "../../../generated/prisma/index.js";
import type { CreateReviewInput } from "./reviews.schema.js";
/**
 * Returns all ReviewerAssignments for the authenticated reviewer,
 * including the paper summary and whether a review has already been submitted.
 */
export declare const getMyAssignments: (reviewerId: string) => Promise<{
    id: string;
    paper: {
        id: string;
        title: string;
        abstract: string;
        domain: string;
        keywords: string[];
        status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    };
    status: import("../../../generated/prisma/index.js").$Enums.AssignmentStatus;
    assignedAt: Date;
    review: {
        id: string;
        createdAt: Date;
        score: number;
        recommendation: string;
    } | null;
}[]>;
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
export declare const submitReview: (assignmentId: string, reviewerId: string, input: CreateReviewInput) => Promise<{
    id: string;
    createdAt: Date;
    paper: {
        id: string;
        title: string;
        domain: string;
        status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    };
    strengths: string;
    weaknesses: string;
    score: number;
    recommendation: string;
    reviewer: {
        name: string;
        email: string;
        id: string;
    };
    assignment: {
        id: string;
        status: import("../../../generated/prisma/index.js").$Enums.AssignmentStatus;
        assignedAt: Date;
    };
}>;
/**
 * Returns all reviews for a given paper.
 *
 * Visibility:
 * - AUTHOR  � own papers only; reviewer identity is hidden
 * - EDITOR / ADMIN � full details
 * - REVIEWER � can only see their own review for this paper
 */
export declare const getReviewsForPaper: (paperId: string, requesterId: string, requesterRole: Role) => Promise<{
    id: string;
    createdAt: Date;
    paper: {
        id: string;
        title: string;
        domain: string;
        status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    };
    strengths: string;
    weaknesses: string;
    score: number;
    recommendation: string;
    assignment: {
        id: string;
        status: import("../../../generated/prisma/index.js").$Enums.AssignmentStatus;
        assignedAt: Date;
    };
}[]>;
/**
 * Returns all reviews submitted by the authenticated reviewer.
 */
export declare const getMyReviews: (reviewerId: string) => Promise<{
    id: string;
    createdAt: Date;
    paper: {
        id: string;
        title: string;
        domain: string;
        status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    };
    strengths: string;
    weaknesses: string;
    score: number;
    recommendation: string;
    reviewer: {
        name: string;
        email: string;
        id: string;
    };
    assignment: {
        id: string;
        status: import("../../../generated/prisma/index.js").$Enums.AssignmentStatus;
        assignedAt: Date;
    };
}[]>;
//# sourceMappingURL=reviews.service.d.ts.map