import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  listCollections, listAllCollections, getCollectionBySlug, getCollectionById,
  getCollectionArticles, createCollection, updateCollection, deleteCollection,
  addArticleToCollection, removeArticleFromCollection,
} from "./collections.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const paginationSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const createSchema = z.object({
  slug:          z.string().min(2).max(200),
  title:         z.string().min(2).max(300),
  description:   z.string().optional(),
  coverImageUrl: z.string().optional(),
  discipline:    z.string().max(200).optional(),
  isActive:      z.boolean().optional(),
});

const updateSchema = createSchema.partial();

const addArticleSchema = z.object({
  articleId: z.string(),
  order:     z.coerce.number().int().optional(),
});

// ── Public ────────────────────────────────────────────────────
export const list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await listCollections();
    sendSuccess(res, { statusCode: 200, message: "Collections retrieved", data });
  } catch (err) { next(err); }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const collection = await getCollectionBySlug(param(req.params["slug"]));
    sendSuccess(res, { statusCode: 200, message: "Collection retrieved", data: collection });
  } catch (err) { next(err); }
};

export const getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await getCollectionArticles(param(req.params["slug"]), parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── Admin ─────────────────────────────────────────────────────
export const adminList = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await listAllCollections();
    sendSuccess(res, { statusCode: 200, message: "Collections retrieved", data });
  } catch (err) { next(err); }
};

export const adminGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const collection = await getCollectionById(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Collection retrieved", data: collection });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const collection = await createCollection(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Collection created", data: collection });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const collection = await updateCollection(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Collection updated", data: collection });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteCollection(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Collection deleted", data: null });
  } catch (err) { next(err); }
};

export const addArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = addArticleSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const entry = await addArticleToCollection(param(req.params["id"]), parsed.data.articleId, parsed.data.order);
    sendSuccess(res, { statusCode: 201, message: "Article added to collection", data: entry });
  } catch (err) { next(err); }
};

export const removeArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await removeArticleFromCollection(param(req.params["id"]), param(req.params["articleId"]));
    sendSuccess(res, { statusCode: 200, message: "Article removed from collection", data: null });
  } catch (err) { next(err); }
};
