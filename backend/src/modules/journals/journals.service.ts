import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { Prisma } from "../../../generated/prisma/index.js";

const journalSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  discipline: true,
  issn: true,
  eIssn: true,
  impactFactor: true,
  coverImageUrl: true,
  isOpenAccess: true,
  publisherName: true,
  isActive: true,
  createdAt: true,
  _count: { select: { articles: true } },
} as const;

// ── getJournalById (admin) ────────────────────────────────────
export const getJournalById = async (id: string) => {
  const journal = await prisma.journal.findUnique({ where: { id } });
  if (!journal) throw new AppError("Journal not found", 404);
  return journal;
};

// ── listAllJournals (admin) ───────────────────────────────────
export const listAllJournals = async (page: number, pageSize: number, discipline?: string) => {
  const where: Prisma.JournalWhereInput = {};
  if (discipline) where.discipline = { contains: discipline, mode: "insensitive" };

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.journal.findMany({ where, select: journalSelect, orderBy: { title: "asc" }, skip, take: pageSize }),
    prisma.journal.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── createJournal ─────────────────────────────────────────────
export const createJournal = async (input: {
  slug: string; title: string;
  description?: string; discipline?: string; issn?: string; eIssn?: string;
  impactFactor?: number; coverImageUrl?: string; isOpenAccess?: boolean;
  publisherName?: string; isActive?: boolean;
}) => {
  const exists = await prisma.journal.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (exists) throw new AppError("A journal with this slug already exists", 409);

  return prisma.journal.create({
    data: {
      slug:          input.slug,
      title:         input.title,
      description:   input.description,
      discipline:    input.discipline ?? "",
      issn:          input.issn,
      eIssn:         input.eIssn,
      impactFactor:  input.impactFactor,
      coverImageUrl: input.coverImageUrl,
      isOpenAccess:  input.isOpenAccess ?? false,
      publisherName: input.publisherName,
      isActive:      input.isActive ?? true,
    },
    select: journalSelect,
  });
};

// ── updateJournal ─────────────────────────────────────────────
export const updateJournal = async (id: string, input: {
  slug?: string; title?: string; description?: string; discipline?: string;
  issn?: string; eIssn?: string; impactFactor?: number | null;
  coverImageUrl?: string; isOpenAccess?: boolean; publisherName?: string; isActive?: boolean;
}) => {
  const existing = await prisma.journal.findUnique({ where: { id }, select: { id: true, slug: true } });
  if (!existing) throw new AppError("Journal not found", 404);

  if (input.slug && input.slug !== existing.slug) {
    const conflict = await prisma.journal.findUnique({ where: { slug: input.slug }, select: { id: true } });
    if (conflict) throw new AppError("Slug already in use", 409);
  }

  return prisma.journal.update({
    where: { id },
    data: {
      ...(input.slug          !== undefined && { slug:          input.slug }),
      ...(input.title         !== undefined && { title:         input.title }),
      ...(input.description   !== undefined && { description:   input.description }),
      ...(input.discipline    !== undefined && { discipline:    input.discipline }),
      ...(input.issn          !== undefined && { issn:          input.issn }),
      ...(input.eIssn         !== undefined && { eIssn:         input.eIssn }),
      ...(input.impactFactor  !== undefined && { impactFactor:  input.impactFactor }),
      ...(input.coverImageUrl !== undefined && { coverImageUrl: input.coverImageUrl }),
      ...(input.isOpenAccess  !== undefined && { isOpenAccess:  input.isOpenAccess }),
      ...(input.publisherName !== undefined && { publisherName: input.publisherName }),
      ...(input.isActive      !== undefined && { isActive:      input.isActive }),
    },
    select: journalSelect,
  });
};

// ── deleteJournal ─────────────────────────────────────────────
export const deleteJournal = async (id: string) => {
  const existing = await prisma.journal.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Journal not found", 404);
  await prisma.journal.delete({ where: { id } });
};

// ── getJournalBySlug ─────────────────────────────────────────
export const getJournalBySlug = async (slug: string) => {
  const journal = await prisma.journal.findUnique({
    where: { slug, isActive: true },
    select: {
      ...journalSelect,
      issues: {
        orderBy: [{ year: "desc" }, { volume: "desc" }, { issue: "desc" }],
        select: { id: true, volume: true, issue: true, year: true, publishedAt: true },
      },
      editorialBoard: {
        orderBy: { order: "asc" },
        select: { id: true, name: true, title: true, institution: true, order: true },
      },
    },
  });
  if (!journal) throw new AppError("Journal not found", 404);

  // FE expects `editors` with `role` and `affiliation` keys
  return {
    ...journal,
    editors: journal.editorialBoard.map(m => ({
      id:          m.id,
      name:        m.name,
      role:        m.title ?? "Editor",
      affiliation: m.institution ?? null,
      order:       m.order,
    })),
  };
};

// ── listJournals ─────────────────────────────────────────────
export const listJournals = async (
  page: number,
  pageSize: number,
  discipline?: string
) => {
  const where: Prisma.JournalWhereInput = { isActive: true };
  if (discipline) where.discipline = { contains: discipline, mode: "insensitive" };

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.journal.findMany({
      where,
      select: journalSelect,
      orderBy: { title: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.journal.count({ where }),
  ]);

  return {
    data,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};
