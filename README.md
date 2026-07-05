<div align="center">

# Lumex Research Portal

**A full-stack academic publishing and peer-review platform**

Peer-reviewed research across every discipline — accessible to researchers, clinicians, and policymakers worldwide.

![Homepage](public/1.jpeg)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748)](https://www.prisma.io)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Submission Workflow](#submission-workflow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Seed Accounts](#seed-accounts)
- [API Reference](#api-reference)
- [AI Integration](#ai-integration)
- [Security](#security)
- [Features by Role](#features-by-role)
- [Knowledge Graph](#knowledge-graph)

---

## Overview

Lumex covers the complete lifecycle of scholarly research — from manuscript submission and structured peer review, through editorial decision-making, to open-access publication and reader discovery. Built solo end-to-end with 180+ API endpoints, a 30-model Prisma schema, and a Feature-Sliced Design frontend.

**Five roles, one platform:**

| Role | Primary Flow |
|------|-------------|
| **Author** | 7-step submission wizard → revision tracking → APC payment |
| **Reviewer** | Invitation → structured scoring → recommendation |
| **Editor** | Reviewer assignment → analytics → accept/reject/revision |
| **Admin** | User management → content moderation → platform config |
| **Reader** | Search → save → alert → purchase |

---

## Screenshots

<table>
<tr>
<td><img src="public/1.jpeg" alt="Homepage"/><br><b>Homepage</b> — hero search, trending articles, platform stats</td>
<td><img src="public/2.jpeg" alt="Editorial Control Center"/><br><b>Editorial Control Center</b> — submission queue, reviewer assignment</td>
</tr>
<tr>
<td><img src="public/3.jpeg" alt="Journal Analytics"/><br><b>Journal Analytics</b> — submission trends, acceptance rate, processing efficiency</td>
<td><img src="public/4.jpeg" alt="Reviewer Workspace"/><br><b>Reviewer Workspace</b> — active review queue with deadlines</td>
</tr>
<tr>
<td><img src="public/5.jpeg" alt="Journal Page"/><br><b>Journal Detail</b> — impact factor, volumes, editorial board</td>
<td><img src="public/6.jpeg" alt="Browse Journals"/><br><b>Browse Journals</b> — alphabetical and discipline-based browsing</td>
</tr>
<tr>
<td><img src="public/7.jpeg" alt="User Dashboard"/><br><b>User Dashboard</b> — saved articles, research history, alerts, orders</td>
<td><img src="public/8.jpeg" alt="Submission Wizard"/><br><b>Submission Wizard</b> — 7-step manuscript submission flow</td>
</tr>
</table>

---

## Tech Stack

### Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 20 (ESM modules) |
| Framework | Express.js v5 |
| Language | TypeScript 5.9 (strict) |
| Database | PostgreSQL 14+ / Neon serverless |
| ORM | Prisma v7 (adapter switching: `@prisma/adapter-pg` / `@prisma/adapter-neon`) |
| Auth | JWT access tokens (15 min) + opaque refresh tokens (30 days, DB-stored, rotated) |
| File Storage | Supabase Storage — files stored on CDN, only URLs in DB |
| Email | Resend — 15+ fire-and-forget templates |
| Validation | Zod v4 on every request body and query |
| Security | Helmet, CORS, express-rate-limit (5 profiles), token blacklist |
| AI | Groq SDK (Llama 3.3 70B) + Google Generative AI |
| PDF | pdf-parse — text extraction for AI summarization |

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS + Radix UI primitives |
| Client State | Zustand (UI filters, wizard steps, auth) |
| Server State | TanStack Query v5 (cached queries, mutations, optimistic updates) |
| Forms | React Hook Form + Zod (type-safe, schema-validated) |
| Routing | React Router DOM v7 (Data Router) |
| Testing | Vitest + React Testing Library + Playwright E2E |
| Architecture | Feature-Sliced Design (FSD) |
| Dev Mocking | MSW (Mock Service Worker) |

---

## Architecture

### Backend — 4-Layer Module Pattern

Every one of the 18 backend modules follows the same structure:

```
routes.ts       →  URL binding, middleware application, rate limits
controller.ts   →  Zod validation, calls service, formats response via sendSuccess()
service.ts      →  Business logic, Prisma queries, email triggers
schema.ts       →  Zod schemas for request validation
```

This mirrors the frontend's Feature-Sliced Design layers (`pages → features → entities → shared`) — two teams that independently arrived at the same layering principle.

### Frontend — Feature-Sliced Design

```
app/            →  Router, global stores (Zustand), layouts
pages/          →  31 route-level components, thin wrappers
features/       →  Business logic: submission wizard, search, journal-admin
entities/       →  Domain query hooks (TanStack Query), type definitions
widgets/        →  Composite UI blocks: GlobalHeader, SubmissionWizard, MetricsPanel
shared/         →  Atomic UI (Radix+Tailwind), utils, constants, hooks
```

### Caching Strategy

| Layer | Mechanism | TTL |
|-------|-----------|-----|
| Backend — hot routes | In-process `Map`-backed `cached()` helper | 2 min (articles/top), 60 s (homepage, search suggest) |
| Backend — site config | In-process cache | 10 min |
| Frontend | TanStack Query `staleTime` | Per-query (mirrors backend TTLs) |

The backend TTL cache and TanStack Query solve the same problem at different layers — both are read-through caches that serve stale data while revalidating in the background.

---

## Submission Workflow

The submission state machine enforces transitions in the service layer, with explicit status guards before every mutation:

```
                    ┌─────────────────────────────┐
                    │                             │
  Author creates    ▼                             │
  ──────────────► DRAFT ──── submit ──────────► SUBMITTED
                    │                             │
                    │ withdraw                    │ editor assigns reviewer
                    ▼                             ▼
                WITHDRAWN ◄── withdraw ─── UNDER_REVIEW
                                               │         │
                                    accept ◄───┘    ┌────┘ reject
                                       │            │
                                       ▼            ▼
                                   ACCEPTED      REJECTED
                                       │
                                       │ revision_required
                                       ▼
                              REVISION_REQUIRED
                                       │
                                       │ author resubmits
                                       └──────────► SUBMITTED (loop)
```

**State rules enforced in code:**
- Only `DRAFT` submissions can be edited or have files added
- `WITHDRAWN` is terminal — only available from `DRAFT` or `SUBMITTED`
- File upload is permitted on `DRAFT` and `REVISION_REQUIRED` only
- Revision resubmission requires at least one file uploaded after the revision was requested
- `ACCEPTED` auto-creates a draft `Article` record in a Prisma transaction; proof approval publishes it

**Email triggers at each transition:**

| Transition | Email sent to |
|-----------|--------------|
| `DRAFT → SUBMITTED` | Author — submission received |
| `SUBMITTED → UNDER_REVIEW` | Author — under review |
| Reviewer assigned | Reviewer — invitation with deadline |
| `→ ACCEPTED` | Author — accepted |
| `→ REJECTED` | Author — rejected with reason |
| `→ REVISION_REQUIRED` | Author — revision notes |
| `→ WITHDRAWN` | Author — withdrawal confirmed |

All emails are fire-and-forget (`void sendEmail(...)`) — they never block the HTTP response.

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── modules/            # 18 feature modules
│   │   │   ├── auth/           # register, login, logout, refresh, reset
│   │   │   ├── articles/       # CRUD, publish, metrics, citations
│   │   │   ├── submissions/    # full submission + review lifecycle
│   │   │   ├── users/          # profile, alerts, bookmarks, dashboard
│   │   │   ├── checkout/       # article purchase + APC + Stripe webhook
│   │   │   ├── ai/             # Groq PDF summarization + Q&A
│   │   │   ├── search/         # full-text + autocomplete
│   │   │   ├── journals/       # journal + issue management
│   │   │   ├── books/          # book + chapter discovery
│   │   │   ├── collections/    # article collections
│   │   │   ├── news/           # news CRUD
│   │   │   ├── careers/        # job listings
│   │   │   ├── conferences/    # conference management
│   │   │   ├── contact/        # contact form
│   │   │   ├── homepage/       # aggregated homepage data
│   │   │   ├── site-config/    # KV config store
│   │   │   ├── feeds/          # RSS feeds
│   │   │   ├── authors/        # author profiles
│   │   │   ├── admin/          # admin panel
│   │   │   ├── editor/         # legacy paper editorial
│   │   │   ├── papers/         # legacy paper CRUD
│   │   │   ├── reviews/        # legacy paper reviews
│   │   │   ├── comments/       # threaded comments
│   │   │   └── sitemap/        # sitemap.xml + robots.txt
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts      # JWT decode, optional auth
│   │   │   ├── role.middleware.ts      # requireRole(...roles)
│   │   │   ├── ratelimit.middleware.ts # 5 rate limit profiles
│   │   │   ├── upload.middleware.ts    # multer (memory storage)
│   │   │   └── error.middleware.ts     # AppError → JSON response
│   │   ├── utils/
│   │   │   ├── apiResponse.ts   # sendSuccess() — the #1 god node
│   │   │   ├── email.ts         # 15+ Resend templates
│   │   │   ├── cache.ts         # in-process TTL cache
│   │   │   ├── storage.ts       # Supabase upload/delete/signedUrl
│   │   │   ├── alertDigest.ts   # match articles → user alerts → digest email
│   │   │   ├── tokenBlacklist.ts # in-memory access token revocation
│   │   │   └── jwt.ts           # sign/verify access + refresh tokens
│   │   └── config/
│   │       ├── env.ts           # Zod-validated env vars
│   │       └── prisma.ts        # PrismaClient singleton with adapter
│   ├── prisma/
│   │   ├── schema.prisma        # 30 models across 7 domains
│   │   ├── seed.ts              # 9 users, 7 journals, 30 articles, 6 books…
│   │   ├── seed-mock-data.ts    # alternative seed from mock JSON
│   │   └── migrations/          # timestamped SQL migrations
│   └── postman/                 # collection + test shell scripts
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── router/routes.tsx        # 31 routes, protected/guest guards
│   │   │   ├── store/useAuthStore.ts    # Zustand auth state
│   │   │   ├── store/useSearchStore.ts  # search filters
│   │   │   └── layouts/                 # Page, Two-column, Three-column
│   │   ├── pages/               # 31 route components (thin wrappers)
│   │   ├── features/            # business logic
│   │   │   ├── submission/      # 7-step wizard + Zustand store
│   │   │   ├── journal-admin/   # journal + special issue management
│   │   │   ├── search/          # search UI + query layer
│   │   │   ├── article/         # article display features
│   │   │   ├── user/            # dashboard panels
│   │   │   └── editor/          # legacy reviewer assignment
│   │   ├── entities/            # TanStack Query hooks per domain
│   │   ├── widgets/             # GlobalHeader, GlobalFooter, MegaMenu…
│   │   └── shared/
│   │       ├── api/base.ts      # fetchClient() — the #2 god node
│   │       ├── ui/              # 20+ Radix+Tailwind components
│   │       ├── constants/       # routes, disciplines, article types
│   │       └── hooks/           # useMediaQuery, useScrollPosition…
│   └── public/mock-data/        # JSON fixtures for MSW dev mocking
├── generated/prisma/            # generated Prisma client (committed)
├── graphify-out/                # codebase knowledge graph
└── public/                      # screenshots used in this README
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL 14+ (or a [Neon](https://neon.tech) connection string)
- [Supabase](https://supabase.com) project (free tier is fine) for file storage
- [Resend](https://resend.com) API key for email (free tier: 3,000 emails/month)

### 1. Clone and install

```bash
git clone https://github.com/RahulMishra09/Prism---Academic-Publishing-Peer-Review-Platform.git
cd Prism---Academic-Publishing-Peer-Review-Platform

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values (see Environment Variables below)

cp frontend/.env.example frontend/.env
# Edit frontend/.env — only VITE_API_URL is required
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate deploy
```

### 4. Generate Prisma client (if not using the committed one)

```bash
npx prisma generate
```

### 5. Seed the database

```bash
npx tsx prisma/seed.ts
```

Seeds: 9 users · 10 affiliations · 7 journals (with issues + editorial boards) · 30 articles (with authors, references, metrics, figures) · 6 collections · 6 books (with chapters) · 10 news items · 5 careers · 7 conferences · site config · 2 submissions · alerts · orders · 1 legacy paper + review

### 6. Start the servers

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

### Running tests

```bash
# Backend type check
cd backend && npx tsc --noEmit

# Frontend unit tests
cd frontend && npm run test

# Frontend E2E tests
cd frontend && npx playwright test
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# ── Database ──────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/lumex
# For Neon: postgresql://user:password@ep-xxx.neon.tech/lumex?sslmode=require

# ── Auth ──────────────────────────────────────────────────────
JWT_SECRET=your-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters

# ── Supabase (file storage) ───────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_BUCKET=lumex

# ── Email ─────────────────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# ── App ───────────────────────────────────────────────────────
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173

# ── AI (optional — enables /api/ai endpoints) ─────────────────
GROQ_API_KEY=gsk_xxxxxxxxxxxx
GOOGLE_GENERATIVE_AI_KEY=

# ── Payments (optional — enables /api/checkout) ───────────────
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=false
# Set VITE_USE_MOCK=true to use MSW fixtures without a running backend
```

---

## Database Setup

The Prisma schema defines **30 models** across 7 domains:

| Domain | Models |
|--------|--------|
| Users & Auth | `User`, `RefreshToken`, `PasswordResetToken`, `VerificationToken` |
| Publishing | `Journal`, `JournalIssue`, `JournalEditorialBoard`, `Article`, `ArticleAuthor`, `ArticleMetrics`, `ArticleFigure`, `ArticleReference`, `ArticleSupplementary`, `Affiliation` |
| Books | `Book`, `BookAuthor`, `BookChapter`, `BookChapterAuthor` |
| Submissions | `Submission`, `SubmissionFile`, `SubmissionAuthor`, `SubmissionReviewer`, `SubmissionReview` |
| Discovery | `Collection`, `CollectionArticle`, `News`, `Career`, `Conference`, `SiteConfig`, `HomepageContent` |
| Engagement | `Alert`, `Order`, `Subscription`, `UserBookmark`, `UserSavedArticle`, `ViewHistory`, `ContactMessage` |
| Legacy Papers | `Paper`, `ReviewerAssignment`, `Review`, `Comment` |

The Prisma adapter is selected at runtime based on `DATABASE_URL` — `@prisma/adapter-pg` for local PostgreSQL, `@prisma/adapter-neon` for Neon serverless.

---

## Seed Accounts

After running `npx tsx prisma/seed.ts`:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@lumex.io | Admin@123 |
| EDITOR | editor@lumex.io | Editor@123 |
| REVIEWER | rev1@lumex.io | Review@123 |
| AUTHOR | author1@lumex.io | Author@123 |
| READER | reader@lumex.io | Reader@123 |

Additional seeded accounts: `rev2@lumex.io`, `author2@lumex.io`, `author3@lumex.io`, `reader2@lumex.io` — same password pattern as their role.

---

## API Reference

Base URL: `http://localhost:3000`

All authenticated endpoints require `Authorization: Bearer <access_token>`.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register, sends verification email |
| POST | `/login` | — | Returns `{ accessToken, refreshToken }` |
| POST | `/logout` | ✓ | Revokes refresh token + blacklists access token |
| POST | `/refresh` | — | Rotates refresh token |
| GET | `/ip-check` | — | Returns IP geolocation for institutional access |
| POST | `/forgot-password` | — | Sends password reset email |
| POST | `/reset-password` | — | Resets with single-use token |

### Articles — `/api/articles`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | opt | List (paginated, filter by journal/discipline/access/type) |
| GET | `/top` | opt | Trending articles (2 min cache) |
| GET | `/:id` | opt | Article detail — increments `viewCount` |
| POST | `/` | EDITOR+ | Create article |
| PUT | `/:id` | EDITOR+ | Update article |
| PUT | `/:id/publish` | EDITOR+ | Publish — triggers alert digest for all matching users |
| POST | `/:id/download` | opt | Track download |
| GET | `/:id/metrics` | — | View/download/citation counts |

### Submissions — `/api/submissions`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | AUTHOR+ | Create DRAFT submission |
| GET | `/` | AUTHOR+ | List own submissions (EDITOR/ADMIN see all) |
| GET | `/:id` | AUTHOR+ | Get submission |
| PUT | `/:id` | AUTHOR | Update DRAFT |
| PUT | `/:id/submit` | AUTHOR | DRAFT → SUBMITTED (requires ≥1 file) |
| PUT | `/:id/withdraw` | AUTHOR | Withdraw (DRAFT or SUBMITTED only) |
| POST | `/:id/files` | AUTHOR | Upload manuscript file |
| DELETE | `/:id/files/:fileId` | AUTHOR | Delete file |
| GET | `/:id/files` | AUTHOR+ | List files |
| GET | `/:id/files/:fileId/download` | AUTHOR+ | Signed download URL (1 hour) |
| POST | `/:id/authors` | AUTHOR | Add co-author |
| DELETE | `/:id/authors/:coAuthorId` | AUTHOR | Remove co-author |
| PUT | `/:id/under-review` | EDITOR+ | SUBMITTED → UNDER_REVIEW |
| POST | `/:id/assign` | EDITOR+ | Assign reviewer + send invitation email |
| DELETE | `/:id/reviewers/:reviewerId` | EDITOR+ | Remove reviewer |
| GET | `/:id/reviewers` | EDITOR+ | List reviewer assignments |
| PUT | `/:id/decision` | EDITOR+ | ACCEPTED / REJECTED / REVISION_REQUIRED |
| PUT | `/:id/proof` | EDITOR+ | Approve proof → publish article |
| GET | `/:id/reviews` | EDITOR+ | List structured reviews |
| PUT | `/:id/review-status` | REVIEWER | Accept / decline / complete assignment |
| POST | `/:id/review` | REVIEWER | Submit structured review with scores |
| PUT | `/:id/revision` | AUTHOR | Submit revision (REVISION_REQUIRED only) |

### Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/me` | ✓ | Own profile |
| PUT | `/me` | ✓ | Update profile |
| GET | `/dashboard` | ✓ | Stats + recent activity |
| POST | `/alerts` | ✓ | Create keyword/journal/discipline alert |
| GET | `/alerts` | ✓ | List own alerts |
| DELETE | `/alerts/:id` | ✓ | Delete alert |
| GET | `/orders` | ✓ | Order history |
| GET | `/submissions` | ✓ | Own submission list |
| POST | `/history` | ✓ | Record article view |
| POST | `/bookmarks` | ✓ | Bookmark article |
| DELETE | `/bookmarks/:articleId` | ✓ | Remove bookmark |
| POST | `/saved` | ✓ | Save article |
| DELETE | `/saved/:articleId` | ✓ | Remove saved article |

### Reviewer — `/api/submissions` (reviewer-scoped)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/reviewer/dashboard` | REVIEWER | Pending/active/completed counts + recent assignments |
| GET | `/reviewer/:id` | REVIEWER | Submission for review (anonymized) |

### Other Endpoints

| Prefix | Description |
|--------|-------------|
| `/api/journals` | List journals, journal detail with editorial board, articles by issue |
| `/api/books` | Book list, book detail with chapters |
| `/api/chapters` | Chapter detail by DOI |
| `/api/collections` | Collection list, collection detail with grouped articles |
| `/api/search` | Full-text search (60/min), autocomplete suggestions (60 s cache) |
| `/api/news` | Published news, admin CRUD |
| `/api/careers` | Active job listings, admin CRUD |
| `/api/conferences` | Conferences by status/discipline |
| `/api/checkout` | Article purchase, APC payment, Stripe webhook |
| `/api/homepage` | Aggregated homepage data (60 s cache) |
| `/api/site-config` | Key-value configuration store |
| `/api/contact` | Contact form — rate limited to 5/hour |
| `/api/ai` | PDF summarization, paper Q&A (Groq Llama 3.3 70B) |
| `/api/feeds` | RSS feeds, activity digests |
| `/api/authors` | Author profiles with publication history |
| `/admin` | User management, platform stats (ADMIN only) |
| `/editor` | Legacy paper editorial tools (EDITOR+) |
| `/sitemap.xml`, `/robots.txt` | SEO |
| `/health` | Database + Supabase connectivity check |

### Rate Limits

| Profile | Limit | Applied to |
|---------|-------|-----------|
| Global | 200 req / 15 min | All routes |
| Auth | 10 req / 15 min | `/api/auth` |
| Search | 60 req / min | `/api/search` |
| Contact | 5 req / hour | `/api/contact` |
| Upload | 20 req / 15 min | File upload endpoints |

---

## AI Integration

The `/api/ai` module uses **Groq's Llama 3.3 70B** for two features: PDF summarization and paper Q&A.

### PDF Summarization

Accepts a PDF or DOCX file buffer. Text is extracted with `pdf-parse` (PDF) or regex-based XML stripping (DOCX), then truncated to 12,000 characters — enough to cover abstract + introduction + conclusion of most papers, which produces better summaries than feeding 80 pages of equations.

The model is prompted at `temperature: 0.3` with a system prompt that mandates a strict JSON schema:

```json
{
  "title": "string",
  "summary": "2–3 sentence overview",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "methodology": "research methodology",
  "conclusion": "1–2 sentences",
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"]
}
```

The response is extracted with `/\{[\s\S]*\}/` as a safety net for when the model wraps output in markdown fences despite instructions. Files with fewer than 50 extracted characters return a 422 — catches scanned-image PDFs before they hit the model.

### Paper Q&A

Same extraction pipeline, different system prompt. Accepts a freeform question alongside the file and returns a focused answer grounded in the paper text.

---

## Security

### Authentication Flow

```
POST /api/auth/login
  → verify password (bcrypt)
  → issue access token  (JWT, 15 min, signed with JWT_SECRET)
  → issue refresh token (opaque UUID, 30 days, stored in DB)
  → return both to client

POST /api/auth/refresh
  → verify refresh token in DB (not expired, not revoked)
  → delete old refresh token (rotation — one-time use)
  → issue new access + refresh token pair

POST /api/auth/logout
  → delete refresh token from DB
  → add access token to in-memory blacklist (TTL = token's remaining lifetime)
```

### Permission System

Route-level guards via `requireRole(...roles)` middleware. Resource-level ownership checks in the service layer. The two layers are independent:

- `requireRole("EDITOR", "ADMIN")` — blocks non-editors at the route
- `submission.submittedBy === userId` — limits authors to their own records inside the service

### Security Headers

Helmet is applied globally. CORS origin allowlist is configurable via `CORS_ORIGINS`. All request bodies are validated with Zod before reaching any service.

---

## Features by Role

### Reader
- Browse articles, journals, books, collections, conferences, and careers
- Full-text search with discipline/access/date filters and autocomplete
- Save articles, bookmark, set keyword and journal alerts
- View research history
- Purchase subscription articles via Stripe

### Author
- 7-step manuscript submission wizard:
  1. Manuscript type (Research Article, Review, Brief Communication, Case Report, Letter, Perspective, Other)
  2. File upload — PDF or DOCX, stored on Supabase CDN
  3. General info — title, abstract, keywords, journal selection
  4. Suggested reviewers
  5. Cover letter and comments to editor
  6. Manuscript metadata
  7. Review and submit
- Co-author management (add/remove during DRAFT)
- Track submission status through the full pipeline
- Submit revisions with rebuttal letter
- Pay APC after acceptance

### Reviewer
- Workspace with Invitations / Active Reviews / History tabs
- Structured review form with 1–10 scores on:
  - Originality, Methodology, Clarity, Significance
  - Recommendation: Accept / Minor Revision / Major Revision / Reject
  - Separate comments for editor (confidential) and author
- Deadline tracking

### Editor
- Manuscript management dashboard — new, unassigned, under review, awaiting decision
- Assign and remove reviewers with optional deadlines
- Journal analytics — submission trends, acceptance rate, avg. decision time, active reviewers, processing efficiency
- Make accept / reject / revision decisions
- Proof approval → auto-publishes the article
- Manage journal issues, special issues, and editorial board

### Admin
- Platform-wide user list with role assignment, ban/unban
- Content management — news, careers, conferences (create/update/delete)
- Site configuration key-value editor
- Contact message inbox with status tracking (open/in-progress/resolved)
- Platform statistics

---

## Knowledge Graph

The [graphify-out/](graphify-out/) directory contains a full knowledge graph of the codebase generated with [Graphify](https://github.com/safishamsi/graphify) — 6,143 nodes, 10,233 edges, 162 communities.

- **[graph.html](graphify-out/graph.html)** — open in any browser for an interactive community-level visualization
- **[GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md)** — god nodes, surprising connections, suggested exploration questions
- **[graph.json](graphify-out/graph.json)** — raw graph data for programmatic querying

**Key findings:**

| Finding | Detail |
|---------|--------|
| God node #1 | `sendSuccess()` — 160 edges, every controller routes through it |
| God node #2 | `fieldErrors()` — 70 edges, central validation error formatter |
| God node #3 | `fetchClient()` — 39 edges, single API gateway on the frontend |
| Surprising connection | Backend 4-layer pattern ↔ Frontend FSD — two independent teams, same architecture |
| Surprising connection | Backend in-process TTL cache ↔ TanStack Query `staleTime` — same caching philosophy at different layers |

---

## License

MIT
