import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";
import { createReviewSchema } from "./reviews.schema.js";
import { getMyAssignments, submitReview, getReviewsForPaper, getMyReviews, } from "./reviews.service.js";
//Helper 
/** Express 5 req.params values are `string | string[]` at the type level. */
const param = (value) => Array.isArray(value) ? value[0] : value;
//GET /reviews/my-assignments
/**
 * Lists all papers assigned to the authenticated reviewer,
 * with submission status for each.
 * Role: REVIEWER
 */
export const listMyAssignments = async (req, res, next) => {
    try {
        const assignments = await getMyAssignments(req.user.userId);
        sendSuccess(res, {
            statusCode: 200,
            message: "Assignments retrieved successfully",
            data: assignments,
        });
    }
    catch (err) {
        next(err);
    }
};
// POST /reviews/assignments/:assignmentId
/**
 * Submit a review for an assigned paper.
 * Role: REVIEWER
 */
export const submit = async (req, res, next) => {
    try {
        // Validate body first so we can give specific field errors when data is provided,
        // but check assignment existence before calling the service so a bad ID always
        // yields 404 rather than a misleading validation error.
        const parsed = createReviewSchema.safeParse(req.body);
        if (!parsed.success) {
            // If the assignment doesn't exist, return 404 even when body is also invalid.
            const assignmentId = param(req.params.assignmentId);
            const exists = await import("../../config/prisma.js").then(m => m.prisma.reviewerAssignment.findUnique({
                where: { id: assignmentId },
                select: { id: true },
            }));
            if (!exists) {
                res.status(404).json({ success: false, message: "Assignment not found", data: null });
                return;
            }
            res.status(400).json({ success: false, message: "Validation failed", errors: fieldErrors(parsed.error), data: null });
            return;
        }
        const review = await submitReview(param(req.params.assignmentId), req.user.userId, parsed.data);
        sendSuccess(res, {
            statusCode: 201,
            message: "Review submitted successfully",
            data: review,
        });
    }
    catch (err) {
        next(err);
    }
};
//GET /reviews/my-reviews 
/**
 * Lists all reviews submitted by the authenticated reviewer.
 * Role: REVIEWER
 */
export const listMyReviews = async (req, res, next) => {
    try {
        const reviews = await getMyReviews(req.user.userId);
        sendSuccess(res, {
            statusCode: 200,
            message: "Reviews retrieved successfully",
            data: reviews,
        });
    }
    catch (err) {
        next(err);
    }
};
// GET /reviews/papers/:paperId 
/**
 * Returns all reviews for a specific paper.
 * Reviewer identity is hidden from the paper's author.
 * Role: AUTHOR (own papers) | REVIEWER (own review) | EDITOR | ADMIN
 */
export const listForPaper = async (req, res, next) => {
    try {
        const reviews = await getReviewsForPaper(param(req.params.paperId), req.user.userId, req.user.role);
        sendSuccess(res, {
            statusCode: 200,
            message: "Reviews retrieved successfully",
            data: reviews,
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=reviews.controller.js.map