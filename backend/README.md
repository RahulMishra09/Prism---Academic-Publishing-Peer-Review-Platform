# Lumex Research Portal — Backend

A full-featured academic publishing platform backend built with Node.js, TypeScript, Express v5, Prisma v7, and PostgreSQL.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Run database migrations
npm run db:migrate

# 4. (Optional) Seed with sample data
npm run db:seed

# 5. Start development server
npm run dev
```

Server starts on `http://localhost:5000` (or `PORT` from `.env`).

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run typecheck` | Type-check without emitting files |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate` | Run pending migrations (development) |
| `npm run db:migrate:prod` | Run pending migrations (production) |
| `npm run db:push` | Push schema changes without a migration file |
| `npm run db:reset` | Drop and recreate the database + re-seed |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:test` | Run the full database integration test suite |
| `npm test` | Alias for `db:test` |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js (ESM modules) | ≥ 20 |
| Language | TypeScript | ^5.9 |
| Framework | Express.js | ^5.2 |
| ORM | Prisma | ^7.4 |
| Database | PostgreSQL | 14+ |
| DB Adapter | `@prisma/adapter-pg` (local) / `@prisma/adapter-neon` (cloud) | — |
| Auth | JWT (`jsonwebtoken`) | ^9 |
| Passwords | bcrypt | ^6 |
| Validation | Zod | ^4.3 |
| File Storage | Supabase Storage | — |
| File Upload | multer | ^2 |
| Email | Resend | ^6 |
| Security | Helmet, cors, express-rate-limit | — |
| Logging | Morgan | — |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all required values.

```env
# Server
PORT=5000
NODE_ENV=development

# Database — use postgresql://user@host/db for local, full URL for Neon/Supabase
DATABASE_URL="postgresql://user@localhost:5432/research_portal"

# Auth
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES=30d

# Supabase Storage (for PDF/DOCX uploads)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_BUCKET=research-papers

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=Lumex <noreply@your-domain.com>
APP_URL=http://localhost:3000

# Optional
CORS_ORIGINS=http://localhost:3000,https://your-frontend.com
```

---

## API Overview

All new endpoints are prefixed with `/api`. Legacy internal endpoints retain their original paths.

### Auth — `/api/auth`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/auth/register` | Public | Register — returns access + refresh token; sends welcome email |
| POST | `/api/auth/login` | Public | Login — returns access + refresh token |
| POST | `/api/auth/logout` | Auth | Revoke refresh token + blacklist access token |
| GET | `/api/auth/me` | Auth | Current user profile |
| POST | `/api/auth/refresh` | Public | Rotate refresh token, issue new access token |
| POST | `/api/auth/forgot-password` | Public | Send password reset email |
| POST | `/api/auth/reset-password` | Public | Consume reset token, update password |

### Users — `/api/users`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/users/me` | Auth | Profile |
| PUT | `/api/users/me` | Auth | Update name/email |
| GET | `/api/users/me/dashboard` | Auth | Aggregated stats + recent activity |
| GET | `/api/users/me/submissions` | Auth | Author's submission list |
| GET | `/api/users/me/orders` | Auth | Purchase history |
| GET | `/api/users/me/alerts` | Auth | Saved alerts |
| POST | `/api/users/me/alerts` | Auth | Create alert |
| DELETE | `/api/users/me/alerts/:id` | Auth | Delete alert |

### Articles — `/api/articles`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/articles` | Public | Paginated list with filters |
| GET | `/api/articles/top` | Public | Top N by views/citations/downloads (cached 2 min) |
| GET | `/api/articles/:doi` | Public | Article detail — increments view count |
| GET | `/api/articles/:doi/metrics` | Public | View/download/citation counts (cached 30 s) |
| GET | `/api/articles/:doi/download` | Public | Increment download count + redirect to PDF |
| POST | `/api/articles/:id/publish` | EDITOR, ADMIN | Publish article + trigger alert digests |

### Journals — `/api/journals`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/journals` | Public | List active journals |
| GET | `/api/journals/:slug` | Public | Journal detail with editorial board + issues |
| GET | `/api/journals/:slug/articles` | Public | Articles in journal |

### Collections — `/api/collections`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/collections` | Public | List active collections |
| GET | `/api/collections/:slug` | Public | Collection with articles |

### Books & Chapters — `/api/books`, `/api/chapters`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/books` | Public | List books |
| GET | `/api/books/:isbn` | Public | Book with chapters |
| GET | `/api/chapters/:doi` | Public | Single chapter |

### Search — `/api/search`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/search` | Public | Full-text search across articles, journals, books |
| GET | `/api/search/suggestions` | Public | Autocomplete suggestions (cached) |

### Submissions — `/api/submissions`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/submissions` | AUTHOR | Create draft submission |
| GET | `/api/submissions` | EDITOR, ADMIN | List all submissions |
| GET | `/api/submissions/:id` | Auth | Submission detail (author = own only) |
| PUT | `/api/submissions/:id/draft` | AUTHOR | Update draft |
| POST | `/api/submissions/:id/submit` | AUTHOR | Submit — sends confirmation email |
| POST | `/api/submissions/:id/withdraw` | AUTHOR | Withdraw — sends confirmation email |
| POST | `/api/submissions/:id/files` | AUTHOR | Upload manuscript file |
| DELETE | `/api/submissions/:id/files/:fileId` | AUTHOR | Remove file |
| POST | `/api/submissions/:id/co-authors` | AUTHOR | Add co-author |
| DELETE | `/api/submissions/:id/co-authors/:id` | AUTHOR | Remove co-author |
| POST | `/api/submissions/:id/under-review` | EDITOR, ADMIN | Transition to UNDER_REVIEW — sends email |
| POST | `/api/submissions/:id/decision` | EDITOR, ADMIN | Accept/Reject/RevisionRequired — sends email |

### Reviews (legacy papers workflow) — `/reviews`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/reviews/dashboard` | REVIEWER | Workload summary: stats + pending + recent |
| GET | `/reviews/my-assignments` | REVIEWER | Assigned papers |
| POST | `/reviews/assignments/:id` | REVIEWER | Submit review |
| GET | `/reviews/my-reviews` | REVIEWER | Own submitted reviews |
| GET | `/reviews/papers/:paperId` | AUTHOR, REVIEWER, EDITOR, ADMIN | Reviews for a paper |

### Checkout — `/api/checkout`
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/checkout/article/:doi` | Auth | Purchase subscription article — sends order email |
| POST | `/api/checkout/apc/:submissionId` | Auth | Pay APC for accepted submission — sends APC invoice email |
| POST | `/api/checkout/orders/:id/complete` | Auth | Mark order completed — sends receipt email |
| GET | `/api/checkout/orders/:id/receipt` | Auth | Order receipt |

### Notifications (email triggers summary)
| Event | Template |
|-------|----------|
| User registers | Welcome email |
| Forgot password | Password reset link |
| Paper submitted (legacy) | Submission confirmation |
| Paper approved (legacy) | Approval notice |
| Paper rejected (legacy) | Rejection with feedback |
| Reviewer assigned (legacy) | New assignment email |
| Review submitted (legacy) | Review received email |
| New comment | Comment notification |
| Submission submitted | Submission received + reference ID |
| Submission → UNDER_REVIEW | "Under consideration" email |
| Submission → REVISION_REQUIRED | Revision request with editor notes |
| Submission accepted | Acceptance email |
| Submission rejected | Rejection email with reason |
| Submission withdrawn | Withdrawal confirmation |
| Article order created | Order confirmation |
| APC invoice created | APC invoice with amount |
| Order completed | Payment receipt |
| New articles match alerts | Alert digest email (grouped per user) |

### Other endpoints
| Route | Description |
|-------|-------------|
| `/api/news` | Published news items |
| `/api/careers` | Active job listings |
| `/api/conferences` | Conferences filtered by status/discipline |
| `/api/homepage` | Aggregated homepage data (cached 60 s) |
| `/api/site-config` | Site configuration key-value store (cached 10 min) |
| `/api/contact` | Submit contact form — sends dual emails |
| `/admin` | User management: list, ban/unban, change role, stats |
| `/editor` | Paper management: list, assign/remove reviewers |
| `/papers` | Legacy paper CRUD + submit/approve/reject |
| `GET /health` | Health check |

---

## Rate Limiting

| Limiter | Applies to | Limit |
|---------|-----------|-------|
| Global | All routes | 200 req / 15 min / IP |
| Auth | `/api/auth/*` | 10 req / 15 min / IP |
| Search | `/api/search/*` | 60 req / 1 min / IP |
| Contact | `/api/contact` | 5 req / hour / IP |
| Upload | File upload endpoints | 20 req / 15 min / IP |

All rate-limit responses return `{ code: "RATE_LIMIT_EXCEEDED", message: "..." }`.

---

## Testing

Integration tests cover all 24 database models:

```bash
npm run db:test
```

**57 tests** across 15 groups — Auth/Users, Journals, Articles, Collections, Books, News, Careers, Conferences, SiteConfig, Submissions, Alerts, Orders, Contact Messages, Legacy Papers/Reviews, and Relation/Integrity checks.

All tests clean up after themselves using prefixed test data (`@dbtest.io` emails, `test-*` slugs).

---

## Project Structure

```
research-portal/
├── src/
│   ├── app.ts                    Express app — middleware + route mounting
│   ├── server.ts                 Entry point
│   │
│   ├── config/
│   │   ├── env.ts                Env validation + typed export
│   │   └── prisma.ts             Prisma singleton (pg adapter for local, Neon for cloud)
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts    JWT → req.user
│   │   ├── role.middleware.ts    requireRole() factory
│   │   ├── error.middleware.ts   Global error handler + AppError class
│   │   ├── ratelimit.middleware.ts  Five rate limiters
│   │   └── upload.middleware.ts  multer memory storage
│   │
│   ├── modules/
│   │   ├── auth/                 Register, login, logout, refresh, password reset
│   │   ├── users/                Profile, dashboard, alerts, orders
│   │   ├── articles/             List, top, detail, metrics, download, publish
│   │   ├── journals/             List, detail, articles by journal
│   │   ├── collections/          List, detail with articles
│   │   ├── books/                List, detail, chapters
│   │   ├── news/                 Published news
│   │   ├── careers/              Job listings
│   │   ├── conferences/          Conference listings
│   │   ├── search/               Full-text search + suggestions
│   │   ├── homepage/             Aggregated homepage (cached)
│   │   ├── site-config/          Key-value config (cached)
│   │   ├── contact/              Contact form + dual emails
│   │   ├── submissions/          Full manuscript submission workflow
│   │   ├── checkout/             Article purchase + APC payment
│   │   ├── papers/               Legacy internal paper workflow
│   │   ├── reviews/              Reviewer assignments + dashboard
│   │   ├── editor/               Editor paper management
│   │   └── admin/                Admin user management
│   │
│   ├── utils/
│   │   ├── apiResponse.ts        sendSuccess(), fieldErrors()
│   │   ├── cache.ts              In-process TTL cache with cached() helper
│   │   ├── email.ts              All email templates (15 triggers)
│   │   ├── alertDigest.ts        Alert matching + per-user digest dispatch
│   │   ├── storage.ts            Supabase Storage upload/delete
│   │   ├── jwt.ts                signToken(), verifyToken()
│   │   ├── hash.ts               hashPassword(), comparePassword()
│   │   └── tokenBlacklist.ts     In-memory JWT blacklist for logout
│   │
│   ├── types/
│   │   └── express.d.ts          Augments req.user = { userId, role }
│   │
│   └── tests/
│       └── db.test.ts            57-test integration suite
│
├── prisma/
│   ├── schema.prisma             Database schema (source of truth)
│   ├── seed.ts                   Comprehensive seed script
│   └── migrations/               Applied migration SQL files
│
├── generated/
│   └── prisma/                   Auto-generated Prisma client (do not edit)
│
├── ARCHITECTURE.md               Detailed architecture reference
├── package.json
├── tsconfig.json
└── .env                          Not committed
```

---

## Response Format

All endpoints return a consistent envelope:

```json
{
  "success": true,
  "message": "Human-readable status",
  "data": { }
}
```

Errors:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error",
  "details": null
}
```

Validation errors include field-level details:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "email": ["Invalid email address"],
    "password": ["String must contain at least 8 character(s)"]
  }
}
```
