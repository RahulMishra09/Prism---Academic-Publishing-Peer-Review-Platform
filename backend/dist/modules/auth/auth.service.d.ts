import type { RegisterInput, LoginInput } from "./auth.schema.js";
/**
 * registerUser
 * ------------
 * Creates a new user account with READER role (default).
 * Throws 409 if the email is already registered.
 * Returns the created user (no password) + signed JWT.
 */
export declare const registerUser: (input: RegisterInput) => Promise<{
    user: {
        name: string;
        email: string;
        id: string;
        role: import("../../../generated/prisma/index.js").$Enums.Role;
        createdAt: Date;
    };
    token: string;
}>;
/**
 * loginUser
 * ---------
 * Validates credentials and returns the user + signed JWT.
 * Uses the same generic error for wrong email AND wrong password
 * to prevent user enumeration attacks.
 * Throws 403 if the account is banned.
 */
export declare const loginUser: (input: LoginInput) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: import("../../../generated/prisma/index.js").$Enums.Role;
    };
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map