# Research Portal — Backend Architecture

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [How the Server Starts](#how-the-server-starts)
3. [Request Lifecycle](#request-lifecycle)
4. [Where Data Is Stored](#where-data-is-stored)
5. [Database Tables](#database-tables)
6. [Modules & Routes](#modules--routes)
   - [Auth](#auth-module)
   - [Papers](#papers-module)
   - [Reviews](#reviews-module)
7. [Middleware Stack](#middleware-stack)
8. [Authentication & Authorization Flow](#authentication--authorization-flow)
9. [Paper Lifecycle](#paper-lifecycle)
10. [Review Flow](#review-flow)
11. [Role Permissions Matrix](#role-permissions-matrix)
12. [Folder Structure](#folder-structure)
13. [Environment Variables](#environment-variables)
14. [What Is Not Yet Built](#what-is-not-yet-built)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM) |
| Language | TypeScript (strict mode) |
| Framework | Express.js v5 |
| Database | PostgreSQL (hosted on Neon) |
| ORM | Prisma v7 |
| Auth | JWT (jsonwebtoken) |
| Passwords | bcrypt (10 salt rounds) |
| Validation | Zod |
| Security headers | Helmet |
| CORS | cors |
| Logging | Morgan (dev mode) |
| File Storage | Supabase Storage **or** AWS S3 (decision pending) |
| File Upload (server) | multer (multipart/form-data parsing) — not yet installed |

---

## How the Server Starts

```
src/server.ts          ← Entry point. Reads PORT from env, calls app.listen()
    └── src/app.ts     ← Creates Express app, registers middleware and routes
         ├── cors()
         ├── helmet()
         ├── morgan()
         ├── express.json()
         ├── GET /health
         ├── /auth    → auth.routes.ts
         ├── /papers  → papers.routes.ts
         ├── /reviews → reviews.routes.ts
         └── errorHandler (must be last)
```

At startup, `src/config/env.ts` is imported. It validates that `DATABASE_URL`
and `JWT_SECRET` exist in the environment — the process crashes immediately
if either is missing.

---

## Request Lifecycle

Every HTTP request goes through the following pipeline:

```
Client Request
     │
     ▼
cors() + helmet() + morgan()       ← Security headers, CORS, logging
     │
     ▼
express.json()                     ← Parse JSON body
     │
     ▼
Route match (e.g. POST /papers)
     │
     ▼
authenticate middleware            ← Verify JWT, set req.user = { userId, role }
     │
     ▼
requireRole(...) middleware        ← Check role is allowed for this route
     │
     ▼
Controller function                ← Validate input with Zod
     │
     ▼
Service function                   ← Business logic + Prisma DB queries
     │
     ▼
sendSuccess(res, {...})            ← Standardised JSON response
     │
     ▼
Client Response

If anything throws → errorHandler middleware catches it and sends sendError()
```

---

## Where Data Is Stored

Data is split across **two storage systems**:

### 1. PostgreSQL (Neon) — structured data

All relational data lives here. No files, no binary blobs.

| Data | Table | Notes |
|------|-------|-------|
| User accounts | `users` | Passwords are bcrypt hashed, never plaintext |
| JWT tokens | Nowhere | JWTs are stateless; only secret key is stored in env |
| Paper metadata | `papers` | Title, abstract, domain, keywords, status, `fileUrl` |
| Paper file location | `papers.fileUrl` | URL pointing to the file in Supabase/S3 — not the file itself |
| Paper status | `papers.status` | DRAFT / SUBMITTED / APPROVED / REJECTED |
| Reviewer assignments | `reviewer_assignments` | Which reviewer is assigned to which paper |
| Reviews | `reviews` | Strengths, weaknesses, score (1-10), recommendation |

### 2. Supabase Storage or AWS S3 — file storage (planned)

Actual PDF/DOCX files uploaded by authors will be stored in object storage,
**not** in the database. The database only stores the resulting public/signed URL.

| Provider | How it works |
|----------|-------------|
| **Supabase Storage** | Files uploaded to a Supabase bucket. Public or signed URLs returned and saved to `papers.fileUrl` |
| **AWS S3** | Files uploaded to an S3 bucket. Presigned URLs used for both upload and download. URL saved to `papers.fileUrl` |

**Upload flow (planned):**
```
AUTHOR sends multipart/form-data request
    │
    ▼
multer middleware receives the file buffer in memory
    │
    ▼
Service uploads buffer to Supabase Storage / S3
    │
    ▼
Storage returns public/signed URL
    │
    ▼
URL saved to papers.fileUrl in PostgreSQL
    │
    ▼
Client uses the URL to download or preview the file directly from storage
    (server is not involved in file downloads — client hits storage directly)
```

> **Current state:** `fileUrl` field does not yet exist in the schema.
> `multer`, Supabase SDK / AWS SDK are not yet installed.
> The specific provider (Supabase vs AWS S3) has not been finalised.

### Database Connection

```
src/config/prisma.ts
    └── Creates a single PrismaClient instance (singleton pattern)
         └── Reads DATABASE_URL from environment
              └── Connects to PostgreSQL on Neon (serverless)
```

The Prisma client is generated into `/generated/prisma/` from the schema at
`/prisma/schema.prisma`.

---

## Database Tables

### `users`
```
id          String   (cuid, primary key)
name        String
email       String   (unique)
password    String   (bcrypt hash)
role        Role     (READER | AUTHOR | REVIEWER | EDITOR | ADMIN)
isBanned    Boolean  (default false)
createdAt   DateTime
updatedAt   DateTime
```

### `papers`
```
id              String       (cuid, primary key)
title           String       (5–300 chars)
abstract        String       (50–5000 chars)
domain          String
keywords        String[]     (array of strings)
status          PaperStatus  (DRAFT | SUBMITTED | APPROVED | REJECTED)
rejectionReason String?      (set when status = REJECTED)
fileUrl         String?      (PLANNED — URL of uploaded PDF/DOCX stored in Supabase/S3)
aiSummary       String?      (reserved for future AI feature)
embedding       Float[]      (reserved for future vector search)
reviewAISuggestion String?   (reserved for future AI feature)
createdAt       DateTime
updatedAt       DateTime
approvedAt      DateTime?    (set when status = APPROVED)
submittedBy     String       (FK → users.id)
```
Indexes: `status`, `domain`, `createdAt`, `submittedBy`

> `fileUrl` is planned but not yet added to the Prisma schema. A migration
> will be required once the storage provider (Supabase vs AWS S3) is finalised.

### `reviewer_assignments`
```
id          String           (cuid, primary key)
status      AssignmentStatus (PENDING | COMPLETED)
assignedAt  DateTime
paperId     String           (FK → papers.id)
reviewerId  String           (FK → users.id)

Unique constraint: (paperId, reviewerId) — same reviewer can't be assigned twice
```

### `reviews`
```
id             String   (cuid, primary key)
strengths      String
weaknesses     String
score          Int      (1–10)
recommendation String   (ACCEPT | MINOR_REVISION | MAJOR_REVISION | REJECT)
createdAt      DateTime
paperId        String   (FK → papers.id)
reviewerId     String   (FK → users.id)
assignmentId   String   (FK → reviewer_assignments.id, unique 1-to-1)

Unique constraint: (paperId, reviewerId) — one review per reviewer per paper
```

### `comments`
```
id        String   (cuid, primary key)
body      String   (max 2000 chars)
createdAt DateTime
updatedAt DateTime
paperId   String   (FK -> papers.id)
authorId  String   (FK -> users.id)
parentId  String?  (FK -> comments.id, nullable — for threaded replies)
```
Indexes: `paperId`, `authorId`, `parentId`

---

## Modules & Routes

### Auth Module
**Base path:** `/auth`
**Files:** `src/modules/auth/`

| Method | Path | Role | What it does |
|--------|------|------|-------------|
| POST | `/auth/register` | Public | Create account (READER role by default). Returns user + JWT |
| POST | `/auth/login` | Public | Validate credentials. Returns user + JWT |

**Flow:**
```
POST /auth/register
  Body: { name, email, password }
    → Zod validation
    → Check email not already used (409 if duplicate)
    → bcrypt.hash(password, 10)
    → prisma.user.create()
    → signToken({ userId, role })
    → Return { user, token }

POST /auth/login
  Body: { email, password }
    → Zod validation
    → prisma.user.findUnique({ where: { email } })
    → Generic "Invalid email or password" if not found (prevents enumeration)
    → Check isBanned (403 if banned)
    → bcrypt.compare(password, hash)
    → signToken({ userId, role })
    → Return { user, token }
```

---

### Papers Module
**Base path:** `/papers`
**Files:** `src/modules/papers/`

| Method | Path | Role | What it does |
|--------|------|------|-------------|
| POST | `/papers` | AUTHOR | Create new paper in DRAFT status |
| GET | `/papers/my` | AUTHOR | List own papers |
| GET | `/papers` | All authenticated | Paginated list (role-filtered visibility) |
| GET | `/papers/:id` | All authenticated | Single paper detail (role-filtered) |
| PATCH | `/papers/:id` | AUTHOR | Update draft paper (DRAFT status only) |
| POST | `/papers/:id/submit` | AUTHOR | Move paper DRAFT → SUBMITTED |
| POST | `/papers/:id/approve` | EDITOR, ADMIN | Move paper SUBMITTED → APPROVED |
| POST | `/papers/:id/reject` | EDITOR, ADMIN | Move paper SUBMITTED → REJECTED (reason required) |

**Visibility rules for `GET /papers`:**

| Role | Sees |
|------|------|
| AUTHOR | Own papers only (any status) |
| REVIEWER | Only SUBMITTED papers assigned to them |
| READER | Only APPROVED papers |
| EDITOR | All papers (filterable by status/domain) |
| ADMIN | All papers (filterable by status/domain) |

**Approve/Reject guard:** A paper cannot be approved or rejected unless it has
**at least one completed review**. Attempting to do so returns 422.

---

### Reviews Module
**Base path:** `/reviews`
**Files:** `src/modules/reviews/`

| Method | Path | Role | What it does |
|--------|------|------|-------------|
| GET | `/reviews/my-assignments` | REVIEWER | List papers assigned to this reviewer |
| POST | `/reviews/assignments/:assignmentId` | REVIEWER | Submit a review for an assignment |
| GET | `/reviews/my-reviews` | REVIEWER | List reviews this reviewer has submitted |
| GET | `/reviews/papers/:paperId` | AUTHOR, REVIEWER, EDITOR, ADMIN | Get all reviews for a paper |

**Double-blind enforcement:**

| Who reads reviews | What they see |
|-------------------|---------------|
| AUTHOR | Review content (strengths, weaknesses, score) — reviewer identity hidden |
| REVIEWER | Only their own review for that paper |
| EDITOR / ADMIN | Full details including reviewer identity |
| READER | Access denied (403) |

**Submit review flow:**
```
POST /reviews/assignments/:assignmentId
  Body: { strengths, weaknesses, score, recommendation }
    → Verify assignment exists and belongs to this reviewer
    → Verify assignment status is PENDING (not already reviewed)
    → Verify paper is in SUBMITTED status
    → prisma.$transaction([
        prisma.review.create(...),
        prisma.reviewerAssignment.update({ status: COMPLETED })
      ])
    → Return created review
```

Using a **database transaction** ensures the review creation and assignment
status update happen atomically — either both succeed or neither does.

---

### Editor Module
**Base path:** `/editor`
**Files:** `src/modules/editor/`
**Access:** EDITOR and ADMIN only on all routes

| Method | Path | What it does |
|--------|------|-------------|
| GET | `/editor/papers` | Paginated list of all papers (filterable by status/domain) |
| GET | `/editor/papers/:paperId` | Full paper detail with all assignments and reviews |
| POST | `/editor/papers/:paperId/assign-reviewer` | Assign a reviewer to a submitted paper |
| GET | `/editor/papers/:paperId/assignments` | List all reviewer assignments for a paper |
| DELETE | `/editor/papers/:paperId/assignments/:reviewerId` | Remove a PENDING assignment |

**Assign reviewer guards:**
- Paper must be in **SUBMITTED** status
- User must exist and have the **REVIEWER** role
- User must not be banned
- Same reviewer cannot be assigned to the same paper twice (409)

**Remove assignment guard:**
- Assignment must be **PENDING** — cannot remove a reviewer who already submitted a review (422)

**Assign reviewer flow:**
```
POST /editor/papers/:paperId/assign-reviewer
  Body: { reviewerId }
    → Verify paper exists and is SUBMITTED
    → Verify user exists and role === REVIEWER and not banned
    → Check no duplicate assignment (409 if already assigned)
    → prisma.reviewerAssignment.create({ paperId, reviewerId })
    → Return assignment with paper + reviewer details
```

---

### Comments Module
**Base path:** `/comments`
**Files:** `src/modules/comments/`

| Method | Path | Role | What it does |
|--------|------|------|-------------|
| GET | `/comments/papers/:paperId` | All authenticated | Paginated top-level comments + nested replies for an APPROVED paper |
| POST | `/comments/papers/:paperId` | READER, AUTHOR, EDITOR, ADMIN | Post a comment or reply on an APPROVED paper |
| DELETE | `/comments/:commentId` | Owner, EDITOR, ADMIN | Delete a comment (cascades to its replies) |

**Access rules:**
- Comments only allowed on **APPROVED** papers — 403 on any other status
- **REVIEWER** role cannot post comments (they use the Review model)
- **AUTHOR** can only comment on their own papers
- **READER / AUTHOR** can only delete their own comments
- **EDITOR / ADMIN** can delete any comment
- Replies supported via `parentId` — one level of nesting only (cannot reply to a reply)

**Create comment flow:**
```
POST /comments/papers/:paperId
  Body: { body, parentId? }
    → Reject if role === REVIEWER (403)
    → Verify paper exists and status === APPROVED
    → If AUTHOR, verify paper.submittedBy === req.user.userId
    → If parentId provided:
        - Verify parent comment exists and belongs to same paper
        - Verify parent has no parentId (enforce one level of nesting)
    → prisma.comment.create({ body, paperId, authorId, parentId })
    → Return comment with author details
```

**Delete comment flow:**
```
DELETE /comments/:commentId
    → Verify comment exists
    → Verify requester is owner OR role === EDITOR/ADMIN
    → prisma.$transaction([
        prisma.comment.deleteMany({ where: { parentId: commentId } }),
        prisma.comment.delete({ where: { id: commentId } })
      ])
```

---

## Middleware Stack

### `authenticate` — `src/middleware/auth.middleware.ts`
Runs on every protected route.

```
1. Read Authorization header
2. Check format: "Bearer <token>"
3. jwt.verify(token, JWT_SECRET)
4. Decode payload: { userId, role }
5. Set req.user = { userId, role }
6. Call next()

Errors:
  - No header → 401 "No token provided"
  - Bad format → 401 "Malformed authorization header"
  - Expired    → 401 "Token has expired"
  - Invalid    → 401 "Invalid token"
```

### `requireRole(...roles)` — `src/middleware/role.middleware.ts`
Always runs AFTER `authenticate`. Factory function that creates a middleware:

```
requireRole(Role.AUTHOR, Role.EDITOR)
  → Returns middleware that:
      If req.user is missing → 401
      If req.user.role not in [AUTHOR, EDITOR] → 403
      Otherwise → next()
```

### `errorHandler` — `src/middleware/error.middleware.ts`
Registered last in `app.ts`. Catches all errors passed via `next(err)`.

```
If err is AppError (operational):
  → res.status(err.statusCode).json({ success: false, message: err.message })

If unexpected error:
  → Log full stack trace
  → Development: return err.message
  → Production: return "Internal server error" (safe generic message)
```

---

## Authentication & Authorization Flow

```
User registers/logs in
    │
    ▼
Server returns JWT token (signed with JWT_SECRET, expires in 7 days)
    │
    ▼
Client stores token (localStorage / cookie — client's responsibility)
    │
    ▼
Client sends token on every request:
    Authorization: Bearer <token>
    │
    ▼
authenticate middleware verifies token
    │
    ▼
req.user = { userId: "cuid...", role: "AUTHOR" }
    │
    ▼
requireRole checks the role → allow or 403
```

JWTs are **stateless** — the server does not store tokens anywhere.
If a token is stolen, there is currently no revocation mechanism (this is a known gap).

---

## Paper Lifecycle

```
                    AUTHOR creates
                         │
                         ▼
                      DRAFT ──── AUTHOR can edit (title, abstract, domain, keywords)
                         │
                    AUTHOR submits
                         │
                         ▼
                    SUBMITTED ──── EDITOR assigns reviewers
                         │            │
                         │        REVIEWER submits review(s)
                         │
              ┌──────────┴──────────┐
              │                     │
         EDITOR approves       EDITOR rejects
              │                     │
              ▼                     ▼
          APPROVED              REJECTED
     (visible to READERs)  (rejectionReason stored)
```

Rules:
- Paper can only be edited while in **DRAFT** status
- Paper can only be approved/rejected from **SUBMITTED** status
- At least **one completed review** is required before approve/reject
- Once APPROVED or REJECTED, status cannot be changed (no endpoint for it)

---

## Review Flow

```
1. EDITOR calls POST /editor/papers/:paperId/assign-reviewer  { reviewerId }
   → Creates ReviewerAssignment { status: PENDING }

2. REVIEWER calls GET /reviews/my-assignments
   → Sees list of papers assigned to them

3. REVIEWER calls POST /reviews/assignments/:assignmentId
   Body: { strengths, weaknesses, score, recommendation }
   → Creates Review record
   → Updates ReviewerAssignment.status = COMPLETED
   (both in a single DB transaction)

4. EDITOR calls GET /reviews/papers/:paperId
   → Sees all reviews with full reviewer details

5. AUTHOR calls GET /reviews/papers/:paperId
   → Sees review content, reviewer identity is hidden (double-blind)

6. EDITOR calls POST /papers/:id/approve OR /papers/:id/reject
   → Paper status transitions
```

---

## Role Permissions Matrix

| Action | READER | AUTHOR | REVIEWER | EDITOR | ADMIN |
|--------|:------:|:------:|:--------:|:------:|:-----:|
| Register / Login | ✓ | ✓ | ✓ | ✓ | ✓ |
| View approved papers | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create paper | | ✓ | | | |
| Edit own draft | | ✓ | | | |
| Submit own paper | | ✓ | | | |
| View own papers | | ✓ | | | |
| View assigned papers | | | ✓ | | |
| Submit review | | | ✓ | | |
| View own reviews | | | ✓ | | |
| Approve paper | | | | ✓ | ✓ |
| Reject paper | | | | ✓ | ✓ |
| View all papers | | | | ✓ | ✓ |
| View all reviews | | | | ✓ | ✓ |
| Assign reviewers | | | | ✓ | ✓ |
| Ban users | | | | | (no endpoint yet) |
| Change user roles | | | | | (no endpoint yet) |

---

## Folder Structure

```
research-portal/
├── src/
│   ├── app.ts                    Express app setup
│   ├── server.ts                 Entry point (listen)
│   │
│   ├── config/
│   │   ├── env.ts                Env var validation + export
│   │   └── prisma.ts             Prisma singleton client
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts    JWT verification → req.user
│   │   ├── role.middleware.ts    Role guard factory
│   │   └── error.middleware.ts   Global error handler + AppError class
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts    Route definitions
│   │   │   ├── auth.controller.ts  Zod parse → call service
│   │   │   ├── auth.service.ts   Business logic + Prisma queries
│   │   │   └── auth.schema.ts    Zod schemas for register/login
│   │   │
│   │   ├── papers/
│   │   │   ├── papers.routes.ts
│   │   │   ├── papers.controller.ts
│   │   │   ├── papers.service.ts
│   │   │   └── papers.schema.ts
│   │   │
│   │   ├── reviews/
│   │   │   ├── reviews.routes.ts
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   └── reviews.schema.ts
│   │   │
│   │   ├── admin/               EMPTY — not implemented yet
│   │   │   ├── admin.routes.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.schema.ts
│   │   │
│   │   └── editor/
│   │       ├── editor.routes.ts      Route definitions (EDITOR, ADMIN only)
│   │       ├── editor.controller.ts  Request handlers
│   │       ├── editor.service.ts     Business logic + Prisma queries
│   │       └── editor.schema.ts      Zod schemas for assign-reviewer + list filters
│   │
│   ├── types/
│   │   └── express.d.ts         Augments Express Request with req.user
│   │
│   └── utils/
│       ├── apiResponse.ts       sendSuccess(), sendError(), fieldErrors()
│       ├── jwt.ts               signToken(), verifyToken()
│       └── hash.ts              hashPassword(), comparePassword()
│
├── prisma/
│   └── schema.prisma            Database schema (source of truth)
│
├── generated/
│   └── prisma/                  Auto-generated Prisma client (do not edit)
│
├── package.json
├── tsconfig.json
└── .env                         Not committed — copy from .env.example
```

---

## Environment Variables

### Current (required now)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | YES | — | PostgreSQL connection string (Neon) |
| `JWT_SECRET` | YES | — | Secret key for signing JWTs |
| `PORT` | No | `5000` | Port the server listens on |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiry (e.g. `7d`, `24h`, `60m`) |

### Planned — File Storage (add when provider is chosen)

**If using Supabase Storage:**

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | YES | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | YES | Service role key (server-side only, never expose to client) |
| `SUPABASE_BUCKET` | YES | Name of the storage bucket for paper files |

**If using AWS S3:**

| Variable | Required | Description |
|----------|----------|-------------|
| `AWS_ACCESS_KEY_ID` | YES | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | YES | IAM user secret key |
| `AWS_REGION` | YES | S3 bucket region (e.g. `us-east-1`) |
| `AWS_S3_BUCKET` | YES | S3 bucket name |

---

## What Is Not Yet Built

| Feature | Status | Notes |
|---------|--------|-------|
| Reviewer assignment endpoint | Done | `POST /editor/papers/:paperId/assign-reviewer` — fully implemented |
| Admin module | Empty files | User listing, ban/unban, role changes |
| Editor module | Done | Paper listing, detail, assign/remove reviewers — fully implemented |
| Comments system | Done | Full module implemented — list, create, delete with threaded replies |
| File/PDF upload | Planned | Provider chosen: Supabase Storage or AWS S3. Needs: `multer`, SDK install, `fileUrl` schema field, migration, upload endpoint |
| JWT revocation / logout | Not started | Tokens cannot be invalidated before expiry |
| Rate limiting | Not started | No protection against brute force or abuse |
| Email notifications | Not started | Authors not notified on approval/rejection |
| AI features | Schema only | `aiSummary`, `embedding`, `reviewAISuggestion` columns exist but no logic |
| Search | Basic only | Only domain filter; no full-text search on title/abstract |
| Tests | None | No test files exist |
| API docs | None | No Swagger/OpenAPI spec |
