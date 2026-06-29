import { Request, Response, NextFunction } from "express";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";
import { changeRoleSchema, listUsersSchema } from "./admin.schema.js";
import {
  listUsers,
  getUserById,
  changeRole,
  banUser,
  unbanUser,
  getStats,
  getSubmissionAnalytics,
} from "./admin.service.js";

// Express 5 types req.params values as string | string[].
// Route params are always a single string at runtime -- this cast is safe.
const param = (value: string | string[]): string =>
  Array.isArray(value) ? value[0]! : value;

// GET /admin/stats
// Platform-wide statistics for the admin dashboard.
// Role: ADMIN
export const stats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await getStats();
    sendSuccess(res, { statusCode: 200, message: "Stats retrieved successfully", data });
  } catch (err) {
    next(err);
  }
};

// GET /admin/users
// Paginated list of all users with optional filters.
// Role: ADMIN
export const listAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = listUsersSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:  fieldErrors(parsed.error),
        data:    null,
      });
      return;
    }

    const result = await listUsers(parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Users retrieved successfully", data: result });
  } catch (err) {
    next(err);
  }
};

// GET /admin/users/:userId
// Single user detail with activity counts.
// Role: ADMIN
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getUserById(param(req.params.userId));
    sendSuccess(res, { statusCode: 200, message: "User retrieved successfully", data: user });
  } catch (err) {
    next(err);
  }
};

// PATCH /admin/users/:userId/role
// Change a user's role.
// Role: ADMIN
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = changeRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:  fieldErrors(parsed.error),
        data:    null,
      });
      return;
    }

    const user = await changeRole(
      param(req.params.userId),
      req.user!.userId,
      parsed.data
    );

    sendSuccess(res, { statusCode: 200, message: "User role updated successfully", data: user });
  } catch (err) {
    next(err);
  }
};

// PATCH /admin/users/:userId/ban
// Ban a user from the platform.
// Role: ADMIN
export const ban = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await banUser(param(req.params.userId), req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "User banned successfully", data: user });
  } catch (err) {
    next(err);
  }
};

// GET /admin/analytics/submissions
export const submissionAnalytics = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const data = await getSubmissionAnalytics();
    sendSuccess(res, { statusCode: 200, message: "Submission analytics", data });
  } catch (err) { next(err); }
};

// PATCH /admin/users/:userId/unban
// Lift the ban on a user.
// Role: ADMIN
export const unban = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await unbanUser(param(req.params.userId));
    sendSuccess(res, { statusCode: 200, message: "User unbanned successfully", data: user });
  } catch (err) {
    next(err);
  }
};
