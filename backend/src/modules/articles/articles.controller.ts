import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { articleListSchema } from "./articles.schema.js";
import {
  getArticleByDoi, listArticles, listTopArticles, trackDownload,
  getArticleMetrics, publishArticle,
  listAllArticles, getArticleByIdAdmin, createArticle, updateArticle, deleteArticle,
  listFigures, addFigure, removeFigure,
  listSupplementary, addSupplementary, removeSupplementary,
} from "./articles.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const topSchema = z.object({
  rankBy:     z.enum(["views", "citations", "downloads"]).default("views"),
  limit:      z.coerce.number().int().min(1).max(50).default(10),
  discipline: z.string().optional(),
  period:     z.enum(["week", "month", "year", "all"]).default("all"),
});

const adminListSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(20),
  discipline:  z.string().optional(),
  isPublished: z.enum(["true", "false"]).transform(v => v === "true").optional(),
});

const createSchema = z.object({
  doi:         z.string().min(3).max(500),
  title:       z.string().min(2).max(500),
  abstract:    z.string().min(10),
  discipline:  z.string().min(2).max(200),
  keywords:    z.array(z.string()).optional(),
  articleType: z.string().optional(),
  accessType:  z.string().optional(),
  language:    z.string().max(10).optional(),
  pdfUrl:      z.string().optional(),
  htmlUrl:     z.string().optional(),
  journalId:   z.string().optional(),
  issueId:     z.string().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

const updateSchema = createSchema.extend({
  pdfUrl:      z.string().nullable().optional(),
  htmlUrl:     z.string().nullable().optional(),
  journalId:   z.string().nullable().optional(),
  issueId:     z.string().nullable().optional(),
  isTrending:  z.boolean().optional(),
  publishedAt: z.string().nullable().optional(),
}).partial();

// ── GET /articles ────────────────────────────────────────────
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = articleListSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters", details: fieldErrors(parsed.error) });
      return;
    }
    const result = await listArticles(parsed.data);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── GET /articles/top ────────────────────────────────────────
export const top = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = topSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query", details: fieldErrors(parsed.error) }); return; }
    const data = await listTopArticles(parsed.data.rankBy, parsed.data.limit, parsed.data.discipline, parsed.data.period);
    sendSuccess(res, { statusCode: 200, message: "Top articles", data });
  } catch (err) { next(err); }
};

// ── GET /articles/:doi ───────────────────────────────────────
export const getByDoi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const article = await getArticleByDoi(param(req.params["doi"]));
    sendSuccess(res, { statusCode: 200, message: "Article retrieved", data: article });
  } catch (err) { next(err); }
};

// ── GET /articles/:doi/metrics ───────────────────────────────
export const metrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getArticleMetrics(param(req.params["doi"]));
    sendSuccess(res, { statusCode: 200, message: "Article metrics", data });
  } catch (err) { next(err); }
};

// ── GET /articles/:doi/download ──────────────────────────────
export const download = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await trackDownload(param(req.params["doi"]), req.user?.userId);
    res.redirect(302, result.pdfUrl);
  } catch (err) { next(err); }
};

// ── POST /articles/:id/publish ───────────────────────────────
export const publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const article = await publishArticle(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Article published", data: article });
  } catch (err) { next(err); }
};

// ── Admin ─────────────────────────────────────────────────────
export const adminList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = adminListSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listAllArticles(parsed.data.page, parsed.data.pageSize, parsed.data.discipline, parsed.data.isPublished);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const adminGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const article = await getArticleByIdAdmin(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Article retrieved", data: article });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const article = await createArticle(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Article created", data: article });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const article = await updateArticle(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Article updated", data: article });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteArticle(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Article deleted", data: null });
  } catch (err) { next(err); }
};

// ── Figures ───────────────────────────────────────────────────
const figureSchema = z.object({
  url:     z.string().min(1),
  caption: z.string().optional(),
  type:    z.enum(["IMAGE", "CHART", "TABLE", "DIAGRAM", "OTHER"]).optional(),
  order:   z.coerce.number().int().optional(),
});

export const getFigures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await listFigures(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Figures retrieved", data });
  } catch (err) { next(err); }
};

export const createFigure = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = figureSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const fig = await addFigure(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Figure added", data: fig });
  } catch (err) { next(err); }
};

export const deleteFigure = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await removeFigure(param(req.params["id"]), param(req.params["figureId"]));
    sendSuccess(res, { statusCode: 200, message: "Figure deleted", data: null });
  } catch (err) { next(err); }
};

// ── Supplementary files ───────────────────────────────────────
const suppSchema = z.object({
  fileName:    z.string().min(1),
  fileUrl:     z.string().min(1),
  description: z.string().optional(),
  fileSize:    z.coerce.number().int().optional(),
  mimeType:    z.string().optional(),
});

export const getSupplementary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await listSupplementary(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Supplementary files retrieved", data });
  } catch (err) { next(err); }
};

export const createSupplementary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = suppSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const file = await addSupplementary(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Supplementary file added", data: file });
  } catch (err) { next(err); }
};

export const deleteSupplementary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await removeSupplementary(param(req.params["id"]), param(req.params["fileId"]));
    sendSuccess(res, { statusCode: 200, message: "Supplementary file deleted", data: null });
  } catch (err) { next(err); }
};
