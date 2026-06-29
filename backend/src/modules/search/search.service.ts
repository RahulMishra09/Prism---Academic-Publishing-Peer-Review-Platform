import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../../generated/prisma/index.js";

export interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
  sortBy: string;
  contentType?: string[];
  discipline?: string[];
  journal?: string[];
  accessType?: string[];
  language?: string[];
  articleType?: string[];
  dateFrom?: string;
  dateTo?: string;
  titleSearch?: string;
  authorSearch?: string;
  abstractSearch?: string;
  issnSearch?: string;
  doiSearch?: string;
}

// ── search ───────────────────────────────────────────────────
export const search = async (params: SearchParams) => {
  const startTime = Date.now();
  const { query, page, pageSize, sortBy } = params;
  const skip = (page - 1) * pageSize;

  // Build article WHERE clause
  const articleWhere: Prisma.ArticleWhereInput = { isPublished: true };

  // Full-text search across title, abstract, keywords
  if (query) {
    articleWhere.OR = [
      { title:    { contains: query, mode: "insensitive" } },
      { abstract: { contains: query, mode: "insensitive" } },
      { keywords: { has: query } },
    ];
  }

  // Targeted field searches
  if (params.titleSearch) {
    articleWhere.title = { contains: params.titleSearch, mode: "insensitive" };
  }
  if (params.abstractSearch) {
    articleWhere.abstract = { contains: params.abstractSearch, mode: "insensitive" };
  }
  if (params.doiSearch) {
    articleWhere.doi = { contains: params.doiSearch, mode: "insensitive" };
  }
  if (params.authorSearch) {
    articleWhere.authors = {
      some: {
        OR: [
          { firstName: { contains: params.authorSearch, mode: "insensitive" } },
          { lastName:  { contains: params.authorSearch, mode: "insensitive" } },
          { email:     { contains: params.authorSearch, mode: "insensitive" } },
        ],
      },
    };
  }

  // Filters
  if (params.discipline?.length) {
    articleWhere.discipline = { in: params.discipline };
  }
  if (params.accessType?.length) {
    articleWhere.accessType = { in: params.accessType as Prisma.EnumAccessTypeFilter["in"] };
  }
  if (params.articleType?.length) {
    articleWhere.articleType = { in: params.articleType as Prisma.EnumArticleTypeFilter["in"] };
  }
  if (params.language?.length) {
    articleWhere.language = { in: params.language };
  }
  if (params.issnSearch) {
    articleWhere.journal = { issn: { contains: params.issnSearch } };
  } else if (params.journal?.length) {
    articleWhere.journal = { slug: { in: params.journal } };
  }
  if (params.dateFrom || params.dateTo) {
    articleWhere.publishedAt = {};
    if (params.dateFrom) articleWhere.publishedAt.gte = new Date(params.dateFrom);
    if (params.dateTo)   articleWhere.publishedAt.lte = new Date(params.dateTo);
  }

  const orderBy = buildSearchOrder(sortBy);

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: articleWhere,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true, doi: true, title: true, abstract: true,
        discipline: true, articleType: true, accessType: true,
        language: true, publishedAt: true, viewCount: true, citationCount: true,
        journal: { select: { slug: true, title: true, issn: true } },
        authors: {
          orderBy: { order: "asc" },
          take: 5,
          select: { firstName: true, lastName: true, isCorresponding: true },
        },
      },
    }),
    prisma.article.count({ where: articleWhere }),
  ]);

  // Compute facets from unfiltered counts
  const [disciplineFacets, accessTypeFacets, articleTypeFacets] = await Promise.all([
    prisma.article.groupBy({
      by: ["discipline"],
      where: { isPublished: true },
      _count: { discipline: true },
      orderBy: { _count: { discipline: "desc" } },
    }),
    prisma.article.groupBy({
      by: ["accessType"],
      where: { isPublished: true },
      _count: { accessType: true },
    }),
    prisma.article.groupBy({
      by: ["articleType"],
      where: { isPublished: true },
      _count: { articleType: true },
    }),
  ]);

  // Add inline highlights for query terms
  const highlighted = query
    ? articles.map(a => ({
        ...a,
        highlight: {
          title:    highlightText(a.title, query),
          abstract: highlightText(a.abstract.slice(0, 300), query),
        },
      }))
    : articles;

  return {
    results: highlighted,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    queryTime: Date.now() - startTime,
    facets: {
      disciplines: disciplineFacets.map((f) => ({
        value: f.discipline,
        count: f._count.discipline,
      })),
      accessTypes: accessTypeFacets.map((f) => ({
        value: f.accessType,
        count: f._count.accessType,
      })),
      articleTypes: articleTypeFacets.map((f) => ({
        value: f.articleType,
        count: f._count.articleType,
      })),
    },
  };
};

// ── suggestions ──────────────────────────────────────────────
export const getSuggestions = async (q: string, limit = 8) => {
  if (q.length < 3) return [];

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { doi:   { contains: q, mode: "insensitive" } },
      ],
    },
    take: limit,
    select: { doi: true, title: true, articleType: true },
    orderBy: { viewCount: "desc" },
  });

  return articles.map((a) => ({
    title:       a.title,
    doi:         a.doi,
    type:        "article",
    articleType: a.articleType,
  }));
};

// ── getRelatedArticles ───────────────────────────────────────
export const getRelatedArticles = async (doi: string, limit = 6) => {
  const article = await prisma.article.findUnique({
    where: { doi: decodeURIComponent(doi), isPublished: true },
    select: { id: true, keywords: true, discipline: true, journalId: true },
  });
  if (!article) return [];

  const candidates = await prisma.article.findMany({
    where: {
      isPublished: true,
      id: { not: article.id },
      OR: [
        { discipline: article.discipline },
        { journalId: article.journalId ?? undefined },
        { keywords: article.keywords.length > 0 ? { hasSome: article.keywords } : undefined },
      ],
    },
    take: limit * 3,
    select: {
      id: true, doi: true, title: true, discipline: true, articleType: true,
      accessType: true, publishedAt: true, viewCount: true, citationCount: true,
      keywords: true, journalId: true,
      journal: { select: { slug: true, title: true } },
      authors: { orderBy: { order: "asc" }, take: 3, select: { firstName: true, lastName: true } },
    },
  });

  // Score by keyword overlap + same journal + same discipline
  const scored = candidates.map(c => {
    let score = 0;
    if (c.discipline === article.discipline) score += 3;
    if (c.journalId && c.journalId === article.journalId) score += 2;
    const overlap = c.keywords.filter(k => article.keywords.includes(k)).length;
    score += overlap * 2;
    return { ...c, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);

  return scored.slice(0, limit).map(({ _score: _, ...rest }) => rest);
};

// ── highlightText ─────────────────────────────────────────────
function highlightText(text: string, query: string): string {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  let result = text;
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
  }
  return result;
}

function buildSearchOrder(sortBy: string): Prisma.ArticleOrderByWithRelationInput {
  switch (sortBy) {
    case "date-asc":  return { publishedAt: "asc" };
    case "citations": return { citationCount: "desc" };
    case "views":     return { viewCount: "desc" };
    default:          return { publishedAt: "desc" };
  }
}
