import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildRss(title: string, description: string, link: string, items: {
  title: string; link: string; description: string;
  pubDate?: Date | null; author?: string; doi?: string;
}[]): string {
  const itemsXml = items.map(i => `
    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${escapeXml(i.link)}</link>
      <description>${escapeXml(i.description)}</description>
      ${i.pubDate ? `<pubDate>${i.pubDate.toUTCString()}</pubDate>` : ""}
      ${i.author ? `<author>${escapeXml(i.author)}</author>` : ""}
      ${i.doi ? `<guid isPermaLink="false">doi:${escapeXml(i.doi)}</guid>` : ""}
    </item>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(link)}" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;
}

// ── GET /api/feeds/journal/:slug.xml ─────────────────────────
export const journalFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawSlug = param(req.params["slug"]);
    const slug = rawSlug.endsWith(".xml") ? rawSlug.slice(0, -4) : rawSlug;

    const journal = await prisma.journal.findUnique({ where: { slug }, select: { id: true, title: true, description: true } });
    if (!journal) { res.status(404).json({ message: "Journal not found" }); return; }

    const articles = await prisma.article.findMany({
      where: { journalId: journal.id, isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
      select: {
        doi: true, title: true, abstract: true, publishedAt: true,
        authors: { orderBy: { order: "asc" }, take: 1, select: { firstName: true, lastName: true } },
      },
    });

    const feed = buildRss(
      journal.title,
      journal.description ?? `Latest articles from ${journal.title}`,
      `${env.APP_URL}/journals/${slug}`,
      articles.map(a => ({
        title:       a.title,
        link:        `${env.APP_URL}/articles/${encodeURIComponent(a.doi)}`,
        description: a.abstract.slice(0, 300),
        pubDate:     a.publishedAt,
        author:      a.authors[0] ? `${a.authors[0].firstName} ${a.authors[0].lastName}` : undefined,
        doi:         a.doi,
      }))
    );

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.status(200).send(feed);
  } catch (err) { next(err); }
};

// ── GET /api/feeds/discipline/:name.xml ───────────────────────
export const disciplineFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawName = param(req.params["name"]);
    const name = rawName.endsWith(".xml") ? rawName.slice(0, -4) : rawName;

    const articles = await prisma.article.findMany({
      where: { discipline: { contains: name, mode: "insensitive" }, isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
      select: {
        doi: true, title: true, abstract: true, publishedAt: true,
        authors: { orderBy: { order: "asc" }, take: 1, select: { firstName: true, lastName: true } },
      },
    });

    const feed = buildRss(
      `${name} — Latest Articles`,
      `Latest published articles in ${name}`,
      `${env.APP_URL}/search?discipline=${encodeURIComponent(name)}`,
      articles.map(a => ({
        title:       a.title,
        link:        `${env.APP_URL}/articles/${encodeURIComponent(a.doi)}`,
        description: a.abstract.slice(0, 300),
        pubDate:     a.publishedAt,
        author:      a.authors[0] ? `${a.authors[0].firstName} ${a.authors[0].lastName}` : undefined,
        doi:         a.doi,
      }))
    );

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.status(200).send(feed);
  } catch (err) { next(err); }
};

// ── GET /api/feeds/latest.xml ─────────────────────────────────
export const latestFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
      select: {
        doi: true, title: true, abstract: true, publishedAt: true, discipline: true,
        journal: { select: { title: true } },
        authors: { orderBy: { order: "asc" }, take: 1, select: { firstName: true, lastName: true } },
      },
    });

    const feed = buildRss(
      "Latest Articles",
      "Most recently published articles on the research portal",
      `${env.APP_URL}/articles`,
      articles.map(a => ({
        title:       a.title,
        link:        `${env.APP_URL}/articles/${encodeURIComponent(a.doi)}`,
        description: a.abstract.slice(0, 300),
        pubDate:     a.publishedAt,
        author:      a.authors[0] ? `${a.authors[0].firstName} ${a.authors[0].lastName}` : undefined,
        doi:         a.doi,
      }))
    );

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.status(200).send(feed);
  } catch (err) { next(err); }
};
