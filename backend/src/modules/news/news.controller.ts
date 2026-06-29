import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  listNews, listAllNews, getNewsBySlug, getNewsById,
  createNews, updateNews, deleteNews,
} from "./news.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const querySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
});

const createSchema = z.object({
  slug:        z.string().min(2).max(200),
  title:       z.string().min(2).max(300),
  summary:     z.string().min(10).max(1000),
  content:     z.string().min(10),
  imageUrl:    z.string().optional(),
  category:    z.string().max(100).optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

const updateSchema = createSchema.partial();

// ── Public ────────────────────────────────────────────────────
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listNews(parsed.data.page, parsed.data.pageSize, parsed.data.category);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await getNewsBySlug(param(req.params["slug"]));
    sendSuccess(res, { statusCode: 200, message: "News article retrieved", data: item });
  } catch (err) { next(err); }
};

// ── Admin ─────────────────────────────────────────────────────
export const adminList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listAllNews(parsed.data.page, parsed.data.pageSize, parsed.data.category);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const adminGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await getNewsById(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "News article retrieved", data: item });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const item = await createNews(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "News article created", data: item });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const item = await updateNews(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "News article updated", data: item });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteNews(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "News article deleted", data: null });
  } catch (err) { next(err); }
};
