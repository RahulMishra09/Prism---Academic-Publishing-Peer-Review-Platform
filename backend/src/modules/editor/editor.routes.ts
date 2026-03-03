import { Router } from "express";
import { Role } from "../../../generated/prisma/index.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import {
  listPapers,
  getPaper,
  assign,
  unassign,
  getAssignments,
} from "./editor.controller.js";

const router = Router();

// All editor routes require a valid JWT + EDITOR or ADMIN role
router.use(authenticate);
router.use(requireRole(Role.EDITOR, Role.ADMIN));

// Paper management
// GET  /editor/papers               paginated list of all papers
router.get("/papers", listPapers);

// GET  /editor/papers/:paperId      full paper detail with assignments and reviews
router.get("/papers/:paperId", getPaper);

// Reviewer assignment
// POST   /editor/papers/:paperId/assign-reviewer          assign a reviewer
router.post("/papers/:paperId/assign-reviewer", assign);

// GET    /editor/papers/:paperId/assignments               list all assignments for a paper
router.get("/papers/:paperId/assignments", getAssignments);

// DELETE /editor/papers/:paperId/assignments/:reviewerId   remove a PENDING assignment
router.delete("/papers/:paperId/assignments/:reviewerId", unassign);

export default router;
