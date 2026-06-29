import { Role, Prisma } from "../../../generated/prisma/index.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import type { ChangeRoleInput, ListUsersQuery } from "./admin.schema.js";

// Shared user select -- never return password
const userSelect = {
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
} as const;

// listUsers
// Returns a paginated list of all users.
// Supports optional filtering by role, banned status, and name/email search.
export const listUsers = async (query: ListUsersQuery) => {
  const { role, isBanned, search, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (role)                 where.role     = role as Role;
  if (isBanned !== undefined) where.isBanned = isBanned;
  if (search) {
    where.OR = [
      { name:  { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select:  userSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// getUserById
// Returns full detail for a single user including activity counts.
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: userSelect,
  });

  if (!user) throw new AppError("User not found", 404);

  return user;
};

// changeRole
// Changes the role of a user.
// Guards:
//   - User must exist
//   - Cannot change own role (prevents accidental self-lockout)
//   - Cannot demote the last ADMIN in the system
export const changeRole = async (
  targetUserId: string,
  requesterId:  string,
  input: ChangeRoleInput
) => {
  if (targetUserId === requesterId) {
    throw new AppError("You cannot change your own role", 422);
  }

  const user = await prisma.user.findUnique({
    where:  { id: targetUserId },
    select: { id: true, role: true, name: true },
  });

  if (!user) throw new AppError("User not found", 404);

  // Prevent removing the last ADMIN
  if (user.role === Role.ADMIN && input.role !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) {
      throw new AppError("Cannot demote the last ADMIN in the system", 422);
    }
  }

  return prisma.user.update({
    where:  { id: targetUserId },
    data:   { role: input.role as Role },
    select: userSelect,
  });
};

// banUser
// Bans a user, preventing them from logging in.
// Guards:
//   - User must exist
//   - Cannot ban yourself
//   - Cannot ban another ADMIN
//   - User must not already be banned
export const banUser = async (targetUserId: string, requesterId: string) => {
  if (targetUserId === requesterId) {
    throw new AppError("You cannot ban yourself", 422);
  }

  const user = await prisma.user.findUnique({
    where:  { id: targetUserId },
    select: { id: true, role: true, isBanned: true, name: true },
  });

  if (!user) throw new AppError("User not found", 404);

  if (user.role === Role.ADMIN) {
    throw new AppError("Cannot ban an ADMIN user", 422);
  }

  if (user.isBanned) {
    throw new AppError("User is already banned", 409);
  }

  return prisma.user.update({
    where:  { id: targetUserId },
    data:   { isBanned: true },
    select: userSelect,
  });
};

// unbanUser
// Lifts the ban on a user.
// Guards:
//   - User must exist
//   - User must currently be banned
export const unbanUser = async (targetUserId: string) => {
  const user = await prisma.user.findUnique({
    where:  { id: targetUserId },
    select: { id: true, isBanned: true },
  });

  if (!user) throw new AppError("User not found", 404);

  if (!user.isBanned) {
    throw new AppError("User is not banned", 409);
  }

  return prisma.user.update({
    where:  { id: targetUserId },
    data:   { isBanned: false },
    select: userSelect,
  });
};

// getSubmissionAnalytics
// Returns editorial pipeline stats for editors/admins.
export const getSubmissionAnalytics = async () => {
  const [byStatus, total, last30, last7, avgReviewersPerSubmission] = await Promise.all([
    prisma.submission.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.submission.count(),
    prisma.submission.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.submission.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.submissionReviewer.groupBy({ by: ["submissionId"], _count: { _all: true } })
      .then(rows => rows.length ? rows.reduce((s, r) => s + r._count._all, 0) / rows.length : 0),
  ]);

  const acceptedCount = byStatus.find(r => r.status === "ACCEPTED")?._count._all ?? 0;
  const rejectedCount = byStatus.find(r => r.status === "REJECTED")?._count._all ?? 0;
  const decided = acceptedCount + rejectedCount;

  return {
    total,
    last30Days: last30,
    last7Days: last7,
    byStatus: byStatus.reduce((acc: Record<string, number>, r) => ({ ...acc, [r.status]: r._count._all }), {}),
    acceptanceRate: decided > 0 ? Math.round((acceptedCount / decided) * 100) : null,
    avgReviewersPerSubmission: Math.round(avgReviewersPerSubmission * 10) / 10,
  };
};

// getStats
// Returns platform-wide statistics for the admin dashboard.
export const getStats = async () => {
  const [
    totalUsers,
    totalPapers,
    totalReviews,
    totalComments,
    usersByRole,
    papersByStatus,
    bannedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.paper.count(),
    prisma.review.count(),
    prisma.comment.count(),
    prisma.user.groupBy({ by: ["role"],    _count: { _all: true } }),
    prisma.paper.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.user.count({ where: { isBanned: true } }),
  ]);

  return {
    totals: {
      users:    totalUsers,
      papers:   totalPapers,
      reviews:  totalReviews,
      comments: totalComments,
      banned:   bannedUsers,
    },
    usersByRole:    usersByRole.reduce((acc, r) => ({ ...acc, [r.role]: r._count._all }), {}),
    papersByStatus: papersByStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count._all }), {}),
  };
};
