import { registerSchema, loginSchema } from "./auth.schema.js";
import { registerUser, loginUser } from "./auth.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";
/**
 * POST /auth/register
 * -------------------
 * Validates body with Zod, delegates to registerUser service.
 * Returns 201 with user object and JWT on success.
 */
export const register = async (req, res, next) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
                data: null,
            });
            return;
        }
        const result = await registerUser(parsed.data);
        sendSuccess(res, {
            statusCode: 201,
            message: "Account created successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
/**
 * POST /auth/login
 * ----------------
 * Validates body with Zod, delegates to loginUser service.
 * Returns 200 with user object and JWT on success.
 */
export const login = async (req, res, next) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
                data: null,
            });
            return;
        }
        const result = await loginUser(parsed.data);
        sendSuccess(res, {
            statusCode: 200,
            message: "Login successful",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=auth.controller.js.map