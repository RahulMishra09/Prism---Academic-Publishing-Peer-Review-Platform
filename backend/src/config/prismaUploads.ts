/**
 * Second Prisma/Postgres client for the uploads database.
 *
 * If UPLOADS_DATABASE_URL is set to a different Neon database, file metadata
 * is stored there. Falls back to DATABASE_URL in development.
 */
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/index.js";
import { env } from "./env.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPrismaClient = any;

function createUploadsClient(): AnyPrismaClient {
  const adapter = new PrismaNeon({ connectionString: env.UPLOADS_DATABASE_URL });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PrismaClient as any)({ adapter });
}

// Singleton — reuse across hot-reloads in dev
const globalForPrismaUploads = globalThis as unknown as { prismaUploads?: AnyPrismaClient };
export const prismaUploads: PrismaClient =
  globalForPrismaUploads.prismaUploads ?? createUploadsClient();

if (env.NODE_ENV !== "production") {
  globalForPrismaUploads.prismaUploads = prismaUploads;
}
