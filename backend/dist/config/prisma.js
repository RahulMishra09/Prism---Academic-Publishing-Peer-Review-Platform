import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "./env.js";
// Singleton pattern — one Prisma instance across the app
const globalForPrisma = globalThis;
function createPrismaClient() {
    const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });
    return new PrismaClient({
        adapter,
        log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
}
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
//# sourceMappingURL=prisma.js.map