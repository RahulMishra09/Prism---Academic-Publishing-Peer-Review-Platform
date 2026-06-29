import { Router } from "express";
import { Role } from "../../../generated/prisma/index.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { stats, listAllUsers, getUser, updateRole, ban, unban, submissionAnalytics } from "./admin.controller.js";

const router = Router();

// All admin routes require a valid JWT
router.use(authenticate);

// Analytics — accessible to editors and admins
// GET  /admin/analytics/submissions          editorial pipeline KPIs
router.get("/analytics/submissions", requireRole(Role.EDITOR, Role.ADMIN), submissionAnalytics);

// Routes below require full ADMIN role
router.use(requireRole(Role.ADMIN));

// Dashboard
// GET  /admin/stats                          platform-wide stats
router.get("/stats", stats);

// User management
// GET   /admin/users                   paginated list with filters
router.get("/users", listAllUsers);

// GET   /admin/users/:userId           single user detail
router.get("/users/:userId", getUser);

// PATCH /admin/users/:userId/role      change role
router.patch("/users/:userId/role", updateRole);

// PATCH /admin/users/:userId/ban       ban a user
router.patch("/users/:userId/ban", ban);

// PATCH /admin/users/:userId/unban     lift ban
router.patch("/users/:userId/unban", unban);

export default router;
