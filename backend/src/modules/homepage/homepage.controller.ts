import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getHomepage, setHomepageSection, deleteHomepageSection } from "./homepage.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const setSectionSchema = z.object({
  content: z.unknown().refine(v => v !== undefined, "content is required"),
});

export const homepage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getHomepage();
    sendSuccess(res, { statusCode: 200, message: "Homepage data", data });
  } catch (err) { next(err); }
};

export const setSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = setSectionSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await setHomepageSection(param(req.params["section"]), parsed.data.content);
    sendSuccess(res, { statusCode: 200, message: "Homepage section updated", data: result });
  } catch (err) { next(err); }
};

export const removeSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteHomepageSection(param(req.params["section"]));
    sendSuccess(res, { statusCode: 200, message: "Homepage section deleted", data: null });
  } catch (err) { next(err); }
};
