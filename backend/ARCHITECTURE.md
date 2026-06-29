# Lumex Research Portal — Backend Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Request Lifecycle](#request-lifecycle)
4. [Middleware Stack](#middleware-stack)
5. [Module Architecture](#module-architecture)
6. [Database Design](#database-design)
7. [Authentication & Session Management](#authentication--session-management)
8. [Role Permissions Matrix](#role-permissions-matrix)
9. [Workflow State Machines](#workflow-state-machines)
10. [Notification System](#notification-system)
11. [Caching Strategy](#caching-strategy)
12. [Rate Limiting](#rate-limiting)
13. [File Storage](#file-storage)
14. [Alert Digest System](#alert-digest-system)
15. [Folder Structure](#folder-structure)
16. [Environment Variables](#environment-variables)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
│              Web App / Mobile App / API Consumer                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │  HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS API SERVER                         │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Helmet   │  │  CORS    │  │ Morgan   │  │ Rate Limiter │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Route Modules (17)                    │   │
│  │  auth · users · articles · journals · collections       │   │
│  │  books · news · careers · conferences · search          │   │
│  │  submissions · checkout · contact · homepage            │   │
│  │  papers · reviews · editor · admin                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────┐   ┌──────────────────────────────┐   │
│  │    In-Process Cache  │   │   Token Blacklist (in-mem)   │   │
│  │    (TTL Cache)       │   │                              │   │
│  └──────────────────────┘   └──────────────────────────────┘   │
└──────────┬──────────────────────────┬───────────────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────────┐   ┌──────────────────────────────────────┐
│   PostgreSQL (Neon)  │   │          External Services           │
│                      │   │                                      │
│   24 tables          │   │  ┌─────────────┐  ┌─────────────┐  │
│   Prisma v7 ORM      │   │  │   Supabase  │  │   Resend    │  │
│   pg adapter (local) │   │  │   Storage   │  │   (Email)   │  │
│   Neon adapter (prod)│   │  │  PDF/DOCX   │  │  15 templates│  │
└──────────────────────┘   │  └─────────────┘  └─────────────┘  │
                           └──────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Node.js (ESM) | `"type": "module"` — all imports use `.js` extension |
| Language | TypeScript 5.9 | Strict mode; `noEmit` typecheck in CI |
| Framework | Express v5 | Async error propagation, `req.params` typed as `string\|string[]` |
| Database | PostgreSQL 14+ | Neon (cloud) or local |
| ORM | Prisma v7.4 | Driver adapter required; no library engine |
| DB Adapter | `@prisma/adapter-pg` / `@prisma/adapter-neon` | Switched at runtime based on `DATABASE_URL` |
| Auth | JWT (`jsonwebtoken`) | Access token 15 min; refresh token 30 days (DB-stored, rotated) |
| Passwords | bcrypt | 10 salt rounds |
| Validation | Zod v4 | `.safeParse()` on every request body/query |
| File Storage | Supabase Storage | PDF/DOCX files; DB stores URL only |
| File Upload | multer | Memory storage; `@types/multer` |
| Email | Resend | Fire-and-forget; 15 named templates |
| Security | Helmet + cors + express-rate-limit | 5 limiter profiles |
| Logging | Morgan | `dev` format in development |

---

## Request Lifecycle

```
Incoming HTTP Request
        │
        ▼
┌─────────────────────────────────────────────────┐
│  Global middleware (applies to every request)    │
│  1. cors()           — CORS headers              │
│  2. helmet()         — Security headers          │
│  3. morgan()         — Request logging           │
│  4. express.json()   — Parse JSON body           │
│  5. globalLimiter    — 200 req/15 min/IP         │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
               Route-specific limiters
               (authLimiter / searchLimiter / contactLimiter)
                         │
                         ▼
               authenticate middleware
               ┌──────────────────────┐
               │ Read Authorization   │
               │ Verify JWT           │
               │ Set req.user         │
               └──────────┬───────────┘
                          │  (skipped for public routes)
                          ▼
               requireRole(...roles)
               ┌──────────────────────┐
               │ Check req.user.role  │
               │ 403 if not allowed   │
               └──────────┬───────────┘
                          │
                          ▼
               Controller function
               ┌──────────────────────┐
               │ Zod.safeParse(body)  │
               │ 400 on failure       │
               │ Call service fn      │
               └──────────┬───────────┘
                          │
                          ▼
               Service function
               ┌──────────────────────┐
               │ Business logic       │
               │ Prisma queries       │
               │ Cache read/write     │
               │ Fire-and-forget      │
               │  emails / digests    │
               └──────────┬───────────┘
                          │
                          ▼
               sendSuccess(res, {...})
               Standard JSON envelope
                          │
                          ▼
                    Client Response

  Any thrown error → errorHandler middleware
  AppError    → err.statusCode + err.message
  Unexpected  → 500 + safe generic message
```

---

## Middleware Stack

### `authenticate` — `src/middleware/auth.middleware.ts`

```
Authorization: Bearer <access_token>
       │
       ├─ Missing / malformed → 401
       ├─ Token in blacklist  → 401 (logged out)
       ├─ jwt.verify fails    → 401
       └─ Valid               → req.user = { userId, role }
```

### `requireRole(...roles)` — `src/middleware/role.middleware.ts`

Factory: `requireRole("EDITOR", "ADMIN")` returns middleware that checks `req.user.role`.

### `errorHandler` — `src/middleware/error.middleware.ts`

```typescript
class AppError extends Error {
  readonly statusCode: number;  // HTTP status
  readonly code: string;        // Machine-readable code e.g. "NOT_FOUND"
}

// Response shape
{ code: string, message: string, details: null | FieldErrors }
```

### `ratelimit` — `src/middleware/ratelimit.middleware.ts`

| Limiter | Window | Max | Applied to |
|---------|--------|-----|-----------|
| `globalLimiter` | 15 min | 200 | All routes (app-level) |
| `authLimiter` | 15 min | 10 | `/api/auth/*` |
| `searchLimiter` | 1 min | 60 | `/api/search/*` |
| `contactLimiter` | 60 min | 5 | `/api/contact` |
| `uploadLimiter` | 15 min | 20 | File upload routes |

All return `{ code: "RATE_LIMIT_EXCEEDED", message: "..." }` on hit.

### `upload` — `src/middleware/upload.middleware.ts`

multer memory storage; file in `req.file.buffer`. Used on submission file upload routes.

---

## Module Architecture

Each feature module follows a strict 4-layer structure:

```
modules/<feature>/
  ├── <feature>.routes.ts      Route definitions + middleware chaining
  ├── <feature>.controller.ts  Parse request → call service → sendSuccess()
  ├── <feature>.service.ts     Business logic + Prisma + cache + email
  └── <feature>.schema.ts      Zod schemas for body/query validation
```

### Module inventory

| Module | Base Path | Key Responsibilities |
|--------|-----------|---------------------|
| `auth` | `/api/auth` | Register, login, logout, refresh, forgot/reset password |
| `users` | `/api/users` | Profile, dashboard, alerts, orders |
| `articles` | `/api/articles` | List, top, detail, metrics, download tracking, publish |
| `journals` | `/api/journals` | Journal list, detail, articles by journal |
| `collections` | `/api/collections` | Collection list + article members |
| `books` | `/api/books` | Book list, detail, chapters |
| `news` | `/api/news` | Published news items |
| `careers` | `/api/careers` | Active job listings |
| `conferences` | `/api/conferences` | Conferences by status/discipline |
| `search` | `/api/search` | Full-text + faceted search, suggestions |
| `homepage` | `/api/homepage` | Aggregated homepage payload (cached) |
| `site-config` | `/api/site-config` | Key-value config store (cached) |
| `contact` | `/api/contact` | Contact form + dual confirmation emails |
| `submissions` | `/api/submissions` | Full submission lifecycle (8 status transitions) |
| `checkout` | `/api/checkout` | Article purchase, APC payment, order completion |
| `papers` | `/papers` | Legacy internal paper workflow (CRUD + review) |
| `reviews` | `/reviews` | Reviewer dashboard, assignments, submit review |
| `editor` | `/editor` | Editor paper management, reviewer assignment |
| `admin` | `/admin` | User list, ban/unban, role change, platform stats |

---

## Database Design

### Adapter selection (`src/config/prisma.ts`)

```typescript
if (DATABASE_URL.includes("neon.tech")) {
  // Cloud: WebSocket adapter for Neon serverless
  adapter = new PrismaNeon({ connectionString: DATABASE_URL });
} else {
  // Local / other: standard pg adapter
  adapter = new PrismaPg({ connectionString: DATABASE_URL });
}
return new PrismaClient({ adapter, log });
```

### Schema at a glance (24 models)

```
USERS & AUTH
  users                  id, name, email, password, role, isBanned
  refresh_tokens         id, token, expiresAt, isRevoked, userId
  password_reset_tokens  id, token, expiresAt, used, userId

LEGACY PAPER WORKFLOW
  papers                 id, title, abstract, domain, keywords, status, fileUrl, aiSummary, embedding
  reviewer_assignments   id, paperId, reviewerId, status
  reviews                id, paperId, reviewerId, assignmentId, strengths, weaknesses, score, recommendation
  comments               id, paperId, authorId, parentId, body

PUBLISHING CONTENT
  journals               id, slug, title, discipline, issn, impactFactor, isOpenAccess
  journal_issues         id, journalId, volume, issue, year, publishedAt
  journal_editorial_board id, journalId, name, title, institution
  affiliations           id, name, department, country
  articles               id, doi, title, abstract, keywords, discipline, articleType, accessType
                         pdfUrl, isPublished, viewCount, downloadCount, citationCount, isTrending
  article_authors        id, articleId, affiliationId, firstName, lastName, orcid, isCorresponding
  article_references     id, articleId, text, doi, order
  article_metrics        id, articleId, viewCount, downloadCount, citationCount, shareCount
  collections            id, slug, title, discipline, isActive
  collection_articles    id, collectionId, articleId, order
  books                  id, isbn, title, discipline, isOpenAccess
  book_chapters          id, bookId, doi, title, abstract, pdfUrl

PLATFORM
  news                   id, slug, title, summary, content, category, isPublished
  careers                id, title, department, type, isActive, closingDate
  conferences            id, slug, title, status, startDate, endDate, discipline
  site_config            id, key, value
  homepage_content       id, section, content (JSON)
  contact_messages       id, firstName, lastName, email, subject, message, ticketId

SUBMISSION WORKFLOW
  submissions            id, title, abstract, keywords, status, journalSlug, coverLetter
  submission_files       id, submissionId, fileName, fileUrl, mimeType, fileSize, fileType
  submission_authors     id, submissionId, firstName, lastName, email, affiliation

USER ACTIVITY
  alerts                 id, userId, type, query, journalId, discipline
  orders                 id, userId, amount, currency, status, itemType, itemRef, receiptUrl
```

### Key enums

| Enum | Values |
|------|--------|
| `Role` | READER, AUTHOR, REVIEWER, EDITOR, ADMIN |
| `PaperStatus` | DRAFT, SUBMITTED, APPROVED, REJECTED |
| `SubmissionStatus` | DRAFT, SUBMITTED, UNDER_REVIEW, REVISION_REQUIRED, ACCEPTED, REJECTED, WITHDRAWN |
| `AssignmentStatus` | PENDING, COMPLETED |
| `AccessType` | OPEN_ACCESS, SUBSCRIPTION, FREE |
| `ArticleType` | RESEARCH_ARTICLE, REVIEW, EDITORIAL, LETTER, CASE_STUDY, BOOK_REVIEW, CORRECTION |
| `ConferenceStatus` | UPCOMING, ONGOING, PAST, CANCELLED |
| `OrderStatus` | PENDING, COMPLETED, FAILED, REFUNDED |

---

## Authentication & Session Management

### Token strategy

```
Login / Register
       │
       ▼
┌─────────────────────────────────────────────────┐
│  Access Token (JWT, 15 min)                      │
│  Payload: { userId, role, iat, exp }             │
│  Stateless — verified by JWT_SECRET              │
│                                                  │
│  Refresh Token (opaque, 30 days)                 │
│  Stored in: refresh_tokens table                 │
│  Rotated on use (old revoked, new issued)        │
└─────────────────────────────────────────────────┘
       │
       ├─ Access token → Authorization: Bearer <token>
       └─ Refresh token → POST /api/auth/refresh
```

### Logout

```
POST /api/auth/logout
  → Revoke refresh token in DB (isRevoked = true)
  → Add access token jti to in-memory blacklist
  → authenticate middleware checks blacklist on every request
```

### Password reset

```
POST /api/auth/forgot-password { email }
  → Create PasswordResetToken (1-hour TTL, single-use)
  → Send reset link via Resend
  → Always returns 200 (prevents email enumeration)

POST /api/auth/reset-password { token, password }
  → Verify token not used/expired
  → $transaction: update password + mark token used + revoke all refresh tokens
```

---

## Role Permissions Matrix

| Action | READER | AUTHOR | REVIEWER | EDITOR | ADMIN |
|--------|:------:|:------:|:--------:|:------:|:-----:|
| Register / Login | ✓ | ✓ | ✓ | ✓ | ✓ |
| Browse articles, journals, books | ✓ | ✓ | ✓ | ✓ | ✓ |
| View article metrics | ✓ | ✓ | ✓ | ✓ | ✓ |
| Download PDF | ✓ | ✓ | ✓ | ✓ | ✓ |
| Comment on approved papers | ✓ | ✓* | | ✓ | ✓ |
| Create / edit / submit paper (legacy) | | ✓ | | | |
| Submit manuscript (submissions) | | ✓ | | | |
| Withdraw own submission | | ✓ | | | |
| Save alerts | ✓ | ✓ | ✓ | ✓ | ✓ |
| Purchase articles / pay APC | ✓ | ✓ | ✓ | ✓ | ✓ |
| View reviewer dashboard | | | ✓ | | |
| View assigned papers | | | ✓ | | |
| Submit peer review | | | ✓ | | |
| List all submissions | | | | ✓ | ✓ |
| Move submission to UNDER_REVIEW | | | | ✓ | ✓ |
| Make submission decision | | | | ✓ | ✓ |
| Assign / remove paper reviewers | | | | ✓ | ✓ |
| Approve / reject papers (legacy) | | | | ✓ | ✓ |
| Publish articles | | | | ✓ | ✓ |
| List / search all users | | | | | ✓ |
| Ban / unban users | | | | | ✓ |
| Change user roles | | | | | ✓ |
| View platform stats | | | | | ✓ |

*AUTHOR can only comment on their own papers.

---

## Workflow State Machines

### Legacy Paper Workflow

```
                   AUTHOR: POST /papers
                            │
                            ▼
                         DRAFT ◄──── AUTHOR can edit (title, abstract, keywords, domain)
                            │            AUTHOR can upload / delete file
                            │
                   AUTHOR: POST /papers/:id/submit
                   (requires at least one uploaded file)
                            │
                            ▼
                       SUBMITTED ◄──── EDITOR assigns reviewers
                            │              REVIEWER submits reviews
                            │
              ┌─────────────┴─────────────┐
              │  (requires ≥1 completed   │
              │    review)                │
              ▼                           ▼
    EDITOR: approve                EDITOR: reject
              │                           │
              ▼                           ▼
          APPROVED                   REJECTED
    (public, viewCount               (rejectionReason stored,
     increments on read)              email sent to author)
```

### Submission Workflow (new `Submission` model)

```
              AUTHOR: POST /api/submissions
                           │
                           ▼
                        DRAFT ◄──── author can edit, upload files, add co-authors
                           │
              AUTHOR: POST /api/submissions/:id/submit
              (requires ≥1 uploaded file)
                           │
                           ▼
                      SUBMITTED ─────────────────────────────────┐
                           │                                      │
              EDITOR: POST /api/submissions/:id/under-review      │
                           │                               AUTHOR: POST /api/submissions/:id/withdraw
                           ▼                                      │
                      UNDER_REVIEW                                ▼
                           │                                 WITHDRAWN
                           │                              (terminal — no further transitions)
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
    decision=ACCEPTED  decision=REJECTED  decision=REVISION_REQUIRED
             │             │             │
             ▼             ▼             ▼
         ACCEPTED      REJECTED    REVISION_REQUIRED
             │         (terminal)       │
             │                         │  AUTHOR uploads revised files
             │                         └──────────────► SUBMITTED (re-submit)
             │
    AUTHOR: POST /api/checkout/apc/:id  (if open-access)
             │
             ▼
         APC paid → production scheduled
```

Emails are sent at every transition automatically.

### Review Assignment Flow

```
EDITOR: POST /editor/papers/:paperId/assign-reviewer { reviewerId }
                              │
                              ▼
                  ReviewerAssignment created
                     status = PENDING
                              │
                    Email sent to reviewer
                              │
              REVIEWER: POST /reviews/assignments/:assignmentId
                   { strengths, weaknesses, score, recommendation }
                              │
                              ▼ (DB transaction)
                   Review record created
                   Assignment status = COMPLETED
                              │
                    Email sent to paper author
```

---

## Notification System

All emails are **fire-and-forget** (`void promise`) — they never block the HTTP response.
Templates live in `src/utils/email.ts` and share a single branded HTML layout builder.

### Email trigger map

| Trigger | Function | Recipients |
|---------|----------|-----------|
| User registers | `sendWelcomeEmail` | New user |
| Forgot password | `sendPasswordResetEmail` | Requester |
| Paper submitted (legacy) | `sendPaperSubmittedEmail` | Author |
| Paper approved (legacy) | `sendPaperApprovedEmail` | Author |
| Paper rejected (legacy) | `sendPaperRejectedEmail` | Author |
| Reviewer assigned (legacy) | `sendReviewerAssignedEmail` | Reviewer |
| Review submitted (legacy) | `sendReviewSubmittedEmail` | Paper author |
| New comment | `sendNewCommentEmail` | Paper author / parent commenter |
| Submission submitted | `sendSubmissionReceivedEmail` | Author |
| Submission → UNDER_REVIEW | `sendSubmissionUnderReviewEmail` | Author |
| Revision requested | `sendSubmissionRevisionRequiredEmail` | Author (+ editor notes) |
| Submission accepted | `sendSubmissionAcceptedEmail` | Author |
| Submission rejected | `sendSubmissionRejectedEmail` | Author (+ reason) |
| Submission withdrawn | `sendSubmissionWithdrawnEmail` | Author |
| Article order created | `sendOrderConfirmationEmail` | Buyer |
| APC invoice created | `sendApcConfirmationEmail` | Author |
| Order completed | `sendOrderReceiptEmail` | Buyer |
| Alert digest | `sendAlertDigestEmail` | Each user with matched alerts |
| Contact form | (inline) | Support inbox + form submitter |

---

## Caching Strategy

`src/utils/cache.ts` — a zero-dependency in-memory TTL cache backed by a `Map`.

```typescript
// Generic cache-aside pattern
const data = await cached("key", TTL_MS, () => expensiveDbQuery());

// Manual invalidation
cache.del("site-config:all");       // exact key
cache.invalidate("top:");           // all keys with prefix
```

### Cache entries

| Key pattern | TTL | Bust on |
|-------------|-----|---------|
| `homepage:main` | 60 s | Article published |
| `top:{rankBy}:{limit}:{discipline}` | 2 min | Article published |
| `metrics:{doi}` | 30 s | View/download increment |
| `site-config:all` | 10 min | `setSiteConfig()` |
| `search-suggestions:{q}` | 60 s | — (natural expiry) |

> For multi-instance deployments, replace `TtlCache` in `cache.ts` with a Redis/Upstash adapter — the `cached()` call signature is identical.

---

## Rate Limiting

```
Every request
       │
       ▼
  globalLimiter (200/15 min) ──── 429 → { code: "RATE_LIMIT_EXCEEDED" }
       │
       ├── /api/auth/*     → authLimiter    (10/15 min)
       ├── /api/search/*   → searchLimiter  (60/1 min)
       ├── /api/contact    → contactLimiter (5/hour)
       └── file uploads    → uploadLimiter  (20/15 min)
```

All limiters return:
```json
{ "code": "RATE_LIMIT_EXCEEDED", "message": "..." }
```
with `RateLimit-*` standard headers.

---

## File Storage

Files (PDF, DOCX) are stored in **Supabase Storage**, not in the database.

```
AUTHOR: POST /api/submissions/:id/files  (multipart/form-data)
        POST /papers/:id/upload
                │
                ▼
    multer.memoryStorage() → req.file.buffer
                │
                ▼
    uploadFile(buffer, storagePath, contentType)
    in src/utils/storage.ts
                │
                ▼
    supabase.storage.from(BUCKET).upload(path, buffer)
                │
                ▼
    Public URL stored in papers.fileUrl or submission_files.fileUrl
                │
                ▼
    Client downloads directly from Supabase CDN (server not involved)
```

File deletion calls `supabase.storage.from(BUCKET).remove([path])`.

---

## Alert Digest System

`src/utils/alertDigest.ts` — called by `publishArticle()` whenever an article goes live.

```
publishArticle(articleId)
       │
       ├─ Update DB: isPublished = true
       ├─ Bust cache (top: prefix + homepage:main)
       └─ void dispatchAlertDigest([article])
                       │
                       ▼
        Fetch all Alert records from DB
                       │
                       ▼
        For each alert, test article against it:
          KEYWORD   → title/keywords/discipline contains query
          JOURNAL   → article.journalId === alert.journalId
          DISCIPLINE → article.discipline == alert.discipline (case-insensitive)
          AUTHOR    → keyword match on title (full author DB check TODO)
                       │
                       ▼
        Group matched articles by userId (deduplicated)
                       │
                       ▼
        Send ONE digest email per user (void — fire-and-forget)
```

---

## Folder Structure

```
research-portal/
├── src/
│   ├── app.ts                       Express app setup + route mounting
│   ├── server.ts                    Entry point (app.listen)
│   │
│   ├── config/
│   │   ├── env.ts                   Env validation + typed export
│   │   └── prisma.ts                Singleton PrismaClient (adapter auto-selected)
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       JWT verification → req.user
│   │   ├── role.middleware.ts       requireRole() factory
│   │   ├── error.middleware.ts      Global error handler + AppError class
│   │   ├── ratelimit.middleware.ts  5 rate limiter instances
│   │   └── upload.middleware.ts     multer memory storage instance
│   │
│   ├── modules/
│   │   ├── auth/                    Auth lifecycle
│   │   ├── users/                   User profile, alerts, dashboard
│   │   ├── articles/                Article CRUD, metrics, download, publish
│   │   ├── journals/                Journal + issue + editorial board
│   │   ├── collections/             Article collections
│   │   ├── books/                   Books + chapters
│   │   ├── news/                    News items
│   │   ├── careers/                 Job listings
│   │   ├── conferences/             Academic conferences
│   │   ├── search/                  Full-text search + suggestions
│   │   ├── homepage/                Aggregated homepage data
│   │   ├── site-config/             Key-value config store
│   │   ├── contact/                 Contact form + dual emails
│   │   ├── submissions/             Manuscript submission workflow
│   │   ├── checkout/                Article purchase + APC payment
│   │   ├── papers/                  Legacy internal paper workflow
│   │   ├── reviews/                 Reviewer dashboard + assignments
│   │   ├── editor/                  Editor paper management
│   │   └── admin/                   Admin user management
│   │
│   ├── utils/
│   │   ├── apiResponse.ts           sendSuccess(), fieldErrors()
│   │   ├── cache.ts                 In-process TTL cache + cached() helper
│   │   ├── email.ts                 19 typed email functions + shared layout()
│   │   ├── alertDigest.ts           Alert matching + per-user digest dispatch
│   │   ├── storage.ts               Supabase Storage: uploadFile(), deleteFile()
│   │   ├── jwt.ts                   signToken(), verifyToken()
│   │   ├── hash.ts                  hashPassword(), comparePassword()
│   │   └── tokenBlacklist.ts        In-memory Set for revoked access tokens
│   │
│   ├── types/
│   │   └── express.d.ts             Augments req.user = { userId, role }
│   │
│   └── tests/
│       └── db.test.ts               57 integration tests across 15 groups
│
├── prisma/
│   ├── schema.prisma                Database schema (24 models, 8 enums)
│   ├── seed.ts                      Full sample data seed
│   └── migrations/
│       ├── 20260216052835_init/
│       ├── 20260218061055_add_comments/
│       ├── 20260411000000_lumex_expansion/
│       └── 20260412000000_add_paper_fileurl/
│
├── generated/
│   └── prisma/                      Auto-generated Prisma client (do not edit)
│
├── README.md
├── ARCHITECTURE.md
├── package.json
├── tsconfig.json
└── .env                             Not committed
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | YES | — | PostgreSQL connection string |
| `JWT_SECRET` | YES | — | Access token signing secret |
| `SUPABASE_URL` | YES | — | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | YES | — | Supabase service role key |
| `SUPABASE_BUCKET` | YES | — | Storage bucket name |
| `RESEND_API_KEY` | YES | — | Resend API key |
| `EMAIL_FROM` | YES | — | Sender address e.g. `Lumex <noreply@lumex.io>` |
| `APP_URL` | YES | — | Frontend base URL (used in email links) |
| `PORT` | No | `5000` | Server listen port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `JWT_EXPIRES_IN` | No | `15m` | Access token TTL |
| `REFRESH_TOKEN_EXPIRES` | No | `30d` | Refresh token TTL |
| `CORS_ORIGINS` | No | `*` | Comma-separated allowed origins |
