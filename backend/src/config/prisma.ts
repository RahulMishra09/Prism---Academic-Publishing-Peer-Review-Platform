import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";

// Singleton pattern — one Prisma instance across the app
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

async function createPrismaClient(): Promise<PrismaClient> {
  const log: ("error" | "warn")[] =
    env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

  // Use standard pg adapter for ALL connections (NeonDB, Supabase, local)
  // The Neon WebSocket adapter (PrismaNeon) only works in serverless/edge
  // environments and fails on many machines due to missing WebSocket support.
  // NeonDB pooler URLs work fine with standard pg over TCP.
  const isCloud = env.DATABASE_URL.includes("neon.tech") ||
                  env.DATABASE_URL.includes("supabase.co") ||
                  env.DATABASE_URL.includes("sslmode=require");
  
  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ...(isCloud ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = await createPrismaClient());
