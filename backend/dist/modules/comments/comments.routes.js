import { Router } from "express";
import { Role } from "../../../generated/prisma/index.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { list, create, remove } from "./comments.controller.js";
const router = Router();
// All comment routes require a valid JWT
router.use(authenticate);
// GET  /comments/papers/:paperId
// List all top-level comments with replies for an APPROVED paper.
// Accessible by all authenticated users.
router.get("/papers/:paperId", list);
// POST /comments/papers/:paperId
// Post a comment or reply on an APPROVED paper.
// REVIEWER is excluded -- reviewers use the Review model.
router.post("/papers/:paperId", requireRole(Role.READER, Role.AUTHOR, Role.EDITOR, Role.ADMIN), create);
// DELETE /comments/:commentId
// Delete a comment (owner, EDITOR, or ADMIN).
// Cascades to replies if deleting a parent comment.
router.delete("/:commentId", requireRole(Role.READER, Role.AUTHOR, Role.EDITOR, Role.ADMIN), remove);
export default router;
//# sourceMappingURL=comments.routes.js.map