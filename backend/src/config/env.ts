import dotenv from "dotenv";
import { Role } from "../../generated/prisma/index.js";

dotenv.config();

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

function validateDatabaseUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
      throw new Error("DATABASE_URL must start with postgres:// or postgresql://");
    }

    return rawUrl;
  } catch {
    throw new Error(
      "Invalid DATABASE_URL. Expected a PostgreSQL connection string like postgresql://user:password@host:5432/database?sslmode=require",
    );
  }
}

function getDevAuthRole(rawRole: string | undefined): Role {
  if (!rawRole) {
    return Role.ADMIN;
  }

  const normalized = rawRole.trim().toUpperCase();

  if (Object.values(Role).includes(normalized as Role)) {
    return normalized as Role;
  }

  throw new Error(
    `Invalid DEV_AUTH_ROLE "${rawRole}". Expected one of: ${Object.values(Role).join(", ")}`,
  );
}

export const env = {
  PORT: process.env["PORT"] ?? "8080",
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
  DATABASE_URL: validateDatabaseUrl(process.env["DATABASE_URL"] as string),
  UPLOADS_DATABASE_URL: process.env["UPLOADS_DATABASE_URL"] ?? process.env["DATABASE_URL"] as string,
  JWT_SECRET: process.env["JWT_SECRET"] as string,
  JWT_REFRESH_SECRET: process.env["JWT_REFRESH_SECRET"] as string,
  JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"] ?? "15m",
  DEV_AUTH_EMAIL: process.env["DEV_AUTH_EMAIL"] ?? "test@lumex.com",
  DEV_AUTH_PASSWORD: process.env["DEV_AUTH_PASSWORD"] ?? "password",
  DEV_AUTH_NAME: process.env["DEV_AUTH_NAME"] ?? "Lumex Test User",
  DEV_AUTH_ROLE: getDevAuthRole(process.env["DEV_AUTH_ROLE"]),
  // Email (SMTP / nodemailer)
  SMTP_HOST: process.env["SMTP_HOST"] ?? "",
  SMTP_PORT: Number(process.env["SMTP_PORT"] ?? "587"),
  SMTP_USER: process.env["SMTP_USER"] ?? "",
  SMTP_PASS: process.env["SMTP_PASS"] ?? "",
  EMAIL_FROM: process.env["EMAIL_FROM"] ?? "no-reply@prism.io",
  FRONTEND_URL: process.env["FRONTEND_URL"] ?? "http://localhost:5173",
};
