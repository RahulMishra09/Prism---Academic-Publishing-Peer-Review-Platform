-- ============================================================
-- Migration: lumex_expansion
-- Adds all Lumex publishing platform models
-- ============================================================

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('OPEN_ACCESS', 'SUBSCRIPTION', 'FREE');
CREATE TYPE "ArticleType" AS ENUM ('RESEARCH_ARTICLE', 'REVIEW', 'EDITORIAL', 'LETTER', 'CASE_STUDY', 'BOOK_REVIEW', 'CORRECTION');
CREATE TYPE "ConferenceStatus" AS ENUM ('UPCOMING', 'ONGOING', 'PAST', 'CANCELLED');
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUIRED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- ── Journals ──────────────────────────────────────────────────
CREATE TABLE "journals" (
    "id"            TEXT NOT NULL,
    "slug"          TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "description"   TEXT,
    "discipline"    TEXT NOT NULL,
    "issn"          TEXT,
    "eIssn"         TEXT,
    "impactFactor"  DOUBLE PRECISION,
    "coverImageUrl" TEXT,
    "isOpenAccess"  BOOLEAN NOT NULL DEFAULT false,
    "publisherName" TEXT,
    "isActive"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "journals_slug_key" ON "journals"("slug");
CREATE UNIQUE INDEX "journals_issn_key" ON "journals"("issn");
CREATE INDEX "journals_discipline_idx" ON "journals"("discipline");
CREATE INDEX "journals_slug_idx" ON "journals"("slug");

-- ── Journal Issues ────────────────────────────────────────────
CREATE TABLE "journal_issues" (
    "id"          TEXT NOT NULL,
    "volume"      INTEGER NOT NULL,
    "issue"       INTEGER NOT NULL,
    "year"        INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "journalId"   TEXT NOT NULL,

    CONSTRAINT "journal_issues_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "journal_issues_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "journal_issues_journalId_idx" ON "journal_issues"("journalId");

-- ── Journal Editorial Board ───────────────────────────────────
CREATE TABLE "journal_editorial_board" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "title"       TEXT,
    "institution" TEXT,
    "order"       INTEGER NOT NULL DEFAULT 0,
    "journalId"   TEXT NOT NULL,

    CONSTRAINT "journal_editorial_board_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "journal_editorial_board_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "journal_editorial_board_journalId_idx" ON "journal_editorial_board"("journalId");

-- ── Affiliations ──────────────────────────────────────────────
CREATE TABLE "affiliations" (
    "id"         TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "department" TEXT,
    "country"    TEXT,

    CONSTRAINT "affiliations_pkey" PRIMARY KEY ("id")
);

-- ── Articles ──────────────────────────────────────────────────
CREATE TABLE "articles" (
    "id"            TEXT NOT NULL,
    "doi"           TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "abstract"      TEXT NOT NULL,
    "keywords"      TEXT[],
    "discipline"    TEXT NOT NULL,
    "articleType"   "ArticleType" NOT NULL DEFAULT 'RESEARCH_ARTICLE',
    "accessType"    "AccessType" NOT NULL DEFAULT 'OPEN_ACCESS',
    "language"      TEXT NOT NULL DEFAULT 'en',
    "pdfUrl"        TEXT,
    "htmlUrl"       TEXT,
    "publishedAt"   TIMESTAMP(3),
    "isPublished"   BOOLEAN NOT NULL DEFAULT false,
    "viewCount"     INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "citationCount" INTEGER NOT NULL DEFAULT 0,
    "isTrending"    BOOLEAN NOT NULL DEFAULT false,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "journalId"     TEXT,
    "issueId"       TEXT,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "articles_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "articles_issueId_fkey"   FOREIGN KEY ("issueId")   REFERENCES "journal_issues"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "articles_doi_key"       ON "articles"("doi");
CREATE INDEX "articles_discipline_idx"       ON "articles"("discipline");
CREATE INDEX "articles_journalId_idx"        ON "articles"("journalId");
CREATE INDEX "articles_publishedAt_idx"      ON "articles"("publishedAt");
CREATE INDEX "articles_isPublished_idx"      ON "articles"("isPublished");
CREATE INDEX "articles_isTrending_idx"       ON "articles"("isTrending");

-- ── Article Authors ───────────────────────────────────────────
CREATE TABLE "article_authors" (
    "id"              TEXT NOT NULL,
    "firstName"       TEXT NOT NULL,
    "lastName"        TEXT NOT NULL,
    "email"           TEXT,
    "orcid"           TEXT,
    "isCorresponding" BOOLEAN NOT NULL DEFAULT false,
    "order"           INTEGER NOT NULL,
    "articleId"       TEXT NOT NULL,
    "affiliationId"   TEXT,

    CONSTRAINT "article_authors_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "article_authors_articleId_fkey"     FOREIGN KEY ("articleId")     REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "article_authors_affiliationId_fkey" FOREIGN KEY ("affiliationId") REFERENCES "affiliations"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "article_authors_articleId_idx" ON "article_authors"("articleId");

-- ── Article References ────────────────────────────────────────
CREATE TABLE "article_references" (
    "id"        TEXT NOT NULL,
    "text"      TEXT NOT NULL,
    "doi"       TEXT,
    "order"     INTEGER NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "article_references_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "article_references_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "article_references_articleId_idx" ON "article_references"("articleId");

-- ── Article Metrics ───────────────────────────────────────────
CREATE TABLE "article_metrics" (
    "id"            TEXT NOT NULL,
    "viewCount"     INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "citationCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount"    INTEGER NOT NULL DEFAULT 0,
    "articleId"     TEXT NOT NULL,

    CONSTRAINT "article_metrics_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "article_metrics_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "article_metrics_articleId_key" ON "article_metrics"("articleId");

-- ── Collections ───────────────────────────────────────────────
CREATE TABLE "collections" (
    "id"            TEXT NOT NULL,
    "slug"          TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "description"   TEXT,
    "coverImageUrl" TEXT,
    "discipline"    TEXT,
    "isActive"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");
CREATE INDEX "collections_slug_idx" ON "collections"("slug");

-- ── Collection Articles (join) ────────────────────────────────
CREATE TABLE "collection_articles" (
    "id"           TEXT NOT NULL,
    "order"        INTEGER NOT NULL DEFAULT 0,
    "addedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    "articleId"    TEXT NOT NULL,

    CONSTRAINT "collection_articles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "collection_articles_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "collection_articles_articleId_fkey"    FOREIGN KEY ("articleId")    REFERENCES "articles"("id")    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "collection_articles_collectionId_articleId_key" ON "collection_articles"("collectionId", "articleId");
CREATE INDEX "collection_articles_collectionId_idx" ON "collection_articles"("collectionId");

-- ── Books ─────────────────────────────────────────────────────
CREATE TABLE "books" (
    "id"            TEXT NOT NULL,
    "isbn"          TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "description"   TEXT,
    "publisher"     TEXT,
    "publishedAt"   TIMESTAMP(3),
    "coverImageUrl" TEXT,
    "discipline"    TEXT,
    "isOpenAccess"  BOOLEAN NOT NULL DEFAULT false,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");
CREATE INDEX "books_isbn_idx" ON "books"("isbn");

-- ── Book Chapters ─────────────────────────────────────────────
CREATE TABLE "book_chapters" (
    "id"        TEXT NOT NULL,
    "doi"       TEXT NOT NULL,
    "title"     TEXT NOT NULL,
    "abstract"  TEXT,
    "order"     INTEGER NOT NULL,
    "pdfUrl"    TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId"    TEXT NOT NULL,

    CONSTRAINT "book_chapters_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "book_chapters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "book_chapters_doi_key" ON "book_chapters"("doi");
CREATE INDEX "book_chapters_bookId_idx"     ON "book_chapters"("bookId");
CREATE INDEX "book_chapters_doi_idx"        ON "book_chapters"("doi");

-- ── News ──────────────────────────────────────────────────────
CREATE TABLE "news" (
    "id"          TEXT NOT NULL,
    "slug"        TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "summary"     TEXT NOT NULL,
    "content"     TEXT NOT NULL,
    "imageUrl"    TEXT,
    "category"    TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "news_slug_key"       ON "news"("slug");
CREATE INDEX "news_isPublished_idx"       ON "news"("isPublished");

-- ── Careers ───────────────────────────────────────────────────
CREATE TABLE "careers" (
    "id"           TEXT NOT NULL,
    "title"        TEXT NOT NULL,
    "department"   TEXT,
    "location"     TEXT,
    "type"         TEXT NOT NULL,
    "description"  TEXT NOT NULL,
    "requirements" TEXT,
    "isActive"     BOOLEAN NOT NULL DEFAULT true,
    "closingDate"  TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "careers_isActive_idx" ON "careers"("isActive");

-- ── Conferences ───────────────────────────────────────────────
CREATE TABLE "conferences" (
    "id"                 TEXT NOT NULL,
    "slug"               TEXT NOT NULL,
    "title"              TEXT NOT NULL,
    "description"        TEXT,
    "location"           TEXT,
    "isVirtual"          BOOLEAN NOT NULL DEFAULT false,
    "startDate"          TIMESTAMP(3) NOT NULL,
    "endDate"            TIMESTAMP(3) NOT NULL,
    "status"             "ConferenceStatus" NOT NULL DEFAULT 'UPCOMING',
    "discipline"         TEXT,
    "submissionDeadline" TIMESTAMP(3),
    "website"            TEXT,
    "coverImageUrl"      TEXT,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conferences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "conferences_slug_key"  ON "conferences"("slug");
CREATE INDEX "conferences_status_idx"       ON "conferences"("status");

-- ── Site Config ───────────────────────────────────────────────
CREATE TABLE "site_config" (
    "id"    TEXT NOT NULL,
    "key"   TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "site_config_key_key" ON "site_config"("key");

-- ── Homepage Content ──────────────────────────────────────────
CREATE TABLE "homepage_content" (
    "id"        TEXT NOT NULL,
    "section"   TEXT NOT NULL,
    "content"   JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_content_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "homepage_content_section_key" ON "homepage_content"("section");

-- ── Password Reset Tokens ─────────────────────────────────────
CREATE TABLE "password_reset_tokens" (
    "id"        TEXT NOT NULL,
    "token"     TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used"      BOOLEAN NOT NULL DEFAULT false,
    "userId"    TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");
CREATE INDEX "password_reset_tokens_userId_idx"       ON "password_reset_tokens"("userId");
CREATE INDEX "password_reset_tokens_token_idx"        ON "password_reset_tokens"("token");

-- ── Refresh Tokens ────────────────────────────────────────────
CREATE TABLE "refresh_tokens" (
    "id"        TEXT NOT NULL,
    "token"     TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "userId"    TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");
CREATE INDEX "refresh_tokens_userId_idx"       ON "refresh_tokens"("userId");

-- ── Submissions ───────────────────────────────────────────────
CREATE TABLE "submissions" (
    "id"          TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "abstract"    TEXT,
    "keywords"    TEXT[],
    "status"      "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "coverLetter" TEXT,
    "journalSlug" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "submittedBy" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "submissions_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "submissions_submittedBy_idx" ON "submissions"("submittedBy");
CREATE INDEX "submissions_status_idx"      ON "submissions"("status");

-- ── Submission Files ──────────────────────────────────────────
CREATE TABLE "submission_files" (
    "id"           TEXT NOT NULL,
    "fileName"     TEXT NOT NULL,
    "fileUrl"      TEXT NOT NULL,
    "mimeType"     TEXT NOT NULL,
    "fileSize"     INTEGER NOT NULL,
    "fileType"     TEXT NOT NULL,
    "uploadedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "submission_files_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "submission_files_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "submission_files_submissionId_idx" ON "submission_files"("submissionId");

-- ── Submission Authors ────────────────────────────────────────
CREATE TABLE "submission_authors" (
    "id"           TEXT NOT NULL,
    "firstName"    TEXT NOT NULL,
    "lastName"     TEXT NOT NULL,
    "email"        TEXT NOT NULL,
    "affiliation"  TEXT,
    "order"        INTEGER NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "submission_authors_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "submission_authors_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "submission_authors_submissionId_idx" ON "submission_authors"("submissionId");

-- ── Alerts ────────────────────────────────────────────────────
CREATE TABLE "alerts" (
    "id"         TEXT NOT NULL,
    "type"       TEXT NOT NULL,
    "query"      TEXT,
    "journalId"  TEXT,
    "discipline" TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId"     TEXT NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "alerts_userId_idx" ON "alerts"("userId");

-- ── Orders ────────────────────────────────────────────────────
CREATE TABLE "orders" (
    "id"         TEXT NOT NULL,
    "amount"     DOUBLE PRECISION NOT NULL,
    "currency"   TEXT NOT NULL DEFAULT 'USD',
    "status"     "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "itemType"   TEXT NOT NULL,
    "itemRef"    TEXT NOT NULL,
    "receiptUrl" TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    "userId"     TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- ── Contact Messages ──────────────────────────────────────────
CREATE TABLE "contact_messages" (
    "id"        TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName"  TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "subject"   TEXT NOT NULL,
    "message"   TEXT NOT NULL,
    "ticketId"  TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "contact_messages_ticketId_key" ON "contact_messages"("ticketId");
