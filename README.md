# Lumex Research Portal

A full-stack academic publishing and peer-review platform. Lumex covers the complete lifecycle of scholarly research — from manuscript submission and structured peer review, through editorial decision-making, to open-access publication and reader discovery.

![Homepage](public/1.jpeg)

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Seed Accounts](#seed-accounts)
- [API Reference](#api-reference)
- [Features by Role](#features-by-role)
- [Knowledge Graph](#knowledge-graph)

---

## Overview

Lumex Research Portal is built for academic publishers, researchers, reviewers, and readers. It supports:

- **Authors** — multi-step manuscript submission wizard (7 steps), co-author management, file upload, revision tracking
- **Reviewers** — structured peer review with scoring across originality, methodology, clarity, and significance
- **Editors** — reviewer assignment, submission pipeline management, journal analytics
- **Admins** — user management, content moderation, platform configuration
- **Readers** — full-text search, article collections, bookmarks, alerts, and journal browsing

---

## Screenshots

| | |
|---|---|
| ![Homepage Hero](public/1.jpeg) | ![Editorial Control Center](public/2.jpeg) |
| **Homepage** — search over 15M documents, featured articles, trending research | **Editorial Control Center** — manuscript management, reviewer assignment |
| ![Journal Analytics](public/3.jpeg) | ![Reviewer Workspace](public/4.jpeg) |
| **Journal Analytics** — submission trends, acceptance rate, processing efficiency | **Reviewer Workspace** — active review queue with deadlines |
| ![Journal Page](public/5.jpeg) | ![Browse Journals](public/6.jpeg) |
| **Journal Detail** — impact factor, volumes, editorial board, submission guidelines | **Browse Journals** — alphabetical and discipline-based browsing |
| ![User Dashboard](public/7.jpeg) | ![Submission Wizard](public/8.jpeg) |
| **User Dashboard** — saved articles, research history, alerts, orders | **Submission Wizard** — 7-step manuscript submission flow |

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 20 (ESM) |
| Framework | Express.js v5 |
| Language | TypeScript 5.9 |
| Database | PostgreSQL 14+ / Neon serverless |
| ORM | Prisma v7 |
| Auth | JWT (access 15 min) + opaque refresh tokens (30 days) |
| File Storage | Supabase Storage |
| Email | Resend (15+ templates) |
| Validation | Zod v4 |
| Security | Helmet, CORS, express-rate-limit |
| AI | Google Generative AI, Groq SDK |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + Radix UI |
| State | Zustand (client) + TanStack Query v5 (server) |
| Forms | React Hook Form + Zod |
| Routing | React Router DOM v7 |
| Testing | Vitest + Playwright |
| Architecture | Feature-Sliced Design (FSD) |

---

## Project Structure

```
.
├── backend/                  # Express API server
│   ├── src/
│   │   ├── modules/          # 18 feature modules (auth, articles, submissions…)
│   │   ├── middleware/       # auth, role, rate-limit, upload
│   │   ├── utils/            # jwt, email, cache, storage, alertDigest
│   │   └── config/           # env, prisma
│   ├── prisma/
│   │   ├── schema.prisma     # 30+ models
│   │   ├── seed.ts           # full seed with mock data
│   │   └── migrations/
│   └── postman/              # API collection + test scripts
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── app/              # router, stores, layouts
│   │   ├── pages/            # 31 routes
│   │   ├── features/         # business logic modules
│   │   ├── entities/         # domain query hooks
│   │   ├── widgets/          # composite UI blocks
│   │   └── shared/           # UI components, utils, constants
│   └── public/mock-data/     # MSW mock fixtures
├── generated/prisma/         # Prisma generated client
├── graphify-out/             # Codebase knowledge graph
│   ├── graph.html            # Interactive graph (open in browser)
│   ├── graph.json            # Raw graph data (6,143 nodes)
│   └── GRAPH_REPORT.md       # Architecture audit report
└── public/                   # Screenshots
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL 14+ (or a [Neon](https://neon.tech) connection string)
- A [Supabase](https://supabase.com) project for file storage
- A [Resend](https://resend.com) API key for email

### 1. Clone and install

```bash
git clone https://github.com/RahulMishra09/Prism---Academic-Publishing-Peer-Review-Platform.git
cd Prism---Academic-Publishing-Peer-Review-Platform

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in DATABASE_URL, JWT_SECRET, SUPABASE_*, RESEND_API_KEY (see below)

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate deploy
```

### 4. Seed the database

```bash
npx tsx prisma/seed.ts
```

This creates 9 users, 7 journals, 30 articles, 6 collections, 6 books, 10 news items, 5 careers, 7 conferences, and all supporting data.

### 5. Start the servers

```bash
# Backend (port 3000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lumex

# Auth
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Supabase (file storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_BUCKET=lumex

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# App
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173

# Optional — AI features
GOOGLE_GENERATIVE_AI_KEY=
GROQ_API_KEY=

# Optional — Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=false
```

---

## Database Setup

The Prisma schema defines **30+ models** across these domains:

| Domain | Models |
|--------|--------|
| Users & Auth | `User`, `RefreshToken`, `PasswordResetToken`, `VerificationToken` |
| Publishing | `Journal`, `JournalIssue`, `JournalEditorialBoard`, `Article`, `ArticleAuthor`, `ArticleMetrics`, `ArticleFigure`, `ArticleReference`, `ArticleSupplementary`, `Affiliation` |
| Books | `Book`, `BookAuthor`, `BookChapter`, `BookChapterAuthor` |
| Submissions | `Submission`, `SubmissionFile`, `SubmissionAuthor`, `SubmissionReviewer`, `SubmissionReview` |
| Discovery | `Collection`, `CollectionArticle`, `News`, `Career`, `Conference`, `SiteConfig`, `HomepageContent` |
| Engagement | `Alert`, `Order`, `Subscription`, `UserBookmark`, `UserSavedArticle`, `ViewHistory`, `ContactMessage` |
| Legacy Papers | `Paper`, `ReviewerAssignment`, `Review`, `Comment` |

---

## Seed Accounts

After running `npx tsx prisma/seed.ts`, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@lumex.io | Admin@123 |
| EDITOR | editor@lumex.io | Editor@123 |
| REVIEWER | rev1@lumex.io | Review@123 |
| AUTHOR | author1@lumex.io | Author@123 |
| READER | reader@lumex.io | Reader@123 |

> Additional seeded accounts: `rev2@lumex.io`, `author2@lumex.io`, `author3@lumex.io`, `reader2@lumex.io` — all use the same password pattern as their role.

---

## API Reference

Base URL: `http://localhost:3000`

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns access + refresh tokens |
| POST | `/api/auth/logout` | Revoke refresh token |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |

### Articles
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/articles` | List articles (paginated, filterable) |
| GET | `/api/articles/top` | Trending articles (2 min cache) |
| GET | `/api/articles/:id` | Article detail (increments views) |
| POST | `/api/articles` | Create article (EDITOR+) |
| PUT | `/api/articles/:id/publish` | Publish + trigger alert digests |

### Submissions
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/submissions` | Create draft submission |
| PUT | `/api/submissions/:id` | Update draft |
| POST | `/api/submissions/:id/files` | Upload manuscript file |
| POST | `/api/submissions/:id/authors` | Add co-author |
| PUT | `/api/submissions/:id/submit` | Submit for review |
| PUT | `/api/submissions/:id/assign` | Assign reviewer (EDITOR+) |
| PUT | `/api/submissions/:id/decision` | Accept/Reject/Revision (EDITOR+) |
| PUT | `/api/submissions/:id/withdraw` | Withdraw submission |

### Other Endpoints
- `/api/journals` — journal list and detail
- `/api/books`, `/api/chapters` — book and chapter discovery
- `/api/collections` — article collections
- `/api/search` — full-text search with autocomplete
- `/api/users/dashboard` — user stats and activity
- `/api/users/alerts` — CRUD for keyword/journal alerts
- `/api/news`, `/api/careers`, `/api/conferences` — content APIs
- `/api/checkout` — article purchase and APC payment
- `/api/homepage`, `/api/site-config` — CMS endpoints
- `/api/contact` — contact form (rate limited: 5/hour)
- `/admin` — admin panel (ADMIN only)
- `/api/ai` — AI-powered summaries and recommendations
- `/sitemap.xml`, `/robots.txt` — SEO

### Rate Limits
| Profile | Limit |
|---------|-------|
| Global | 200 req / 15 min |
| Auth | 10 req / 15 min |
| Search | 60 req / min |
| Contact | 5 req / hour |
| Upload | 20 req / 15 min |

---

## Features by Role

### Reader
- Browse articles, journals, books, and collections
- Full-text search with filters and autocomplete
- Save articles and set keyword/journal alerts
- Purchase subscription articles
- View research history

### Author
- 7-step manuscript submission wizard
  1. Article type selection
  2. File upload (PDF / DOCX)
  3. General info (title, abstract, keywords)
  4. Suggested reviewers
  5. Cover letter and comments
  6. Manuscript metadata
  7. Review and submit
- Track submission status through the full pipeline
- Receive email notifications at each stage
- Pay APC for accepted open-access papers

### Reviewer
- Workspace with pending invitations, active reviews, and history
- Structured review form with scoring on:
  - Originality, Methodology, Clarity, Significance (1–10)
  - Recommendation: Accept / Minor Revision / Major Revision / Reject
- Deadline tracking

### Editor
- Manuscript management dashboard
- Assign and remove reviewers
- View journal analytics (submission trends, acceptance rate, processing time)
- Make accept/reject/revision decisions
- Manage journal issues and special issues

### Admin
- Platform-wide user management (roles, ban/unban)
- Content management (news, careers, conferences)
- Site configuration key-value store
- Contact message inbox with ticket tracking
- Platform statistics

---

## Knowledge Graph

The [graphify-out/](graphify-out/) directory contains a full knowledge graph of the codebase generated with [Graphify](https://github.com/safishamsi/graphify):

- **[graph.html](graphify-out/graph.html)** — open in browser for an interactive community-level visualization (162 communities, 383 cross-community edges)
- **[GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md)** — architecture audit: god nodes, surprising connections, suggested questions
- **[graph.json](graphify-out/graph.json)** — raw graph (6,143 nodes, 10,233 edges) for programmatic querying

Key findings from the graph:
- `sendSuccess()` is the highest-degree god node (160 edges) — every controller routes through it
- The backend 4-layer pattern (Routes → Controller → Service → Schema) is architecturally equivalent to the frontend's Feature-Sliced Design
- `fetchClient()` (39 edges) is the single API gateway on the frontend — all server calls pass through it

---

## License

MIT
