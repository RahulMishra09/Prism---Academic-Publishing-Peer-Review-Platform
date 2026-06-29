import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  listJournals, listAllJournals, getJournalBySlug, getJournalById,
  createJournal, updateJournal, deleteJournal,
} from "./journals.service.js";
import { listArticlesByJournal, listArticlesByIssue } from "../articles/articles.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const paginationSchema = z.object({
  page:       z.coerce.number().int().min(1).default(1),
  pageSize:   z.coerce.number().int().min(1).max(1000).default(20),
  discipline: z.string().optional(),
});

const createSchema = z.object({
  slug:          z.string().min(2).max(200),
  title:         z.string().min(2).max(300),
  description:   z.string().optional(),
  discipline:    z.string().max(200).optional(),
  issn:          z.string().max(20).optional(),
  eIssn:         z.string().max(20).optional(),
  impactFactor:  z.coerce.number().optional(),
  coverImageUrl: z.string().optional(),
  isOpenAccess:  z.boolean().optional(),
  publisherName: z.string().max(300).optional(),
  isActive:      z.boolean().optional(),
});

const updateSchema = createSchema
  .extend({ impactFactor: z.coerce.number().nullable().optional() })
  .partial();

// ── Public ────────────────────────────────────────────────────
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listJournals(parsed.data.page, parsed.data.pageSize, parsed.data.discipline);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const journal = await getJournalBySlug(param(req.params["slug"]));
    sendSuccess(res, { statusCode: 200, message: "Journal retrieved", data: journal });
  } catch (err) { next(err); }
};

export const getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listArticlesByJournal(param(req.params["slug"]), parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── GET /journals/:slug/issues/:issueId/articles ─────────────
export const getArticlesByIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listArticlesByIssue(
      param(req.params["slug"]),
      param(req.params["issueId"]),
      parsed.data.page,
      parsed.data.pageSize,
    );
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── Admin ─────────────────────────────────────────────────────
export const adminList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listAllJournals(parsed.data.page, parsed.data.pageSize, parsed.data.discipline);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const adminGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const journal = await getJournalById(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Journal retrieved", data: journal });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const journal = await createJournal(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Journal created", data: journal });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const journal = await updateJournal(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Journal updated", data: journal });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteJournal(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Journal deleted", data: null });
  } catch (err) { next(err); }
};
