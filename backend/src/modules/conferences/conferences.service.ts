import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { Prisma } from "../../../generated/prisma/index.js";

const conferenceSelect = {
  id: true, slug: true, title: true, description: true, location: true,
  isVirtual: true, startDate: true, endDate: true, status: true, discipline: true,
  submissionDeadline: true, website: true, coverImageUrl: true, createdAt: true,
} as const;

// ── listConferences (public) ──────────────────────────────────
export const listConferences = async (
  page: number, pageSize: number,
  status?: string, year?: number, discipline?: string
) => {
  const where: Prisma.ConferenceWhereInput = {};
  if (status)     where.status     = status.toUpperCase() as Prisma.EnumConferenceStatusFilter["equals"];
  if (discipline) where.discipline = { contains: discipline, mode: "insensitive" };
  if (year) {
    where.AND = [
      { startDate: { gte: new Date(`${year}-01-01`) } },
      { startDate: { lte: new Date(`${year}-12-31`) } },
    ];
  }

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.conference.findMany({ where, select: conferenceSelect, orderBy: { startDate: "asc" }, skip, take: pageSize }),
    prisma.conference.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── getConferenceBySlug (public) ──────────────────────────────
export const getConferenceBySlug = async (slug: string) => {
  const conf = await prisma.conference.findUnique({ where: { slug }, select: conferenceSelect });
  if (!conf) throw new AppError("Conference not found", 404);
  return conf;
};

// ── getConferenceById (admin) ─────────────────────────────────
export const getConferenceById = async (id: string) => {
  const conf = await prisma.conference.findUnique({ where: { id } });
  if (!conf) throw new AppError("Conference not found", 404);
  return conf;
};

// ── createConference ──────────────────────────────────────────
export const createConference = async (input: {
  slug: string; title: string; startDate: string; endDate: string;
  description?: string; location?: string; isVirtual?: boolean;
  status?: string; discipline?: string; submissionDeadline?: string;
  website?: string; coverImageUrl?: string;
}) => {
  const exists = await prisma.conference.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (exists) throw new AppError("A conference with this slug already exists", 409);

  return prisma.conference.create({
    data: {
      slug:               input.slug,
      title:              input.title,
      startDate:          new Date(input.startDate),
      endDate:            new Date(input.endDate),
      description:        input.description,
      location:           input.location,
      isVirtual:          input.isVirtual ?? false,
      status:             (input.status?.toUpperCase() ?? "UPCOMING") as "UPCOMING" | "ONGOING" | "PAST" | "CANCELLED",
      discipline:         input.discipline,
      submissionDeadline: input.submissionDeadline ? new Date(input.submissionDeadline) : null,
      website:            input.website,
      coverImageUrl:      input.coverImageUrl,
    },
    select: conferenceSelect,
  });
};

// ── updateConference ──────────────────────────────────────────
export const updateConference = async (id: string, input: {
  slug?: string; title?: string; startDate?: string; endDate?: string;
  description?: string; location?: string; isVirtual?: boolean;
  status?: string; discipline?: string; submissionDeadline?: string | null;
  website?: string; coverImageUrl?: string;
}) => {
  const existing = await prisma.conference.findUnique({ where: { id }, select: { id: true, slug: true } });
  if (!existing) throw new AppError("Conference not found", 404);

  if (input.slug && input.slug !== existing.slug) {
    const conflict = await prisma.conference.findUnique({ where: { slug: input.slug }, select: { id: true } });
    if (conflict) throw new AppError("Slug already in use", 409);
  }

  return prisma.conference.update({
    where: { id },
    data: {
      ...(input.slug               !== undefined && { slug:               input.slug }),
      ...(input.title              !== undefined && { title:              input.title }),
      ...(input.description        !== undefined && { description:        input.description }),
      ...(input.location           !== undefined && { location:           input.location }),
      ...(input.isVirtual          !== undefined && { isVirtual:          input.isVirtual }),
      ...(input.status             !== undefined && { status:             input.status.toUpperCase() as "UPCOMING" | "ONGOING" | "PAST" | "CANCELLED" }),
      ...(input.discipline         !== undefined && { discipline:         input.discipline }),
      ...(input.website            !== undefined && { website:            input.website }),
      ...(input.coverImageUrl      !== undefined && { coverImageUrl:      input.coverImageUrl }),
      ...(input.startDate          !== undefined && { startDate:          new Date(input.startDate) }),
      ...(input.endDate            !== undefined && { endDate:            new Date(input.endDate) }),
      ...(input.submissionDeadline !== undefined && {
        submissionDeadline: input.submissionDeadline ? new Date(input.submissionDeadline) : null,
      }),
    },
    select: conferenceSelect,
  });
};

// ── deleteConference ──────────────────────────────────────────
export const deleteConference = async (id: string) => {
  const existing = await prisma.conference.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Conference not found", 404);
  await prisma.conference.delete({ where: { id } });
};
