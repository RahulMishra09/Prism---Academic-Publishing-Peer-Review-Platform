import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";

const bookSelect = {
  id: true, isbn: true, title: true, description: true,
  publisher: true, publishedAt: true, coverImageUrl: true,
  discipline: true, doi: true, edition: true, language: true,
  isOpenAccess: true, isActive: true, createdAt: true, updatedAt: true,
  _count: { select: { chapters: true } },
  authors: { orderBy: { order: "asc" as const }, select: { id: true, firstName: true, lastName: true, email: true, orcid: true, order: true, isCorresponding: true } },
} as const;

const chapterSelect = {
  id: true, doi: true, title: true, abstract: true, order: true,
  pdfUrl: true, pageStart: true, pageEnd: true, createdAt: true, updatedAt: true,
  authors: { orderBy: { order: "asc" as const }, select: { id: true, firstName: true, lastName: true, email: true, order: true } },
} as const;

// ── Public reads ──────────────────────────────────────────────
export const getBookByIsbn = async (isbn: string) => {
  const book = await prisma.book.findUnique({ where: { isbn: decodeURIComponent(isbn), isActive: true }, select: bookSelect });
  if (!book) throw new AppError("Book not found", 404);
  return book;
};

export const listBooks = async (page: number, pageSize: number, discipline?: string) => {
  const where = { isActive: true, ...(discipline && { discipline: { contains: discipline, mode: "insensitive" as const } }) };
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.book.findMany({ where, select: bookSelect, orderBy: { title: "asc" }, skip, take: pageSize }),
    prisma.book.count({ where }),
  ]);
  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

export const getChaptersByIsbn = async (isbn: string) => {
  const book = await prisma.book.findUnique({ where: { isbn: decodeURIComponent(isbn) } });
  if (!book) throw new AppError("Book not found", 404);
  return prisma.bookChapter.findMany({ where: { bookId: book.id }, orderBy: { order: "asc" }, select: chapterSelect });
};

export const getChapterByDoi = async (doi: string) => {
  const chapter = await prisma.bookChapter.findUnique({
    where: { doi: decodeURIComponent(doi) },
    select: { ...chapterSelect, book: { select: { id: true, isbn: true, title: true, publisher: true, publishedAt: true, coverImageUrl: true } } },
  });
  if (!chapter) throw new AppError("Chapter not found", 404);
  return chapter;
};

// ── Admin CRUD: Books ─────────────────────────────────────────
export const listAllBooks = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.book.findMany({ select: bookSelect, orderBy: { title: "asc" }, skip, take: pageSize }),
    prisma.book.count(),
  ]);
  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

export const createBook = async (input: {
  isbn: string; title: string; description?: string; publisher?: string;
  publishedAt?: string; coverImageUrl?: string; discipline?: string;
  doi?: string; edition?: string; language?: string; isOpenAccess?: boolean;
}) => {
  const exists = await prisma.book.findUnique({ where: { isbn: input.isbn }, select: { id: true } });
  if (exists) throw new AppError("A book with this ISBN already exists", 409);
  return prisma.book.create({
    data: { ...input, publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined },
    select: bookSelect,
  });
};

export const updateBook = async (id: string, input: {
  isbn?: string; title?: string; description?: string; publisher?: string;
  publishedAt?: string | null; coverImageUrl?: string; discipline?: string;
  doi?: string; edition?: string; language?: string; isOpenAccess?: boolean; isActive?: boolean;
}) => {
  const existing = await prisma.book.findUnique({ where: { id }, select: { id: true, isbn: true } });
  if (!existing) throw new AppError("Book not found", 404);
  if (input.isbn && input.isbn !== existing.isbn) {
    const conflict = await prisma.book.findUnique({ where: { isbn: input.isbn }, select: { id: true } });
    if (conflict) throw new AppError("ISBN already in use", 409);
  }
  return prisma.book.update({
    where: { id },
    data: { ...input, publishedAt: input.publishedAt ? new Date(input.publishedAt) : input.publishedAt },
    select: bookSelect,
  });
};

export const deleteBook = async (id: string) => {
  const existing = await prisma.book.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Book not found", 404);
  await prisma.book.delete({ where: { id } });
};

// ── Admin CRUD: Chapters ──────────────────────────────────────
export const createChapter = async (bookId: string, input: {
  doi: string; title: string; abstract?: string; order: number;
  pdfUrl?: string; pageStart?: number; pageEnd?: number;
}) => {
  const book = await prisma.book.findUnique({ where: { id: bookId }, select: { id: true } });
  if (!book) throw new AppError("Book not found", 404);
  const exists = await prisma.bookChapter.findUnique({ where: { doi: input.doi }, select: { id: true } });
  if (exists) throw new AppError("A chapter with this DOI already exists", 409);
  return prisma.bookChapter.create({ data: { ...input, bookId }, select: chapterSelect });
};

export const updateChapter = async (id: string, input: {
  doi?: string; title?: string; abstract?: string; order?: number;
  pdfUrl?: string | null; pageStart?: number | null; pageEnd?: number | null;
}) => {
  const existing = await prisma.bookChapter.findUnique({ where: { id }, select: { id: true, doi: true } });
  if (!existing) throw new AppError("Chapter not found", 404);
  if (input.doi && input.doi !== existing.doi) {
    const conflict = await prisma.bookChapter.findUnique({ where: { doi: input.doi }, select: { id: true } });
    if (conflict) throw new AppError("DOI already in use", 409);
  }
  return prisma.bookChapter.update({ where: { id }, data: input, select: chapterSelect });
};

export const deleteChapter = async (id: string) => {
  const existing = await prisma.bookChapter.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Chapter not found", 404);
  await prisma.bookChapter.delete({ where: { id } });
};
