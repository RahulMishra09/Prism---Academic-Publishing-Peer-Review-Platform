import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";

export const getProfile = async (authorId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: authorId, isBanned: false },
    select: {
      id: true, name: true, email: true, firstName: true, lastName: true,
      orcid: true, affiliation: true, avatarUrl: true, bio: true,
      createdAt: true,
      // Submissions authored (public titles only)
      submissions: {
        where: { status: "ACCEPTED" },
        orderBy: { submittedAt: "desc" },
        take: 20,
        select: { id: true, title: true, journalSlug: true, submittedAt: true, status: true },
      },
    },
  });

  if (!user) throw new AppError("Author not found", 404);

  // Published articles where this user is listed as an author (matched by email or ORCID)
  const authorFilters = [
    ...(user.email ? [{ email: user.email }] : []),
    ...(user.orcid ? [{ orcid: user.orcid }] : []),
  ];

  const articles = authorFilters.length === 0 ? [] : await prisma.article.findMany({
    where: {
      isPublished: true,
      authors: { some: { OR: authorFilters } },
    },
    take: 20,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, doi: true, title: true, discipline: true, articleType: true,
      publishedAt: true, viewCount: true, citationCount: true,
      journal: { select: { slug: true, title: true } },
      authors: {
        orderBy: { order: "asc" },
        select: { firstName: true, lastName: true, isCorresponding: true, order: true },
      },
    },
  });

  const { email: _email, ...publicUser } = user;
  return {
    id: publicUser.id,
    name: publicUser.name,
    firstName: publicUser.firstName,
    lastName: publicUser.lastName,
    orcid: publicUser.orcid,
    affiliation: publicUser.affiliation,
    avatarUrl: publicUser.avatarUrl,
    bio: publicUser.bio,
    memberSince: publicUser.createdAt,
    acceptedSubmissions: user.submissions,
    articles,
  };
};
