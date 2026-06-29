import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { Prisma } from "../../../generated/prisma/index.js";

// ── listCareers (public) ──────────────────────────────────────
export const listCareers = async (page: number, pageSize: number, type?: string) => {
  const where: Prisma.CareerWhereInput = { isActive: true };
  if (type) where.type = type.toUpperCase();

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.career.findMany({
      where,
      select: {
        id: true, title: true, department: true, location: true,
        type: true, requirements: true, isActive: true, closingDate: true, createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.career.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── listAllCareers (admin) ────────────────────────────────────
export const listAllCareers = async (page: number, pageSize: number, type?: string) => {
  const where: Prisma.CareerWhereInput = {};
  if (type) where.type = type.toUpperCase();

  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.career.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.career.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── getCareerById (public) ────────────────────────────────────
export const getCareerById = async (id: string) => {
  const career = await prisma.career.findUnique({ where: { id, isActive: true } });
  if (!career) throw new AppError("Job listing not found", 404);
  return career;
};

// ── getCareerByIdAdmin ────────────────────────────────────────
export const getCareerByIdAdmin = async (id: string) => {
  const career = await prisma.career.findUnique({ where: { id } });
  if (!career) throw new AppError("Job listing not found", 404);
  return career;
};

// ── createCareer ──────────────────────────────────────────────
export const createCareer = async (input: {
  title: string; type: string; description: string;
  department?: string; location?: string; requirements?: string;
  isActive?: boolean; closingDate?: string;
}) => {
  return prisma.career.create({
    data: {
      title:        input.title,
      type:         input.type.toUpperCase(),
      description:  input.description,
      department:   input.department,
      location:     input.location,
      requirements: input.requirements,
      isActive:     input.isActive ?? true,
      closingDate:  input.closingDate ? new Date(input.closingDate) : null,
    },
  });
};

// ── updateCareer ──────────────────────────────────────────────
export const updateCareer = async (id: string, input: {
  title?: string; type?: string; description?: string;
  department?: string; location?: string; requirements?: string;
  isActive?: boolean; closingDate?: string | null;
}) => {
  const existing = await prisma.career.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Job listing not found", 404);

  return prisma.career.update({
    where: { id },
    data: {
      ...(input.title        !== undefined && { title:        input.title }),
      ...(input.type         !== undefined && { type:         input.type.toUpperCase() }),
      ...(input.description  !== undefined && { description:  input.description }),
      ...(input.department   !== undefined && { department:   input.department }),
      ...(input.location     !== undefined && { location:     input.location }),
      ...(input.requirements !== undefined && { requirements: input.requirements }),
      ...(input.isActive     !== undefined && { isActive:     input.isActive }),
      ...(input.closingDate  !== undefined && {
        closingDate: input.closingDate ? new Date(input.closingDate) : null,
      }),
    },
  });
};

// ── deleteCareer ──────────────────────────────────────────────
export const deleteCareer = async (id: string) => {
  const existing = await prisma.career.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError("Job listing not found", 404);
  await prisma.career.delete({ where: { id } });
};
