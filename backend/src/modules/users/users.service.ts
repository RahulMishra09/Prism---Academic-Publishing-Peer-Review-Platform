import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import type { UpdateProfileInput, CreateAlertInput, ChangePasswordInput, UpdateAlertInput } from "./users.schema.js";

const userProfileSelect = {
  id: true, name: true, email: true, role: true, isBanned: true,
  firstName: true, lastName: true, orcid: true, affiliation: true,
  avatarUrl: true, bio: true, createdAt: true, updatedAt: true,
} as const;

// ── getProfile ───────────────────────────────────────────────
export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: userProfileSelect });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// ── updateProfile ────────────────────────────────────────────
export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  return prisma.user.update({ where: { id: userId }, data: input, select: userProfileSelect });
};

// ── changePassword ──────────────────────────────────────────
export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, password: true } });
  if (!user) throw new AppError("User not found", 404);

  const valid = await comparePassword(input.currentPassword, user.password);
  if (!valid) throw new AppError("Current password is incorrect", 400);

  const hashed = await hashPassword(input.newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return { success: true };
};

// ── uploadAvatar ────────────────────────────────────────────
export const updateAvatar = async (userId: string, avatarUrl: string) => {
  return prisma.user.update({ where: { id: userId }, data: { avatarUrl }, select: userProfileSelect });
};

// ── getDashboard ─────────────────────────────────────────────
export const getDashboard = async (userId: string) => {
  const [user, submissionsCount, ordersCount, alertsCount, bookmarksCount,
         savedArticlesCount, reviewsPending, reviewsCompleted,
         recentSubmissions, recentOrders] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true, firstName: true, lastName: true, avatarUrl: true } }),
    prisma.submission.count({ where: { submittedBy: userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.alert.count({ where: { userId } }),
    prisma.userBookmark.count({ where: { userId } }),
    prisma.userSavedArticle.count({ where: { userId } }),
    prisma.submissionReviewer.count({ where: { reviewerId: userId, status: { in: ["INVITED", "ACCEPTED"] } } }),
    prisma.submissionReviewer.count({ where: { reviewerId: userId, status: "COMPLETED" } }),
    prisma.submission.findMany({
      where: { submittedBy: userId },
      take: 5, orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, status: true, journalSlug: true, submittedAt: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId },
      take: 5, orderBy: { createdAt: "desc" },
      select: { id: true, amount: true, currency: true, status: true, itemType: true, itemRef: true, createdAt: true },
    }),
  ]);

  if (!user) throw new AppError("User not found", 404);

  return {
    user,
    stats: {
      submissions: submissionsCount,
      orders: ordersCount,
      alerts: alertsCount,
      bookmarks: bookmarksCount,
      savedArticles: savedArticlesCount,
    },
    reviews: {
      pending: reviewsPending,
      completed: reviewsCompleted,
    },
    recentSubmissions,
    recentOrders,
  };
};

// ── getUserSubmissions ───────────────────────────────────────
export const getUserSubmissions = async (userId: string, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.submission.findMany({
      where: { submittedBy: userId }, skip, take: pageSize, orderBy: { updatedAt: "desc" },
      select: {
        id: true, title: true, status: true, keywords: true,
        journalSlug: true, submittedAt: true, createdAt: true, updatedAt: true,
        coAuthors: { select: { firstName: true, lastName: true, email: true, order: true } },
        files: { select: { id: true, fileName: true, fileType: true, uploadedAt: true } },
      },
    }),
    prisma.submission.count({ where: { submittedBy: userId } }),
  ]);
  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── getUserOrders ────────────────────────────────────────────
export const getUserOrders = async (userId: string, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.order.findMany({ where: { userId }, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
    prisma.order.count({ where: { userId } }),
  ]);
  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── getAlerts / createAlert / deleteAlert ────────────────────
export const getAlerts = async (userId: string) =>
  prisma.alert.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

export const createAlert = async (userId: string, input: CreateAlertInput) =>
  prisma.alert.create({ data: { ...input, userId } });

export const deleteAlert = async (userId: string, alertId: string) => {
  const alert = await prisma.alert.findUnique({ where: { id: alertId } });
  if (!alert || alert.userId !== userId) throw new AppError("Alert not found", 404);
  await prisma.alert.delete({ where: { id: alertId } });
};

export const updateAlert = async (userId: string, alertId: string, input: UpdateAlertInput) => {
  const alert = await prisma.alert.findUnique({ where: { id: alertId } });
  if (!alert || alert.userId !== userId) throw new AppError("Alert not found", 404);
  return prisma.alert.update({ where: { id: alertId }, data: input });
};

// ── Bookmarks ────────────────────────────────────────────────
export const getBookmarks = async (userId: string, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.userBookmark.findMany({
      where: { userId }, skip, take: pageSize, orderBy: { createdAt: "desc" },
      select: {
        id: true, createdAt: true,
        article: {
          select: {
            id: true, doi: true, title: true, abstract: true, discipline: true,
            articleType: true, accessType: true, publishedAt: true,
            viewCount: true, citationCount: true,
            journal: { select: { slug: true, title: true } },
            authors: { orderBy: { order: "asc" }, take: 3, select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.userBookmark.count({ where: { userId } }),
  ]);
  return { data: data.map(b => ({ ...b.article, bookmarkId: b.id, bookmarkedAt: b.createdAt })), totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

export const addBookmark = async (userId: string, articleId: string) => {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);

  const existing = await prisma.userBookmark.findUnique({ where: { userId_articleId: { userId, articleId } } });
  if (existing) throw new AppError("Article already bookmarked", 409);

  return prisma.userBookmark.create({ data: { userId, articleId } });
};

export const removeBookmark = async (userId: string, articleId: string) => {
  const bookmark = await prisma.userBookmark.findUnique({ where: { userId_articleId: { userId, articleId } } });
  if (!bookmark) throw new AppError("Bookmark not found", 404);
  await prisma.userBookmark.delete({ where: { userId_articleId: { userId, articleId } } });
};

// ── Subscriptions ────────────────────────────────────────────
export const getSubscription = async (userId: string) =>
  prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

export const createSubscription = async (userId: string, plan: "MONTHLY" | "YEARLY" | "INSTITUTIONAL") => {
  const existing = await prisma.subscription.findFirst({ where: { userId, status: "ACTIVE" } });
  if (existing) throw new AppError("You already have an active subscription", 409);

  const months = plan === "YEARLY" ? 12 : plan === "INSTITUTIONAL" ? 12 : 1;
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);

  return prisma.subscription.create({
    data: { userId, plan, status: "ACTIVE", endDate },
  });
};

export const cancelSubscription = async (userId: string) => {
  const sub = await prisma.subscription.findFirst({ where: { userId, status: "ACTIVE" } });
  if (!sub) throw new AppError("No active subscription found", 404);
  return prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
};

export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", endDate: { gte: new Date() } },
  });
  return !!sub;
};

// ── Reviewer pool ────────────────────────────────────────────
export const listReviewers = async (params: {
  q?: string;
  discipline?: string;
  page: number;
  pageSize: number;
}) => {
  const { q, discipline, page, pageSize } = params;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = { role: "REVIEWER", isBanned: false };
  if (q) {
    where["OR"] = [
      { name:        { contains: q, mode: "insensitive" } },
      { firstName:   { contains: q, mode: "insensitive" } },
      { lastName:    { contains: q, mode: "insensitive" } },
      { affiliation: { contains: q, mode: "insensitive" } },
    ];
  }
  if (discipline) where["bio"] = { contains: discipline, mode: "insensitive" };

  const [data, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
      select: {
        id: true, name: true, firstName: true, lastName: true,
        email: true, orcid: true, affiliation: true, avatarUrl: true, bio: true,
        _count: { select: { reviewAssignments: true, submissionReviews: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

// ── Saved articles ───────────────────────────────────────────
export const getSavedArticles = async (userId: string, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.userSavedArticle.findMany({
      where: { userId }, skip, take: pageSize, orderBy: { createdAt: "desc" },
      select: {
        id: true, createdAt: true,
        article: {
          select: {
            id: true, doi: true, title: true, abstract: true, discipline: true,
            articleType: true, accessType: true, publishedAt: true,
            viewCount: true, citationCount: true,
            journal: { select: { slug: true, title: true } },
            authors: { orderBy: { order: "asc" }, take: 3, select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.userSavedArticle.count({ where: { userId } }),
  ]);
  return {
    data: data.map(s => ({ ...s.article, savedId: s.id, savedAt: s.createdAt })),
    totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize),
  };
};

export const saveArticle = async (userId: string, articleId: string) => {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);

  const existing = await prisma.userSavedArticle.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (existing) throw new AppError("Article already saved", 409);

  return prisma.userSavedArticle.create({ data: { userId, articleId } });
};

export const unsaveArticle = async (userId: string, articleId: string) => {
  const saved = await prisma.userSavedArticle.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (!saved) throw new AppError("Saved article not found", 404);
  await prisma.userSavedArticle.delete({ where: { userId_articleId: { userId, articleId } } });
};

// ── View history ─────────────────────────────────────────────
export const recordView = async (userId: string, articleId: string) => {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) throw new AppError("Article not found", 404);

  return prisma.viewHistory.create({ data: { userId, articleId } });
};

export const getViewHistory = async (userId: string, page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.viewHistory.findMany({
      where: { userId }, skip, take: pageSize, orderBy: { viewedAt: "desc" },
      select: {
        id: true, viewedAt: true,
        article: {
          select: {
            id: true, doi: true, title: true, discipline: true,
            articleType: true, accessType: true, publishedAt: true,
            journal: { select: { slug: true, title: true } },
            authors: { orderBy: { order: "asc" }, take: 3, select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
    prisma.viewHistory.count({ where: { userId } }),
  ]);
  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};
