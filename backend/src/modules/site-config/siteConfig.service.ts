import { prisma } from "../../config/prisma.js";
import { cached, cache, TTL } from "../../utils/cache.js";

// ── getSiteConfig ────────────────────────────────────────────
export const getSiteConfig = async () =>
  cached("site-config:all", TTL.SITE_CONFIG, async () => {
    const rows = await prisma.siteConfig.findMany();

    // Build a key→value map; attempt to JSON-parse values that look like objects/arrays
    const config: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        config[row.key] = JSON.parse(row.value);
      } catch {
        config[row.key] = row.value;
      }
    }

    return config;
  });

// ── setSiteConfig ────────────────────────────────────────────
// Upserts a key and busts the cache so the next read is fresh.
export const setSiteConfig = async (key: string, value: string) => {
  const result = await prisma.siteConfig.upsert({
    where:  { key },
    create: { key, value },
    update: { value },
  });
  cache.del("site-config:all");
  return result;
};
