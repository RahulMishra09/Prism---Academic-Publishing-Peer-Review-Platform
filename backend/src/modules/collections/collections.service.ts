import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { Prisma } from "../../../generated/prisma/index.js";

const collectionSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  coverImageUrl: true,
  discipline: true,
  isActive: true,
  createdAt: true,
  _count: { select: { articles: true } },
} as const;

// ── getCollectionById (admin) ────────────────────────────────
export const getCollectionById = async (id: string) => {
  const collection = await prisma.collection.findUnique({ where: { id }, select: collectionSelect });
  if (!collection) throw new AppError("Collection not found", 404);
  return collection;
};

// ── listAllCollections (admin) ───────────────────────────────
export const listAllCollections = async () => {
  return prisma.collection.findMany({ select: collectionSelect, orderBy: { title: "asc" } });
};

// ── createCollection ─────────────────────────────────────────
export const createCollection = async (input: {
  slug: string; title: string;
  description?: string; coverImageUrl?: string; discipline?: string; isActive?: boolean;
}) => {
  const exists = await prisma.collection.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (exists) throw new AppError("A collection with this slug already exists", 409);

  return prisma.collection.create({
    data: {
      slug:          input.slug,
      title:         input.title,
      description:   input.description,
      coverImageUrl: input.coverImageUrl,
      discipline:    input.discipline,
      isActive:      input.isActive ?? true,
    },
    select: collectionSelect,
  });
};

// ── updateCollection ─────────────────────────────────────────
export const updateCollection = async (id: string, input: {
  slug?: string; title?: string; description?: string;
  coverImageUrl?: string; discipline?: string; isActive?: boolean;
}) => {
  const existing = await prisma.collection.findUnique({ where: { id }, select: { id: true, slug: true } });
  if (!existing) throw new AppError("Collection not found", 404);

  if (input.slug && input.slug !== existing.slug) {
    const conflict = await prisma.collection.findUnique({ where: { slug: input.slug }, select: { id: true } });
    if (conflict) throw new AppError("Slug already in use", 409);
  }

  return prisma.collection.update({
    where: { id },
    data: {
      ...(input.slug          !== undefined && { slug:          input.slug }),
      ...(input.title         !== undefined && { title:         input.title }),
      ...(input.description   !== undefined && { description:   input.description }),
      ...(input.coverImageUrl !== undefined && { coverImageUrl: input.coverImageUrl }),
      ...(input.discipline    !== undefined && { discipline:    input.discipline }),
      ...(input.isActive      !== undefined && { isActive:      input.isActive }),
    },
    select: collectionSelect,
  });
};

// ── deleteCollection ─────────────────────────────────────────
export const deleteCollection = async (id: string) => {
  const existing = await prisma.collection.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Collection not found", 404);
  await prisma.collection.delete({ where: { id } });
};

// ── addArticleToCollection ────────────────────────────────────
export const addArticleToCollection = async (id: string, articleId: string, order?: number) => {
  const collection = await prisma.collection.findUnique({ where: { id }, select: { id: true } });
  if (!collection) throw new AppError("Collection not found", 404);

  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);

  const existing = await prisma.collectionArticle.findFirst({
    where: { collectionId: id, articleId },
    select: { id: true },
  });
  if (existing) throw new AppError("Article already in this collection", 409);

  return prisma.collectionArticle.create({
    data: { collectionId: id, articleId, order: order ?? 0 },
  });
};

// ── removeArticleFromCollection ───────────────────────────────
export const removeArticleFromCollection = async (id: string, articleId: string) => {
  const entry = await prisma.collectionArticle.findFirst({
    where: { collectionId: id, articleId },
    select: { id: true },
  });
  if (!entry) throw new AppError("Article not in this collection", 404);
  await prisma.collectionArticle.delete({ where: { id: entry.id } });
};

// ── listCollections ──────────────────────────────────────────
export const listCollections = async () => {
  const data = await prisma.collection.findMany({
    where: { isActive: true },
    select: collectionSelect,
    orderBy: { title: "asc" },
  });
  return data;
};

// ── getCollectionBySlug ──────────────────────────────────────
export const getCollectionBySlug = async (slug: string) => {
  const collection = await prisma.collection.findUnique({
    where: { slug, isActive: true },
    select: collectionSelect,
  });
  if (!collection) throw new AppError("Collection not found", 404);
  return collection;
};

// ── getCollectionArticles ────────────────────────────────────
export const getCollectionArticles = async (
  slug: string,
  page: number,
  pageSize: number
) => {
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) throw new AppError("Collection not found", 404);

  const where: Prisma.CollectionArticleWhereInput = { collectionId: collection.id };
  const skip = (page - 1) * pageSize;

  const [items, totalCount] = await Promise.all([
    prisma.collectionArticle.findMany({
      where,
      orderBy: { order: "asc" },
      skip,
      take: pageSize,
      select: {
        order: true,
        addedAt: true,
        article: {
          select: {
            id: true,
            doi: true,
            title: true,
            abstract: true,
            discipline: true,
            articleType: true,
            accessType: true,
            publishedAt: true,
            viewCount: true,
            citationCount: true,
            journal: { select: { id: true, slug: true, title: true } },
            authors: {
              orderBy: { order: "asc" },
              select: { firstName: true, lastName: true, isCorresponding: true },
            },
          },
        },
      },
    }),
    prisma.collectionArticle.count({ where }),
  ]);

  return {
    data: items.map((i) => ({ ...i.article, order: i.order, addedAt: i.addedAt })),
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};
