import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { getUsers, getUser, updateRole, ban, unban, getAuditLogs, getStats } from "./admin.controller.js";

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, requireRole("ADMIN"));

// User management
router.get("/users",                    getUsers);
router.get("/users/:userId",            getUser);
router.patch("/users/:userId/role",     updateRole);
router.post("/users/:userId/ban",       ban);
router.post("/users/:userId/unban",     unban);

// Audit logs
router.get("/audit-logs",              getAuditLogs);

// Platform stats
router.get("/stats",                   getStats);

export default router;
