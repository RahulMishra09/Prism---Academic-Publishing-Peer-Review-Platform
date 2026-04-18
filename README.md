# Prism — Academic Publishing & Peer Review Platform

> *Like light through a prism, research is examined from multiple angles by independent reviewers — revealing its complete spectrum of quality, validity, and contribution.*

Prism is a full-stack academic publishing platform with transparent, double-blind peer review. It covers the complete lifecycle from manuscript submission through editorial decision to public discovery — with role-based access for readers, authors, reviewers, editors, and admins.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Roles & Permissions](#user-roles--permissions)
- [Paper Workflow](#paper-workflow)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)

---

## Features

### Publishing & Review
- **Full paper lifecycle** — DRAFT → SUBMITTED → REVIEWED → APPROVED / REJECTED
- **Double-blind peer review** — reviewer identities hidden from authors
- **Reviewer assignment** — editors assign one or more reviewers per paper
- **Structured reviews** — strengths, weaknesses, numerical score (1–10), recommendation
- **Threaded comments** — nested discussions on approved papers with auth gating
- **DOI support** — articles indexed and searchable by DOI

### Discovery
- **Full-text search** across articles, journals, and disciplines
- **Browse by discipline** — 10+ subject areas with SVG iconography
- **Featured journals** — with impact factor, H5-index, acceptance rate, turnaround metrics
- **Trending research** cards pulled from live backend data
- **Special collections / calls for papers** with deadline tracking

### Frontend UX
- **Editorial-grade design** — EB Garamond headings, Atkinson Hyperlegible body text, Authority Navy palette
- **Discipline tag marquee** — infinite-scroll tag strip on the homepage hero
- **How It Works** — 3-step publishing process with connector line
- **Open Standards trust strip** — COPE, CrossRef DOI, DOAJ, ORCID, PubMed, CC Licensing
- **Responsive dark/light mode** — CSS variable token system with Tailwind v3
- **Role-aware dashboards** — Author, Reviewer, Editor each get tailored views

### Security & Auth
- JWT authentication (stored client-side, sent as `Authorization: Bearer`)
- bcrypt password hashing (10 salt rounds)
- RBAC middleware on every protected route
- Helmet security headers + CORS configuration
- Institutional IP-based access detection

---

## Tech Stack

### Frontend

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 7 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v3 + CSS variables |
| Component primitives | Radix UI |
| State — client | Zustand (with `persist` middleware) |
| State — server | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Routing | React Router DOM v6 |
| SEO | React Helmet Async |

### Backend

| Layer | Library |
|---|---|
| Runtime | Node.js 18+ (ESM) |
| Language | TypeScript (strict) |
| Framework | Express.js v5 |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma v7 |
| Auth | jsonwebtoken + bcrypt |
| Validation | Zod |
| Security | Helmet, CORS, Morgan |

---

## Architecture

### Frontend — Feature-Sliced Design (FSD)

```
frontend/src/
├── app/          # Providers, router, global styles, root stores
├── pages/        # Route-level views (HomePage, ArticlePage, ReviewerDashboard, …)
├── widgets/      # Compositional layout blocks (HomeHero, FeaturedJournals, NewsSection, …)
├── features/     # User interactions (search, submission wizard, auth forms, comments, …)
├── entities/     # Domain models + API queries (article, journal, user, theme, …)
└── shared/       # Base UI components, API client, constants, hooks, styles
```

Each layer may only import from layers below it. Pages compose widgets; widgets compose features and entities; all layers use shared.

### Backend — Module-per-Domain

```
backend/src/
├── modules/
│   ├── auth/       # Register, login, IP-check
│   ├── papers/     # CRUD, submit, approve, reject
│   ├── reviews/    # Assignments, review submission
│   ├── editor/     # Editor dashboard, reviewer assignment
│   └── comments/   # Threaded comment system
├── middleware/     # JWT auth, role guards, error handler
├── config/         # Env, Prisma client
└── utils/          # AppError, response helpers
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database (local, [Neon](https://neon.tech), or Supabase)
- npm

### 1. Clone

```bash
git clone https://github.com/RahulMishra09/Prism---Academic-Publishing-Peer-Review-Platform.git
cd Prism---Academic-Publishing-Peer-Review-Platform
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npx prisma generate
npm run dev            # starts on http://localhost:8080
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:5000 (default)
npm run dev            # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` → `http://localhost:5000` automatically. The `VITE_API_BASE_URL` variable is used for production builds.

---

## Environment Variables

### `backend/.env`

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `PORT` | Server port | `8080` |
| `NODE_ENV` | `development` or `production` | `development` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |

### `frontend/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend base URL (production) | `http://localhost:5000` |

---

## API Reference

All endpoints return `{ success: boolean, message: string, data: T }`.

Protected routes require `Authorization: Bearer <token>`.

### Auth — `/auth`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login, receive JWT |
| GET | `/auth/ip-check` | Public | Institutional access detection |

### Papers — `/papers`

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/papers` | AUTHOR | Create draft paper |
| GET | `/papers/my` | AUTHOR | List own papers |
| GET | `/papers` | All (role-filtered) | List published papers |
| GET | `/papers/:id` | All | Get paper details |
| PATCH | `/papers/:id` | AUTHOR (own draft) | Update draft |
| POST | `/papers/:id/submit` | AUTHOR | Submit for review |
| POST | `/papers/:id/approve` | EDITOR / ADMIN | Approve paper |
| POST | `/papers/:id/reject` | EDITOR / ADMIN | Reject with reason |

### Reviews — `/reviews`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/reviews/my-assignments` | REVIEWER | List assigned papers |
| POST | `/reviews/assignments/:id` | REVIEWER | Submit review |
| GET | `/reviews/my-reviews` | REVIEWER | List submitted reviews |
| GET | `/reviews/papers/:paperId` | EDITOR / ADMIN | All reviews for paper |

### Editor — `/editor`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/editor/papers` | EDITOR / ADMIN | All papers with status filter |
| GET | `/editor/papers/:id` | EDITOR / ADMIN | Paper with reviews |
| POST | `/editor/papers/:id/assign-reviewer` | EDITOR / ADMIN | Assign reviewer |
| GET | `/editor/papers/:id/assignments` | EDITOR / ADMIN | List assignments |
| DELETE | `/editor/papers/:id/assignments/:reviewerId` | EDITOR / ADMIN | Remove pending assignment |

### Comments — `/comments`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/comments/papers/:paperId` | Public | Get comment thread |
| POST | `/comments/papers/:paperId` | Authenticated | Post comment or reply |
| DELETE | `/comments/:commentId` | Owner / ADMIN | Delete comment |

---

## User Roles & Permissions

| Role | Can do |
|---|---|
| **READER** | Browse and search articles, post comments on approved papers |
| **AUTHOR** | Everything READER can do, plus create/edit/submit manuscripts |
| **REVIEWER** | Access assigned papers, submit structured reviews |
| **EDITOR** | Manage all papers, assign reviewers, approve or reject submissions |
| **ADMIN** | Full access across all modules |

---

## Paper Workflow

```
AUTHOR creates draft
       │
       ▼
   [DRAFT]  ──(edit)──▶  [DRAFT]
       │
       │ submit
       ▼
  [SUBMITTED]
       │
       │ editor assigns reviewers
       ▼
  [UNDER REVIEW]
       │
    ┌──┴──┐
    │     │
    ▼     ▼
[APPROVED] [REJECTED]
    │
    ▼
 Public — readable + commentable
```

---

## Database Schema

| Table | Purpose |
|---|---|
| `users` | Accounts with role, hashed password, optional ORCID/institution |
| `papers` | Manuscripts with title, abstract, status, keywords, DOI |
| `reviewer_assignments` | Links reviewers to papers; tracks status (PENDING / COMPLETED) |
| `reviews` | Submitted reviews — strengths, weaknesses, score (1–10), recommendation |
| `comments` | Threaded discussion on approved papers; `parentId` for replies |

Full schema: [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)

---

## Project Structure

```
prism/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/          # auth | papers | reviews | editor | comments
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── ARCHITECTURE.md
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Router, providers, global stores
│   │   ├── pages/            # HomePage, ArticlePage, ReviewerDashboard, EditorDashboard, …
│   │   ├── widgets/          # HomeHero, FeaturedJournals, NewsSection, DisciplineGrid, …
│   │   ├── features/         # search, submission, reviewer, editor, article comments, auth
│   │   ├── entities/         # article, journal, user, theme
│   │   └── shared/           # ui/, api/, constants/, hooks/
│   ├── .env.example
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Roadmap

- [ ] File upload — PDF/DOCX via Supabase Storage or AWS S3
- [ ] Email notifications — submission, assignment, decision alerts
- [ ] Full-text search — PostgreSQL `tsvector` or Meilisearch
- [ ] OpenAPI / Swagger docs
- [ ] Admin panel — user management, role changes, audit logs
- [ ] AI features — abstract summarisation, review quality scoring
- [ ] Rate limiting and refresh token rotation
- [ ] Unit + integration test suite (Vitest, Supertest)
- [ ] Docker Compose for local dev

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Follow existing TypeScript and FSD conventions
4. Test your changes
5. Open a pull request with a clear description

---

## License

ISC

---

*Built with precision. Reviewed with care. Published with confidence.*
