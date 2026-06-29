import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { contactSchema } from "./contact.schema.js";
import { submitContact, listContactMessages, updateContactStatus } from "./contact.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const paginationSchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status:   z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
});

const statusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export const contact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await submitContact(parsed.data);
    sendSuccess(res, { statusCode: 202, message: "Message received", data: result });
  } catch (err) { next(err); }
};

export const adminListMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await listContactMessages(parsed.data.page, parsed.data.pageSize, parsed.data.status);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const adminUpdateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await updateContactStatus(param(req.params["id"]), parsed.data.status);
    sendSuccess(res, { statusCode: 200, message: "Status updated", data: result });
  } catch (err) { next(err); }
};
