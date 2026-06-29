import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { cached, TTL } from "../../utils/cache.js";

function urlEntry(loc: string, lastmod?: Date, changefreq = "weekly", priority = "0.7"): string {
  return `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod.toISOString().split("T")[0]}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const sitemap = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const xml = await cached("sitemap:main", TTL.HOMEPAGE, async () => {
      const [articles, journals, collections, news, conferences] = await Promise.all([
        prisma.article.findMany({ where: { isPublished: true }, select: { doi: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 5000 }),
        prisma.journal.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
        prisma.collection.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
        prisma.news.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true }, orderBy: { publishedAt: "desc" }, take: 500 }),
        prisma.conference.findMany({ select: { slug: true, updatedAt: true } }),
      ]);

      const base = env.APP_URL;

      const staticUrls = [
        urlEntry(`${base}/`, undefined, "daily", "1.0"),
        urlEntry(`${base}/articles`, undefined, "daily", "0.9"),
        urlEntry(`${base}/journals`, undefined, "weekly", "0.8"),
        urlEntry(`${base}/search`, undefined, "weekly", "0.8"),
        urlEntry(`${base}/news`, undefined, "daily", "0.8"),
        urlEntry(`${base}/careers`, undefined, "daily", "0.7"),
        urlEntry(`${base}/conferences`, undefined, "weekly", "0.7"),
        urlEntry(`${base}/collections`, undefined, "weekly", "0.7"),
      ];

      const articleUrls = articles.map(a => urlEntry(`${base}/articles/${encodeURIComponent(a.doi)}`, a.updatedAt, "monthly", "0.6"));
      const journalUrls = journals.map(j => urlEntry(`${base}/journals/${j.slug}`, j.updatedAt, "weekly", "0.7"));
      const collectionUrls = collections.map(c => urlEntry(`${base}/collections/${c.slug}`, c.updatedAt, "weekly", "0.6"));
      const newsUrls = news.map(n => urlEntry(`${base}/news/${n.slug}`, n.updatedAt, "monthly", "0.5"));
      const confUrls = conferences.map(c => urlEntry(`${base}/conferences/${c.slug}`, c.updatedAt, "weekly", "0.6"));

      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...staticUrls, ...journalUrls, ...articleUrls, ...collectionUrls, ...newsUrls, ...confUrls].join("")}
</urlset>`;
    });

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml);
  } catch (err) { next(err); }
};

export const robotsTxt = (_req: Request, res: Response): void => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(`User-agent: *
Allow: /
Disallow: /api/admin/
Disallow: /api/auth/
Disallow: /api/users/me/

Sitemap: ${env.APP_URL}/sitemap.xml`);
};
