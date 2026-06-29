import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { updateProfileSchema, createAlertSchema, changePasswordSchema, updateAlertSchema } from "./users.schema.js";
import {
  getProfile, updateProfile, changePassword, updateAvatar, getDashboard, getUserSubmissions, getUserOrders,
  getAlerts, createAlert, deleteAlert, updateAlert,
  getBookmarks, addBookmark, removeBookmark,
  getSubscription, createSubscription, cancelSubscription,
  listReviewers, getSavedArticles, saveArticle, unsaveArticle,
  recordView, getViewHistory,
} from "./users.service.js";
import { uploadFile } from "../../utils/storage.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const paginationSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const subscribeSchema = z.object({
  plan: z.enum(["MONTHLY", "YEARLY", "INSTITUTIONAL"]),
});

// ── GET /users/me ─────────────────────────────────────────────
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await getProfile(req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "Profile retrieved", data: user });
  } catch (err) { next(err); }
};

// ── PUT /users/me ─────────────────────────────────────────────
export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const user = await updateProfile(req.user!.userId, parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Profile updated", data: user });
  } catch (err) { next(err); }
};

// ── PUT /users/me/password ─────────────────────────────────────
export const changePasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await changePassword(req.user!.userId, parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Password changed successfully", data: result });
  } catch (err) { next(err); }
};

// ── PUT /users/me/avatar ──────────────────────────────────────
export const uploadAvatarHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    if (!file) { res.status(400).json({ code: "BAD_REQUEST", message: "No file uploaded" }); return; }

    const storagePath = `avatars/${req.user!.userId}/${Date.now()}-${file.originalname}`;
    const publicUrl = await uploadFile(file.buffer, storagePath, file.mimetype);
    const user = await updateAvatar(req.user!.userId, publicUrl);
    sendSuccess(res, { statusCode: 200, message: "Avatar updated", data: user });
  } catch (err) { next(err); }
};

// ── GET /users/me/dashboard ───────────────────────────────────
export const dashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getDashboard(req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "Dashboard data", data });
  } catch (err) { next(err); }
};

// ── GET /users/me/submissions ─────────────────────────────────
export const mySubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await getUserSubmissions(req.user!.userId, parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── GET /users/me/orders ──────────────────────────────────────
export const myOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await getUserOrders(req.user!.userId, parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── Alerts ────────────────────────────────────────────────────
export const myAlerts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const alerts = await getAlerts(req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "Alerts retrieved", data: alerts });
  } catch (err) { next(err); }
};

export const addAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createAlertSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const alert = await createAlert(req.user!.userId, parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Alert created", data: alert });
  } catch (err) { next(err); }
};

export const removeAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteAlert(req.user!.userId, param(req.params["id"]));
    res.status(204).send();
  } catch (err) { next(err); }
};

export const updateAlertHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateAlertSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const alert = await updateAlert(req.user!.userId, param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Alert updated", data: alert });
  } catch (err) { next(err); }
};

// ── Bookmarks ─────────────────────────────────────────────────
export const myBookmarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await getBookmarks(req.user!.userId, parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const bookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const articleId = param(req.params["articleId"]);
    const result = await addBookmark(req.user!.userId, articleId);
    sendSuccess(res, { statusCode: 201, message: "Bookmarked", data: result });
  } catch (err) { next(err); }
};

export const unbookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await removeBookmark(req.user!.userId, param(req.params["articleId"]));
    res.status(204).send();
  } catch (err) { next(err); }
};

// ── Reviewer pool ─────────────────────────────────────────────
export const getReviewers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = z.object({
      q:          z.string().optional(),
      discipline: z.string().optional(),
      page:       z.coerce.number().int().min(1).default(1),
      pageSize:   z.coerce.number().int().min(1).max(100).default(20),
    }).safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await listReviewers(parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Reviewers retrieved", data: result });
  } catch (err) { next(err); }
};

// ── Saved articles ────────────────────────────────────────────
export const mySavedArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await getSavedArticles(req.user!.userId, parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const saveArticleHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await saveArticle(req.user!.userId, param(req.params["articleId"]));
    sendSuccess(res, { statusCode: 201, message: "Article saved", data: result });
  } catch (err) { next(err); }
};

export const unsaveArticleHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await unsaveArticle(req.user!.userId, param(req.params["articleId"]));
    res.status(204).send();
  } catch (err) { next(err); }
};

// ── View history ──────────────────────────────────────────────
export const myHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await getViewHistory(req.user!.userId, parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const addToHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const articleId = param(req.params["articleId"]);
    await recordView(req.user!.userId, articleId);
    sendSuccess(res, { statusCode: 201, message: "View recorded", data: null });
  } catch (err) { next(err); }
};

// ── Subscription ──────────────────────────────────────────────
export const mySubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sub = await getSubscription(req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "Subscription status", data: sub });
  } catch (err) { next(err); }
};

export const subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const sub = await createSubscription(req.user!.userId, parsed.data.plan);
    sendSuccess(res, { statusCode: 201, message: "Subscription created", data: sub });
  } catch (err) { next(err); }
};

export const unsubscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sub = await cancelSubscription(req.user!.userId);
    sendSuccess(res, { statusCode: 200, message: "Subscription cancelled", data: sub });
  } catch (err) { next(err); }
};
