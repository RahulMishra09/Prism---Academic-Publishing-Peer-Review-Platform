import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { Prisma } from "../../../generated/prisma/index.js";
import { cache } from "../../utils/cache.js";

const NEWS_CACHE_PREFIX = "news:";

// ── listNews (public) ─────────────────────────────────────────
export const listNews = async (page: number, pageSize: number, category?: string) => {
  const where: Prisma.NewsWhereInput = { isPublished: true };
  if (category) where.category = { contains: category, mode: "insensitive" };

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.news.findMany({
      where,
      select: {
        id: true, slug: true, title: true, summary: true,
        imageUrl: true, category: true, publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.news.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── listAllNews (admin) ───────────────────────────────────────
export const listAllNews = async (page: number, pageSize: number, category?: string) => {
  const where: Prisma.NewsWhereInput = {};
  if (category) where.category = { contains: category, mode: "insensitive" };

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.news.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── getNewsBySlug (public) ────────────────────────────────────
export const getNewsBySlug = async (slug: string) => {
  const item = await prisma.news.findUnique({ where: { slug, isPublished: true } });
  if (!item) throw new AppError("News article not found", 404);
  return item;
};

// ── getNewsById (admin) ───────────────────────────────────────
export const getNewsById = async (id: string) => {
  const item = await prisma.news.findUnique({ where: { id } });
  if (!item) throw new AppError("News article not found", 404);
  return item;
};

// ── createNews ────────────────────────────────────────────────
export const createNews = async (input: {
  slug: string; title: string; summary: string; content: string;
  imageUrl?: string; category?: string; isPublished?: boolean; publishedAt?: string;
}) => {
  const exists = await prisma.news.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (exists) throw new AppError("A news item with this slug already exists", 409);

  const item = await prisma.news.create({
    data: {
      slug:        input.slug,
      title:       input.title,
      summary:     input.summary,
      content:     input.content,
      imageUrl:    input.imageUrl,
      category:    input.category,
      isPublished: input.isPublished ?? false,
      publishedAt: input.isPublished ? (input.publishedAt ? new Date(input.publishedAt) : new Date()) : null,
    },
  });

  cache.invalidate(NEWS_CACHE_PREFIX);
  return item;
};

// ── updateNews ────────────────────────────────────────────────
export const updateNews = async (id: string, input: {
  slug?: string; title?: string; summary?: string; content?: string;
  imageUrl?: string; category?: string; isPublished?: boolean; publishedAt?: string;
}) => {
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw new AppError("News article not found", 404);

  if (input.slug && input.slug !== existing.slug) {
    const conflict = await prisma.news.findUnique({ where: { slug: input.slug }, select: { id: true } });
    if (conflict) throw new AppError("Slug already in use", 409);
  }

  const wasPublished = existing.isPublished;
  const nowPublishing = input.isPublished === true && !wasPublished;

  const item = await prisma.news.update({
    where: { id },
    data: {
      ...(input.slug        !== undefined && { slug:        input.slug }),
      ...(input.title       !== undefined && { title:       input.title }),
      ...(input.summary     !== undefined && { summary:     input.summary }),
      ...(input.content     !== undefined && { content:     input.content }),
      ...(input.imageUrl    !== undefined && { imageUrl:    input.imageUrl }),
      ...(input.category    !== undefined && { category:    input.category }),
      ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
      publishedAt: nowPublishing
        ? (input.publishedAt ? new Date(input.publishedAt) : new Date())
        : existing.publishedAt,
    },
  });

  cache.invalidate(NEWS_CACHE_PREFIX);
  return item;
};

// ── deleteNews ────────────────────────────────────────────────
export const deleteNews = async (id: string) => {
  const existing = await prisma.news.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("News article not found", 404);
  await prisma.news.delete({ where: { id } });
  cache.invalidate(NEWS_CACHE_PREFIX);
};
