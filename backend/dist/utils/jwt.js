import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
// Sign a new token
export const signToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
};
// Verify and decode a token
export const verifyToken = (token) => {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded;
};
//# sourceMappingURL=jwt.js.map