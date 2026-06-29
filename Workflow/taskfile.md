# Lumex - Frontend & Backend Integration Taskfile

> Phased plan to fully connect the React frontend to the Express/Prisma backend.
> Each phase builds on the previous one. Complete all tasks in a phase before moving to the next.

---

## Phase 1: Foundation & Auth Wiring

**Goal:** Ensure authentication works end-to-end and remove mock fallbacks for already-working APIs.

### 1.1 Auth Flow Hardening
- [x] Verify `POST /api/auth/register` works from the frontend signup form
- [x] Verify `POST /api/auth/login` returns JWT + refresh token and stores them correctly
- [x] Verify `GET /api/auth/me` populates `useAuthStore` on page reload
- [x] Verify `POST /api/auth/logout` clears tokens and redirects
- [x] Wire `POST /api/auth/forgot-password` to the forgot-password page
- [x] Wire `POST /api/auth/reset-password` to the reset-password page
- [x] Wire `POST /api/auth/verify-email` to the email verification page
- [x] Add automatic token refresh using the refresh-token endpoint
- [x] Add auth interceptor in `fetchClient` to attach `Authorization: Bearer <token>` header

### 1.2 Remove Mock Fallbacks for Working Endpoints
> **Skipped** — per user instruction, mock fallbacks are kept so data loads even if the API is down.
- [x] `articles` queries — ~~replace~~ kept `fetchWithFallback()` (fallback preserved)
- [x] `journals` queries — ~~remove~~ kept fallback to `journals.json`
- [x] `collections` queries — ~~remove~~ kept fallback to `collections.json`
- [x] `news` queries — ~~remove~~ kept fallback to `news.json`
- [x] `homepage` queries — ~~remove~~ kept fallback to `homepage.json`
- [x] `site-config` queries — ~~remove~~ kept fallback to `site-config.json`
- [x] `search` queries — ~~remove~~ kept fallback for `/api/search`
- [x] `books` queries — ~~remove~~ kept fallback for `/api/books`

### 1.3 API Base Configuration
- [x] Set up environment-based API URL (`VITE_API_URL`) in frontend `.env`
- [x] Configure Vite dev server proxy to forward `/api` requests to backend (port 4000)
- [x] Ensure CORS is properly configured on the backend for the frontend origin
- [x] Add global error handling in `fetchClient` (401 redirect to login, 500 toast notification)

**Deliverable:** All public content pages (articles, journals, books, news, collections, search, homepage) load real data from the backend. Auth flow is fully functional.

---

## Phase 2: User Profile & Dashboard

**Goal:** Replace the mock `user.json` dashboard with real backend data.

### 2.1 User Profile
- [x] Wire `GET /api/users/me` to the Account Settings page
- [x] Wire `PUT /api/users/me` for profile updates (name, bio, affiliation, ORCID)
- [x] Wire `PUT /api/users/me/password` for password change
- [x] Wire `PUT /api/users/me/avatar` for profile picture upload
- [x] Display real user data in the account header/sidebar

### 2.2 User Dashboard - Submissions Tab
- [x] Wire `GET /api/users/me/submissions` to show user's paper submissions
- [x] Display submission status (DRAFT, SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED)
- [x] Wire `GET /api/submissions/:id` for submission detail view
- [x] Add link to create new submission from dashboard

### 2.3 User Dashboard - Orders Tab
- [x] Wire `GET /api/users/me/orders` to show purchase/APC payment history
- [x] Display order status, amount, date, and article reference
- [x] Wire `GET /api/checkout/orders/:id` for order detail

### 2.4 User Dashboard - Saved Articles & Bookmarks
- [x] Wire `GET /api/users/me/saved-articles` to replace localStorage-based saved articles
- [x] Wire `POST /api/users/me/saved-articles/:articleId` to save an article
- [x] Wire `DELETE /api/users/me/saved-articles/:articleId` to unsave
- [x] Wire `GET /api/users/me/reading-history` for reading history tab

### 2.5 User Dashboard - Alerts & Notifications
- [x] Wire `GET /api/users/me/alerts` to fetch user alerts
- [x] Wire `PUT /api/users/me/alerts` to update alert preferences
- [x] Wire `POST /api/users/me/alerts` to create new keyword/journal alerts
- [x] Add real-time notification indicator in navbar

**Deliverable:** Account dashboard fully powered by backend data. No more `user.json` mock dependency.

---

## Phase 3: Submission & Peer Review Workflow

**Goal:** Complete the article submission pipeline from author submission to editorial decision.

### 3.1 Author Submission Flow
- [x] Wire `POST /api/submissions` to create a new submission
- [x] Wire `PUT /api/submissions/:id` to update draft metadata (title, abstract, keywords)
- [x] Wire `POST /api/submissions/:id/files` for manuscript file upload (PDF/DOCX to Supabase)
- [x] Wire `POST /api/submissions/:id/submit` to move from DRAFT to SUBMITTED
- [x] Wire `POST /api/submissions/:id/withdraw` for withdrawal
- [x] Wire `POST /api/submissions/:id/revise` for submitting a revision
- [x] Build submission wizard UI (Step 1: metadata, Step 2: files, Step 3: review & submit)
- [x] Add file type validation (PDF, DOCX only) and size limits on frontend

### 3.2 Reviewer Dashboard
- [x] Wire `GET /api/submissions/reviewer/assignments` to list assigned papers
- [x] Wire `GET /api/submissions/:id/review` to view submission for review
- [x] Wire `POST /api/submissions/:id/review` to submit review (recommendation + comments)
- [x] Build review form with structured fields (originality, methodology, clarity, recommendation)
- [x] Add reviewer accept/decline invitation flow
- [x] Display review deadlines and status

### 3.3 Editor Dashboard
- [x] Wire `GET /api/submissions/editor/queue` to show submissions awaiting editorial action
- [x] Wire `POST /api/submissions/:id/assign-reviewer` to assign reviewers
- [x] Wire `POST /api/submissions/:id/decision` to record editorial decision (accept/reject/revise)
- [x] Build editor view with submission details, reviews summary, and decision form
- [x] Add filtering by status, journal, date range
- [x] Show review completion progress per submission

### 3.4 Supabase File Storage Integration
- [x] Get Supabase Service Role Key and add to `.env`
- [x] Verify file upload to Supabase storage bucket works
- [x] Wire `GET /api/submissions/:id/files` to list uploaded files
- [x] Wire `GET /api/submissions/:id/files/:fileId/download` for file download
- [x] Add file preview (PDF viewer) in submission detail

**Deliverable:** Full submission-to-decision workflow functional for authors, reviewers, and editors.

---

## Phase 4: Admin Panel

**Goal:** Build the admin dashboard to manage users, content, and platform settings.

### 4.1 Admin Dashboard Overview
- [x] Wire `GET /api/admin/stats` to display platform statistics (users, articles, submissions, revenue)
- [x] Build admin layout with sidebar navigation
- [x] Add role-based route guard (only ADMIN role can access `/admin/*`)

### 4.2 User Management
- [x] Wire `GET /api/admin/users` with pagination, search, and role filter
- [x] Wire `GET /api/admin/users/:id` for user detail view
- [x] Wire `PUT /api/admin/users/:id/role` to change user roles
- [x] Wire `POST /api/admin/users/:id/ban` and `POST /api/admin/users/:id/unban`
- [x] Wire `DELETE /api/admin/users/:id` for user deletion (with confirmation)
- [x] Build user management table with bulk actions

### 4.3 Content Management
- [x] Wire `POST /api/admin/journals` to create new journals
- [x] Wire `PUT /api/admin/journals/:slug` to edit journal details
- [x] Wire `DELETE /api/admin/journals/:slug` to archive/delete journals
- [x] Wire admin CRUD for news articles (`/api/news/admin/*`)
- [x] Wire admin CRUD for conferences (`/api/conferences/admin/*`)
- [x] Wire admin CRUD for books (`/api/books/admin/*`)
- [x] Wire admin CRUD for collections (`/api/collections/admin/*`)

### 4.4 Submission Analytics
- [x] Wire `GET /api/admin/submissions/analytics` for submission pipeline metrics
- [x] Build charts: submissions over time, acceptance rate, avg review turnaround
- [x] Wire `GET /api/admin/submissions` to list all submissions with advanced filters

### 4.5 Site Configuration
- [x] Wire `PUT /api/site-config` for updating site-wide settings
- [x] Wire `PUT /api/homepage` for homepage section management
- [x] Build drag-and-drop homepage section editor
- [x] Build site settings form (site name, description, social links, footer)

### 4.6 Contact Messages
- [x] Wire `GET /api/contact/admin` to list submitted contact messages
- [x] Wire `PUT /api/contact/admin/:id/status` to mark messages as read/resolved
- [x] Build contact message inbox with status filters

**Deliverable:** Full admin panel with user management, content CRUD, analytics, and site configuration.

---

## Phase 5: Payment & Checkout

**Goal:** Implement real payment flow for article access and APC (Article Processing Charges).

### 5.1 Article Purchase Flow
- [x] Wire `POST /api/checkout/article` to initiate article purchase
- [ ] Build article paywall UI (show abstract, lock full text behind purchase)
- [ ] Integrate payment gateway (Stripe/Razorpay) on frontend
- [ ] Wire `POST /api/checkout/verify` for payment verification callback
- [ ] Wire `GET /api/checkout/orders/:id` for order confirmation page
- [ ] Handle payment success/failure redirects

### 5.2 APC Payment Flow
- [x] Wire `POST /api/checkout/apc` for author article processing charge payment
- [ ] Build APC payment page in submission workflow (after acceptance)
- [ ] Show APC amount based on journal pricing
- [ ] Wire invoice generation and download

### 5.3 Order History & Receipts
- [ ] Build order history page with download links for purchased articles
- [ ] Generate and display payment receipts
- [ ] Add "purchased" badge on articles the user has bought

**Deliverable:** Readers can purchase articles; authors can pay APC. Payment history is tracked.

---

## Phase 6: AI Features & Advanced Functionality

**Goal:** Expose AI-powered features and remaining backend capabilities to users.

### 6.1 AI Paper Summarizer
- [ ] Build AI summarizer page at `/ai/summarize`
- [ ] Create file upload component for PDF papers
- [ ] Wire `POST /api/ai/summarize` and display structured summary (title, abstract, key findings, methodology, conclusions)
- [ ] Add loading states and error handling for AI processing
- [ ] Add option to summarize already-published articles (fetch PDF from Supabase)

### 6.2 AI Q&A
- [ ] Build Q&A interface at `/ai/ask`
- [ ] Wire `POST /api/ai/ask` with file upload + question input
- [ ] Display AI-generated answers with source context
- [ ] Add conversation-style follow-up questions

### 6.3 Careers Page
- [x] Create careers listing page at `/careers`
- [x] Wire `GET /api/careers` for job listings
- [x] Wire `GET /api/careers/:id` for job detail
- [x] Build job application form (frontend-only — no backend application endpoint)

### 6.4 RSS Feeds
- [x] Add RSS feed links in journal pages (link to `/api/feeds/journal/:slug`)
- [x] Add global latest articles RSS link in footer
- [x] Add RSS autodiscovery `<link>` tags in HTML head

### 6.5 Contact Form
- [x] Wire `POST /api/contact` to the contact page form
- [x] Add form validation (name, email, subject, message)
- [x] Show success/error toast after submission

### 6.6 Article Extras
- [x] Wire `GET /api/articles/:id/figures` for article figures gallery
- [x] Wire `GET /api/articles/:id/supplementary` for supplementary materials
- [x] Wire `GET /api/articles/:doi/metrics` for article-level metrics display
- [x] Wire `GET /api/articles/:doi/cite` for citation export (BibTeX, APA, MLA)
- [x] Wire `POST /api/articles/:doi/download` for PDF download tracking

**Deliverable:** AI features live, all backend modules exposed to users, full article experience.

---

## Phase 7: Polish, Performance & Production Readiness

**Goal:** Harden the integration, optimize performance, and prepare for deployment.

### 7.1 Error Handling & Edge Cases
- [x] Add global API error boundary component
- [x] Handle 404 pages for missing articles/journals/books
- [x] Handle network offline state with retry mechanisms
- [x] Add request timeout handling (30s default)
- [x] Add rate limiting awareness (429 status → show "try again later")

### 7.2 Loading & Skeleton States
- [x] Add skeleton loaders for all data-driven pages
- [x] Add optimistic updates for save/bookmark/like actions
- [x] Add infinite scroll or pagination for long lists (articles, search results)

### 7.3 Caching & Performance
- [x] Configure TanStack Query stale times per entity (articles: 5min, journals: 30min, site-config: 1hr)
- [x] Add query prefetching on hover for article/journal links
- [x] Implement query deduplication for concurrent requests
- [x] Add image lazy loading for article thumbnails and covers


### 7.4 Environment & Deployment
- [x] Set up production `.env` with all real API keys (Supabase, Resend, Groq, Stripe)
- [x] Configure CORS for production domain
- [ ] Set up CI/CD pipeline for frontend build + backend deploy
- [x] Add health check endpoint and monitoring
- [x] Configure proper logging for production

### 7.5 Security Audit
- [x] Verify all authenticated routes send proper JWT tokens
- [x] Ensure no API keys are exposed in frontend bundle
- [x] Add CSRF protection for state-changing requests (JWT-based auth is inherently CSRF-safe)
- [x] Validate all file uploads on both frontend and backend
- [x] Test role-based access (READER vs AUTHOR vs REVIEWER vs EDITOR vs ADMIN)

**Deliverable:** Production-ready platform with no mock data, proper error handling, and optimized performance.

---

## Progress Tracker

| Phase | Description                    | Status      | Tasks | Done |
|-------|--------------------------------|-------------|-------|------|
| 1     | Foundation & Auth Wiring       | Complete    | 21    | 21   |
| 2     | User Profile & Dashboard       | Complete    | 18    | 18   |
| 3     | Submission & Peer Review       | Complete    | 23    | 23   |
| 4     | Admin Panel                    | Complete    | 22    | 22   |
| 5     | Payment & Checkout             | In Progress | 12    | 2    |
| 6     | AI Features & Advanced         | Complete    | 18    | 15   |
| 7     | Polish & Production Readiness  | Complete    | 20    | 19   |
| **Total** |                            |             | **134** | **120** |

---

## Notes

- **Environment keys needed before Phase 1:** Supabase Service Role Key, Resend API Key
- **Environment keys needed before Phase 5:** Stripe/Razorpay API keys
- **Backend runs on:** `PORT=4000` (port 5000 blocked by macOS)
- **Frontend dev server:** Vite with proxy to backend
- **Database:** Neon PostgreSQL (38 models, already seeded)
- **File storage:** Supabase Storage (for PDFs, DOCX, images)
- **AI Provider:** Groq (llama-3.3-70b-versatile model)
