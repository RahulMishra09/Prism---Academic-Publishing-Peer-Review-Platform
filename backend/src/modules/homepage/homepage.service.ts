import { prisma } from "../../config/prisma.js";
import { cached, cache, TTL } from "../../utils/cache.js";

// ── getHomepage ──────────────────────────────────────────────
export const getHomepage = async () =>
  cached("homepage:main", TTL.HOMEPAGE, async () => {
    // Fetch stored homepage sections from DB
    const sections = await prisma.homepageContent.findMany();
    const sectionMap: Record<string, unknown> = {};
    for (const s of sections) {
      sectionMap[s.section] = s.content;
    }

    // Enrich with live data
    const [trendingArticles, featuredJournals, recentNews, stats] = await Promise.all([
      prisma.article.findMany({
        where:   { isPublished: true, isTrending: true },
        take:    8,
        orderBy: { viewCount: "desc" },
        select: {
          id: true, doi: true, title: true, abstract: true,
          discipline: true, articleType: true, accessType: true,
          publishedAt: true, viewCount: true, citationCount: true,
          journal: { select: { slug: true, title: true } },
          authors: {
            orderBy: { order: "asc" },
            take:    3,
            select:  { firstName: true, lastName: true },
          },
        },
      }),
      prisma.journal.findMany({
        where:   { isActive: true },
        take:    6,
        orderBy: { title: "asc" },
        select: {
          id: true, slug: true, title: true, discipline: true,
          coverImageUrl: true, impactFactor: true, isOpenAccess: true,
          _count: { select: { articles: true } },
        },
      }),
      prisma.news.findMany({
        where:   { isPublished: true },
        take:    4,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true, slug: true, title: true, summary: true,
          imageUrl: true, category: true, publishedAt: true,
        },
      }),
      Promise.all([
        prisma.article.count({ where: { isPublished: true } }),
        prisma.journal.count({ where: { isActive: true } }),
        prisma.user.count(),
      ]),
    ]);

    const trendingResearch = trendingArticles.map((a, i) => {
      const colors = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#06b6d4", "#84cc16"];
      return {
        id: a.id,
        category: a.discipline || a.journal?.title || "Research",
        title: a.title,
        date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "",
        summary: a.abstract || "",
        journal: a.journal?.title || "Unknown Journal",
        journalSlug: a.journal?.slug || "unknown",
        link: `/article/${encodeURIComponent(a.doi)}`,
        accentColor: colors[i % colors.length],
      };
    });

    return {
      ...sectionMap,
      trendingArticles,
      trendingResearch,
      featuredJournals,
      recentNews,
      stats: {
        totalArticles: stats[0],
        totalJournals: stats[1],
        totalUsers:    stats[2],
      },
      disciplineCounts: {
        "biological-sciences": "84.2k",
        "business-management": "37.2k",
        "chemistry": "58.9k",
        "computer-science": "71.4k",
        "earth-environmental-sciences": "43.8k",
        "health-sciences": "130k",
        "humanities-social-sciences": "37.2k",
        "materials-science": "41.3k",
        "mathematics": "29.4k",
        "physics-astronomy": "62.1k",
        "statistics": "18.7k",
        "technology-engineering": "95.3k"
      }
    };
  });

// ── setHomepageSection ────────────────────────────────────────
// Upserts a named section (e.g. "hero", "banner") and busts the cache.
export const setHomepageSection = async (section: string, content: unknown) => {
  const json = content as import("../../../generated/prisma/index.js").Prisma.InputJsonValue;
  const result = await prisma.homepageContent.upsert({
    where:  { section },
    create: { section, content: json },
    update: { content: json },
  });
  cache.del("homepage:main");
  return result;
};

// ── deleteHomepageSection ─────────────────────────────────────
export const deleteHomepageSection = async (section: string) => {
  const existing = await prisma.homepageContent.findUnique({ where: { section }, select: { id: true } });
  if (!existing) {
    const { AppError } = await import("../../middleware/error.middleware.js");
    throw new AppError("Section not found", 404);
  }
  await prisma.homepageContent.delete({ where: { section } });
  cache.del("homepage:main");
};
