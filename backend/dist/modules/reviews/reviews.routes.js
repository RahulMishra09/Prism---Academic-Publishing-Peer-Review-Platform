import { Router } from "express";
import { Role } from "../../../generated/prisma/index.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { listMyAssignments, submit, listMyReviews, listForPaper, } from "./reviews.controller.js";
const router = Router();
// All review routes require a valid JWT
router.use(authenticate);
// Reviewer routes 
// GET  /reviews/my-assignments list assigned papers
router.get("/my-assignments", requireRole(Role.REVIEWER), listMyAssignments);
// POST /reviews/assignments/:assignmentId  submit a review
router.post("/assignments/:assignmentId", requireRole(Role.REVIEWER), submit);
// GET  /reviews/my-reviews list own submitted reviews
router.get("/my-reviews", requireRole(Role.REVIEWER), listMyReviews);
// Shared read routes 
// GET  /reviews/papers/:paperId all reviews for a paper
// Accessible by: AUTHOR (own), REVIEWER (own), EDITOR, ADMIN
router.get("/papers/:paperId", requireRole(Role.AUTHOR, Role.REVIEWER, Role.EDITOR, Role.ADMIN), listForPaper);
export default router;
//# sourceMappingURL=reviews.routes.js.map