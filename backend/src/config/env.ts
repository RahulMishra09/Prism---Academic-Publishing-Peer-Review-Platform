import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
  "SUPABASE_BUCKET",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "APP_URL",
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  PORT:                  process.env["PORT"]           ?? "5000",
  NODE_ENV:              process.env["NODE_ENV"]        ?? "development",
  DATABASE_URL:          process.env["DATABASE_URL"]    as string,
  JWT_SECRET:            process.env["JWT_SECRET"]      as string,
  JWT_EXPIRES_IN:        process.env["JWT_EXPIRES_IN"]  ?? "15m",
  REFRESH_TOKEN_EXPIRES: process.env["REFRESH_TOKEN_EXPIRES"] ?? "30d",
  SUPABASE_URL:          process.env["SUPABASE_URL"]         as string,
  SUPABASE_SERVICE_KEY:  process.env["SUPABASE_SERVICE_KEY"] as string,
  SUPABASE_BUCKET:       process.env["SUPABASE_BUCKET"]      as string,
  RESEND_API_KEY:        process.env["RESEND_API_KEY"]       as string,
  EMAIL_FROM:            process.env["EMAIL_FROM"]           as string,
  APP_URL:               process.env["APP_URL"]              as string,
  // Optional — frontend origin for CORS (comma-separated list)
  CORS_ORIGINS:             process.env["CORS_ORIGINS"]             ?? "*",
  // Optional — payment webhook signature secret
  PAYMENT_WEBHOOK_SECRET:   process.env["PAYMENT_WEBHOOK_SECRET"]   ?? "",
  // Optional — AI features
  OPENAI_API_KEY:           process.env["OPENAI_API_KEY"]           ?? "",
  GEMINI_API_KEY:           process.env["GEMINI_API_KEY"]           ?? "",
  GROQ_API_KEY:             process.env["GROQ_API_KEY"]             ?? "",
  AI_REVIEW_SUGGESTIONS:    process.env["AI_REVIEW_SUGGESTIONS_ENABLED"] === "true",
};
