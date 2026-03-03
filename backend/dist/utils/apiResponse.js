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
export const fieldErrors = (error) => {
    const result = {};
    for (const issue of error.issues) {
        const key = issue.path.length > 0 ? String(issue.path[0]) : "_root";
        if (!result[key])
            result[key] = [];
        result[key].push(issue.message);
    }
    return result;
};
// Standard success response
export const sendSuccess = (res, { statusCode = 200, message, data }) => {
    res.status(statusCode).json({
        success: true,
        message,
        data: data ?? null,
    });
};
// Standard error response
export const sendError = (res, { statusCode = 500, message }) => {
    res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};
//# sourceMappingURL=apiResponse.js.map