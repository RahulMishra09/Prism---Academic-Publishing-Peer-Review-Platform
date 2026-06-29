import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getSiteConfig, setSiteConfig } from "./siteConfig.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const setSchema = z.object({
  value: z.string(),
});

export const siteConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getSiteConfig();
    sendSuccess(res, { statusCode: 200, message: "Site configuration", data });
  } catch (err) { next(err); }
};

export const setConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = setSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const result = await setSiteConfig(param(req.params["key"]), parsed.data.value);
    sendSuccess(res, { statusCode: 200, message: "Config key updated", data: result });
  } catch (err) { next(err); }
};
