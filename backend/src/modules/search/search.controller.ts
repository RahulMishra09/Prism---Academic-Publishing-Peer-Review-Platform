import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { search, getSuggestions, getRelatedArticles } from "./search.service.js";
import { fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const searchSchema = z.object({
  query:         z.string().default(""),
  page:          z.coerce.number().int().min(1).default(1),
  pageSize:      z.coerce.number().int().min(1).max(100).default(20),
  sortBy:        z.enum(["relevance", "date-desc", "date-asc", "citations", "views"]).default("date-desc"),
  contentType:   z.string().optional().transform(v => v?.split(",")),
  discipline:    z.string().optional().transform(v => v?.split(",")),
  journal:       z.string().optional().transform(v => v?.split(",")),
  accessType:    z.string().optional().transform(v => v?.split(",")),
  language:      z.string().optional().transform(v => v?.split(",")),
  articleType:   z.string().optional().transform(v => v?.split(",")),
  dateFrom:      z.string().optional(),
  dateTo:        z.string().optional(),
  titleSearch:   z.string().optional(),
  authorSearch:  z.string().optional(),
  abstractSearch:z.string().optional(),
  issnSearch:    z.string().optional(),
  doiSearch:     z.string().optional(),
});

// POST body schema — arrays passed directly (no comma-split needed)
const postSearchSchema = z.object({
  query:         z.string().default(""),
  page:          z.coerce.number().int().min(1).default(1),
  pageSize:      z.coerce.number().int().min(1).max(100).default(20),
  sortBy:        z.enum(["relevance", "date-desc", "date-asc", "citations", "views"]).default("date-desc"),
  contentType:   z.array(z.string()).optional(),
  discipline:    z.array(z.string()).optional(),
  journal:       z.array(z.string()).optional(),
  accessType:    z.array(z.string()).optional(),
  language:      z.array(z.string()).optional(),
  articleType:   z.array(z.string()).optional(),
  dateFrom:      z.string().optional(),
  dateTo:        z.string().optional(),
  titleSearch:   z.string().optional(),
  authorSearch:  z.string().optional(),
  abstractSearch:z.string().optional(),
  issnSearch:    z.string().optional(),
  doiSearch:     z.string().optional(),
});

const suggestionSchema = z.object({ q: z.string().min(1) });
const relatedSchema    = z.object({ limit: z.coerce.number().int().min(1).max(20).default(6) });

// ── GET /search ───────────────────────────────────────────────
export const searchHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = searchSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid search parameters", details: fieldErrors(parsed.error) }); return; }
    const result = await search(parsed.data as Parameters<typeof search>[0]);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── POST /search ──────────────────────────────────────────────
export const postSearchHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = postSearchSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid search parameters", details: fieldErrors(parsed.error) }); return; }
    const result = await search(parsed.data as Parameters<typeof search>[0]);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// ── GET /search/suggestions ───────────────────────────────────
export const suggestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = suggestionSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Query required" }); return; }
    const data = await getSuggestions(parsed.data.q);
    res.status(200).json({ data });
  } catch (err) { next(err); }
};

// ── GET /search/related/:doi ──────────────────────────────────
export const relatedArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = relatedSchema.safeParse(req.query);
    const limit = parsed.success ? parsed.data.limit : 6;
    const data = await getRelatedArticles(param(req.params["doi"]), limit);
    res.status(200).json({ data });
  } catch (err) { next(err); }
};
