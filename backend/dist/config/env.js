import dotenv from "dotenv";
import { Role } from "../../generated/prisma/index.js";
dotenv.config();
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
function validateDatabaseUrl(rawUrl) {
    try {
        const parsed = new URL(rawUrl);
        if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
            throw new Error("DATABASE_URL must start with postgres:// or postgresql://");
        }
        return rawUrl;
    }
    catch {
        throw new Error("Invalid DATABASE_URL. Expected a PostgreSQL connection string like postgresql://user:password@host:5432/database?sslmode=require");
    }
}
function getDevAuthRole(rawRole) {
    if (!rawRole) {
        return Role.ADMIN;
    }
    const normalized = rawRole.trim().toUpperCase();
    if (Object.values(Role).includes(normalized)) {
        return normalized;
    }
    throw new Error(`Invalid DEV_AUTH_ROLE "${rawRole}". Expected one of: ${Object.values(Role).join(", ")}`);
}
export const env = {
    PORT: process.env["PORT"] ?? "8080",
    NODE_ENV: process.env["NODE_ENV"] ?? "development",
    DATABASE_URL: validateDatabaseUrl(process.env["DATABASE_URL"]),
    JWT_SECRET: process.env["JWT_SECRET"],
    JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"] ?? "7d",
    DEV_AUTH_EMAIL: process.env["DEV_AUTH_EMAIL"] ?? "test@lumex.com",
    DEV_AUTH_PASSWORD: process.env["DEV_AUTH_PASSWORD"] ?? "password",
    DEV_AUTH_NAME: process.env["DEV_AUTH_NAME"] ?? "Lumex Test User",
    DEV_AUTH_ROLE: getDevAuthRole(process.env["DEV_AUTH_ROLE"]),
};
//# sourceMappingURL=env.js.map