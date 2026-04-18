import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Map a Prisma Paper (with author) to the Article shape the frontend expects */
function mapPaperToArticle(paper: {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  keywords: string[];
  createdAt: Date;
  approvedAt: Date | null;
  author: {
    id: string;
    name: string;
    email: string;
  };
}) {
  const nameParts = paper.author.name.trim().split(/\s+/);
  const fallbackLastName = nameParts.slice(1).join(" ").trim() || nameParts[0] || "";
  return {
    id: paper.id,
    doi: `10.prism/${paper.id}`,
    title: paper.title,
    abstract: [{ text: paper.abstract }],
    authors: [
      {
        id: paper.author.id,
        name: paper.author.name,
        firstName: nameParts[0] ?? "",
        lastName: fallbackLastName,
        isCorresponding: true,
        affiliations: [],
        creditRoles: [],
      },
    ],
    keywords: paper.keywords,
    articleType: "research-article",
    accessLevel: "open_access",
    subjectArea: paper.domain,
    license: "CC BY",
    journalSlug: paper.domain.toLowerCase().replace(/\s+/g, "-"),
    journalTitle: paper.domain,
    publishedDate: (paper.approvedAt ?? paper.createdAt).toISOString().slice(0, 10),
    language: "en",
  };
}

// ── Articles ───────────────────────────────────────────────────────────────

export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
    const pageSize = Math.min(50, Math.max(1, parseInt(String(req.query.pageSize ?? "20"))));
    const query = String(req.query.query ?? "").trim();
    const trending = req.query.trending === "true";
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { status: "APPROVED" };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { abstract: { contains: query, mode: "insensitive" } },
        { domain: { contains: query, mode: "insensitive" } },
        { keywords: { has: query } },
        { author: { name: { contains: query, mode: "insensitive" } } },
      ];
    }

    const orderBy = trending
      ? { approvedAt: "desc" as const }
      : { approvedAt: "desc" as const };

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.paper.count({ where }),
    ]);

    res.json({
      success: true,
      message: "Articles fetched",
      data: papers.map(mapPaperToArticle),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getArticle = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Accept both bare id and doi format (10.prism/<id>)
    const paperId = id.startsWith("10.prism/") ? id.slice("10.prism/".length) : id;

    const paper = await prisma.paper.findFirst({
      where: { id: paperId, status: "APPROVED" },
      include: {
        author: { select: { id: true, name: true, email: true } },
        reviews: {
          select: { score: true, recommendation: true },
        },
      },
    });

    if (!paper) {
      res.status(404).json({ success: false, message: "Article not found" });
      return;
    }

    res.json({
      success: true,
      message: "Article fetched",
      data: mapPaperToArticle(paper),
    });
  } catch (err) {
    next(err);
  }
};

// ── Homepage ───────────────────────────────────────────────────────────────

export const getHomepage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalApproved, totalUsers, recentPapers] = await Promise.all([
      prisma.paper.count({ where: { status: "APPROVED" } }),
      prisma.user.count(),
      prisma.paper.findMany({
        where: { status: "APPROVED" },
        orderBy: { approvedAt: "desc" },
        take: 3,
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const trendingResearch = recentPapers.map((p, i) => {
      const colors = ["#1e3a8a", "#6d28d9", "#0f766e"];
      return {
        id: p.id,
        title: p.title,
        journal: p.domain,
        journalSlug: p.domain.toLowerCase().replace(/\s+/g, "-"),
        category: p.domain,
        date: (p.approvedAt ?? p.createdAt).toISOString().slice(0, 10),
        link: `/article/${p.id}`,
        accentColor: colors[i % colors.length],
      };
    });

    res.json({
      success: true,
      message: "Homepage data fetched",
      data: {
        stats: [
          { value: totalApproved.toLocaleString(), label: "Articles indexed" },
          { value: "100+", label: "Active journals" },
          { value: "38%", label: "Open access" },
          { value: totalUsers.toLocaleString(), label: "Researchers" },
        ],
        trendingResearch,
        callForPapers: [],
        quickLinks: [
          {
            title: "Discover Open Access",
            description: "Freely available research from around the world",
            href: "/search?filter=open-access",
          },
          {
            title: "Publish with Us",
            description: "Submit your research to our trusted journals",
            href: "/publish",
          },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Site Config ────────────────────────────────────────────────────────────

export const getSiteConfig = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const totalApproved = await prisma.paper.count({ where: { status: "APPROVED" } });
    const totalUsers = await prisma.user.count();

    res.json({
      success: true,
      message: "Site config fetched",
      data: {
        siteName: "Prism",
        tagline: "The Platform for Rigorous Science",
        metrics: [
          {
            label: "Articles Published",
            value: totalApproved.toLocaleString(),
            sub: "Peer-reviewed & approved",
            color: "#1e3a8a",
          },
          {
            label: "Registered Researchers",
            value: totalUsers.toLocaleString(),
            sub: "Active accounts",
            color: "#6d28d9",
          },
          {
            label: "Average Time to Decision",
            value: "28 days",
            sub: "For reviewed manuscripts",
            color: "#0f766e",
          },
          {
            label: "Open Access Rate",
            value: "100%",
            sub: "All approved articles",
            color: "#0ea5e9",
          },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Journals ───────────────────────────────────────────────────────────────
// No journal table in the DB yet — return a curated static list.

const STATIC_JOURNALS = [
  {
    id: "j1",
    slug: "nature-medicine",
    title: "Nature Medicine",
    name: "Nature Medicine",
    subjectArea: "Biomedical Sciences",
    issn: "1078-8956",
    impactFactor: 82.9,
    h5Index: 213,
    acceptanceRate: 7,
    turnaround: "30d",
    metrics: { impactFactor: 82.9, hIndex: 213 },
  },
  {
    id: "j2",
    slug: "cell",
    title: "Cell",
    name: "Cell",
    subjectArea: "Cell Biology",
    issn: "0092-8674",
    impactFactor: 64.5,
    h5Index: 298,
    acceptanceRate: 5,
    turnaround: "45d",
    metrics: { impactFactor: 64.5, hIndex: 298 },
  },
  {
    id: "j3",
    slug: "lancet",
    title: "The Lancet",
    name: "The Lancet",
    subjectArea: "Clinical Medicine",
    issn: "0140-6736",
    impactFactor: 168.9,
    h5Index: 349,
    acceptanceRate: 4,
    turnaround: "21d",
    metrics: { impactFactor: 168.9, hIndex: 349 },
  },
  {
    id: "j4",
    slug: "science",
    title: "Science",
    name: "Science",
    subjectArea: "Multidisciplinary",
    issn: "0036-8075",
    impactFactor: 56.9,
    h5Index: 432,
    acceptanceRate: 6,
    turnaround: "35d",
    metrics: { impactFactor: 56.9, hIndex: 432 },
  },
  {
    id: "j5",
    slug: "plos-medicine",
    title: "PLOS Medicine",
    name: "PLOS Medicine",
    subjectArea: "Public Health",
    issn: "1549-1676",
    impactFactor: 15.8,
    h5Index: 126,
    acceptanceRate: 12,
    turnaround: "40d",
    metrics: { impactFactor: 15.8, hIndex: 126 },
  },
  {
    id: "j6",
    slug: "jmlr",
    title: "Journal of Machine Learning Research",
    name: "JMLR",
    subjectArea: "Machine Learning",
    issn: "1532-4435",
    impactFactor: 6.2,
    h5Index: 98,
    acceptanceRate: 18,
    turnaround: "60d",
    metrics: { impactFactor: 6.2, hIndex: 98 },
  },
];

export const getJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
    const pageSize = Math.min(50, Math.max(1, parseInt(String(req.query.pageSize ?? "20"))));
    const start = (page - 1) * pageSize;
    const data = STATIC_JOURNALS.slice(start, start + pageSize);

    res.json({
      success: true,
      message: "Journals fetched",
      data,
      pagination: {
        page,
        pageSize,
        total: STATIC_JOURNALS.length,
        totalPages: Math.ceil(STATIC_JOURNALS.length / pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
};
