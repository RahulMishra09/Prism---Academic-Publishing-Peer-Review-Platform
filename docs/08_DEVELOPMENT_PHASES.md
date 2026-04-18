# Lumex Frontend Replica — Development Phases & Implementation Order

## Phase 0: Project Bootstrap (Day 1–2) ✅ DONE

- [x] `npm create vite@latest lumex-replica -- --template react-ts`
- [x] Install all dependencies (see 07_LIBRARIES_AND_CONFIG.md)
- [x] Configure Vite path aliases
- [x] Set up Tailwind with lumex tokens
- [x] Set up ESLint + Prettier + Husky
- [x] Create folder structure (all empty index files)
- [x] Set up MSW + mock data stubs
- [x] Set up React Query provider
- [x] Set up router with placeholder pages
- [x] Deploy to Vercel/Netlify preview

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

## Phase 2: Global Layout (Day 6–8) ✅ DONE

- [x] `GlobalHeader` — logo, search bar, nav links, account menu, hamburger mobile
- [x] `MegaMenu` — disciplines dropdown with sub-categories
- [x] `TopBanner` — institutional access / cookie banner
- [x] `GlobalFooter` — links, social, ISSN info, legal
- [x] `PageLayout` — header + main + footer wrapper
- [x] `TwoColumnLayout` + `ThreeColumnLayout`

---

## Phase 3: Mock Data & API Layer (Day 9–10) ✅ DONE

- [x] Write all mock JSON fixtures (realistic Lumex-style data)
- [x] Implement `fetchWithFallback` to replace MSW interceptors entirely
- [x] Write React Query hooks for each entity
- [x] Test all hooks in isolation

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

## Phase 5: Home Page (Day 15–16) ✅ DONE
- [x] `HomeHero` — search bar, tagline
- [x] `DisciplineGrid` — 25 discipline tiles with icons
- [x] `FeaturedJournals` — carousel/grid
- [x] `NewsSection`
- [x] Wire up `HomePage`

---

## Phase 6: Search Flow (Day 17–20) 🟡 IN PROGRESS
- [ ] `SearchBar` with typeahead (`SearchSuggestions`)
- [ ] `AdvancedSearch` form
- [ ] `SearchFilterPanel` — faceted filters with counts
- [x] `SearchResultsPage` — results list + filters + sort + pagination
- [ ] Wire `useSearch` hook to URL params (bidirectional sync)

---

## Phase 7: Journal Pages (Day 21–25) 🟡 IN PROGRESS
- [x] `JournalHomePage` — hero, tabs
- [ ] `JournalIssueList` — volumes & issues grid
- [ ] `MetricsPanel` — impact factor, CiteScore
- [ ] `JournalSidebar`
- [ ] `EditorialBoardPage`
- [ ] `AboutJournalPage`
- [ ] `SubmissionGuidelinesPage`
- [ ] `OpenAccessPage`

---

## Phase 8: Article Page (Day 26–32) ✅ DONE

- [x] `ArticleHero` — full metadata display
- [x] `AbstractSection` — structured abstract renderer
- [x] `ArticleBody` — JATS XML → HTML sections renderer
- [x] `FigureViewer` — lightbox modal
- [x] `TableRenderer` — scrollable table display
- [x] `EquationRenderer` — KaTeX math rendering
- [x] `ReferencesSection` — numbered list with DOI links
- [x] `ArticleSidebar` — sticky TOC with scrollspy
- [x] `CitationTools` — format picker + download
- [x] `RelatedContent`
- [x] `AccessGate` — paywall logic
- [ ] `PDFViewer` — pdfjs inline viewer (basic implementation done)
- [x] Wire up `ArticlePage`

---

## Phase 9: Auth Pages (Day 33–35) ✅ DONE
- [x] `LoginForm` + `LoginPage`
- [x] `RegisterForm` + `RegisterPage`
- [x] `ForgotPasswordForm`
- [x] `OrcidLogin` button
- [x] `useAuth` hook + Zustand auth store
- [x] Protected route wrapper

---

## Phase 10: Submission Flow (Day 36–42) ✅ DONE
- [x] `SubmissionWizard` stepper UI
- [x] All 5 step components
- [x] `FileUploadZone` (react-dropzone)
- [x] Form validation with Zod + React Hook Form
- [x] `useSubmission` hook

---

## Phase 11: My Account (Day 43–46) 🟡 IN PROGRESS
- [x] `MyAccountPage` with tabs
- [ ] Saved articles list
- [ ] `AlertSignupForm` + alerts list
- [ ] Submissions tracker
- [ ] Orders/receipts

---

## Phase 12: Remaining Pages (Day 47–52) 🟡 IN PROGRESS
- [x] `BookPage`, `BookChapterPage`
- [x] `AuthorPage`
- [x] `SubjectAreaPage`
- [ ] `ConferencePage`
- [ ] `CheckoutPage`
- [ ] `ArticleAlertsPage`
- [ ] `ReviewerDashboard` + `ReviewForm`
- [x] `JournalListPage` (A–Z)
- [x] Static content pages (via generic `StaticContentPage` template)

---

## Phase 13: Polish & QA (Day 53–60) 🔴 PENDING
- [ ] Pixel-perfect comparison vs live Lumex site
- [ ] Mobile responsive testing (all breakpoints)
- [ ] Accessibility audit (keyboard nav, ARIA, contrast)
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser testing
- [ ] Unit tests for all utils
- [ ] Integration tests for key flows
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
