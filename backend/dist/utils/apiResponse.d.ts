import { Response } from "express";
import { z } from "zod";
/**
 * fieldErrors
 * -----------
 * Converts a Zod v4 ZodError into a plain `Record<field, string[]>` map
 * by reducing over `error.issues` — type-safe and avoids the deprecated
 * `.flatten()` method.
 *
 * Only captures the first path segment (field name) for top-level object
 * validation errors, which is the standard case for request body/query
 * validation in this API.
 *
 * Usage:
 *   const parsed = schema.safeParse(req.body);
 *   if (!parsed.success) {
 *     res.status(400).json({ ..., errors: fieldErrors(parsed.error) });
 *   }
 */
export declare const fieldErrors: (error: z.ZodError) => Record<string, string[]>;
interface ApiResponseOptions {
    statusCode: number;
    message: string;
    data?: unknown;
}
export declare const sendSuccess: (res: Response, { statusCode, message, data }: ApiResponseOptions) => void;
export declare const sendError: (res: Response, { statusCode, message }: Omit<ApiResponseOptions, "data">) => void;
export {};
//# sourceMappingURL=apiResponse.d.ts.map