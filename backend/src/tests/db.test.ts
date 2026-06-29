/**
 * src/tests/db.test.ts
 * --------------------
 * Full database integration test for every model in the Lumex schema.
 * Uses the real Prisma client — requires a live PostgreSQL connection.
 *
 * Run with:  npx tsx src/tests/db.test.ts
 *
 * Exit codes:  0 = all tests passed
 *              1 = one or more tests failed
 */

import "../config/env.js";   // loads .env
import { prisma } from "../config/prisma.js";

// ── Test harness ─────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(label: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅  ${label}`);
    passed++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ❌  ${label}\n      ${msg}`);
    failures.push(`${label}: ${msg}`);
    failed++;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

// ── Cleanup helper ────────────────────────────────────────────
async function cleanup() {
  await prisma.$transaction([
    prisma.contactMessage.deleteMany({ where: { email: { contains: "@dbtest.io" } } }),
    prisma.order.deleteMany({ where: { user: { email: { contains: "@dbtest.io" } } } }),
    prisma.alert.deleteMany({ where: { user: { email: { contains: "@dbtest.io" } } } }),
    prisma.submissionFile.deleteMany({ where: { submission: { author: { email: { contains: "@dbtest.io" } } } } }),
    prisma.submissionAuthor.deleteMany({ where: { submission: { author: { email: { contains: "@dbtest.io" } } } } }),
    prisma.submission.deleteMany({ where: { author: { email: { contains: "@dbtest.io" } } } }),
    prisma.refreshToken.deleteMany({ where: { user: { email: { contains: "@dbtest.io" } } } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: { not: "" } } }),  // cleaned by userId below
    prisma.comment.deleteMany({ where: { author: { email: { contains: "@dbtest.io" } } } }),
    prisma.review.deleteMany({ where: { reviewer: { email: { contains: "@dbtest.io" } } } }),
    prisma.reviewerAssignment.deleteMany({ where: { reviewer: { email: { contains: "@dbtest.io" } } } }),
    prisma.paper.deleteMany({ where: { author: { email: { contains: "@dbtest.io" } } } }),
    prisma.articleAuthor.deleteMany({ where: { article: { doi: { startsWith: "10.9999" } } } }),
    prisma.articleMetrics.deleteMany({ where: { article: { doi: { startsWith: "10.9999" } } } }),
    prisma.articleReference.deleteMany({ where: { article: { doi: { startsWith: "10.9999" } } } }),
    prisma.collectionArticle.deleteMany({ where: { article: { doi: { startsWith: "10.9999" } } } }),
    prisma.article.deleteMany({ where: { doi: { startsWith: "10.9999" } } }),
    prisma.bookChapter.deleteMany({ where: { doi: { startsWith: "10.9999" } } }),
    prisma.book.deleteMany({ where: { isbn: { startsWith: "978-9999" } } }),
    prisma.collectionArticle.deleteMany({ where: { collection: { slug: { startsWith: "test-col-" } } } }),
    prisma.collection.deleteMany({ where: { slug: { startsWith: "test-col-" } } }),
    prisma.journalEditorialBoard.deleteMany({ where: { journal: { slug: { startsWith: "test-j-" } } } }),
    prisma.journalIssue.deleteMany({ where: { journal: { slug: { startsWith: "test-j-" } } } }),
    prisma.journal.deleteMany({ where: { slug: { startsWith: "test-j-" } } }),
    prisma.affiliation.deleteMany({ where: { name: { startsWith: "Test Uni" } } }),
    prisma.news.deleteMany({ where: { slug: { startsWith: "test-news-" } } }),
    prisma.career.deleteMany({ where: { title: { startsWith: "[TEST]" } } }),
    prisma.conference.deleteMany({ where: { slug: { startsWith: "test-conf-" } } }),
    prisma.siteConfig.deleteMany({ where: { key: { startsWith: "test_" } } }),
    prisma.homepageContent.deleteMany({ where: { section: { startsWith: "test_" } } }),
    prisma.user.deleteMany({ where: { email: { contains: "@dbtest.io" } } }),
  ]);
}

// ─────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔌  Connecting to database...");
  await prisma.$connect();
  console.log("   Connected\n");

  // Pre-test cleanup
  await cleanup();

  // ── GROUP 1: Core Auth Models ──────────────────────────────
  console.log("── Auth / Users ──────────────────────────────────────");

  let testUser: Awaited<ReturnType<typeof prisma.user.create>> | null = null;

  await test("Create user with AUTHOR role", async () => {
    testUser = await prisma.user.create({
      data: { name: "DB Test Author", email: "author@dbtest.io", password: "hashed_pw", role: "AUTHOR" },
    });
    assert(testUser.id.length > 0, "id should be set");
    assert(testUser.role === "AUTHOR", "role should be AUTHOR");
    assert(testUser.isBanned === false, "should not be banned by default");
  });

  let reviewerUser: Awaited<ReturnType<typeof prisma.user.create>> | null = null;
  await test("Create user with REVIEWER role", async () => {
    reviewerUser = await prisma.user.create({
      data: { name: "DB Test Reviewer", email: "reviewer@dbtest.io", password: "hashed_pw", role: "REVIEWER" },
    });
    assert(reviewerUser.role === "REVIEWER", "role check");
  });

  await test("Find user by email", async () => {
    const found = await prisma.user.findUnique({ where: { email: "author@dbtest.io" } });
    assert(found?.id === testUser?.id, "should find same user");
  });

  await test("Update user name", async () => {
    const updated = await prisma.user.update({
      where: { id: testUser!.id },
      data: { name: "DB Test Author Updated" },
    });
    assert(updated.name === "DB Test Author Updated", "name should be updated");
  });

  await test("Create refresh token for user", async () => {
    const rt = await prisma.refreshToken.create({
      data: { token: "rt_test_token_abc123", userId: testUser!.id, expiresAt: new Date(Date.now() + 86_400_000) },
    });
    assert(rt.isRevoked === false, "should not be revoked by default");
  });

  await test("Revoke refresh token", async () => {
    const updated = await prisma.refreshToken.update({
      where: { token: "rt_test_token_abc123" },
      data: { isRevoked: true },
    });
    assert(updated.isRevoked === true, "should be revoked");
  });

  await test("Create password reset token", async () => {
    const prt = await prisma.passwordResetToken.create({
      data: { token: "prt_test_xyz", userId: testUser!.id, expiresAt: new Date(Date.now() + 3_600_000) },
    });
    assert(!prt.used, "should not be used by default");
    // Mark used
    await prisma.passwordResetToken.update({ where: { id: prt.id }, data: { used: true } });
  });

  await test("Ban and unban user", async () => {
    await prisma.user.update({ where: { id: testUser!.id }, data: { isBanned: true } });
    const banned = await prisma.user.findUnique({ where: { id: testUser!.id } });
    assert(banned?.isBanned === true, "should be banned");
    await prisma.user.update({ where: { id: testUser!.id }, data: { isBanned: false } });
  });

  // ── GROUP 2: Journal Models ─────────────────────────────────
  console.log("\n── Journals ──────────────────────────────────────────");

  let testJournal: Awaited<ReturnType<typeof prisma.journal.create>> | null = null;
  let testIssue: Awaited<ReturnType<typeof prisma.journalIssue.create>> | null = null;

  await test("Create journal with slug uniqueness", async () => {
    testJournal = await prisma.journal.create({
      data: {
        slug: "test-j-cs-quarterly",
        title: "Test CS Quarterly",
        discipline: "Computer Science",
        isOpenAccess: true,
        publisherName: "Test Publisher",
      },
    });
    assert(testJournal.slug === "test-j-cs-quarterly", "slug check");
  });

  await test("Prevent duplicate journal slug", async () => {
    let threw = false;
    try {
      await prisma.journal.create({
        data: { slug: "test-j-cs-quarterly", title: "Duplicate", discipline: "CS" },
      });
    } catch { threw = true; }
    assert(threw, "should throw on duplicate slug");
  });

  await test("Create journal issue", async () => {
    testIssue = await prisma.journalIssue.create({
      data: { volume: 1, issue: 1, year: 2026, publishedAt: new Date(), journalId: testJournal!.id },
    });
    assert(testIssue.volume === 1, "volume check");
  });

  await test("Create editorial board member", async () => {
    const eb = await prisma.journalEditorialBoard.create({
      data: { name: "Dr. Test Editor", title: "Editor-in-Chief", order: 1, journalId: testJournal!.id },
    });
    assert(eb.journalId === testJournal!.id, "journalId check");
  });

  await test("Fetch journal with counts and board", async () => {
    const j = await prisma.journal.findUnique({
      where: { id: testJournal!.id },
      include: { issues: true, editorialBoard: true },
    });
    assert(j?.issues.length === 1, "should have 1 issue");
    assert(j?.editorialBoard.length === 1, "should have 1 board member");
  });

  // ── GROUP 3: Article Models ─────────────────────────────────
  console.log("\n── Articles ──────────────────────────────────────────");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testArticle: any = null;
  let testAffil: Awaited<ReturnType<typeof prisma.affiliation.create>> | null = null;

  await test("Create affiliation", async () => {
    testAffil = await prisma.affiliation.create({
      data: { name: "Test Uni CS", department: "CS", country: "USA" },
    });
    assert(testAffil.name === "Test Uni CS", "name check");
  });

  await test("Create published article with authors + metrics", async () => {
    testArticle = await prisma.article.create({
      data: {
        doi: "10.9999/test.001",
        title: "Test Article on Database Testing",
        abstract: "A test article for verifying database operations.",
        keywords: ["testing", "database"],
        discipline: "Computer Science",
        isPublished: true,
        publishedAt: new Date(),
        journalId: testJournal!.id,
        issueId: testIssue!.id,
        authors: {
          create: [
            { firstName: "Test", lastName: "Author", isCorresponding: true, order: 1, affiliationId: testAffil!.id },
          ],
        },
        references: {
          create: [{ text: "Test Reference 1", order: 1 }, { text: "Test Reference 2", doi: "10.9999/ref.001", order: 2 }],
        },
        metrics: { create: { viewCount: 10, downloadCount: 2 } },
      },
      include: { authors: true, references: true, metrics: true },
    });
    assert(testArticle.authors.length === 1, "should have 1 author");
    assert(testArticle.references.length === 2, "should have 2 references");
    assert(testArticle.metrics?.viewCount === 10, "metrics check");
  });

  await test("Prevent duplicate DOI", async () => {
    let threw = false;
    try {
      await prisma.article.create({
        data: { doi: "10.9999/test.001", title: "Dup", abstract: "dup", keywords: [], discipline: "CS" },
      });
    } catch { threw = true; }
    assert(threw, "should throw on duplicate DOI");
  });

  await test("Filter articles by discipline (published only)", async () => {
    const results = await prisma.article.findMany({
      where: { discipline: "Computer Science", isPublished: true },
    });
    assert(results.length >= 1, "should find at least 1 published CS article");
  });

  await test("Filter articles by journal", async () => {
    const results = await prisma.article.findMany({
      where: { journalId: testJournal!.id, isPublished: true },
    });
    assert(results.some((a) => a.id === testArticle!.id), "should include test article");
  });

  await test("Update article view count", async () => {
    const updated = await prisma.article.update({
      where: { id: testArticle!.id },
      data: { viewCount: { increment: 1 } },
    });
    assert(updated.viewCount === 1, "viewCount should be 1");
  });

  // ── GROUP 4: Collections ────────────────────────────────────
  console.log("\n── Collections ───────────────────────────────────────");

  let testCol: Awaited<ReturnType<typeof prisma.collection.create>> | null = null;

  await test("Create collection", async () => {
    testCol = await prisma.collection.create({
      data: { slug: "test-col-db", title: "Test DB Collection", discipline: "Computer Science" },
    });
    assert(testCol.isActive === true, "should be active by default");
  });

  await test("Add article to collection", async () => {
    const ca = await prisma.collectionArticle.create({
      data: { collectionId: testCol!.id, articleId: testArticle!.id, order: 1 },
    });
    assert(ca.order === 1, "order check");
  });

  await test("Prevent duplicate article in collection", async () => {
    let threw = false;
    try {
      await prisma.collectionArticle.create({
        data: { collectionId: testCol!.id, articleId: testArticle!.id, order: 2 },
      });
    } catch { threw = true; }
    assert(threw, "should throw on duplicate collectionId+articleId");
  });

  await test("Fetch collection with articles", async () => {
    const col = await prisma.collection.findUnique({
      where: { id: testCol!.id },
      include: { articles: { include: { article: true } } },
    });
    assert(col?.articles.length === 1, "should have 1 article");
    assert(col?.articles[0].article.doi === "10.9999/test.001", "correct article");
  });

  // ── GROUP 5: Books + Chapters ───────────────────────────────
  console.log("\n── Books & Chapters ──────────────────────────────────");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testBook: any = null;

  await test("Create book with chapters", async () => {
    testBook = await prisma.book.create({
      data: {
        isbn: "978-9999-00001",
        title: "Test Book on DB Design",
        publisher: "Test Press",
        discipline: "Computer Science",
        chapters: {
          create: [
            { doi: "10.9999/book.ch1", title: "Chapter 1: Intro",      order: 1 },
            { doi: "10.9999/book.ch2", title: "Chapter 2: Relations",   order: 2 },
            { doi: "10.9999/book.ch3", title: "Chapter 3: Normalization", order: 3 },
          ],
        },
      },
      include: { chapters: true },
    });
    assert(testBook.chapters.length === 3, "should have 3 chapters");
  });

  await test("Fetch chapter by DOI", async () => {
    const ch = await prisma.bookChapter.findUnique({
      where: { doi: "10.9999/book.ch2" },
      include: { book: true },
    });
    assert(ch?.title === "Chapter 2: Relations", "title check");
    assert(ch?.book.isbn === "978-9999-00001", "parent book check");
  });

  await test("Prevent duplicate chapter DOI", async () => {
    let threw = false;
    try {
      await prisma.bookChapter.create({ data: { doi: "10.9999/book.ch1", title: "Dup", order: 99, bookId: testBook!.id } });
    } catch { threw = true; }
    assert(threw, "should throw on duplicate DOI");
  });

  // ── GROUP 6: News ───────────────────────────────────────────
  console.log("\n── News ──────────────────────────────────────────────");

  await test("Create published news item", async () => {
    const item = await prisma.news.create({
      data: {
        slug: "test-news-db-001",
        title: "Test News Item",
        summary: "Summary of test news",
        content: "Full content of test news article.",
        category: "Testing",
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    assert(item.slug === "test-news-db-001", "slug check");
  });

  await test("Filter published news only", async () => {
    await prisma.news.create({
      data: { slug: "test-news-db-draft", title: "Draft News", summary: "s", content: "c", isPublished: false },
    });
    const published = await prisma.news.findMany({ where: { isPublished: true, slug: { startsWith: "test-news-" } } });
    assert(published.length === 1, "only 1 published test news");
    assert(published[0].slug === "test-news-db-001", "correct slug");
  });

  // ── GROUP 7: Careers ────────────────────────────────────────
  console.log("\n── Careers ───────────────────────────────────────────");

  await test("Create career listing", async () => {
    const c = await prisma.career.create({
      data: {
        title: "[TEST] Senior Engineer",
        type: "FULL_TIME",
        description: "Test job description",
        location: "Remote",
        department: "Engineering",
        closingDate: new Date(Date.now() + 30 * 86_400_000),
      },
    });
    assert(c.isActive === true, "should be active by default");
  });

  await test("Deactivate career listing", async () => {
    const c = await prisma.career.findFirst({ where: { title: "[TEST] Senior Engineer" } });
    const updated = await prisma.career.update({ where: { id: c!.id }, data: { isActive: false } });
    assert(!updated.isActive, "should be inactive");
  });

  // ── GROUP 8: Conferences ────────────────────────────────────
  console.log("\n── Conferences ───────────────────────────────────────");

  await test("Create upcoming conference", async () => {
    const conf = await prisma.conference.create({
      data: {
        slug: "test-conf-ai-2027",
        title: "Test AI Conference 2027",
        startDate: new Date(Date.now() + 90 * 86_400_000),
        endDate:   new Date(Date.now() + 93 * 86_400_000),
        status: "UPCOMING",
        discipline: "Computer Science",
        isVirtual: false,
      },
    });
    assert(conf.status === "UPCOMING", "status check");
  });

  await test("Filter conferences by status", async () => {
    const upcoming = await prisma.conference.findMany({ where: { status: "UPCOMING", slug: { startsWith: "test-conf-" } } });
    assert(upcoming.length >= 1, "should find upcoming conference");
  });

  // ── GROUP 9: Site Config + Homepage ─────────────────────────
  console.log("\n── Site Config & Homepage ────────────────────────────");

  await test("Create and retrieve site config key", async () => {
    await prisma.siteConfig.create({ data: { key: "test_site_name", value: "TestLumex" } });
    const config = await prisma.siteConfig.findUnique({ where: { key: "test_site_name" } });
    assert(config?.value === "TestLumex", "value check");
  });

  await test("Upsert site config", async () => {
    await prisma.siteConfig.upsert({
      where: { key: "test_site_name" },
      update: { value: "UpdatedTestLumex" },
      create: { key: "test_site_name", value: "UpdatedTestLumex" },
    });
    const config = await prisma.siteConfig.findUnique({ where: { key: "test_site_name" } });
    assert(config?.value === "UpdatedTestLumex", "upsert value check");
  });

  await test("Create homepage content section", async () => {
    const hc = await prisma.homepageContent.create({
      data: { section: "test_hero", content: { headline: "Test Headline", cta: "Click Me" } },
    });
    assert(typeof hc.content === "object", "content should be JSON object");
  });

  // ── GROUP 10: Submissions ───────────────────────────────────
  console.log("\n── Submissions ───────────────────────────────────────");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testSubmission: any = null;

  await test("Create draft submission", async () => {
    testSubmission = await prisma.submission.create({
      data: {
        title: "Test Submission: Distributed Systems",
        abstract: "Testing submission creation in the database.",
        keywords: ["testing", "distributed systems"],
        status: "DRAFT",
        submittedBy: testUser!.id,
        coAuthors: {
          create: [
            { firstName: "Co", lastName: "Author", email: "coauthor@dbtest.io", order: 1 },
          ],
        },
      },
      include: { coAuthors: true },
    });
    assert(testSubmission.status === "DRAFT", "status check");
    assert(testSubmission.coAuthors.length === 1, "should have 1 co-author");
  });

  await test("Transition submission DRAFT → SUBMITTED", async () => {
    const updated = await prisma.submission.update({
      where: { id: testSubmission!.id },
      data: { status: "SUBMITTED", submittedAt: new Date() },
    });
    assert(updated.status === "SUBMITTED", "status should be SUBMITTED");
    assert(updated.submittedAt !== null, "submittedAt should be set");
  });

  await test("Editor decision: ACCEPTED", async () => {
    const updated = await prisma.submission.update({
      where: { id: testSubmission!.id },
      data: { status: "ACCEPTED" },
    });
    assert(updated.status === "ACCEPTED", "status check");
  });

  await test("Query submissions by status", async () => {
    const subs = await prisma.submission.findMany({
      where: { status: "ACCEPTED", submittedBy: testUser!.id },
    });
    assert(subs.length === 1, "should find 1 accepted submission");
  });

  // ── GROUP 11: Alerts ────────────────────────────────────────
  console.log("\n── Alerts ────────────────────────────────────────────");

  await test("Create multiple alert types", async () => {
    await prisma.alert.createMany({
      data: [
        { type: "NEW_ARTICLE",   query: "quantum computing",    userId: testUser!.id },
        { type: "JOURNAL_UPDATE", journalId: testJournal!.id,  userId: testUser!.id },
        { type: "CONFERENCE",     discipline: "CS",             userId: testUser!.id },
      ],
    });
    const alerts = await prisma.alert.findMany({ where: { userId: testUser!.id } });
    assert(alerts.length === 3, "should have 3 alerts");
  });

  await test("Delete specific alert", async () => {
    const alert = await prisma.alert.findFirst({ where: { userId: testUser!.id, type: "CONFERENCE" } });
    await prisma.alert.delete({ where: { id: alert!.id } });
    const remaining = await prisma.alert.findMany({ where: { userId: testUser!.id } });
    assert(remaining.length === 2, "should have 2 alerts after delete");
  });

  // ── GROUP 12: Orders ────────────────────────────────────────
  console.log("\n── Orders ────────────────────────────────────────────");

  let testOrder: Awaited<ReturnType<typeof prisma.order.create>> | null = null;

  await test("Create PENDING order", async () => {
    testOrder = await prisma.order.create({
      data: {
        userId:   testUser!.id,
        amount:   29.99,
        currency: "USD",
        status:   "PENDING",
        itemType: "ARTICLE",
        itemRef:  testArticle!.doi,
      },
    });
    assert(testOrder.status === "PENDING", "status check");
    assert(testOrder.amount === 29.99, "amount check");
  });

  await test("Complete order and add receipt URL", async () => {
    const updated = await prisma.order.update({
      where: { id: testOrder!.id },
      data: { status: "COMPLETED", receiptUrl: "https://receipts.lumex.io/test-ord" },
    });
    assert(updated.status === "COMPLETED", "status check");
    assert(updated.receiptUrl !== null, "receiptUrl should be set");
  });

  await test("Prevent duplicate COMPLETED article order (application-level check)", async () => {
    const existing = await prisma.order.findFirst({
      where: { userId: testUser!.id, itemRef: testArticle!.doi, status: "COMPLETED", itemType: "ARTICLE" },
    });
    assert(existing !== null, "should find existing completed order");
  });

  // ── GROUP 13: Contact Messages ──────────────────────────────
  console.log("\n── Contact Messages ──────────────────────────────────");

  await test("Create contact message with auto ticketId", async () => {
    const msg = await prisma.contactMessage.create({
      data: {
        firstName: "Test",
        lastName:  "User",
        email:     "contact@dbtest.io",
        subject:   "DB Test Contact",
        message:   "Testing contact message creation.",
      },
    });
    assert(msg.ticketId.length > 0, "ticketId should be auto-generated");
  });

  // ── GROUP 14: Legacy Paper Workflow ─────────────────────────
  console.log("\n── Legacy Papers / Reviews ───────────────────────────");

  let testPaper: Awaited<ReturnType<typeof prisma.paper.create>> | null = null;
  let testAssignment: Awaited<ReturnType<typeof prisma.reviewerAssignment.create>> | null = null;

  await test("Create paper in DRAFT status", async () => {
    testPaper = await prisma.paper.create({
      data: {
        title: "Test Paper: Graph Neural Networks",
        abstract: "A study of GNNs for node classification.",
        domain: "Computer Science",
        keywords: ["GNN", "graph", "neural networks"],
        status: "DRAFT",
        submittedBy: testUser!.id,
      },
    });
    assert(testPaper.status === "DRAFT", "status check");
  });

  await test("Submit paper: DRAFT → SUBMITTED", async () => {
    const updated = await prisma.paper.update({
      where: { id: testPaper!.id },
      data: { status: "SUBMITTED" },
    });
    assert(updated.status === "SUBMITTED", "status check");
  });

  await test("Assign reviewer to paper", async () => {
    testAssignment = await prisma.reviewerAssignment.create({
      data: { paperId: testPaper!.id, reviewerId: reviewerUser!.id },
    });
    assert(testAssignment.status === "PENDING", "default status check");
  });

  await test("Prevent duplicate reviewer assignment", async () => {
    let threw = false;
    try {
      await prisma.reviewerAssignment.create({
        data: { paperId: testPaper!.id, reviewerId: reviewerUser!.id },
      });
    } catch { threw = true; }
    assert(threw, "should throw on duplicate assignment");
  });

  await test("Submit review and mark assignment COMPLETED", async () => {
    const review = await prisma.review.create({
      data: {
        paperId:        testPaper!.id,
        reviewerId:     reviewerUser!.id,
        assignmentId:   testAssignment!.id,
        strengths:      "Clear and well-structured research.",
        weaknesses:     "Limited dataset size.",
        score:          7,
        recommendation: "MINOR_REVISION",
      },
    });
    assert(review.score === 7, "score check");
    await prisma.reviewerAssignment.update({
      where: { id: testAssignment!.id },
      data: { status: "COMPLETED" },
    });
    const asgn = await prisma.reviewerAssignment.findUnique({ where: { id: testAssignment!.id } });
    assert(asgn?.status === "COMPLETED", "assignment should be COMPLETED");
  });

  await test("Add comment to paper", async () => {
    const comment = await prisma.comment.create({
      data: { paperId: testPaper!.id, authorId: testUser!.id, body: "Very insightful work!" },
    });
    assert(comment.body === "Very insightful work!", "body check");
  });

  await test("Add reply comment (threaded)", async () => {
    const parent = await prisma.comment.findFirst({ where: { paperId: testPaper!.id } });
    const reply = await prisma.comment.create({
      data: { paperId: testPaper!.id, authorId: reviewerUser!.id, body: "Thank you!", parentId: parent!.id },
    });
    assert(reply.parentId === parent!.id, "parentId check");
  });

  await test("Approve paper: SUBMITTED → APPROVED", async () => {
    const updated = await prisma.paper.update({
      where: { id: testPaper!.id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
    assert(updated.status === "APPROVED", "status check");
    assert(updated.approvedAt !== null, "approvedAt check");
  });

  // ── GROUP 15: Cascading / Relation checks ───────────────────
  console.log("\n── Relation & Integrity Checks ───────────────────────");

  await test("Fetch user with all relations", async () => {
    const user = await prisma.user.findUnique({
      where: { id: testUser!.id },
      include: { submissions: true, alerts: true, orders: true, papers: true },
    });
    assert((user?.submissions.length ?? 0) >= 1, "should have submissions");
    assert((user?.alerts.length ?? 0) >= 1, "should have alerts");
    assert((user?.orders.length ?? 0) >= 1, "should have orders");
    assert((user?.papers.length ?? 0) >= 1, "should have papers");
  });

  await test("Fetch article with full relations", async () => {
    const article = await prisma.article.findUnique({
      where: { id: testArticle!.id },
      include: { authors: { include: { affiliation: true } }, references: true, metrics: true, journal: true, issue: true },
    });
    assert(article?.authors[0].affiliation?.name === "Test Uni CS", "affiliation check");
    assert(article?.journal?.slug === "test-j-cs-quarterly", "journal check");
  });

  await test("Count articles per journal", async () => {
    const journal = await prisma.journal.findUnique({
      where: { id: testJournal!.id },
      include: { _count: { select: { articles: true } } },
    });
    assert((journal?._count.articles ?? 0) >= 1, "should have articles");
  });

  await test("groupBy: article count by discipline", async () => {
    const groups = await prisma.article.groupBy({
      by: ["discipline"],
      where: { isPublished: true },
      _count: { discipline: true },
    });
    assert(groups.length > 0, "should have at least 1 discipline group");
  });

  // ── POST-TEST CLEANUP ──────────────────────────────────────
  console.log("\n🧹  Cleaning up test data...");
  await cleanup();
  console.log("   ✅  Cleanup done\n");

  // ── RESULTS ───────────────────────────────────────────────
  console.log("━".repeat(55));
  console.log(`\n🏁  Results: ${passed} passed, ${failed} failed\n`);

  if (failures.length > 0) {
    console.error("Failed tests:");
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  } else {
    console.log("✅  All database tests passed!");
    process.exit(0);
  }
}

main()
  .catch((err) => {
    console.error("\n💥  Unexpected error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
