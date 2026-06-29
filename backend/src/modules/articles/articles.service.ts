import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import type { ArticleListQuery } from "./articles.schema.js";
import { Prisma } from "../../../generated/prisma/index.js";
import { dispatchAlertDigest } from "../../utils/alertDigest.js";
import { cached, cache, TTL } from "../../utils/cache.js";
import { hasActiveSubscription } from "../users/users.service.js";

const articleSelect = {
  id: true,
  doi: true,
  title: true,
  abstract: true,
  keywords: true,
  discipline: true,
  articleType: true,
  accessType: true,
  language: true,
  pdfUrl: true,
  htmlUrl: true,
  publishedAt: true,
  viewCount: true,
  downloadCount: true,
  citationCount: true,
  isTrending: true,
  journal: {
    select: { id: true, slug: true, title: true, discipline: true, issn: true },
  },
  issue: {
    select: { id: true, volume: true, issue: true, year: true, publishedAt: true },
  },
  authors: {
    orderBy: { order: Prisma.SortOrder.asc },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      orcid: true,
      isCorresponding: true,
      order: true,
      affiliation: {
        select: { id: true, name: true, department: true, country: true },
      },
    },
  },
  metrics: true,
} as const;

// ── getArticleByDoi ──────────────────────────────────────────
// Increments view count on every access (fire-and-forget).
export const getArticleByDoi = async (doi: string) => {
  const decoded = decodeURIComponent(doi);

  const article = await prisma.article.findUnique({
    where: { doi: decoded, isPublished: true },
    select: {
      ...articleSelect,
      references: {
        orderBy: { order: Prisma.SortOrder.asc },
        select: { id: true, text: true, doi: true, order: true },
      },
    },
  });

  if (!article) throw new AppError("Article not found", 404);

  // Increment view count + ArticleMetrics in background
  void incrementViews(article.id);

  return article;
};

// ── trackDownload ────────────────────────────────────────────
// Checks access rights before returning the PDF URL.
export const trackDownload = async (doi: string, userId?: string) => {
  const decoded = decodeURIComponent(doi);
  const article = await prisma.article.findUnique({
    where:  { doi: decoded, isPublished: true },
    select: { id: true, pdfUrl: true, accessType: true },
  });
  if (!article) throw new AppError("Article not found", 404);
  if (!article.pdfUrl) throw new AppError("No PDF available for this article", 404);

  // Access control for non-open articles
  if (article.accessType !== "OPEN_ACCESS" && article.accessType !== "FREE") {
    if (!userId) throw new AppError("Authentication required to download this article", 401);

    // Check completed order for this DOI
    const order = await prisma.order.findFirst({
      where: { userId, itemRef: decoded, itemType: "ARTICLE", status: "COMPLETED" },
    });

    // Check active subscription
    const hasSub = order ? false : await hasActiveSubscription(userId);

    if (!order && !hasSub) {
      throw new AppError("Purchase or subscription required to download this article", 403);
    }
  }

  void incrementDownloads(article.id);
  return { pdfUrl: article.pdfUrl };
};

// ── getMetrics ───────────────────────────────────────────────
// Returns live metrics for a single article (cached 30 s).
export const getArticleMetrics = async (doi: string) => {
  const decoded = decodeURIComponent(doi);
  return cached(`metrics:${decoded}`, TTL.METRICS, async () => {
    const article = await prisma.article.findUnique({
      where: { doi: decoded, isPublished: true },
      select: {
        id: true, doi: true, viewCount: true,
        downloadCount: true, citationCount: true, isTrending: true,
        metrics: { select: { viewCount: true, downloadCount: true, citationCount: true, shareCount: true } },
      },
    });
    if (!article) throw new AppError("Article not found", 404);
    return article;
  });
};

// ── listTopArticles ──────────────────────────────────────────
// Returns top N articles ranked by views | citations | downloads, with optional time period.
export const listTopArticles = async (
  rankBy: "views" | "citations" | "downloads" = "views",
  limit = 10,
  discipline?: string,
  period?: "week" | "month" | "year" | "all"
) => {
  const cacheKey = `top:${rankBy}:${limit}:${discipline ?? "all"}:${period ?? "all"}`;
  return cached(cacheKey, TTL.TOP_ARTICLES, async () => {
    const where: Prisma.ArticleWhereInput = { isPublished: true };
    if (discipline) where.discipline = { contains: discipline, mode: "insensitive" };

    if (period && period !== "all") {
      const cutoff = new Date();
      if (period === "week")  cutoff.setDate(cutoff.getDate() - 7);
      if (period === "month") cutoff.setMonth(cutoff.getMonth() - 1);
      if (period === "year")  cutoff.setFullYear(cutoff.getFullYear() - 1);
      where.publishedAt = { gte: cutoff };
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput =
      rankBy === "citations"  ? { citationCount:  "desc" } :
      rankBy === "downloads"  ? { downloadCount:  "desc" } :
                                { viewCount:      "desc" };

    return prisma.article.findMany({
      where,
      orderBy,
      take: limit,
      select: {
        id: true, doi: true, title: true, discipline: true,
        articleType: true, accessType: true, publishedAt: true,
        viewCount: true, downloadCount: true, citationCount: true,
        isTrending: true,
        journal: { select: { slug: true, title: true } },
        authors: {
          orderBy: { order: "asc" },
          take:    3,
          select:  { firstName: true, lastName: true, isCorresponding: true },
        },
      },
    });
  });
};

// ── listArticles ─────────────────────────────────────────────
export const listArticles = async (q: ArticleListQuery) => {
  const where: Prisma.ArticleWhereInput = { isPublished: true };

  if (q.discipline)  where.discipline  = { contains: q.discipline, mode: "insensitive" };
  if (q.trending)    where.isTrending  = true;
  if (q.accessType)  where.accessType  = q.accessType;
  if (q.articleType) where.articleType = q.articleType;
  if (q.language)    where.language    = q.language;

  if (q.dateFrom || q.dateTo) {
    where.publishedAt = {};
    if (q.dateFrom) where.publishedAt.gte = new Date(q.dateFrom);
    if (q.dateTo)   where.publishedAt.lte = new Date(q.dateTo);
  }

  if (q.query) {
    where.OR = [
      { title:    { contains: q.query, mode: "insensitive" } },
      { abstract: { contains: q.query, mode: "insensitive" } },
      { keywords: { has: q.query } },
    ];
  }

  // Relevance ranking: fetch all candidates and score in-process
  if (q.sortBy === "relevance" && q.query) {
    const candidates = await prisma.article.findMany({ where, select: articleSelect });
    const terms = q.query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = candidates.map(a => ({ a, score: relevanceScore(a, terms) }));
    scored.sort((x, y) => y.score - x.score);
    const totalCount = scored.length;
    const skip = (q.page - 1) * q.pageSize;
    const data = scored.slice(skip, skip + q.pageSize).map(s => s.a);
    return { data, totalCount, page: q.page, pageSize: q.pageSize, totalPages: Math.ceil(totalCount / q.pageSize) };
  }

  const orderBy = buildOrderBy(q.sortBy);
  const skip    = (q.page - 1) * q.pageSize;

  const [data, totalCount] = await Promise.all([
    prisma.article.findMany({ where, select: articleSelect, orderBy, skip, take: q.pageSize }),
    prisma.article.count({ where }),
  ]);

  return {
    data,
    totalCount,
    page: q.page,
    pageSize: q.pageSize,
    totalPages: Math.ceil(totalCount / q.pageSize),
  };
};

// ── listArticlesByJournal ────────────────────────────────────
export const listArticlesByJournal = async (
  slug: string,
  page: number,
  pageSize: number
) => {
  const journal = await prisma.journal.findUnique({ where: { slug } });
  if (!journal) throw new AppError("Journal not found", 404);

  const where: Prisma.ArticleWhereInput = { journalId: journal.id, isPublished: true };
  const skip = (page - 1) * pageSize;

  const [data, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      select: articleSelect,
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

// ── listArticlesByIssue ──────────────────────────────────────
export const listArticlesByIssue = async (
  slug: string,
  issueId: string,
  page: number,
  pageSize: number
) => {
  const journal = await prisma.journal.findUnique({ where: { slug } });
  if (!journal) throw new AppError("Journal not found", 404);

  const issue = await prisma.journalIssue.findFirst({
    where: { id: issueId, journalId: journal.id },
  });
  if (!issue) throw new AppError("Issue not found", 404);

  const where: Prisma.ArticleWhereInput = {
    journalId: journal.id,
    issueId: issue.id,
    isPublished: true,
  };
  const skip = (page - 1) * pageSize;

  const [data, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      select: articleSelect,
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    issue: { id: issue.id, volume: issue.volume, issue: issue.issue, year: issue.year },
  };
};

// ── getArticleByIdAdmin ──────────────────────────────────────
export const getArticleByIdAdmin = async (id: string) => {
  const article = await prisma.article.findUnique({ where: { id }, select: articleSelect });
  if (!article) throw new AppError("Article not found", 404);
  return article;
};

// ── listAllArticles (admin) ──────────────────────────────────
export const listAllArticles = async (
  page: number, pageSize: number,
  discipline?: string, isPublished?: boolean
) => {
  const where: Prisma.ArticleWhereInput = {};
  if (discipline !== undefined) where.discipline = { contains: discipline, mode: "insensitive" };
  if (isPublished !== undefined) where.isPublished = isPublished;

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.article.findMany({ where, select: articleSelect, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    prisma.article.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── createArticle ────────────────────────────────────────────
export const createArticle = async (input: {
  doi: string; title: string; abstract: string; discipline: string;
  keywords?: string[]; articleType?: string; accessType?: string;
  language?: string; pdfUrl?: string; htmlUrl?: string;
  journalId?: string; issueId?: string; isPublished?: boolean; publishedAt?: string;
}) => {
  const exists = await prisma.article.findUnique({ where: { doi: input.doi }, select: { id: true } });
  if (exists) throw new AppError("An article with this DOI already exists", 409);

  return prisma.article.create({
    data: {
      doi:         input.doi,
      title:       input.title,
      abstract:    input.abstract,
      discipline:  input.discipline,
      keywords:    input.keywords ?? [],
      articleType: (input.articleType?.toUpperCase() ?? "RESEARCH_ARTICLE") as any,
      accessType:  (input.accessType?.toUpperCase()  ?? "OPEN_ACCESS")      as any,
      language:    input.language ?? "en",
      pdfUrl:      input.pdfUrl,
      htmlUrl:     input.htmlUrl,
      journalId:   input.journalId,
      issueId:     input.issueId,
      isPublished: input.isPublished ?? false,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
    },
    select: articleSelect,
  });
};

// ── updateArticle ────────────────────────────────────────────
export const updateArticle = async (id: string, input: {
  doi?: string; title?: string; abstract?: string; discipline?: string;
  keywords?: string[]; articleType?: string; accessType?: string;
  language?: string; pdfUrl?: string | null; htmlUrl?: string | null;
  journalId?: string | null; issueId?: string | null;
  isPublished?: boolean; isTrending?: boolean; publishedAt?: string | null;
}) => {
  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true, doi: true } });
  if (!existing) throw new AppError("Article not found", 404);

  if (input.doi && input.doi !== existing.doi) {
    const conflict = await prisma.article.findUnique({ where: { doi: input.doi }, select: { id: true } });
    if (conflict) throw new AppError("DOI already in use", 409);
  }

  return prisma.article.update({
    where: { id },
    data: {
      ...(input.doi         !== undefined && { doi:         input.doi }),
      ...(input.title       !== undefined && { title:       input.title }),
      ...(input.abstract    !== undefined && { abstract:    input.abstract }),
      ...(input.discipline  !== undefined && { discipline:  input.discipline }),
      ...(input.keywords    !== undefined && { keywords:    input.keywords }),
      ...(input.articleType !== undefined && { articleType: input.articleType.toUpperCase() as any }),
      ...(input.accessType  !== undefined && { accessType:  input.accessType.toUpperCase()  as any }),
      ...(input.language    !== undefined && { language:    input.language }),
      ...(input.pdfUrl      !== undefined && { pdfUrl:      input.pdfUrl }),
      ...(input.htmlUrl     !== undefined && { htmlUrl:     input.htmlUrl }),
      ...(input.journalId   !== undefined && { journalId:   input.journalId }),
      ...(input.issueId     !== undefined && { issueId:     input.issueId }),
      ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
      ...(input.isTrending  !== undefined && { isTrending:  input.isTrending }),
      ...(input.publishedAt !== undefined && {
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      }),
    },
    select: articleSelect,
  });
};

// ── Article Figures ──────────────────────────────────────────
export const listFigures = async (articleId: string) => {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);
  return prisma.articleFigure.findMany({ where: { articleId }, orderBy: { order: "asc" } });
};

export const addFigure = async (articleId: string, input: {
  url: string; caption?: string; type?: string; order?: number;
}) => {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);
  return prisma.articleFigure.create({
    data: { articleId, url: input.url, caption: input.caption, type: (input.type?.toUpperCase() ?? "IMAGE") as any, order: input.order ?? 0 },
  });
};

export const removeFigure = async (articleId: string, figureId: string) => {
  const fig = await prisma.articleFigure.findFirst({ where: { id: figureId, articleId } });
  if (!fig) throw new AppError("Figure not found", 404);
  await prisma.articleFigure.delete({ where: { id: figureId } });
};

// ── Article Supplementary Files ───────────────────────────────
export const listSupplementary = async (articleId: string) => {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);
  return prisma.articleSupplementary.findMany({ where: { articleId }, orderBy: { createdAt: "asc" } });
};

export const addSupplementary = async (articleId: string, input: {
  fileName: string; fileUrl: string; description?: string; fileSize?: number; mimeType?: string;
}) => {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);
  return prisma.articleSupplementary.create({ data: { articleId, ...input } });
};

export const removeSupplementary = async (articleId: string, fileId: string) => {
  const file = await prisma.articleSupplementary.findFirst({ where: { id: fileId, articleId } });
  if (!file) throw new AppError("Supplementary file not found", 404);
  await prisma.articleSupplementary.delete({ where: { id: fileId } });
};

// ── deleteArticle ────────────────────────────────────────────
export const deleteArticle = async (id: string) => {
  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Article not found", 404);
  await prisma.article.delete({ where: { id } });
  cache.invalidate("top:");
  cache.del("homepage:main");
};

// ── publishArticle ───────────────────────────────────────────
export const publishArticle = async (articleId: string) => {
  const existing = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, isPublished: true },
  });
  if (!existing) throw new AppError("Article not found", 404);
  if (existing.isPublished) throw new AppError("Article is already published", 409);

  const article = await prisma.article.update({
    where: { id: articleId },
    data:  { isPublished: true, publishedAt: new Date() },
    select: {
      id: true, doi: true, title: true, discipline: true,
      keywords: true, journalId: true,
      journal:    { select: { title: true, slug: true } },
      isPublished: true,
      publishedAt: true,
    },
  });

  // Invalidate top-articles cache so fresh results are returned
  cache.invalidate("top:");
  cache.del("homepage:main");

  void dispatchAlertDigest([article]);

  return article;
};

// ── helpers ──────────────────────────────────────────────────
type ArticleForScore = { title: string; abstract: string; keywords: string[]; discipline: string };

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function relevanceScore(article: ArticleForScore, terms: string[]): number {
  let score = 0;
  const title    = article.title.toLowerCase();
  const abstract = article.abstract.toLowerCase();
  const keywords = article.keywords.map(k => k.toLowerCase());
  const discip   = article.discipline.toLowerCase();

  for (const term of terms) {
    const escaped = escapeRegExp(term);

    // Title: 3 pts per occurrence (whole word match counts extra)
    const titleMatches = (title.match(new RegExp(escaped, "g")) ?? []).length;
    score += titleMatches * 3;

    // Keywords: 2 pts per matched keyword
    for (const kw of keywords) {
      if (kw.includes(term)) score += 2;
    }

    // Discipline: 2 pts
    if (discip.includes(term)) score += 2;

    // Abstract: 1 pt per occurrence (capped at 5 to prevent abstract stuffing)
    const absMatches = Math.min((abstract.match(new RegExp(escaped, "g")) ?? []).length, 5);
    score += absMatches;
  }

  return score;
}


function buildOrderBy(sortBy: string): Prisma.ArticleOrderByWithRelationInput {
  switch (sortBy) {
    case "date-asc":   return { publishedAt:   "asc" };
    case "citations":  return { citationCount: "desc" };
    case "views":      return { viewCount:     "desc" };
    case "downloads":  return { downloadCount: "desc" };
    default:           return { publishedAt:   "desc" };
  }
}

async function incrementViews(articleId: string): Promise<void> {
  try {
    await Promise.all([
      prisma.article.update({
        where: { id: articleId },
        data:  { viewCount: { increment: 1 } },
      }),
      prisma.articleMetrics.upsert({
        where:  { articleId },
        update: { viewCount: { increment: 1 } },
        create: { articleId, viewCount: 1 },
      }),
    ]);
    // Bust the metrics snapshot cache for this article
    cache.invalidate("metrics:");
  } catch {
    // Non-critical — never fail a read because the counter update failed
  }
}

async function incrementDownloads(articleId: string): Promise<void> {
  try {
    await Promise.all([
      prisma.article.update({
        where: { id: articleId },
        data:  { downloadCount: { increment: 1 } },
      }),
      prisma.articleMetrics.upsert({
        where:  { articleId },
        update: { downloadCount: { increment: 1 } },
        create: { articleId, downloadCount: 1 },
      }),
    ]);
    cache.invalidate("metrics:");
  } catch {
    // Non-critical
  }
}
