-- ============================================================
-- Migration: Refresh Tokens, Audit Logs, File Upload Fields,
--            Full-Text Search (tsvector), AuditAction enum
-- ============================================================

-- ── Enums ──────────────────────────────────────────────────────────────────

CREATE TYPE "AuditAction" AS ENUM (
  'USER_CREATED', 'USER_UPDATED', 'USER_BANNED', 'USER_UNBANNED',
  'ROLE_CHANGED', 'PAPER_SUBMITTED', 'PAPER_APPROVED', 'PAPER_REJECTED',
  'REVIEWER_ASSIGNED', 'REVIEWER_UNASSIGNED', 'REVIEW_SUBMITTED',
  'FILE_UPLOADED', 'COMMENT_DELETED', 'LOGIN', 'LOGOUT'
);

-- ── Refresh Tokens ─────────────────────────────────────────────────────────

CREATE TABLE "refresh_tokens" (
  "id"        TEXT      NOT NULL PRIMARY KEY,
  "token"     TEXT      NOT NULL UNIQUE,
  "userId"    TEXT      NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  "isRevoked" BOOLEAN   NOT NULL DEFAULT false
);

CREATE INDEX "refresh_tokens_userId_idx"  ON "refresh_tokens"("userId");
CREATE INDEX "refresh_tokens_token_idx"   ON "refresh_tokens"("token");

-- ── Audit Logs ─────────────────────────────────────────────────────────────

CREATE TABLE "audit_logs" (
  "id"         TEXT         NOT NULL PRIMARY KEY,
  "action"     "AuditAction" NOT NULL,
  "actorId"    TEXT         REFERENCES "users"("id") ON DELETE SET NULL,
  "targetId"   TEXT,
  "targetType" TEXT,
  "meta"       JSONB,
  "ip"         TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "audit_logs_actorId_idx"   ON "audit_logs"("actorId");
CREATE INDEX "audit_logs_action_idx"    ON "audit_logs"("action");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- ── File Upload Fields (papers) ────────────────────────────────────────────

ALTER TABLE "papers"
  ADD COLUMN IF NOT EXISTS "fileUrl"       TEXT,
  ADD COLUMN IF NOT EXISTS "fileKey"       TEXT,
  ADD COLUMN IF NOT EXISTS "fileName"      TEXT,
  ADD COLUMN IF NOT EXISTS "fileMimeType"  TEXT,
  ADD COLUMN IF NOT EXISTS "fileSizeBytes" INTEGER;

-- ── Full-Text Search ───────────────────────────────────────────────────────

-- Add tsvector column
ALTER TABLE "papers"
  ADD COLUMN IF NOT EXISTS "search_vector" TSVECTOR;

-- Backfill existing rows
UPDATE "papers"
SET "search_vector" = to_tsvector('english',
  coalesce(title, '') || ' ' ||
  coalesce(abstract, '') || ' ' ||
  coalesce(domain, '') || ' ' ||
  coalesce(array_to_string(keywords, ' '), '')
);

-- GIN index for fast FTS queries
CREATE INDEX IF NOT EXISTS "papers_search_vector_gin"
  ON "papers" USING GIN("search_vector");

-- Trigger function: keep search_vector in sync on INSERT / UPDATE
CREATE OR REPLACE FUNCTION papers_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.abstract, '') || ' ' ||
    coalesce(NEW.domain, '') || ' ' ||
    coalesce(array_to_string(NEW.keywords, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS papers_search_vector_trigger ON "papers";
CREATE TRIGGER papers_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, abstract, domain, keywords
  ON "papers"
  FOR EACH ROW EXECUTE FUNCTION papers_search_vector_update();
