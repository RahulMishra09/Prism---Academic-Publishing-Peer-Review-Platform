import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  listConferences, getConferenceBySlug, getConferenceById,
  createConference, updateConference, deleteConference,
} from "./conferences.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const querySchema = z.object({
  page:       z.coerce.number().int().min(1).default(1),
  pageSize:   z.coerce.number().int().min(1).max(100).default(20),
  status:     z.string().optional(),
  year:       z.coerce.number().int().optional(),
  discipline: z.string().optional(),
});

const createSchema = z.object({
  slug:               z.string().min(2).max(200),
  title:              z.string().min(2).max(300),
  startDate:          z.string(),
  endDate:            z.string(),
  description:        z.string().optional(),
  location:           z.string().max(300).optional(),
  isVirtual:          z.boolean().optional(),
  status:             z.string().optional(),
  discipline:         z.string().max(200).optional(),
  submissionDeadline: z.string().optional(),
  website:            z.string().optional(),
  coverImageUrl:      z.string().optional(),
});

const updateSchema = createSchema
  .extend({ submissionDeadline: z.string().nullable().optional() })
  .partial();

// ── Public ────────────────────────────────────────────────────
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const { page, pageSize, status, year, discipline } = parsed.data;
    const result = await listConferences(page, pageSize, status, year, discipline);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const conf = await getConferenceBySlug(param(req.params["slug"]));
    sendSuccess(res, { statusCode: 200, message: "Conference retrieved", data: conf });
  } catch (err) { next(err); }
};

// ── Admin ─────────────────────────────────────────────────────
export const adminList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const { page, pageSize, status, year, discipline } = parsed.data;
    const result = await listConferences(page, pageSize, status, year, discipline);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const adminGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const conf = await getConferenceById(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Conference retrieved", data: conf });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const conf = await createConference(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Conference created", data: conf });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const conf = await updateConference(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Conference updated", data: conf });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteConference(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Conference deleted", data: null });
  } catch (err) { next(err); }
};
