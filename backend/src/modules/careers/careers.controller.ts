import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  listCareers, listAllCareers, getCareerById, getCareerByIdAdmin,
  createCareer, updateCareer, deleteCareer,
} from "./careers.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const querySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type:     z.string().optional(),
});

const createSchema = z.object({
  title:        z.string().min(2).max(300),
  type:         z.string().min(2).max(100),
  description:  z.string().min(10),
  department:   z.string().max(200).optional(),
  location:     z.string().max(200).optional(),
  requirements: z.string().optional(),
  isActive:     z.boolean().optional(),
  closingDate:  z.string().optional(),
});

const updateSchema = createSchema.extend({ closingDate: z.string().nullable().optional() }).partial();

// ── Public ────────────────────────────────────────────────────
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listCareers(parsed.data.page, parsed.data.pageSize, parsed.data.type);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const career = await getCareerById(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Career listing retrieved", data: career });
  } catch (err) { next(err); }
};

// ── Admin ─────────────────────────────────────────────────────
export const adminList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query parameters" }); return; }
    const result = await listAllCareers(parsed.data.page, parsed.data.pageSize, parsed.data.type);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const adminGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const career = await getCareerByIdAdmin(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Career listing retrieved", data: career });
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const career = await createCareer(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Career listing created", data: career });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const career = await updateCareer(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Career listing updated", data: career });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteCareer(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Career listing deleted", data: null });
  } catch (err) { next(err); }
};
