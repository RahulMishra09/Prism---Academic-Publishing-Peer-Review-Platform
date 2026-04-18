import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"] as const;

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

export const env = {
  PORT: process.env["PORT"] ?? "5000",
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
  DATABASE_URL: validateDatabaseUrl(process.env["DATABASE_URL"] as string),
  JWT_SECRET: process.env["JWT_SECRET"] as string,
  JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"] ?? "7d",
};
