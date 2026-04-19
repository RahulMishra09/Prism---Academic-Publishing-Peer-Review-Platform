import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  listUsers,
  getUserById,
  changeUserRole,
  banUser,
  unbanUser,
  listAuditLogs,
  getPlatformStats,
} from "./admin.service.js";
import {
  changeRoleSchema,
  listUsersSchema,
  listAuditLogsSchema,
} from "./admin.schema.js";
import { Role, AuditAction } from "../../../generated/prisma/index.js";

/** GET /admin/users */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = listUsersSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ success: false, message: "Invalid query", data: null }); return; }
    const result = await listUsers({ ...parsed.data, role: parsed.data.role as Role | undefined });
    sendSuccess(res, { statusCode: 200, message: "Users retrieved", data: result });
  } catch (err) { next(err); }
};

/** GET /admin/users/:userId */
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await getUserById(String(req.params["userId"]));
    sendSuccess(res, { statusCode: 200, message: "User retrieved", data: user });
  } catch (err) { next(err); }
};

/** PATCH /admin/users/:userId/role */
export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = changeRoleSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ success: false, message: "Invalid role", data: null }); return; }
    const result = await changeUserRole(String(req.params["userId"]), parsed.data.role as Role, req.user!.userId, req.ip);
    sendSuccess(res, { statusCode: 200, message: "Role updated", data: result });
  } catch (err) { next(err); }
};

/** POST /admin/users/:userId/ban */
export const ban = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await banUser(String(req.params["userId"]), req.user!.userId, req.ip);
    sendSuccess(res, { statusCode: 200, message: "User banned", data: result });
  } catch (err) { next(err); }
};

/** POST /admin/users/:userId/unban */
export const unban = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await unbanUser(String(req.params["userId"]), req.user!.userId, req.ip);
    sendSuccess(res, { statusCode: 200, message: "User unbanned", data: result });
  } catch (err) { next(err); }
};

/** GET /admin/audit-logs */
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = listAuditLogsSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ success: false, message: "Invalid query", data: null }); return; }
    const result = await listAuditLogs({ ...parsed.data, action: parsed.data.action as AuditAction | undefined });
    sendSuccess(res, { statusCode: 200, message: "Audit logs retrieved", data: result });
  } catch (err) { next(err); }
};

/** GET /admin/stats */
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await getPlatformStats();
    sendSuccess(res, { statusCode: 200, message: "Stats retrieved", data: stats });
  } catch (err) { next(err); }
};
