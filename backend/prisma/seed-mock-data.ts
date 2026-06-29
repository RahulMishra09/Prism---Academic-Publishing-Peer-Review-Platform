/**
 * prisma/seed-mock-data.ts
 * -------------------------
 * Seeds the Lumex database with ALL mock data from the frontend.
 * Reads JSON files from ../frontend/public/mock-data/ and inserts
 * them into the corresponding Prisma tables.
 *
 * Run with:  npx tsx prisma/seed-mock-data.ts
 *
 * Idempotent — cleans all data first, then re-inserts.
 */

import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();
const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const prisma = new PrismaClient({ adapter, log: ["warn", "error"] });

// ── Path helper ──────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const MOCK_DIR = resolve(__dirname, "../../frontend/public/mock-data");
const loadJson = <T>(file: string): T =>
  JSON.parse(readFileSync(resolve(MOCK_DIR, file), "utf-8"));

// ── Helpers ──────────────────────────────────────────────────
const hash = (p: string) => bcrypt.hash(p, 10);
const now = new Date();
const future = (days: number) => new Date(now.getTime() + days * 86_400_000);
const past = (days: number) => new Date(now.getTime() - days * 86_400_000);

/** Process items in batches to avoid overwhelming Neon connection pool. */
async function batchProcess<T>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<unknown>,
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(fn));
  }
}

// ── Type mappings ────────────────────────────────────────────
const articleTypeMap: Record<string, string> = {
  "research-article": "RESEARCH_ARTICLE",
  "review-article": "REVIEW",
  review: "REVIEW",
  editorial: "EDITORIAL",
  letter: "LETTER",
  "case-study": "CASE_STUDY",
  "book-review": "BOOK_REVIEW",
  correction: "CORRECTION",
};

const accessTypeMap: Record<string, string> = {
  open_access: "OPEN_ACCESS",
  subscribed: "SUBSCRIPTION",
  subscription: "SUBSCRIPTION",
  free: "FREE",
};

// ══════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════
async function main() {
  console.log("🌱  Seeding Lumex database with frontend mock data...\n");

  // ── 1. CLEAN ──────────────────────────────────────────────
  console.log("🗑   Cleaning existing data...");
  const tables = [
    prisma.contactMessage, prisma.order, prisma.alert, prisma.viewHistory,
    prisma.verificationToken, prisma.userSavedArticle, prisma.userBookmark,
    prisma.subscription, prisma.submissionReview, prisma.submissionReviewer,
    prisma.submissionFile, prisma.submissionAuthor, prisma.submission,
    prisma.articleFigure, prisma.articleSupplementary, prisma.refreshToken,
    prisma.passwordResetToken, prisma.collectionArticle, prisma.articleMetrics,
    prisma.articleReference, prisma.articleAuthor, prisma.article,
    prisma.bookChapterAuthor, prisma.bookChapter, prisma.bookAuthor, prisma.book,
    prisma.collection, prisma.journalEditorialBoard, prisma.journalIssue,
    prisma.journal, prisma.affiliation, prisma.news, prisma.career,
    prisma.conference, prisma.siteConfig, prisma.homepageContent,
    prisma.comment, prisma.review, prisma.reviewerAssignment, prisma.paper,
    prisma.user,
  ] as { deleteMany: () => Promise<unknown> }[];
  for (const table of tables) {
    await table.deleteMany();
  }
  console.log("   ✅  Clean complete\n");

  // ── 2. USERS ──────────────────────────────────────────────
  console.log("👤  Creating users...");
  const admin    = await prisma.user.create({ data: { name: "Admin User",     email: "admin@lumex.io",   password: await hash("Admin@123"),  role: "ADMIN",    isVerified: true } });
  const editor   = await prisma.user.create({ data: { name: "Editor Jane",    email: "editor@lumex.io",  password: await hash("Editor@123"), role: "EDITOR",   isVerified: true } });
  const reviewer1= await prisma.user.create({ data: { name: "Reviewer Alice", email: "rev1@lumex.io",    password: await hash("Review@123"), role: "REVIEWER", isVerified: true } });
  const reviewer2= await prisma.user.create({ data: { name: "Reviewer Bob",   email: "rev2@lumex.io",    password: await hash("Review@123"), role: "REVIEWER", isVerified: true } });
  const author1  = await prisma.user.create({ data: { name: "Author Carlos",  email: "author1@lumex.io", password: await hash("Author@123"), role: "AUTHOR",   isVerified: true } });
  const author2  = await prisma.user.create({ data: { name: "Author Diana",   email: "author2@lumex.io", password: await hash("Author@123"), role: "AUTHOR",   isVerified: true } });
  const reader   = await prisma.user.create({ data: { name: "Reader Eve",     email: "reader@lumex.io",  password: await hash("Reader@123"), role: "READER",   isVerified: true } });
  console.log("   ✅  7 users created\n");

  // ── 3. JOURNALS ───────────────────────────────────────────
  console.log("📰  Seeding journals...");
  type MockJournal = {
    slug: string; title: string; description?: string; discipline?: string[];
    electronicISSN?: string; printISSN?: string; publisher?: string;
    coverImageUrl?: string; openAccess?: boolean; accessType?: string;
    metrics?: { impactFactor?: number };
  };
  const mockJournals = loadJson<{ journals: MockJournal[] }>("journals.json").journals;

  // Track journal slugs + ISSNs to avoid unique constraint violations
  const journalSlugSet = new Set<string>();
  const seenIssn = new Set<string>();
  const seenEissn = new Set<string>();

  await batchProcess(mockJournals, 3, async (j) => {
    if (journalSlugSet.has(j.slug)) return; // skip duplicate slugs
    journalSlugSet.add(j.slug);

    // Deduplicate ISSNs — null out if already seen
    let issn = j.printISSN ?? null;
    let eIssn = j.electronicISSN ?? null;
    if (issn && seenIssn.has(issn)) issn = null; else if (issn) seenIssn.add(issn);
    if (eIssn && seenEissn.has(eIssn)) eIssn = null; else if (eIssn) seenEissn.add(eIssn);

    await prisma.journal.create({
      data: {
        slug:          j.slug,
        title:         j.title,
        description:   j.description ?? null,
        discipline:    Array.isArray(j.discipline) ? j.discipline[0] ?? "General" : (j.discipline ?? "General"),
        eIssn,
        issn,
        impactFactor:  j.metrics?.impactFactor ?? null,
        coverImageUrl: j.coverImageUrl ?? null,
        isOpenAccess:  j.openAccess ?? j.accessType === "gold_oa",
        publisherName: j.publisher ?? "Lumex Publishing",
      },
    });
  });

  // Create missing journals referenced by articles but not in journals.json
  const missingJournalSlugs = [
    { slug: "nature-astronomy",            title: "Nature Astronomy",                 discipline: "Astronomy" },
    { slug: "npj-biofilms-and-microbiomes", title: "npj Biofilms and Microbiomes",    discipline: "Biology" },
    { slug: "the-embo-journal",            title: "The EMBO Journal",                 discipline: "Molecular Biology" },
  ];
  for (const mj of missingJournalSlugs) {
    if (!journalSlugSet.has(mj.slug)) {
      journalSlugSet.add(mj.slug);
      await prisma.journal.create({
        data: { slug: mj.slug, title: mj.title, discipline: mj.discipline, publisherName: "Lumex Publishing" },
      });
    }
  }

  const journalCount = await prisma.journal.count();
  console.log(`   ✅  ${journalCount} journals created\n`);

  // Build slug → id lookup
  const allJournals = await prisma.journal.findMany({ select: { id: true, slug: true } });
  const journalMap = new Map(allJournals.map((j) => [j.slug, j.id]));

  // ── 4. ARTICLES ───────────────────────────────────────────
  console.log("📄  Seeding articles...");
  type MockAuthor = {
    firstName?: string; lastName?: string; name?: string;
    isCorresponding?: boolean; email?: string; orcid?: string;
    affiliations?: { name?: string; department?: string; city?: string; country?: string }[];
  };
  type MockFigure = { url?: string; caption?: string; type?: string };
  type MockReference = { rawText?: string; doi?: string; index?: number };
  type MockArticle = {
    doi: string; title: string;
    abstract?: { text: string }[];
    keywords?: string[];
    articleType?: string; accessLevel?: string;
    subjectArea?: string; journalSlug?: string;
    volume?: string; issue?: string;
    publishedDate?: string; language?: string;
    authors?: MockAuthor[];
    figures?: MockFigure[];
    references?: MockReference[];
    metrics?: { views?: number; downloads?: number; citations?: number };
  };
  const mockArticles = loadJson<{ articles: MockArticle[] }>("articles.json").articles;

  // Deduplicate affiliations
  const affiliationCache = new Map<string, string>(); // "name|dept|country" → id

  async function getOrCreateAffiliation(aff: { name?: string; department?: string; country?: string }): Promise<string | null> {
    if (!aff.name) return null;
    const key = `${aff.name}|${aff.department ?? ""}|${aff.country ?? ""}`;
    if (affiliationCache.has(key)) return affiliationCache.get(key)!;
    const record = await prisma.affiliation.create({
      data: { name: aff.name, department: aff.department ?? null, country: aff.country ?? null },
    });
    affiliationCache.set(key, record.id);
    return record.id;
  }

  // Track created DOIs to avoid duplicates
  const createdDois = new Set<string>();
  let articleCount = 0;

  await batchProcess(mockArticles, 3, async (a) => {
    if (createdDois.has(a.doi)) return;
    createdDois.add(a.doi);

    const journalId = a.journalSlug ? journalMap.get(a.journalSlug) ?? null : null;
    const abstractText = Array.isArray(a.abstract)
      ? a.abstract.map((s) => s.text).join("\n\n")
      : (a.abstract as unknown as string) ?? "";

    const articleRecord = await prisma.article.create({
      data: {
        doi:           a.doi,
        title:         a.title,
        abstract:      abstractText,
        keywords:      a.keywords ?? [],
        discipline:    a.subjectArea ?? "General",
        articleType:   (articleTypeMap[a.articleType ?? ""] ?? "RESEARCH_ARTICLE") as "RESEARCH_ARTICLE",
        accessType:    (accessTypeMap[a.accessLevel ?? ""] ?? "OPEN_ACCESS") as "OPEN_ACCESS",
        language:      a.language ?? "en",
        isPublished:   true,
        publishedAt:   a.publishedDate ? new Date(a.publishedDate) : past(Math.floor(Math.random() * 365)),
        viewCount:     a.metrics?.views ?? 0,
        downloadCount: a.metrics?.downloads ?? 0,
        citationCount: a.metrics?.citations ?? 0,
        journalId,
      },
    });

    // Authors
    if (a.authors?.length) {
      for (let i = 0; i < a.authors.length; i++) {
        const auth = a.authors[i];
        const firstName = auth.firstName ?? auth.name?.split(" ")[0] ?? "Unknown";
        const lastName = auth.lastName ?? auth.name?.split(" ").slice(1).join(" ") ?? "Author";
        let affiliationId: string | null = null;
        if (auth.affiliations?.[0]) {
          affiliationId = await getOrCreateAffiliation(auth.affiliations[0]);
        }
        await prisma.articleAuthor.create({
          data: {
            articleId:       articleRecord.id,
            firstName,
            lastName,
            email:           auth.email ?? null,
            orcid:           auth.orcid ?? null,
            isCorresponding: auth.isCorresponding ?? (i === 0),
            order:           i + 1,
            affiliationId,
          },
        });
      }
    }

    // Figures
    if (a.figures?.length) {
      for (let i = 0; i < a.figures.length; i++) {
        const fig = a.figures[i];
        await prisma.articleFigure.create({
          data: {
            articleId: articleRecord.id,
            url:       fig.url ?? `https://picsum.photos/seed/fig${i}/800/600`,
            caption:   fig.caption ?? null,
            type:      "IMAGE",
            order:     i + 1,
          },
        });
      }
    }

    // References
    if (a.references?.length) {
      for (let i = 0; i < a.references.length; i++) {
        const ref = a.references[i];
        await prisma.articleReference.create({
          data: {
            articleId: articleRecord.id,
            text:      ref.rawText ?? `Reference ${i + 1}`,
            doi:       ref.doi ?? null,
            order:     ref.index ?? i + 1,
          },
        });
      }
    }

    // Metrics
    if (a.metrics) {
      await prisma.articleMetrics.create({
        data: {
          articleId:     articleRecord.id,
          viewCount:     a.metrics.views ?? 0,
          downloadCount: a.metrics.downloads ?? 0,
          citationCount: a.metrics.citations ?? 0,
        },
      });
    }

    articleCount++;
    if (articleCount % 50 === 0) console.log(`   ... ${articleCount} articles`);
  });

  console.log(`   ✅  ${articleCount} articles created (with authors, figures, references, metrics)\n`);

  // ── 5. COLLECTIONS ────────────────────────────────────────
  console.log("📚  Seeding collections...");
  type MockCollection = { title: string; description?: string; slug: string; imageUrl?: string };
  const mockCollections = loadJson<{ collections: MockCollection[] }>("collections.json").collections;

  await batchProcess(mockCollections, 10, async (c) => {
    await prisma.collection.create({
      data: {
        slug:          c.slug,
        title:         c.title,
        description:   c.description ?? null,
        coverImageUrl: c.imageUrl ?? null,
      },
    });
  });
  console.log(`   ✅  ${mockCollections.length} collections created\n`);

  // ── 6. BOOKS + CHAPTERS ───────────────────────────────────
  console.log("📖  Seeding books...");
  type MockBook = {
    doi?: string; title: string; isbn: string;
    authors?: { firstName: string; lastName: string }[];
    publishYear?: number; publisher?: string;
    coverImageUrl?: string; type?: string;
    discipline?: string; description?: string;
  };
  const mockBooks = loadJson<MockBook[]>("books.json");

  const bookDoiToId = new Map<string, string>();

  for (const b of mockBooks) {
    const record = await prisma.book.create({
      data: {
        isbn:          b.isbn,
        doi:           b.doi ?? null,
        title:         b.title,
        description:   b.description ?? null,
        publisher:     b.publisher ?? "Lumex Press",
        publishedAt:   b.publishYear ? new Date(`${b.publishYear}-01-01`) : null,
        coverImageUrl: b.coverImageUrl ?? null,
        discipline:    b.discipline ?? null,
      },
    });
    if (b.doi) bookDoiToId.set(b.doi, record.id);

    // Book authors
    if (b.authors?.length) {
      for (let i = 0; i < b.authors.length; i++) {
        await prisma.bookAuthor.create({
          data: {
            bookId:    record.id,
            firstName: b.authors[i].firstName,
            lastName:  b.authors[i].lastName,
            order:     i + 1,
          },
        });
      }
    }
  }
  console.log(`   ✅  ${mockBooks.length} books created\n`);

  // Chapters
  console.log("📑  Seeding chapters...");
  type MockChapter = {
    doi: string; title: string; bookDoi?: string;
    authors?: { firstName?: string; lastName?: string; name?: string }[];
    pages?: string; publishYear?: number;
  };
  const mockChapters = loadJson<{ chapters: MockChapter[] }>("chapters.json").chapters;
  let chapterCount = 0;

  for (const ch of mockChapters) {
    const bookId = ch.bookDoi ? bookDoiToId.get(ch.bookDoi) : null;
    if (!bookId) continue; // skip chapters with no matching book

    // Parse pages like "1–42" or "1-42"
    let pageStart: number | null = null;
    let pageEnd: number | null = null;
    if (ch.pages) {
      const parts = ch.pages.split(/[–-]/);
      pageStart = parseInt(parts[0]) || null;
      pageEnd = parts[1] ? parseInt(parts[1]) || null : null;
    }

    const chRecord = await prisma.bookChapter.create({
      data: {
        doi:       ch.doi,
        title:     ch.title,
        bookId,
        order:     chapterCount + 1,
        pageStart,
        pageEnd,
      },
    });

    // Chapter authors
    if (ch.authors?.length) {
      for (let i = 0; i < ch.authors.length; i++) {
        const a = ch.authors[i];
        await prisma.bookChapterAuthor.create({
          data: {
            chapterId: chRecord.id,
            firstName: a.firstName ?? a.name?.split(" ")[0] ?? "Unknown",
            lastName:  a.lastName ?? a.name?.split(" ").slice(1).join(" ") ?? "Author",
            order:     i + 1,
          },
        });
      }
    }
    chapterCount++;
  }
  console.log(`   ✅  ${chapterCount} chapters created\n`);

  // ── 7. NEWS ───────────────────────────────────────────────
  console.log("📰  Seeding news...");
  type MockNews = { title: string; date?: string; category?: string; summary: string; slug: string };
  const mockNews = loadJson<{ news: MockNews[] }>("news.json").news;

  await batchProcess(mockNews, 10, async (n) => {
    await prisma.news.create({
      data: {
        slug:        n.slug,
        title:       n.title,
        summary:     n.summary,
        content:     n.summary, // use summary as content since mock has no full content
        category:    n.category ?? null,
        isPublished: true,
        publishedAt: n.date ? new Date(n.date) : past(Math.floor(Math.random() * 180)),
      },
    });
  });
  console.log(`   ✅  ${mockNews.length} news items created\n`);

  // ── 8. CONFERENCES ────────────────────────────────────────
  console.log("🎤  Seeding conferences...");
  type MockConference = {
    slug: string; title: string; date?: string; location?: string;
    about?: string; topics?: string[];
  };
  const mockConferences = loadJson<Record<string, MockConference>>("conferences.json");
  const confSlugs = new Set<string>();
  let confCount = 0;

  for (const [key, c] of Object.entries(mockConferences)) {
    const slug = c.slug ?? key;
    if (confSlugs.has(slug)) continue; // skip duplicates
    confSlugs.add(slug);

    // Parse dates like "July 21-27, 2024" or "December 10-16, 2023"
    let startDate = new Date();
    let endDate = new Date();
    let status: "UPCOMING" | "ONGOING" | "PAST" = "PAST";

    if (c.date) {
      const match = c.date.match(/(\w+)\s+(\d+)-(\d+),\s*(\d{4})/);
      if (match) {
        const [, month, startDay, endDay, year] = match;
        startDate = new Date(`${month} ${startDay}, ${year}`);
        endDate = new Date(`${month} ${endDay}, ${year}`);
        status = startDate > now ? "UPCOMING" : "PAST";
      }
    }

    await prisma.conference.create({
      data: {
        slug,
        title:       c.title,
        description: c.about ?? null,
        location:    c.location ?? null,
        isVirtual:   false,
        startDate,
        endDate,
        status,
        discipline:  c.topics?.[0] ?? null,
      },
    });
    confCount++;
  }
  console.log(`   ✅  ${confCount} conferences created\n`);

  // ── 9. CAREERS ────────────────────────────────────────────
  console.log("💼  Creating career listings...");
  await Promise.all([
    prisma.career.create({
      data: {
        title: "Senior Backend Engineer", department: "Engineering", location: "Remote",
        type: "FULL_TIME", description: "We are looking for a Senior Backend Engineer to join our platform team.",
        requirements: "5+ years Node.js, TypeScript, PostgreSQL, REST APIs.", closingDate: future(30),
      },
    }),
    prisma.career.create({
      data: {
        title: "Editorial Coordinator", department: "Editorial", location: "London, UK",
        type: "FULL_TIME", description: "Coordinate manuscript review processes and liaise with editors and authors.",
        requirements: "2+ years publishing experience.", closingDate: future(14),
      },
    }),
    prisma.career.create({
      data: {
        title: "Data Science Intern", department: "Research", location: "Remote",
        type: "INTERNSHIP", description: "Summer internship in the data science team working on citation analysis.",
        closingDate: future(7),
      },
    }),
    prisma.career.create({
      data: {
        title: "Frontend Developer", department: "Engineering", location: "Berlin, Germany",
        type: "FULL_TIME", description: "Build the next generation of our publishing platform UI.",
        requirements: "3+ years React, TypeScript experience.", closingDate: future(45),
      },
    }),
    prisma.career.create({
      data: {
        title: "Machine Learning Engineer", department: "AI Research", location: "Remote",
        type: "FULL_TIME", description: "Work on AI-powered paper summarization and recommendation systems.",
        requirements: "MS/PhD in ML, experience with LLMs and NLP.", closingDate: future(60),
      },
    }),
  ]);
  console.log("   ✅  5 career listings created\n");

  // ── 10. SITE CONFIG ───────────────────────────────────────
  console.log("⚙️   Seeding site config...");
  type MockSiteConfig = {
    metrics: { label: string; value: string; sub: string; color: string }[];
    socialLinks: Record<string, string>;
  };
  const mockSiteConfig = loadJson<MockSiteConfig>("site-config.json");

  const configEntries: { key: string; value: string }[] = [
    { key: "site_name",        value: "Lumex Publishing" },
    { key: "site_tagline",     value: "Advancing Research, Connecting Minds" },
    { key: "contact_email",    value: "support@lumex.io" },
    { key: "maintenance_mode", value: "false" },
  ];

  // Social links
  for (const [platform, url] of Object.entries(mockSiteConfig.socialLinks)) {
    configEntries.push({ key: `social_${platform}`, value: url });
  }

  // Metrics
  for (const m of mockSiteConfig.metrics) {
    configEntries.push({ key: `metric_${m.label.toLowerCase().replace(/\s+/g, "_")}`, value: JSON.stringify(m) });
  }

  for (const entry of configEntries) {
    await prisma.siteConfig.create({ data: entry });
  }
  console.log(`   ✅  ${configEntries.length} site config entries created\n`);

  // ── 11. HOMEPAGE CONTENT ──────────────────────────────────
  console.log("🏠  Seeding homepage content...");
  type MockHomepage = {
    stats: Record<string, string>[];
    quickLinks: Record<string, string>[];
    callForPapers: Record<string, string | number>[];
  };
  const mockHomepage = loadJson<MockHomepage>("homepage.json");

  await Promise.all([
    prisma.homepageContent.create({
      data: {
        section: "hero",
        content: {
          headline: "Advancing Research, Connecting Minds",
          subheadline: "Discover cutting-edge research across every discipline.",
          ctaLabel: "Browse Articles", ctaUrl: "/articles",
        },
      },
    }),
    prisma.homepageContent.create({
      data: { section: "stats",        content: mockHomepage.stats },
    }),
    prisma.homepageContent.create({
      data: { section: "quickLinks",   content: mockHomepage.quickLinks },
    }),
    prisma.homepageContent.create({
      data: { section: "callForPapers", content: mockHomepage.callForPapers },
    }),
    prisma.homepageContent.create({
      data: {
        section: "mission",
        content: { title: "Our Mission", body: "Lumex Publishing is committed to open science and equitable access to research." },
      },
    }),
  ]);
  console.log("   ✅  5 homepage sections created\n");

  // ── 12. SUBMISSIONS + ORDERS + ALERTS ─────────────────────
  console.log("📤  Creating submissions, orders, alerts...");
  const submission = await prisma.submission.create({
    data: {
      title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
      abstract: "We propose a federated learning framework for healthcare data.",
      keywords: ["federated learning", "privacy", "healthcare"],
      status: "SUBMITTED", journalSlug: "journal-of-computer-science",
      coverLetter: "We believe this work is a strong fit for your journal.",
      submittedAt: past(2), submittedBy: author1.id,
      coAuthors: { create: [{ firstName: "Diana", lastName: "Author", email: author2.email, affiliation: "Oxford", order: 1 }] },
    },
  });
  await prisma.submission.create({
    data: {
      title: "Quantum Key Distribution in 5G Networks",
      status: "DRAFT", keywords: ["quantum cryptography", "5G"],
      submittedBy: author2.id,
    },
  });

  await Promise.all([
    prisma.alert.create({ data: { type: "NEW_ARTICLE", query: "machine learning", userId: reader.id } }),
    prisma.alert.create({ data: { type: "JOURNAL_UPDATE", journalId: allJournals[0]?.id, userId: reader.id } }),
    prisma.alert.create({ data: { type: "NEW_ARTICLE", discipline: "Biology", userId: author1.id } }),
  ]);

  await Promise.all([
    prisma.order.create({
      data: { userId: reader.id, amount: 29.99, currency: "USD", status: "COMPLETED", itemType: "ARTICLE", itemRef: mockArticles[0]?.doi ?? "10.1234/demo", receiptUrl: "https://receipts.lumex.io/ord_001" },
    }),
    prisma.order.create({
      data: { userId: author1.id, amount: 1500, currency: "USD", status: "PENDING", itemType: "APC", itemRef: submission.id },
    }),
  ]);

  await prisma.contactMessage.create({
    data: {
      firstName: "John", lastName: "Smith", email: "john.smith@example.com",
      subject: "Question about submission guidelines",
      message: "Hi, I would like to know more about the manuscript formatting requirements.",
    },
  });
  console.log("   ✅  2 submissions, 3 alerts, 2 orders, 1 contact message created\n");

  // ── 13. LEGACY PAPER WORKFLOW ─────────────────────────────
  console.log("📝  Creating legacy paper workflow...");
  const paper = await prisma.paper.create({
    data: {
      title: "Blockchain for Academic Credential Verification",
      abstract: "This paper proposes a blockchain-based system for verifying academic credentials.",
      domain: "Computer Science", keywords: ["blockchain", "credentials"],
      status: "SUBMITTED", submittedBy: author1.id,
    },
  });
  const assignment = await prisma.reviewerAssignment.create({
    data: { paperId: paper.id, reviewerId: reviewer1.id, status: "COMPLETED" },
  });
  await prisma.review.create({
    data: {
      paperId: paper.id, reviewerId: reviewer1.id, assignmentId: assignment.id,
      strengths: "Well-structured argument, novel application.", weaknesses: "Limited scalability discussion.",
      score: 8, recommendation: "MINOR_REVISION",
    },
  });
  console.log("   ✅  Legacy paper workflow created\n");

  // ── SUMMARY ───────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.journal.count(),
    prisma.article.count(),
    prisma.articleAuthor.count(),
    prisma.affiliation.count(),
    prisma.articleFigure.count(),
    prisma.articleReference.count(),
    prisma.articleMetrics.count(),
    prisma.collection.count(),
    prisma.book.count(),
    prisma.bookChapter.count(),
    prisma.news.count(),
    prisma.career.count(),
    prisma.conference.count(),
    prisma.siteConfig.count(),
    prisma.homepageContent.count(),
    prisma.submission.count(),
    prisma.alert.count(),
    prisma.order.count(),
  ]);

  console.log("━".repeat(55));
  console.log("🎉  Seed complete! Database summary:\n");
  console.log(`   Users              : ${counts[0]}`);
  console.log(`   Journals           : ${counts[1]}`);
  console.log(`   Articles           : ${counts[2]}`);
  console.log(`   Article Authors    : ${counts[3]}`);
  console.log(`   Affiliations       : ${counts[4]}`);
  console.log(`   Article Figures    : ${counts[5]}`);
  console.log(`   Article References : ${counts[6]}`);
  console.log(`   Article Metrics    : ${counts[7]}`);
  console.log(`   Collections        : ${counts[8]}`);
  console.log(`   Books              : ${counts[9]}`);
  console.log(`   Book Chapters      : ${counts[10]}`);
  console.log(`   News               : ${counts[11]}`);
  console.log(`   Careers            : ${counts[12]}`);
  console.log(`   Conferences        : ${counts[13]}`);
  console.log(`   Site Config        : ${counts[14]}`);
  console.log(`   Homepage Sections  : ${counts[15]}`);
  console.log(`   Submissions        : ${counts[16]}`);
  console.log(`   Alerts             : ${counts[17]}`);
  console.log(`   Orders             : ${counts[18]}`);
  console.log("━".repeat(55));
}

main()
  .catch((e) => { console.error("❌  Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
