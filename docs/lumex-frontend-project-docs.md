# Lumex Frontend Replica — Project Overview

## Project Goal
Build a pixel-perfect, feature-complete 1:1 frontend replica of lumex.com using React + TypeScript. This document defines the complete project lifecycle, architecture, file structure, libraries, and principles.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS + CSS Modules (for scoped overrides) |
| State Management | Zustand (global) + React Query (server state) |
| Routing | React Router v6 |
| Form Handling | React Hook Form + Zod |
| HTTP Client | Axios + React Query |
| PDF Rendering | react-pdf / pdfjs-dist |
| Rich Text / Abstract Parsing | react-markdown + remark-gfm |
| DOI / Citation Utilities | Custom parsers |
| Virtualization | @tanstack/react-virtual |
| UI Primitives | Radix UI (headless) |
| Icons | react-icons (fa, md sets) |
| Animation | Framer Motion |
| Testing | Vitest + React Testing Library + Playwright (E2E) |
| Linting | ESLint + Prettier + Husky |
| i18n | react-i18next |
| Analytics (mock) | Custom event hook layer |

---

## Architecture Style
**Feature-Sliced Design (FSD)** — Layers: app → pages → widgets → features → entities → shared

---

## Development Principles
1. **Component isolation** — every component is independently renderable with mock data
2. **Type safety** — no `any`, strict TypeScript throughout
3. **Accessibility (WCAG 2.1 AA)** — all interactive elements keyboard navigable
4. **Mobile-first responsive** — mirrors Lumex's breakpoints (sm: 576, md: 768, lg: 992, xl: 1200, 2xl: 1400)
5. **Mock-first** — all data comes from mock JSON/fixtures so backend is not needed
6. **Lazy loading** — route-level code splitting for all pages
7. **SEO-ready** — react-helmet-async for head management
8. **Pixel-perfect** — match Lumex's exact typography, spacing, color tokens
# Lumex Frontend Replica — Complete File Structure

```
lumex-replica/
├── public/
│   ├── favicon.ico
│   ├── lumex-logo.svg
│   └── robots.txt
│
├── src/
│   │
│   ├── app/                          # App-level setup (FSD: app layer)
│   │   ├── App.tsx                   # Root component, router outlet
│   │   ├── main.tsx                  # Entry point
│   │   ├── router.tsx                # All route definitions
│   │   ├── providers.tsx             # All context/provider wrappers
│   │   └── store/
│   │       ├── useAuthStore.ts       # Zustand: auth state
│   │       ├── useCartStore.ts       # Zustand: article purchase cart
│   │       ├── useSearchStore.ts     # Zustand: search filters/query state
│   │       └── useUIStore.ts         # Zustand: modals, drawers, toasts
│   │
│   ├── pages/                        # FSD: pages layer (route-level components)
│   │   ├── HomePage/
│   │   │   ├── index.tsx
│   │   │   ├── HomePage.tsx
│   │   │   └── HomePage.module.css
│   │   ├── JournalHomePage/          # /journal/{journalSlug}
│   │   │   ├── index.tsx
│   │   │   ├── JournalHomePage.tsx
│   │   │   └── JournalHomePage.module.css
│   │   ├── ArticlePage/              # /article/{doi}
│   │   │   ├── index.tsx
│   │   │   ├── ArticlePage.tsx
│   │   │   └── ArticlePage.module.css
│   │   ├── SearchResultsPage/
│   │   │   ├── index.tsx
│   │   │   ├── SearchResultsPage.tsx
│   │   │   └── SearchResultsPage.module.css
│   │   ├── JournalListPage/          # Browse journals A-Z
│   │   │   ├── index.tsx
│   │   │   └── JournalListPage.tsx
│   │   ├── SubjectAreaPage/          # /discipline/{subject}
│   │   │   ├── index.tsx
│   │   │   └── SubjectAreaPage.tsx
│   │   ├── BookPage/                 # /book/{isbn}
│   │   │   ├── index.tsx
│   │   │   └── BookPage.tsx
│   │   ├── BookChapterPage/
│   │   │   ├── index.tsx
│   │   │   └── BookChapterPage.tsx
│   │   ├── ConferencePage/
│   │   │   ├── index.tsx
│   │   │   └── ConferencePage.tsx
│   │   ├── AuthorPage/               # /author/{authorId}
│   │   │   ├── index.tsx
│   │   │   └── AuthorPage.tsx
│   │   ├── InstitutionalPage/        # For library/institutional info
│   │   │   ├── index.tsx
│   │   │   └── InstitutionalPage.tsx
│   │   ├── SubmissionPage/           # Manuscript submission flow
│   │   │   ├── index.tsx
│   │   │   └── SubmissionPage.tsx
│   │   ├── SubmissionGuidelinesPage/
│   │   │   ├── index.tsx
│   │   │   └── SubmissionGuidelinesPage.tsx
│   │   ├── PeerReviewPage/
│   │   │   ├── index.tsx
│   │   │   └── PeerReviewPage.tsx
│   │   ├── EditorialBoardPage/
│   │   │   ├── index.tsx
│   │   │   └── EditorialBoardPage.tsx
│   │   ├── AboutJournalPage/
│   │   │   ├── index.tsx
│   │   │   └── AboutJournalPage.tsx
│   │   ├── OpenAccessPage/
│   │   │   ├── index.tsx
│   │   │   └── OpenAccessPage.tsx
│   │   ├── ArticleAlertsPage/        # Sign up for alerts
│   │   │   ├── index.tsx
│   │   │   └── ArticleAlertsPage.tsx
│   │   ├── MyAccountPage/
│   │   │   ├── index.tsx
│   │   │   └── MyAccountPage.tsx
│   │   ├── LoginPage/
│   │   │   ├── index.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── RegisterPage/
│   │   │   ├── index.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── CheckoutPage/
│   │   │   ├── index.tsx
│   │   │   └── CheckoutPage.tsx
│   │   ├── NotFoundPage/
│   │   │   ├── index.tsx
│   │   │   └── NotFoundPage.tsx
│   │   └── StaticContentPage/        # Generic for T&C, Privacy, etc.
│   │       ├── index.tsx
│   │       └── StaticContentPage.tsx
│   │
│   ├── widgets/                      # FSD: widgets layer (page sections)
│   │   ├── GlobalHeader/
│   │   │   ├── GlobalHeader.tsx      # Top nav: logo, search bar, account
│   │   │   ├── MegaMenu.tsx          # Discipline dropdown mega-menu
│   │   │   ├── TopBanner.tsx         # Institutional/alert banner
│   │   │   └── GlobalHeader.module.css
│   │   ├── GlobalFooter/
│   │   │   ├── GlobalFooter.tsx
│   │   │   └── GlobalFooter.module.css
│   │   ├── JournalSidebar/
│   │   │   ├── JournalSidebar.tsx    # Right sidebar: metrics, info links
│   │   │   └── JournalSidebar.module.css
│   │   ├── ArticleSidebar/
│   │   │   ├── ArticleSidebar.tsx    # Article page TOC + cite/share tools
│   │   │   └── ArticleSidebar.module.css
│   │   ├── SearchFilterPanel/
│   │   │   ├── SearchFilterPanel.tsx # Faceted filter sidebar
│   │   │   └── SearchFilterPanel.module.css
│   │   ├── ArticleHero/
│   │   │   ├── ArticleHero.tsx       # Title, authors, DOI, dates
│   │   │   └── ArticleHero.module.css
│   │   ├── AbstractSection/
│   │   │   ├── AbstractSection.tsx
│   │   │   └── AbstractSection.module.css
│   │   ├── ArticleBody/
│   │   │   ├── ArticleBody.tsx       # Full article content renderer
│   │   │   ├── ArticleSection.tsx    # Individual section
│   │   │   ├── FigureViewer.tsx      # Figure + caption lightbox
│   │   │   ├── TableRenderer.tsx     # Academic table renderer
│   │   │   ├── EquationRenderer.tsx  # Math/LaTeX (katex)
│   │   │   └── ArticleBody.module.css
│   │   ├── ReferencesSection/
│   │   │   ├── ReferencesSection.tsx
│   │   │   └── ReferencesSection.module.css
│   │   ├── CitationTools/
│   │   │   ├── CitationTools.tsx     # Cite, export, share panel
│   │   │   ├── CitationModal.tsx
│   │   │   └── CitationTools.module.css
│   │   ├── RelatedContent/
│   │   │   ├── RelatedContent.tsx    # Related articles widget
│   │   │   └── RelatedContent.module.css
│   │   ├── JournalIssueList/
│   │   │   ├── JournalIssueList.tsx
│   │   │   └── JournalIssueList.module.css
│   │   ├── HomeHero/
│   │   │   ├── HomeHero.tsx
│   │   │   └── HomeHero.module.css
│   │   ├── DisciplineGrid/
│   │   │   ├── DisciplineGrid.tsx
│   │   │   └── DisciplineGrid.module.css
│   │   ├── FeaturedJournals/
│   │   │   ├── FeaturedJournals.tsx
│   │   │   └── FeaturedJournals.module.css
│   │   ├── NewsSection/
│   │   │   ├── NewsSection.tsx
│   │   │   └── NewsSection.module.css
│   │   └── MetricsPanel/
│   │       ├── MetricsPanel.tsx      # Impact factor, CiteScore, etc.
│   │       └── MetricsPanel.module.css
│   │
│   ├── features/                     # FSD: features layer (user interactions)
│   │   ├── search/
│   │   │   ├── SearchBar.tsx         # Main header search bar
│   │   │   ├── AdvancedSearch.tsx    # Advanced search form
│   │   │   ├── SearchSuggestions.tsx # Typeahead dropdown
│   │   │   ├── useSearch.ts          # Search hook
│   │   │   └── searchUtils.ts        # Query param builders
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── OrcidLogin.tsx        # ORCID login button/flow
│   │   │   └── useAuth.ts
│   │   ├── articleAccess/
│   │   │   ├── AccessGate.tsx        # Paywall / open access gate
│   │   │   ├── PDFViewer.tsx         # Inline PDF viewer
│   │   │   ├── HTMLViewer.tsx        # HTML article viewer
│   │   │   ├── DownloadOptions.tsx   # PDF, ePub, RIS, BibTex download
│   │   │   └── useArticleAccess.ts
│   │   ├── submission/
│   │   │   ├── SubmissionWizard.tsx  # Multi-step submission form
│   │   │   ├── Step1_ManuscriptType.tsx
│   │   │   ├── Step2_Authors.tsx
│   │   │   ├── Step3_Upload.tsx
│   │   │   ├── Step4_Metadata.tsx
│   │   │   ├── Step5_Review.tsx
│   │   │   ├── FileUploadZone.tsx    # Drag & drop uploader
│   │   │   └── useSubmission.ts
│   │   ├── alerts/
│   │   │   ├── AlertSignupForm.tsx
│   │   │   └── useAlerts.ts
│   │   ├── bookmarks/
│   │   │   ├── BookmarkButton.tsx
│   │   │   ├── BookmarkList.tsx
│   │   │   └── useBookmarks.ts
│   │   ├── peerReview/
│   │   │   ├── ReviewerDashboard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── usePeerReview.ts
│   │   └── sharing/
│   │       ├── SharePanel.tsx        # Social share: Twitter, LinkedIn, email
│   │       ├── CopyLinkButton.tsx
│   │       └── useSharing.ts
│   │
│   ├── entities/                     # FSD: entities layer (domain models + UI)
│   │   ├── article/
│   │   │   ├── ArticleCard.tsx       # Compact article card (search results)
│   │   │   ├── ArticleCardFull.tsx   # Full-width article listing
│   │   │   ├── ArticleMeta.tsx       # DOI, dates, type badge
│   │   │   ├── AuthorList.tsx        # Rendered author list with links
│   │   │   ├── KeywordList.tsx
│   │   │   ├── ArticleBadge.tsx      # Open Access, Free, etc.
│   │   │   └── types.ts              # Article TS interfaces
│   │   ├── journal/
│   │   │   ├── JournalCard.tsx
│   │   │   ├── JournalBadge.tsx      # Gold OA, Hybrid, etc.
│   │   │   ├── IssueCard.tsx
│   │   │   ├── VolumeList.tsx
│   │   │   └── types.ts
│   │   ├── author/
│   │   │   ├── AuthorCard.tsx
│   │   │   ├── AuthorAffiliation.tsx
│   │   │   ├── ContributionBadge.tsx # CRediT taxonomy badges
│   │   │   └── types.ts
│   │   ├── book/
│   │   │   ├── BookCard.tsx
│   │   │   ├── ChapterCard.tsx
│   │   │   └── types.ts
│   │   ├── citation/
│   │   │   ├── CitationDisplay.tsx   # Formatted citation renderers
│   │   │   ├── ReferenceItem.tsx
│   │   │   └── types.ts
│   │   └── institution/
│   │       ├── InstitutionBadge.tsx
│   │       └── types.ts
│   │
│   ├── shared/                       # FSD: shared layer (reusable across all)
│   │   ├── ui/                       # Primitive UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.module.css
│   │   │   ├── Select/
│   │   │   │   └── Select.tsx
│   │   │   ├── Checkbox/
│   │   │   │   └── Checkbox.tsx
│   │   │   ├── Radio/
│   │   │   │   └── Radio.tsx
│   │   │   ├── Tabs/
│   │   │   │   ├── Tabs.tsx
│   │   │   │   └── Tabs.module.css
│   │   │   ├── Accordion/
│   │   │   │   └── Accordion.tsx
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Modal.module.css
│   │   │   ├── Tooltip/
│   │   │   │   └── Tooltip.tsx
│   │   │   ├── Pagination/
│   │   │   │   ├── Pagination.tsx
│   │   │   │   └── Pagination.module.css
│   │   │   ├── Breadcrumb/
│   │   │   │   └── Breadcrumb.tsx
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── Badge.module.css
│   │   │   ├── Spinner/
│   │   │   │   └── Spinner.tsx
│   │   │   ├── Skeleton/
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Skeleton.module.css
│   │   │   ├── Alert/
│   │   │   │   └── Alert.tsx
│   │   │   ├── Tag/
│   │   │   │   └── Tag.tsx
│   │   │   ├── Divider/
│   │   │   │   └── Divider.tsx
│   │   │   ├── Image/
│   │   │   │   └── Image.tsx        # Lazy-loading image with fallback
│   │   │   ├── Link/
│   │   │   │   └── Link.tsx         # Wrapper for internal/external links
│   │   │   └── ProgressBar/
│   │   │       └── ProgressBar.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Container.tsx         # Max-width wrapper
│   │   │   ├── Grid.tsx              # 12-col grid helper
│   │   │   ├── Stack.tsx             # Flex stack utility
│   │   │   ├── PageLayout.tsx        # Header + main + footer
│   │   │   ├── TwoColumnLayout.tsx   # Content + sidebar
│   │   │   └── ThreeColumnLayout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── apiClient.ts          # Axios instance config
│   │   │   ├── endpoints.ts          # All API endpoint constants
│   │   │   ├── queryKeys.ts          # React Query key factory
│   │   │   └── mockAdapter.ts        # Axios-mock-adapter setup
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useIntersectionObserver.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useSessionStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── usePrevious.ts
│   │   │   ├── useWindowSize.ts
│   │   │   ├── useClickOutside.ts
│   │   │   ├── useKeyPress.ts
│   │   │   ├── useScrollPosition.ts
│   │   │   ├── useCopyToClipboard.ts
│   │   │   └── usePageTitle.ts       # Sets document.title + meta
│   │   │
│   │   ├── utils/
│   │   │   ├── doiUtils.ts           # DOI parsing, formatting, URL gen
│   │   │   ├── citationFormatter.ts  # APA, MLA, Chicago, BibTeX, RIS
│   │   │   ├── abstractParser.ts     # HTML/XML abstract parsing
│   │   │   ├── authorUtils.ts        # Author name formatting
│   │   │   ├── dateUtils.ts          # Date formatting for publications
│   │   │   ├── issnUtils.ts          # ISSN formatting/validation
│   │   │   ├── metricUtils.ts        # Impact factor, quartile display
│   │   │   ├── accessUtils.ts        # Determine article access level
│   │   │   ├── urlUtils.ts           # Route generation helpers
│   │   │   ├── searchQueryUtils.ts   # Parse/stringify search params
│   │   │   ├── fileUtils.ts          # File size, type helpers
│   │   │   ├── xmlParser.ts          # Parse JATS XML article content
│   │   │   └── classNames.ts         # cx() / clsx utility
│   │   │
│   │   ├── constants/
│   │   │   ├── disciplines.ts        # All subject areas/disciplines
│   │   │   ├── languages.ts
│   │   │   ├── licenseTypes.ts       # CC-BY, CC-BY-NC, etc.
│   │   │   ├── articleTypes.ts       # Research, Review, Letter, etc.
│   │   │   ├── contentTypes.ts       # Journal, Book, Conference, etc.
│   │   │   └── routes.ts             # Route path constants
│   │   │
│   │   ├── types/
│   │   │   ├── global.d.ts
│   │   │   ├── api.types.ts          # Generic API response types
│   │   │   ├── search.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── ui.types.ts
│   │   │
│   │   └── styles/
│   │       ├── variables.css         # CSS custom properties (colors, spacing)
│   │       ├── typography.css        # Font imports + type scale
│   │       ├── reset.css
│   │       ├── global.css
│   │       └── lumex-tokens.css   # Lumex brand design tokens
│   │
│   └── mocks/                        # All mock data
│       ├── data/
│       │   ├── articles.mock.ts
│       │   ├── journals.mock.ts
│       │   ├── books.mock.ts
│       │   ├── authors.mock.ts
│       │   ├── searchResults.mock.ts
│       │   ├── disciplines.mock.ts
│       │   ├── editorialBoard.mock.ts
│       │   ├── issues.mock.ts
│       │   └── user.mock.ts
│       ├── handlers/                 # MSW request handlers
│       │   ├── article.handlers.ts
│       │   ├── journal.handlers.ts
│       │   ├── search.handlers.ts
│       │   ├── auth.handlers.ts
│       │   └── submission.handlers.ts
│       └── browser.ts                # MSW browser setup
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│       └── playwright/
│
├── .storybook/                       # Storybook for component docs
│   ├── main.ts
│   └── preview.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```
# Lumex Frontend Replica — Feature Flows

## 1. Home Page Flow
**Route:** `/`
**Components Used:** GlobalHeader → HomeHero → DisciplineGrid → FeaturedJournals → NewsSection → GlobalFooter

**Sections:**
1. Sticky top nav with mega-menu (discipline categories)
2. Hero search bar (journals, articles, books)
3. Browse by discipline grid (25+ disciplines with icons)
4. Featured/highlighted journals carousel
5. Latest news + blog posts
6. Publisher highlights (LumexOpen, LumexLink stats)
7. Footer with links

---

## 2. Journal Home Page Flow
**Route:** `/journal/{journal-slug}`
**Components:** GlobalHeader → JournalHero → Tabs(Articles/Issues/About/Submit) → JournalSidebar → GlobalFooter

**Sections:**
1. Journal cover image + title + ISSN + metrics (Impact Factor, CiteScore)
2. Open Access badge / Access type indicator
3. Tabs:
   - **Articles** — latest published, editor's choice, most accessed
   - **Issues** — volumes/issues archive
   - **About** — aims & scope, editorial board link
   - **Submission Guidelines** — link to submission page
4. Sidebar: metrics, abstracting & indexing, submission link

---

## 3. Article Page Flow
**Route:** `/article/{doi}`
**Components:** GlobalHeader → ArticleHero → Tabs(Abstract/FullText/Figures/References) → ArticleSidebar → CitationTools → RelatedContent → GlobalFooter

**Sections:**
1. Article hero: title, authors (linked), affiliations, dates, DOI, access badge
2. Action bar: Download PDF, HTML, Share, Cite, Bookmark
3. Tabs:
   - **Abstract** — structured abstract with sections
   - **Full Text** (if access) — JATS XML rendered as HTML sections
   - **Figures & Tables** — gallery with captions
   - **References** — numbered refs with DOI links
4. Sticky sidebar TOC (scrollspy)
5. Related articles panel
6. Altmetric/citation count badges

---

## 4. Search Flow
**Route:** `/search?query=...&filters=...`
**Components:** GlobalHeader → SearchFilterPanel → SearchResultsList → Pagination

**Steps:**
1. User types in header search bar → typeahead suggestions appear (debounced 300ms)
2. Submit → navigate to /search with query params
3. Results page: left filter panel, center results, sort controls
4. Filters: Content Type, Discipline, Date Range, Language, Access Type, Journal
5. Each result: ArticleCard or BookCard depending on type
6. Pagination: 20 results per page
7. Advanced search toggle: field-specific search (title, author, abstract, ISSN, DOI)

---

## 5. Article Access & PDF Flow
**Components:** AccessGate → PDFViewer / HTMLViewer → DownloadOptions

**Access Logic (accessUtils.ts):**
- `open_access` → show full HTML + PDF download
- `subscribed` (mock auth) → show full content
- `requires_purchase` → show abstract only + buy button (Checkout page)
- `free_to_read` → full access flagged articles

**PDF Viewer:**
- Uses pdfjs-dist embedded inline
- Page navigation, zoom, full-screen
- Download button

---

## 6. Manuscript Submission Flow
**Route:** `/journal/{slug}/submit`
**Components:** SubmissionWizard (5-step stepper)

**Steps:**
1. **Manuscript Type** — Research Article, Review, Letter, Editorial, Case Study
2. **Authors** — Add/reorder authors, ORCID field, corresponding author flag, affiliations
3. **Upload** — Drag & drop: main doc (DOCX/PDF), figures, supplementary files; file type validation
4. **Metadata** — Title, abstract (with character counter), keywords (tag input), cover letter, suggested reviewers
5. **Review & Submit** — Preview all, agree to T&C, submit button → success state

---

## 7. Editorial Board Page
**Route:** `/journal/{slug}/editors`
**Components:** EditorialBoardPage → AuthorCard grid with role labels (Editor-in-Chief, Section Editor, etc.)

---

## 8. Auth Flow
**Routes:** `/login`, `/register`, `/forgot-password`

**Login Options:**
- Email + password form
- ORCID login button (OAuth mock)
- Institutional access (Shibboleth mock)

**Register:** Full academic profile: name, email, password, affiliation, ORCID, research interests (multi-select disciplines)

---

## 9. My Account Flow
**Route:** `/account` (protected)
**Tabs:** Profile, Saved Articles, Alerts, Submissions, Orders

---

## 10. Open Access / APC Page
**Route:** `/journal/{slug}/open-access`
- APC pricing table
- Waiver/discount info
- License options (CC-BY, CC-BY-NC-ND, etc.)
- FAQ accordion

---

## 11. Browse Journals A–Z
**Route:** `/journals`
- Alphabetical index (A–Z buttons)
- Filter by discipline / access type
- Journal cards in grid

---

## 12. Book / Chapter Flow
**Route:** `/book/{isbn}`, `/chapter/{doi}`
- Book cover, metadata (ISBN, edition, publisher, year)
- Table of contents with chapter links
- Chapter-level access gates
- Citation export same as articles

---

## 13. Checkout / Purchase Flow
**Route:** `/checkout`
- Article purchase: one-time buy
- Rental option (48hr access)
- Institutional invoice option
- Order confirmation page

---

## 14. Article Alerts
**Route:** `/journal/{slug}/alerts`
- Email alert signup for new issues / TOC alerts
- Keyword alerts
- Author alerts

---

## 15. Peer Review Dashboard (Reviewer)
**Route:** `/account/reviews`
- Pending invitations
- Active reviews
- Completed reviews
- ReviewForm: Accept/Decline → Detailed review form with criteria scoring + free text comments

---

## 16. Static Pages
- About Lumex
- Contact Us
- Privacy Policy
- Terms & Conditions
- Cookie Policy
- Accessibility
- Help / FAQ
# Lumex Frontend Replica — Architecture & Design Patterns

## Architecture: Feature-Sliced Design (FSD)

```
app → pages → widgets → features → entities → shared
```

Each layer can only import from layers below it. Never import upward.

| Layer | Role | Imports From |
|-------|------|-------------|
| app | Bootstrap, providers, router | pages, shared |
| pages | Route components | widgets, features, entities, shared |
| widgets | Composite page sections | features, entities, shared |
| features | User interactions/behaviors | entities, shared |
| entities | Business domain components | shared |
| shared | Pure utilities, primitives | nothing |

---

## State Management

### Zustand Stores (Global Client State)

**useAuthStore.ts**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}
```

**useSearchStore.ts**
```typescript
interface SearchState {
  query: string;
  filters: SearchFilters;
  sortBy: SortOption;
  page: number;
  setQuery: (q: string) => void;
  setFilters: (f: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}
```

**useUIStore.ts**
```typescript
interface UIState {
  modals: Record<string, boolean>;
  toasts: Toast[];
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}
```

### React Query (Server State)

All API calls go through React Query hooks:
```
useArticleQuery(doi)          → GET /articles/{doi}
useJournalQuery(slug)         → GET /journals/{slug}
useSearchQuery(params)        → GET /search
useJournalIssuesQuery(slug)   → GET /journals/{slug}/issues
useAuthorQuery(authorId)      → GET /authors/{id}
useBooksQuery(isbn)           → GET /books/{isbn}
useEditorialBoardQuery(slug)  → GET /journals/{slug}/editors
```

---

## Routing Architecture

### Router (router.tsx)
All routes are lazy-loaded with React.lazy + Suspense:
```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
// etc.
```

### Route Structure
```
/                                     → HomePage
/journals                             → JournalListPage
/journal/:slug                        → JournalHomePage
/journal/:slug/articles               → JournalArticlesPage
/journal/:slug/issues                 → JournalIssuesPage
/journal/:slug/volumes/:vol/issues/:iss → IssuePage
/journal/:slug/submit                 → SubmissionPage
/journal/:slug/submission-guidelines  → SubmissionGuidelinesPage
/journal/:slug/editors                → EditorialBoardPage
/journal/:slug/about                  → AboutJournalPage
/journal/:slug/open-access            → OpenAccessPage
/journal/:slug/alerts                 → ArticleAlertsPage
/article/:doi*                        → ArticlePage  (DOI has slashes)
/book/:isbn                           → BookPage
/chapter/:doi*                        → BookChapterPage
/conference/:slug                     → ConferencePage
/author/:authorId                     → AuthorPage
/search                               → SearchResultsPage
/login                                → LoginPage
/register                             → RegisterPage
/forgot-password                      → ForgotPasswordPage
/account                              → MyAccountPage (protected)
/account/submissions                  → SubmissionsPage (protected)
/account/reviews                      → ReviewerDashboard (protected)
/checkout                             → CheckoutPage
/discipline/:subject                  → SubjectAreaPage
/about                                → StaticContentPage
/privacy-policy                       → StaticContentPage
/terms-and-conditions                 → StaticContentPage
*                                     → NotFoundPage
```

---

## Data Flow Architecture

```
Mock JSON / MSW handlers
        ↓
Axios instance (apiClient.ts)
        ↓
React Query hooks (entity-level)
        ↓
Widget/Feature components
        ↓
Shared UI primitives
```

---

## Component Patterns

### Pattern 1: Container/Presenter Split
Every complex widget has a logic container + pure presenter:
```
ArticleHero/
  ArticleHeroContainer.tsx   ← fetches data, handles state
  ArticleHeroView.tsx         ← pure render, no logic
```

### Pattern 2: Compound Components (for Tabs, Accordion)
```typescript
<Tabs defaultValue="abstract">
  <Tabs.List>
    <Tabs.Tab value="abstract">Abstract</Tabs.Tab>
    <Tabs.Tab value="fulltext">Full Text</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="abstract"><AbstractSection /></Tabs.Panel>
  <Tabs.Panel value="fulltext"><ArticleBody /></Tabs.Panel>
</Tabs>
```

### Pattern 3: Render Props for Access Gate
```typescript
<AccessGate articleId={doi} requiredLevel="full">
  {({ hasAccess }) => hasAccess ? <ArticleBody /> : <PurchasePrompt />}
</AccessGate>
```

### Pattern 4: Skeleton Loading State
Every data-fetching component has a Skeleton variant:
```typescript
if (isLoading) return <ArticleCardSkeleton />;
if (isError) return <ErrorState message={error.message} />;
return <ArticleCard {...data} />;
```

---

## CSS Architecture

- **Tailwind CSS** for layout, spacing, typography (utility-first)
- **CSS Modules** (`.module.css`) for component-specific overrides
- **CSS Custom Properties** in `variables.css` for brand tokens
- **No styled-components** — keeps bundle lighter

### Lumex Design Tokens
```css
--lumex-primary: #e8181d;        /* Lumex red */
--lumex-primary-dark: #c0141a;
--lumex-text: #222222;
--lumex-text-muted: #6b6b6b;
--lumex-bg: #ffffff;
--lumex-bg-light: #f5f5f5;
--lumex-border: #dddddd;
--lumex-link: #025e8d;           /* Lumex blue */
--lumex-link-hover: #013f5f;
--lumex-oa-gold: #f5a500;        /* Open Access gold */
--lumex-font-sans: 'Source Sans Pro', Arial, sans-serif;
--lumex-font-serif: 'Merriweather', Georgia, serif;
--lumex-font-mono: 'Source Code Pro', monospace;
```

---

## TypeScript Conventions

- All component props use explicit interface (not `type`)
- Generic API types: `ApiResponse<T>`, `PaginatedResponse<T>`
- No `any` — use `unknown` + type guards where needed
- Enums only for fixed, known values (ArticleType, AccessLevel)
- Strict null checks on
- `zod` for runtime validation of form inputs and API responses

---

## Performance Patterns

| Pattern | Implementation |
|---------|---------------|
| Code splitting | `React.lazy` per page |
| List virtualization | `@tanstack/react-virtual` for search results |
| Image lazy loading | Native `loading="lazy"` + IntersectionObserver |
| Debounce search | `useDebounce(300ms)` hook |
| Query caching | React Query staleTime + cacheTime config |
| Prefetching | `queryClient.prefetchQuery` on hover for article cards |
| Bundle analysis | `vite-bundle-visualizer` |

---

## Mock Data Strategy (MSW)

All API responses are intercepted by Mock Service Worker (MSW):

```
/api/articles/:doi          → article detail mock
/api/journals/:slug         → journal detail mock
/api/search                 → paginated results mock
/api/journals               → journal list mock
/api/auth/login             → auth mock
/api/auth/register          → register mock
/api/journals/:slug/issues  → issues list mock
```

MSW runs in browser (service worker) so network tab shows real requests.

---

## Error Boundaries

```
App
 └─ GlobalErrorBoundary (catches all)
     └─ PageLayout
         └─ RouteErrorBoundary (per-page)
             └─ QueryErrorBoundary (per-widget data failure)
```
# Lumex Frontend Replica — TypeScript Types & Interfaces

## Core Domain Types

### Article (entities/article/types.ts)
```typescript
export type AccessLevel = 'open_access' | 'subscribed' | 'requires_purchase' | 'free_to_read';
export type ArticleType = 
  | 'research-article' | 'review-article' | 'letter' | 'editorial'
  | 'case-report' | 'correction' | 'brief-communication' | 'book-review'
  | 'short-communication' | 'erratum' | 'conference-paper';

export type LicenseType = 
  | 'CC BY' | 'CC BY-NC' | 'CC BY-ND' | 'CC BY-SA' | 'CC BY-NC-ND'
  | 'CC BY-NC-SA' | 'Lumex Standard' | 'Open Government';

export interface Author {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  orcid?: string;
  email?: string;
  isCorresponding: boolean;
  affiliations: Affiliation[];
  equalContribution?: boolean;
  creditRoles?: CRediTRole[];
}

export interface Affiliation {
  id: string;
  name: string;
  department?: string;
  city?: string;
  country: string;
  ror?: string;  // Research Organization Registry ID
}

export type CRediTRole =
  | 'Conceptualization' | 'Data curation' | 'Formal Analysis' | 'Funding acquisition'
  | 'Investigation' | 'Methodology' | 'Project administration' | 'Resources'
  | 'Software' | 'Supervision' | 'Validation' | 'Visualization' | 'Writing – original draft'
  | 'Writing – review & editing';

export interface ArticleAbstractSection {
  heading?: string;
  text: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  content: string;  // HTML content
  subsections?: ArticleSection[];
}

export interface ArticleFigure {
  id: string;
  number: number;
  caption: string;
  url: string;
  highResUrl?: string;
  alt: string;
  type: 'figure' | 'table' | 'scheme' | 'equation';
}

export interface ArticleReference {
  id: string;
  index: number;
  rawText: string;
  doi?: string;
  url?: string;
  authors: string[];
  title?: string;
  journal?: string;
  year?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  type: 'journal' | 'book' | 'website' | 'conference' | 'preprint' | 'other';
}

export interface ArticleMetrics {
  views?: number;
  downloads?: number;
  citations?: number;
  altmetricScore?: number;
  altmetricBadgeUrl?: string;
}

export interface Article {
  id: string;
  doi: string;
  title: string;
  subtitle?: string;
  authors: Author[];
  abstract: ArticleAbstractSection[];
  fullAbstractHtml?: string;
  keywords: string[];
  articleType: ArticleType;
  accessLevel: AccessLevel;
  license?: LicenseType;
  journalSlug: string;
  journalTitle: string;
  journalISSN: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publishedDate: string;  // ISO date
  acceptedDate?: string;
  receivedDate?: string;
  onlineDate?: string;
  language: string;
  pdfUrl?: string;
  htmlUrl?: string;
  sections?: ArticleSection[];
  figures?: ArticleFigure[];
  tables?: ArticleFigure[];
  references?: ArticleReference[];
  supplementaryFiles?: SupplementaryFile[];
  metrics?: ArticleMetrics;
  price?: number;
  currency?: string;
  relatedArticles?: ArticleSummary[];
  retracted?: boolean;
  correctionNote?: string;
}

export type ArticleSummary = Pick<
  Article, 
  'id' | 'doi' | 'title' | 'authors' | 'publishedDate' | 'articleType' | 
  'accessLevel' | 'journalTitle' | 'journalSlug' | 'metrics'
>;

export interface SupplementaryFile {
  id: string;
  name: string;
  description?: string;
  url: string;
  size: number;  // bytes
  type: string;  // MIME type
}
```

### Journal (entities/journal/types.ts)
```typescript
export type JournalAccessType = 'hybrid' | 'gold_oa' | 'subscription' | 'free';

export interface JournalMetrics {
  impactFactor?: number;
  impactFactorYear?: number;
  citeScore?: number;
  hIndex?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  snip?: number;  // Source Normalized Impact per Paper
  sjr?: number;   // SCImago Journal Rank
}

export interface JournalEditorialBoard {
  editorInChief: Author[];
  managingEditors?: Author[];
  sectionEditors?: Array<Author & { section: string }>;
  associateEditors?: Author[];
  editorialBoard?: Author[];
  honoraryEditors?: Author[];
}

export interface JournalIssue {
  id: string;
  journalSlug: string;
  volume: number;
  issue: number;
  year: number;
  month?: number;
  publishedDate: string;
  articleCount: number;
  coverImageUrl?: string;
  articles?: ArticleSummary[];
}

export interface Journal {
  id: string;
  slug: string;
  title: string;
  abbreviation?: string;
  printISSN?: string;
  electronicISSN: string;
  publisher: string;
  accessType: JournalAccessType;
  discipline: string[];
  subdiscipline?: string[];
  description: string;
  aimsAndScope: string;  // HTML
  coverImageUrl?: string;
  logoUrl?: string;
  metrics?: JournalMetrics;
  foundedYear?: number;
  frequency?: string;  // e.g. "Monthly", "Bimonthly"
  language: string[];
  indexedIn?: string[];  // Scopus, Web of Science, PubMed, etc.
  editorialBoard?: JournalEditorialBoard;
  submissionUrl?: string;
  latestIssue?: JournalIssue;
  currentVolume?: number;
  articleProcessingCharge?: number;
  apaCurrency?: string;
}
```

### Search (shared/types/search.types.ts)
```typescript
export type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'citations' | 'views';
export type ContentTypeFilter = 'article' | 'book' | 'chapter' | 'conference-paper' | 'protocol';

export interface SearchFilters {
  contentType?: ContentTypeFilter[];
  discipline?: string[];
  journal?: string[];
  accessType?: AccessLevel[];
  language?: string[];
  dateFrom?: string;
  dateTo?: string;
  articleType?: ArticleType[];
}

export interface SearchParams {
  query: string;
  filters: SearchFilters;
  sortBy: SortOption;
  page: number;
  pageSize: number;
  // Advanced search fields
  titleSearch?: string;
  authorSearch?: string;
  abstractSearch?: string;
  issnSearch?: string;
  doiSearch?: string;
}

export interface SearchFacet {
  field: string;
  label: string;
  values: Array<{
    value: string;
    label: string;
    count: number;
    selected: boolean;
  }>;
}

export interface SearchResult {
  type: 'article' | 'book' | 'chapter' | 'journal' | 'conference-paper';
  item: Article | Book | BookChapter;
  highlight?: {
    title?: string;
    abstract?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  page: number;
  pageSize: number;
  facets: SearchFacet[];
  queryTime: number;
}
```

### User (shared/types/user.types.ts)
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  orcid?: string;
  affiliation?: string;
  role: 'reader' | 'author' | 'reviewer' | 'editor' | 'admin';
  savedArticles: string[];  // DOIs
  alerts: AlertSetting[];
  orders: Order[];
  submissions: Submission[];
  avatarUrl?: string;
}

export interface AlertSetting {
  id: string;
  type: 'journal-toc' | 'author' | 'keyword';
  target: string;  // journal slug / author ID / keyword
  email: string;
  frequency: 'immediately' | 'weekly' | 'monthly';
  active: boolean;
}

export interface Order {
  id: string;
  doi: string;
  articleTitle: string;
  amount: number;
  currency: string;
  date: string;
  receiptUrl?: string;
  accessType: 'permanent' | '48hr';
}
```

### Submission (features/submission/types.ts)
```typescript
export type ManuscriptType = 
  | 'original-research' | 'review' | 'short-communication'
  | 'letter' | 'case-study' | 'methodology' | 'technical-note';

export interface SubmissionAuthor {
  firstName: string;
  lastName: string;
  email: string;
  orcid?: string;
  affiliation: string;
  country: string;
  isCorresponding: boolean;
  order: number;
}

export interface SubmissionFile {
  id: string;
  file: File;
  type: 'manuscript' | 'figure' | 'supplementary' | 'cover-letter' | 'data';
  name: string;
  size: number;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
}

export interface SubmissionFormData {
  manuscriptType: ManuscriptType;
  title: string;
  abstract: string;
  keywords: string[];
  authors: SubmissionAuthor[];
  files: SubmissionFile[];
  coverLetter: string;
  suggestedReviewers: Array<{ name: string; email: string; institution: string }>;
  excludedReviewers: Array<{ name: string; email: string; reason: string }>;
  fundingInfo: string;
  conflictOfInterest: string;
  dataAvailability: string;
  agreeToTerms: boolean;
  agreeToEthics: boolean;
}
```

### API Types (shared/types/api.types.ts)
```typescript
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```
# Lumex Frontend Replica — Utility Files In Depth

## 1. doiUtils.ts
```typescript
// Parse and manipulate DOIs (e.g., "10.1007/s00285-023-01234-5")
export const parseDOI = (doi: string): { registrant: string; suffix: string } | null
export const formatDOI = (doi: string): string           // ensures "10." prefix
export const doiToUrl = (doi: string): string            // https://doi.org/{doi}
export const doiToLumexUrl = (doi: string): string    // /article/{doi}
export const extractJournalFromDOI = (doi: string): string | null
export const isValidDOI = (doi: string): boolean
export const normalizeDOI = (doi: string): string        // lowercase, trim
```

## 2. citationFormatter.ts
Formats an Article object into various citation styles:
```typescript
export type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'vancouver' | 'bibtex' | 'ris' | 'endnote';

export const formatCitation = (article: Article, style: CitationStyle): string

// APA: Author, A. A., & Author, B. B. (Year). Title. Journal Name, Volume(Issue), Pages. DOI
// MLA: Author. "Title." Journal Name vol.Volume, no.Issue (Year): Pages. Web.
// BibTeX: @article{key, author={}, title={}, journal={}, year={}, doi={}}
// RIS: multi-line RIS format for reference managers
// RIS download triggers file download
export const downloadCitation = (article: Article, style: 'ris' | 'bibtex' | 'endnote'): void
export const formatAuthorForCitation = (author: Author, style: CitationStyle): string
```

## 3. abstractParser.ts
Parses abstract content from various formats:
```typescript
// Parse HTML abstract with section headers (Background, Methods, Results, Conclusions)
export const parseStructuredAbstract = (html: string): ArticleAbstractSection[]

// Strip HTML tags for plain text display
export const abstractToPlainText = (abstract: ArticleAbstractSection[]): string

// Parse JATS XML abstract
export const parseJATSAbstract = (xml: string): ArticleAbstractSection[]

// Truncate abstract to N chars with ellipsis
export const truncateAbstract = (text: string, maxLength: number): string
```

## 4. xmlParser.ts
Parses JATS XML (NLM Journal Archiving and Interchange Tag Set) into structured article content:
```typescript
// Full JATS XML → Article sections
export const parseJATSArticle = (xmlString: string): {
  sections: ArticleSection[];
  figures: ArticleFigure[];
  tables: ArticleFigure[];
  references: ArticleReference[];
}

// Parse <sec> elements recursively
export const parseSection = (secElement: Element): ArticleSection

// Parse <fig> elements
export const parseFigure = (figElement: Element): ArticleFigure

// Parse <ref-list> element
export const parseReferences = (refListElement: Element): ArticleReference[]

// Convert JATS inline elements to HTML
export const jatsInlineToHTML = (element: Element): string
// Handles: <italic>, <bold>, <sup>, <sub>, <xref>, <ext-link>, <named-content>
```

## 5. authorUtils.ts
```typescript
export const formatAuthorName = (author: Author, format: 'full' | 'abbreviated' | 'lastFirst'): string
// full: "John A. Smith"
// abbreviated: "J. A. Smith"  
// lastFirst: "Smith, John A."

export const formatAuthorList = (authors: Author[], maxVisible?: number): string
// "Smith J., Jones A., Brown K. et al."

export const getCorrespondingAuthors = (authors: Author[]): Author[]

export const formatAffiliation = (affiliation: Affiliation): string

export const formatORCID = (orcid: string): string  // 0000-0000-0000-0000 format

export const orcidToUrl = (orcid: string): string   // https://orcid.org/{orcid}
```

## 6. dateUtils.ts
```typescript
export const formatPublicationDate = (isoDate: string): string  // "15 March 2024"
export const formatShortDate = (isoDate: string): string        // "Mar 2024"
export const formatYear = (isoDate: string): string             // "2024"
export const getPublicationStatus = (article: Article): 'epub-ahead' | 'published' | 'corrected'
export const daysSincePublication = (isoDate: string): number
export const isRecentlyPublished = (isoDate: string, days?: number): boolean  // default 30 days
```

## 7. searchQueryUtils.ts
```typescript
// Convert SearchParams to URLSearchParams
export const searchParamsToURL = (params: SearchParams): URLSearchParams

// Parse URL search params to SearchParams
export const urlToSearchParams = (urlParams: URLSearchParams): Partial<SearchParams>

// Build advanced search query string
export const buildAdvancedQuery = (fields: AdvancedSearchFields): string
// title:"machine learning" AND author:"Smith" AND year:2020-2024

// Highlight search terms in text
export const highlightTerms = (text: string, terms: string[]): string  // returns HTML with <mark>
```

## 8. accessUtils.ts
```typescript
export const getAccessLevel = (article: Article, user: User | null): AccessLevel

export const canViewFullText = (article: Article, user: User | null): boolean

export const canDownloadPDF = (article: Article, user: User | null): boolean

export const getAccessBadgeConfig = (accessLevel: AccessLevel): {
  label: string;
  color: string;
  icon: string;
}
// open_access → "Open Access", gold, lock-open icon
// free_to_read → "Free to Read", green
// subscribed → unlocked
// requires_purchase → "Buy Article", gray, price shown
```

## 9. metricUtils.ts
```typescript
export const formatImpactFactor = (value: number): string  // "5.234"
export const formatCiteScore = (value: number): string     // "8.7"
export const getQuartileColor = (q: string): string        // CSS color per Q1-Q4
export const formatMetricValue = (value: number, metric: MetricType): string
export const getImpactFactorTrend = (history: MetricHistory[]): 'up' | 'down' | 'stable'
```

## 10. urlUtils.ts
```typescript
export const getArticleUrl = (doi: string): string          // /article/{doi}
export const getJournalUrl = (slug: string): string         // /journal/{slug}
export const getJournalIssueUrl = (slug: string, vol: number, iss: number): string
export const getBookUrl = (isbn: string): string            // /book/{isbn}
export const getAuthorUrl = (authorId: string): string      // /author/{authorId}
export const getSearchUrl = (params: Partial<SearchParams>): string
export const getExternalDOIUrl = (doi: string): string      // https://doi.org/{doi}
export const isExternalUrl = (url: string): boolean
```

## 11. issnUtils.ts
```typescript
export const formatISSN = (issn: string): string    // "1234-5678" format
export const isValidISSN = (issn: string): boolean  // checksum validation
export const issnToJournalUrl = (issn: string): string
```

## 12. fileUtils.ts
```typescript
export const formatFileSize = (bytes: number): string  // "2.4 MB"
export const getFileExtension = (filename: string): string
export const isAllowedSubmissionFile = (file: File): boolean
// Allowed: .docx, .doc, .tex, .pdf, .png, .jpg, .tiff, .eps, .xlsx, .csv, .zip

export const validateManuscriptFile = (file: File): { valid: boolean; error?: string }
export const getMimeTypeLabel = (mimeType: string): string  // "PDF Document"
```

## 13. classNames.ts
```typescript
// clsx-compatible utility
export const cx = (...classes: (string | undefined | null | false)[]): string
```

---

## Document Parsers Summary

| Parser | Input | Output | Use Case |
|--------|-------|--------|----------|
| `xmlParser.ts` | JATS XML string | Structured ArticleSection[] | Full text article rendering |
| `abstractParser.ts` | HTML or JATS XML | ArticleAbstractSection[] | Abstract display |
| `citationFormatter.ts` | Article object | Formatted citation string / file | Citation export |
| `abstractParser.ts` | HTML string | Plain text | SEO meta description |

---

## React Query Hooks Reference (all in features/ or entities/)

```typescript
// Article hooks
useArticle(doi: string)
useArticleList(params: ArticleListParams)
useRelatedArticles(doi: string)

// Journal hooks
useJournal(slug: string)
useJournalList(filters: JournalListFilters)
useJournalIssues(slug: string)
useJournalIssue(slug: string, vol: number, iss: number)
useEditorialBoard(slug: string)

// Search hooks
useSearch(params: SearchParams)
useSearchSuggestions(query: string)  // debounced

// Author hooks
useAuthor(authorId: string)
useAuthorArticles(authorId: string)

// Book hooks
useBook(isbn: string)
useBookChapter(doi: string)

// User hooks (auth-protected)
useCurrentUser()
useSavedArticles()
useSubmissions()
useOrders()
useReviews()
```
# Lumex Frontend Replica — Libraries, Config & Setup

## package.json — All Dependencies

### Core
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "typescript": "^5.5.0"
  }
}
```

### State Management
```json
{
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.52.0",
  "@tanstack/react-query-devtools": "^5.52.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.0",
  "@hookform/resolvers": "^3.9.0"
}
```

### HTTP
```json
{
  "axios": "^1.7.0",
  "msw": "^2.4.0"
}
```

### Styling
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "clsx": "^2.1.0"
}
```

### UI Primitives (Radix UI)
```json
{
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-dialog": "^1.1.0",
  "@radix-ui/react-dropdown-menu": "^2.1.0",
  "@radix-ui/react-popover": "^1.1.0",
  "@radix-ui/react-select": "^2.1.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-tooltip": "^1.1.0",
  "@radix-ui/react-checkbox": "^1.1.0",
  "@radix-ui/react-radio-group": "^1.2.0",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-progress": "^1.1.0",
  "@radix-ui/react-toast": "^1.2.0",
  "@radix-ui/react-scroll-area": "^1.1.0"
}
```

### Rich Text / Content
```json
{
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0",
  "rehype-raw": "^7.0.0",
  "rehype-sanitize": "^6.0.0",
  "katex": "^0.16.0",
  "react-katex": "^3.0.0"
}
```

### PDF
```json
{
  "pdfjs-dist": "^4.6.0",
  "react-pdf": "^9.1.0"
}
```

### Virtualization & Performance
```json
{
  "@tanstack/react-virtual": "^3.10.0"
}
```

### Icons & Animation
```json
{
  "react-icons": "^5.3.0",
  "framer-motion": "^11.5.0"
}
```

### SEO & Head
```json
{
  "react-helmet-async": "^2.0.0"
}
```

### File Upload
```json
{
  "react-dropzone": "^14.2.0"
}
```

### Utilities
```json
{
  "date-fns": "^3.6.0",
  "lodash-es": "^4.17.0"
}
```

### Dev Dependencies
```json
{
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@playwright/test": "^1.47.0",
    "@storybook/react": "^8.3.0",
    "@storybook/react-vite": "^8.3.0",
    "eslint": "^9.10.0",
    "@typescript-eslint/parser": "^8.6.0",
    "@typescript-eslint/eslint-plugin": "^8.6.0",
    "eslint-plugin-react": "^7.36.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.3.0",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0",
    "vite-bundle-visualizer": "^1.2.0"
  }
}
```

---

## vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          'query-vendor': ['@tanstack/react-query'],
          'pdf-vendor': ['pdfjs-dist'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

## tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@app/*": ["./src/app/*"],
      "@pages/*": ["./src/pages/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*": ["./src/shared/*"],
      "@mocks/*": ["./src/mocks/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lumex: {
          red: '#e8181d',
          'red-dark': '#c0141a',
          blue: '#025e8d',
          'blue-dark': '#013f5f',
          'oa-gold': '#f5a500',
          text: '#222222',
          muted: '#6b6b6b',
          border: '#dddddd',
          'bg-light': '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Source Sans Pro', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1400px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Key Config Files Summary

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build, path aliases, chunk splitting |
| `tsconfig.json` | TypeScript strict mode + path aliases |
| `tailwind.config.ts` | Lumex brand tokens, custom breakpoints |
| `.eslintrc.cjs` | TypeScript ESLint + React hooks rules |
| `.prettierrc` | Code formatting (2 spaces, single quotes) |
| `vitest.config.ts` | Unit test config with jsdom env |
| `playwright.config.ts` | E2E test config |
| `src/mocks/browser.ts` | MSW browser service worker setup |
| `public/mockServiceWorker.js` | MSW service worker (auto-generated) |

---

## MSW Setup (Mock Service Worker)

### src/mocks/browser.ts
```typescript
import { setupWorker } from 'msw/browser';
import { articleHandlers } from './handlers/article.handlers';
import { journalHandlers } from './handlers/journal.handlers';
import { searchHandlers } from './handlers/search.handlers';
import { authHandlers } from './handlers/auth.handlers';

export const worker = setupWorker(
  ...articleHandlers,
  ...journalHandlers,
  ...searchHandlers,
  ...authHandlers,
);
```

### src/app/main.tsx
```typescript
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('../mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode><App /></StrictMode>
  );
});
```

---

## Storybook Setup

All shared/ui components get a `.stories.tsx` file:
```
Button.stories.tsx
Badge.stories.tsx
ArticleCard.stories.tsx
JournalCard.stories.tsx
SearchBar.stories.tsx
```

Each story shows all variants (sizes, states, access types) for visual QA.
# Lumex Frontend Replica — Development Phases & Implementation Order

## Phase 0: Project Bootstrap (Day 1–2)

1. `npm create vite@latest lumex-replica -- --template react-ts`
2. Install all dependencies (see 07_LIBRARIES_AND_CONFIG.md)
3. Configure Vite path aliases
4. Set up Tailwind with lumex tokens
5. Set up ESLint + Prettier + Husky
6. Create folder structure (all empty index files)
7. Set up MSW + mock data stubs
8. Set up React Query provider
9. Set up router with placeholder pages
10. Deploy to Vercel/Netlify preview

---

## Phase 1: Design System (Day 3–5)

Build all shared/ui primitives first. These are the atoms everything else is built from.

**Order:**
1. `variables.css` — all Lumex tokens
2. `typography.css` — Source Sans Pro import + scale
3. `Button` — variants: primary, secondary, outline, ghost, link; sizes: sm/md/lg
4. `Input`, `Select`, `Checkbox`, `Radio`
5. `Badge`, `Tag`
6. `Spinner`, `Skeleton`
7. `Modal` (Radix Dialog)
8. `Tabs` (Radix Tabs)
9. `Accordion` (Radix Accordion)
10. `Tooltip` (Radix Tooltip)
11. `Pagination`
12. `Breadcrumb`
13. `Alert`
14. `ProgressBar`
15. Layout: `Container`, `Grid`, `Stack`
16. `Link`, `Image`

Write Storybook stories for each.

---

## Phase 2: Global Layout (Day 6–8)

1. `GlobalHeader` — logo, search bar, nav links, account menu, hamburger mobile
2. `MegaMenu` — disciplines dropdown with sub-categories
3. `TopBanner` — institutional access / cookie banner
4. `GlobalFooter` — links, social, ISSN info, legal
5. `PageLayout` — header + main + footer wrapper
6. `TwoColumnLayout` + `ThreeColumnLayout`

---

## Phase 3: Mock Data & API Layer (Day 9–10)

1. Write all mock JSON fixtures (realistic Lumex-style data)
2. Set up MSW handlers for all endpoints
3. Write React Query hooks for each entity
4. Test all hooks in isolation

---

## Phase 4: Entity Components (Day 11–14)

**Articles:**
1. `ArticleCard` (compact — for search/listing)
2. `ArticleCardFull` (full width)
3. `ArticleMeta` (DOI, dates, type)
4. `AuthorList`
5. `KeywordList`
6. `ArticleBadge` (OA gold badge, etc.)

**Journals:**
1. `JournalCard`
2. `JournalBadge`
3. `IssueCard`

**Books:**
1. `BookCard`
2. `ChapterCard`

**Citations:**
1. `ReferenceItem`
2. `CitationDisplay`

---

## Phase 5: Home Page (Day 15–16)
1. `HomeHero` — search bar, tagline
2. `DisciplineGrid` — 25 discipline tiles with icons
3. `FeaturedJournals` — carousel/grid
4. `NewsSection`
5. Wire up `HomePage`

---

## Phase 6: Search Flow (Day 17–20)
1. `SearchBar` with typeahead (`SearchSuggestions`)
2. `AdvancedSearch` form
3. `SearchFilterPanel` — faceted filters with counts
4. `SearchResultsPage` — results list + filters + sort + pagination
5. Wire `useSearch` hook to URL params (bidirectional sync)

---

## Phase 7: Journal Pages (Day 21–25)
1. `JournalHomePage` — hero, tabs
2. `JournalIssueList` — volumes & issues grid
3. `MetricsPanel` — impact factor, CiteScore
4. `JournalSidebar`
5. `EditorialBoardPage`
6. `AboutJournalPage`
7. `SubmissionGuidelinesPage`
8. `OpenAccessPage`

---

## Phase 8: Article Page (Day 26–32)
This is the most complex page.

1. `ArticleHero` — full metadata display
2. `AbstractSection` — structured abstract renderer
3. `ArticleBody` — JATS XML → HTML sections renderer
4. `FigureViewer` — lightbox modal
5. `TableRenderer` — scrollable table display
6. `EquationRenderer` — KaTeX math rendering
7. `ReferencesSection` — numbered list with DOI links
8. `ArticleSidebar` — sticky TOC with scrollspy
9. `CitationTools` — format picker + download
10. `RelatedContent`
11. `AccessGate` — paywall logic
12. `PDFViewer` — pdfjs inline viewer
13. Wire up `ArticlePage`

---

## Phase 9: Auth Pages (Day 33–35)
1. `LoginForm` + `LoginPage`
2. `RegisterForm` + `RegisterPage`
3. `ForgotPasswordForm`
4. `OrcidLogin` button
5. `useAuth` hook + Zustand auth store
6. Protected route wrapper

---

## Phase 10: Submission Flow (Day 36–42)
1. `SubmissionWizard` stepper UI
2. All 5 step components
3. `FileUploadZone` (react-dropzone)
4. Form validation with Zod + React Hook Form
5. `useSubmission` hook

---

## Phase 11: My Account (Day 43–46)
1. `MyAccountPage` with tabs
2. Saved articles list
3. `AlertSignupForm` + alerts list
4. Submissions tracker
5. Orders/receipts

---

## Phase 12: Remaining Pages (Day 47–52)
1. `BookPage`, `BookChapterPage`
2. `AuthorPage`
3. `SubjectAreaPage`
4. `ConferencePage`
5. `CheckoutPage`
6. `ArticleAlertsPage`
7. `ReviewerDashboard` + `ReviewForm`
8. `JournalListPage` (A–Z)
9. Static content pages

---

## Phase 13: Polish & QA (Day 53–60)
1. Pixel-perfect comparison vs live Lumex site
2. Mobile responsive testing (all breakpoints)
3. Accessibility audit (keyboard nav, ARIA, contrast)
4. Performance audit (Lighthouse)
5. Cross-browser testing
6. Unit tests for all utils
7. Integration tests for key flows
8. E2E Playwright tests: home → search → article → submit

---

## Total Estimated Files: ~280–320 `.tsx`/`.ts` files

| Layer | Approx Files |
|-------|-------------|
| Pages | ~24 pages × 2 = ~48 |
| Widgets | ~18 × 2-3 = ~50 |
| Features | ~12 × 3-5 = ~50 |
| Entities | ~20 components = ~40 |
| Shared UI | ~20 components × 2 = ~40 |
| Shared hooks/utils | ~30 |
| Types | ~8 |
| Mocks | ~15 |
| Config | ~8 |
| **Total** | **~290** |
# Lumex Frontend Replica — Mock Data & MSW Handlers

## Mock Data Strategy

All mock data should be realistic and mirror actual Lumex content structure.
Place in `src/mocks/data/`

---

## articles.mock.ts — Example Structure
```typescript
import type { Article } from '@entities/article/types';

export const mockArticle: Article = {
  id: 'art-001',
  doi: '10.1007/s00285-024-02112-3',
  title: 'Spatiotemporal dynamics of predator-prey systems with Allee effects: a mathematical framework',
  subtitle: undefined,
  authors: [
    {
      id: 'auth-001',
      name: 'Sarah Chen',
      firstName: 'Sarah',
      lastName: 'Chen',
      orcid: '0000-0002-1825-0097',
      isCorresponding: true,
      affiliations: [{
        id: 'aff-001',
        name: 'University of Cambridge',
        department: 'Department of Applied Mathematics',
        city: 'Cambridge',
        country: 'UK',
        ror: '013meh722',
      }],
      creditRoles: ['Conceptualization', 'Methodology', 'Writing – original draft'],
    },
    // more authors...
  ],
  abstract: [
    { heading: 'Background', text: 'Population dynamics in ecological systems...' },
    { heading: 'Methods', text: 'We employ a coupled system of reaction-diffusion equations...' },
    { heading: 'Results', text: 'Our analysis reveals three distinct dynamical regimes...' },
    { heading: 'Conclusions', text: 'The Allee threshold plays a critical role...' },
  ],
  keywords: ['Allee effect', 'predator-prey', 'reaction-diffusion', 'Turing patterns', 'bifurcation'],
  articleType: 'research-article',
  accessLevel: 'open_access',
  license: 'CC BY',
  journalSlug: 'journal-of-mathematical-biology',
  journalTitle: 'Journal of Mathematical Biology',
  journalISSN: '0303-6812',
  volume: '88',
  issue: '4',
  pages: '1-34',
  publishedDate: '2024-03-15T00:00:00Z',
  receivedDate: '2023-09-22T00:00:00Z',
  acceptedDate: '2024-02-10T00:00:00Z',
  onlineDate: '2024-02-28T00:00:00Z',
  language: 'en',
  pdfUrl: '/mock-pdf/article-001.pdf',
  metrics: {
    views: 1842,
    downloads: 342,
    citations: 7,
    altmetricScore: 23,
  },
};

export const mockArticles: Article[] = [mockArticle, /* ... more */];
```

---

## journals.mock.ts — Example Structure
```typescript
import type { Journal } from '@entities/journal/types';

export const mockJournal: Journal = {
  id: 'j-001',
  slug: 'journal-of-mathematical-biology',
  title: 'Journal of Mathematical Biology',
  abbreviation: 'J. Math. Biol.',
  printISSN: '0303-6812',
  electronicISSN: '1432-1416',
  publisher: 'Lumex',
  accessType: 'hybrid',
  discipline: ['Mathematics', 'Biology', 'Life Sciences'],
  description: 'The Journal of Mathematical Biology focuses on mathematical biology...',
  aimsAndScope: '<p>The Journal publishes papers in which...</p>',
  coverImageUrl: '/mock-images/jmb-cover.jpg',
  metrics: {
    impactFactor: 2.6,
    impactFactorYear: 2023,
    citeScore: 5.2,
    quartile: 'Q1',
    hIndex: 78,
  },
  foundedYear: 1974,
  frequency: 'Monthly',
  language: ['English'],
  indexedIn: ['Scopus', 'Web of Science', 'PubMed', 'MathSciNet', 'zbMATH'],
  currentVolume: 88,
  articleProcessingCharge: 2890,
  apaCurrency: 'EUR',
};
```

---

## MSW Handlers

### article.handlers.ts
```typescript
import { http, HttpResponse } from 'msw';
import { mockArticles } from '../data/articles.mock';

export const articleHandlers = [
  // GET single article by DOI
  http.get('/api/articles/:doi', ({ params }) => {
    const { doi } = params;
    const decodedDOI = decodeURIComponent(doi as string);
    const article = mockArticles.find(a => a.doi === decodedDOI);
    if (!article) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ data: article });
  }),

  // GET article list for a journal
  http.get('/api/journals/:slug/articles', ({ params, request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const articles = mockArticles.filter(a => a.journalSlug === params.slug);
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      data: articles.slice(start, start + pageSize),
      totalCount: articles.length,
      page, pageSize,
      totalPages: Math.ceil(articles.length / pageSize),
    });
  }),
];
```

### search.handlers.ts
```typescript
import { http, HttpResponse } from 'msw';
import { mockArticles } from '../data/articles.mock';
import type { SearchResponse } from '@shared/types/search.types';

export const searchHandlers = [
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = 20;

    const results = mockArticles
      .filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      )
      .map(a => ({ type: 'article' as const, item: a }));

    const response: SearchResponse = {
      results: results.slice((page - 1) * pageSize, page * pageSize),
      totalCount: results.length,
      page, pageSize,
      queryTime: 45,
      facets: [
        {
          field: 'contentType',
          label: 'Content Type',
          values: [
            { value: 'article', label: 'Article', count: results.length, selected: false },
          ],
        },
        // more facets...
      ],
    };
    return HttpResponse.json(response);
  }),

  // Typeahead suggestions
  http.get('/api/search/suggestions', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? '';
    const suggestions = mockArticles
      .filter(a => a.title.toLowerCase().startsWith(q.toLowerCase()))
      .slice(0, 5)
      .map(a => ({ type: 'article', title: a.title, doi: a.doi }));
    return HttpResponse.json({ data: suggestions });
  }),
];
```

### auth.handlers.ts
```typescript
import { http, HttpResponse } from 'msw';
import { mockUser } from '../data/user.mock';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    if (email === 'test@lumex.com' && password === 'password') {
      return HttpResponse.json({
        data: { user: mockUser, accessToken: 'mock-jwt-token-123' }
      });
    }
    return HttpResponse.json(
      { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/register', async () => {
    return HttpResponse.json({ data: { message: 'Registration successful' } });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer mock-jwt-token-123') {
      return HttpResponse.json({ data: mockUser });
    }
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ data: { message: 'Logged out' } });
  }),
];
```

---

## Disciplines Mock (constants/disciplines.ts)
```typescript
export const DISCIPLINES = [
  { id: 'mathematics', label: 'Mathematics', icon: 'MdFunctions', journalCount: 142 },
  { id: 'physics', label: 'Physics & Astronomy', icon: 'MdScience', journalCount: 89 },
  { id: 'chemistry', label: 'Chemistry', icon: 'MdBiotech', journalCount: 112 },
  { id: 'life-sciences', label: 'Life Sciences', icon: 'MdEco', journalCount: 234 },
  { id: 'medicine', label: 'Medicine', icon: 'MdMedicalServices', journalCount: 318 },
  { id: 'computer-science', label: 'Computer Science', icon: 'MdComputer', journalCount: 98 },
  { id: 'engineering', label: 'Engineering', icon: 'MdEngineering', journalCount: 176 },
  { id: 'social-sciences', label: 'Social Sciences', icon: 'MdPeople', journalCount: 145 },
  { id: 'economics', label: 'Economics', icon: 'MdBarChart', journalCount: 87 },
  { id: 'psychology', label: 'Psychology', icon: 'MdPsychology', journalCount: 94 },
  { id: 'education', label: 'Education', icon: 'MdSchool', journalCount: 67 },
  { id: 'environment', label: 'Earth & Environmental', icon: 'MdTerrain', journalCount: 108 },
  { id: 'materials', label: 'Materials Science', icon: 'MdCategory', journalCount: 73 },
  { id: 'energy', label: 'Energy', icon: 'MdBolt', journalCount: 45 },
  { id: 'law', label: 'Law', icon: 'MdGavel', journalCount: 62 },
  // ... more
] as const;
```
# Lumex Frontend Replica — Testing Strategy & Pixel-Perfect Guidelines

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
All utility files must have 100% coverage.

**Priority test files:**
- `doiUtils.test.ts`
- `citationFormatter.test.ts`
- `abstractParser.test.ts`
- `xmlParser.test.ts`
- `searchQueryUtils.test.ts`
- `accessUtils.test.ts`
- `authorUtils.test.ts`
- `dateUtils.test.ts`

**Component tests (key components):**
- `ArticleCard.test.tsx`
- `SearchBar.test.tsx`
- `AccessGate.test.tsx`
- `SubmissionWizard.test.tsx`
- `CitationTools.test.tsx`
- `Pagination.test.tsx`

### Integration Tests
- Full search flow: type → suggestions → submit → results → filter
- Article page render: abstract, full text, references
- Auth flow: login → protected route → logout
- Submission wizard: all 5 steps

### E2E Tests (Playwright)
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

**E2E test scenarios:**
1. Home page loads, discipline grid renders
2. Search: enter query → navigate to results → apply filter → paginate
3. Navigate to journal → view issues → click article
4. Article page: tabs work, PDF viewer opens, cite modal works
5. Login flow → access protected My Account page
6. Submit manuscript: complete all 5 steps
7. Mobile navigation: hamburger → menu → navigate

---

## Pixel-Perfect Guidelines

### Typography
| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Page title | Source Sans Pro | 600 | 28px | #222 |
| Article title | Merriweather | 700 | 24px | #222 |
| Section heading | Source Sans Pro | 600 | 18px | #222 |
| Body text | Source Sans Pro | 400 | 16px | #333 |
| Author names | Source Sans Pro | 400 | 14px | #025e8d |
| DOI | Source Code Pro | 400 | 13px | #025e8d |
| Abstract text | Source Sans Pro | 400 | 15px | #444 |
| Reference text | Source Sans Pro | 400 | 13px | #333 |
| Caption text | Source Sans Pro | 400 | 12px | #555 |
| Journal name | Source Sans Pro | 600 | 14px | #333 |

### Color Usage
| Context | Color |
|---------|-------|
| Primary action buttons | #e8181d (Lumex red) |
| Links | #025e8d |
| Link hover | #013f5f |
| Open Access badge | #f5a500 background |
| Free to Read badge | #4caf50 |
| Requires Purchase | #777 |
| Border/dividers | #dddddd |
| Light backgrounds | #f5f5f5 |
| Warning/notice | #fff3cd |
| Error | #f8d7da |

### Spacing Scale (mirrors Lumex)
```
4px   — xs (tight labels)
8px   — sm (internal padding)
12px  — md-sm
16px  — md (standard gap)
24px  — lg (section spacing)
32px  — xl
48px  — 2xl (major sections)
64px  — 3xl (page sections)
```

### Key Component Measurements
| Component | Measurement |
|-----------|------------|
| Global header height | 56px desktop, 48px mobile |
| Top announcement banner | 40px |
| Container max-width | 1200px |
| Article page sidebar width | 300px |
| Search filter panel width | 260px |
| Journal cover image | 120px × 160px |
| Article card min-height | 180px |

---

## Accessibility Requirements (WCAG 2.1 AA)

- All interactive elements have `:focus-visible` ring (2px, #025e8d offset)
- Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
- All images have `alt` attributes
- All form fields have associated `<label>` elements
- Skip-to-main-content link at top of page
- ARIA landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`
- `aria-live` regions for dynamic search results
- Modal traps focus (Radix Dialog handles this)
- All tabs are keyboard navigable (arrow keys)
- Article figures have full captions as `aria-describedby`

---

## SEO Configuration (react-helmet-async)

Each page sets:
```tsx
<Helmet>
  <title>{article.title} | {journal.title} | Lumex</title>
  <meta name="description" content={truncateAbstract(abstractText, 160)} />
  <meta property="og:title" content={article.title} />
  <meta property="og:description" content={truncateAbstract(abstractText, 200)} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://link.lumex.com/article/${article.doi}`} />
  <meta name="citation_doi" content={article.doi} />
  <meta name="citation_title" content={article.title} />
  <meta name="citation_journal_title" content={journal.title} />
  <meta name="citation_issn" content={journal.electronicISSN} />
  <link rel="canonical" href={canonicalUrl} />
</Helmet>
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Bundle size (initial) | < 200KB gzipped |
| Time to Interactive | < 3s |
| Lighthouse Performance | > 85 |
| Lighthouse Accessibility | > 95 |
