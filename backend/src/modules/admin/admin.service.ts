import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { Prisma, Role, AuditAction } from "../../../generated/prisma/index.js";

// ─── Audit Logging ──────────────────────────────────────────────────────────

interface AuditLogInput {
  action: AuditAction;
  actorId?: string;
  targetId?: string;
  targetType?: string;
  meta?: Record<string, unknown>;
  ip?: string;
}

export const createAuditLog = async (input: AuditLogInput): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        id:         Math.random().toString(36).slice(2),
        action:     input.action,
        targetId:   input.targetId,
        targetType: input.targetType,
        meta:       (input.meta ?? undefined) as Prisma.InputJsonValue | undefined,
        ip:         input.ip,
        ...(input.actorId ? { actor: { connect: { id: input.actorId } } } : {}),
      },
    });
  } catch {
    // Never let audit logging crash the main flow
    console.error("[AuditLog] Failed to write log:", input.action);
  }
};

// ─── User Management ────────────────────────────────────────────────────────

export interface ListUsersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: Role;
}

export const listUsers = async (query: ListUsersQuery) => {
  const page     = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
  const skip     = (page - 1) * pageSize;

  const where = {
    ...(query.search && {
      OR: [
        { name:  { contains: query.search, mode: "insensitive" as const } },
        { email: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
    ...(query.role && { role: query.role }),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        isBanned:  true,
        createdAt: true,
        _count: {
          select: { papers: true, reviews: true },
        },
      },
    }),
  ]);

  return { users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id:        true,
      name:      true,
      email:     true,
      role:      true,
      isBanned:  true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { papers: true, reviews: true, comments: true },
      },
    },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const changeUserRole = async (
  targetUserId: string,
  newRole: Role,
  actorId: string,
  ip?: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError("User not found", 404);

  const oldRole = user.role;
  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data:  { role: newRole },
    select: { id: true, name: true, email: true, role: true },
  });

  await createAuditLog({
    action:     AuditAction.ROLE_CHANGED,
    actorId,
    targetId:   targetUserId,
    targetType: "user",
    meta:       { oldRole, newRole },
    ip,
  });

  return updated;
};

export const banUser = async (targetUserId: string, actorId: string, ip?: string) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError("User not found", 404);
  if (user.id === actorId) throw new AppError("Cannot ban yourself", 400);

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data:  { isBanned: true },
    select: { id: true, name: true, email: true, isBanned: true },
  });

  await createAuditLog({
    action: AuditAction.USER_BANNED,
    actorId,
    targetId: targetUserId,
    targetType: "user",
    ip,
  });

  return updated;
};

export const unbanUser = async (targetUserId: string, actorId: string, ip?: string) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) throw new AppError("User not found", 404);

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data:  { isBanned: false },
    select: { id: true, name: true, email: true, isBanned: true },
  });

  await createAuditLog({
    action: AuditAction.USER_UNBANNED,
    actorId,
    targetId: targetUserId,
    targetType: "user",
    ip,
  });

  return updated;
};

// ─── Audit Logs ─────────────────────────────────────────────────────────────

export interface ListAuditLogsQuery {
  page?: number;
  pageSize?: number;
  actorId?: string;
  action?: AuditAction;
  targetId?: string;
}

export const listAuditLogs = async (query: ListAuditLogsQuery) => {
  const page     = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 30));
  const skip     = (page - 1) * pageSize;

  const where = {
    ...(query.actorId  && { actorId:  query.actorId }),
    ...(query.action   && { action:   query.action }),
    ...(query.targetId && { targetId: query.targetId }),
  };

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
  ]);

  return { logs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
};

// ─── Platform Stats ──────────────────────────────────────────────────────────

export const getPlatformStats = async () => {
  const [totalUsers, totalPapers, totalReviews, pendingReviews, papersByStatus] =
    await Promise.all([
      prisma.user.count(),
      prisma.paper.count(),
      prisma.review.count(),
      prisma.reviewerAssignment.count({ where: { status: "PENDING" } }),
      prisma.paper.groupBy({ by: ["status"], _count: { id: true } }),
    ]);

  const byStatus = Object.fromEntries(
    papersByStatus.map((r) => [r.status, r._count.id]),
  );

  return { totalUsers, totalPapers, totalReviews, pendingReviews, papersByStatus: byStatus };
};
