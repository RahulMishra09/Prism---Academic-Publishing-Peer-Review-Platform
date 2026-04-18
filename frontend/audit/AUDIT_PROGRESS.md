# Lumex Codebase Audit — Progress Tracker

> Status legend: `pending` | `in-progress` | `done`
> 
> **Last updated**: March 11, 2026

---

## Phase 0 — Project Configuration

| # | File | Status |
|---|------|--------|
| 1 | `package.json` | done |
| 2 | `vite.config.ts` | done |
| 3 | `tsconfig.json` | done |
| 4 | `tsconfig.app.json` | done |
| 5 | `tsconfig.node.json` | done |
| 6 | `eslint.config.js` | done |
| 7 | `.prettierrc` | done |
| 8 | `.prettierignore` | done |
| 9 | `postcss.config.js` | done |
| 10 | `tailwind.config.ts` | done |
| 11 | `vitest.config.ts` | done |
| 12 | `playwright.config.ts` | done |
| 13 | `index.html` | done |
| 14 | `.gitignore` | done |
| 15 | `.husky/pre-commit` | done |
| 16 | `README.md` | done |
| 17 | Root misc files (build*.txt, lint_output*, ts_errors.log, mobile_search_debug.png, raw-dom.html, journal-website.jsx, fetch-dom.cjs) | done |
| 18 | `docs/01_PROJECT_OVERVIEW.md` | done |
| 19 | `docs/02_FILE_STRUCTURE.md` | done |
| 20 | `docs/03_FEATURE_FLOWS.md` | done |
| 21 | `docs/04_ARCHITECTURE.md` | done |
| 22 | `docs/05_TYPES_AND_INTERFACES.md` | done |
| 23 | `docs/06_UTILITY_FILES.md` | done |
| 24 | `docs/07_LIBRARIES_AND_CONFIG.md` | done |
| 25 | `docs/08_DEVELOPMENT_PHASES.md` | done |
| 26 | `docs/09_MOCK_DATA_AND_HANDLERS.md` | done |
| 27 | `docs/10_TESTING_AND_QUALITY.md` | done |
| 28 | `docs/lumex-frontend-project-docs.md` | done |

## Phase 1 — Styling & Design System

| # | File | Status |
|---|------|--------|
| 1 | `src/index.css` | done |
| 2 | `src/shared/ui/styles/variables.css` | done |
| 3 | `src/shared/ui/styles/typography.css` | done |

## Phase 2 — Core Application Shell

| # | File | Status |
|---|------|--------|
| 1 | `src/main.tsx` | done |
| 2 | `src/App.tsx` | done |
| 3 | `src/app/layouts/PageLayout.tsx` | done |
| 4 | `src/app/layouts/ThreeColumnLayout.tsx` | done |
| 5 | `src/app/layouts/TwoColumnLayout.tsx` | done |
| 6 | `src/app/layouts/index.ts` | done |
| 7 | `src/app/router/GuestRoute.tsx` | done |
| 8 | `src/app/router/ProtectedRoute.tsx` | done |
| 9 | `src/app/store/index.ts` | done |
| 10 | `src/app/store/useAuthStore.ts` | done |
| 11 | `src/app/store/useSearchStore.ts` | done |
| 12 | `src/app/store/useUIStore.ts` | done |
| 13 | `src/components/layouts/` (empty dir check) | done |

## Phase 3 — Hooks

| # | File | Status |
|---|------|--------|
| 1 | `src/shared/hooks/useCopyToClipboard.ts` | done |
| 2 | `src/shared/hooks/useDebounce.ts` | done |
| 3 | `src/shared/hooks/useIntersectionObserver.ts` | done |
| 4 | `src/shared/hooks/useLocalStorage.ts` | done |
| 5 | `src/shared/hooks/useMediaQuery.ts` | done |
| 6 | `src/shared/hooks/usePageTitle.ts` | done |
| 7 | `src/shared/hooks/useScrollPosition.ts` | done |
| 8 | `src/shared/ui/Toast/useToast.ts` | done |
| 9 | `src/entities/theme/model/useThemeStore.ts` | done |
| 10 | `src/features/article/hooks/useRecentlyViewed.ts` | done |
| 11 | `src/features/article/hooks/useSavedArticles.ts` | done |
| 12 | `src/features/search/api/useSearchState.ts` | done |
| 13 | `src/features/submission/model/useSubmissionStore.ts` | done |
| 14 | `src/features/user/api/useUserDashboard.ts` | done |

## Phase 4 — Utilities & Helpers

| # | File | Status |
|---|------|--------|
| 1 | `src/shared/constants/articleTypes.ts` | done |
| 2 | `src/shared/constants/disciplines.ts` | done |
| 3 | `src/shared/constants/licenseTypes.ts` | done |
| 4 | `src/shared/constants/routes.ts` | done |
| 5 | `src/features/search/utils/searchQueryUtils.ts` | done |

## Phase 5 — Services & API Layer

| # | File | Status |
|---|------|--------|
| 1 | `src/shared/api/base.ts` | done |
| 2 | `src/shared/api/fetchWithFallback.ts` | done |
| 3 | `src/shared/api/queryClient.ts` | done |
| 4 | `src/shared/api/useSiteConfig.ts` | done |
| 5 | `src/entities/article/api/articleQueries.ts` | done |
| 6 | `src/entities/collection/api/collectionQueries.ts` | done |
| 7 | `src/entities/conference/api/conferenceQueries.ts` | done |
| 8 | `src/entities/journal/api/journalQueries.ts` | done |
| 9 | `src/entities/user/api/userQueries.ts` | done |
| 10 | `src/features/homepage/api/homepageQueries.ts` | done |
| 11 | `src/features/search/api/searchQueries.ts` | done |

## Phase 6 — State Management

| # | File | Status |
|---|------|--------|
| 1 | `src/app/store/useAuthStore.ts` | done |
| 2 | `src/app/store/useSearchStore.ts` | done |
| 3 | `src/app/store/useUIStore.ts` | done |
| 4 | `src/app/store/index.ts` | done |
| 5 | `src/entities/theme/model/useThemeStore.ts` | done |
| 6 | `src/features/submission/model/useSubmissionStore.ts` | done |
| 7 | `src/features/submission/model/submissionSchema.ts` | done |
| 8 | `src/features/submission/model/types.ts` | done |

## Phase 7 — Shared UI Components

| # | File | Status |
|---|------|--------|
| 1 | `src/shared/ui/Accordion/Accordion.tsx` | done |
| 2 | `src/shared/ui/Alert/Alert.tsx` | done |
| 3 | `src/shared/ui/Badge/Badge.tsx` | done |
| 4 | `src/shared/ui/Breadcrumb/Breadcrumb.tsx` | done |
| 5 | `src/shared/ui/Button/Button.tsx` | done |
| 6 | `src/shared/ui/Checkbox/Checkbox.tsx` | done |
| 7 | `src/shared/ui/Image/Image.tsx` | done |
| 8 | `src/shared/ui/Input/Input.tsx` | done |
| 9 | `src/shared/ui/Layout/Container.tsx` | done |
| 10 | `src/shared/ui/Layout/Grid.tsx` | done |
| 11 | `src/shared/ui/Layout/Stack.tsx` | done |
| 12 | `src/shared/ui/Link/Link.tsx` | done |
| 13 | `src/shared/ui/Modal/Modal.tsx` | done |
| 14 | `src/shared/ui/Pagination/Pagination.tsx` | done |
| 15 | `src/shared/ui/ProgressBar/ProgressBar.tsx` | done |
| 16 | `src/shared/ui/Radio/Radio.tsx` | done |
| 17 | `src/shared/ui/ScrollToTop/ScrollToTop.tsx` | done |
| 18 | `src/shared/ui/Select/Select.tsx` | done |
| 19 | `src/shared/ui/Skeleton/Skeleton.tsx` | done |
| 20 | `src/shared/ui/Spinner/Spinner.tsx` | done |
| 21 | `src/shared/ui/Tabs/Tabs.tsx` | done |
| 22 | `src/shared/ui/Tag/Tag.tsx` | done |
| 23 | `src/shared/ui/Toast/Toast.tsx` | done |
| 24 | `src/shared/ui/Toast/Toaster.tsx` | done |
| 25 | `src/shared/ui/Tooltip/Tooltip.tsx` | done |
| 26 | `src/shared/ui/index.ts` | done |
| 27 | Storybook stories (15 `.stories.tsx` files) | done |

## Phase 8 — Feature Modules, Pages & Widgets

### Entities
| # | File | Status |
|---|------|--------|
| 1 | `entities/article/ui/ArticleBadge.tsx` | done |
| 2 | `entities/article/ui/ArticleCard.tsx` | done |
| 3 | `entities/article/ui/ArticleCardFull.tsx` | done |
| 4 | `entities/article/ui/ArticleMeta.tsx` | done |
| 5 | `entities/article/ui/AuthorList.tsx` | done |
| 6 | `entities/article/ui/KeywordList.tsx` | done |
| 7 | `entities/article/ui/index.ts` | done |
| 8 | `entities/book/ui/BookCard.tsx` | done |
| 9 | `entities/book/ui/ChapterCard.tsx` | done |
| 10 | `entities/book/ui/index.ts` | done |
| 11 | `entities/citation/ui/CitationDisplay.tsx` | done |
| 12 | `entities/citation/ui/ReferenceItem.tsx` | done |
| 13 | `entities/citation/ui/index.ts` | done |
| 14 | `entities/journal/ui/IssueCard.tsx` | done |
| 15 | `entities/journal/ui/JournalBadge.tsx` | done |
| 16 | `entities/journal/ui/JournalCard.tsx` | done |
| 17 | `entities/journal/ui/index.ts` | done |
| 18 | `entities/conference/index.ts` | done |

### Features
| # | File | Status |
|---|------|--------|
| 1 | `features/article/ui/AbstractSection.tsx` | done |
| 2 | `features/article/ui/AccessGate.tsx` | done |
| 3 | `features/article/ui/ArticleBody.tsx` | done |
| 4 | `features/article/ui/ArticleHero.tsx` | done |
| 5 | `features/article/ui/ArticleTableOfContents.tsx` | done |
| 6 | `features/article/ui/CitationTools.tsx` | done |
| 7 | `features/article/ui/FigureViewer.tsx` | done |
| 8 | `features/article/ui/ReferencesSection.tsx` | done |
| 9 | `features/article/index.ts` | done |
| 10 | `features/book/ui/BookHero.tsx` | done |
| 11 | `features/book/ui/ChapterList.tsx` | done |
| 12 | `features/book/index.ts` | done |
| 13 | `features/chapter/ui/ChapterHero.tsx` | done |
| 14 | `features/chapter/index.ts` | done |
| 15 | `features/editor/ui/EditorAnalytics.tsx` | done |
| 16 | `features/editor/ui/ReviewerAssigner.tsx` | done |
| 17 | `features/search/ui/AdvancedSearch.tsx` | done |
| 18 | `features/search/ui/SearchBar.tsx` | done |
| 19 | `features/search/ui/SearchSuggestions.tsx` | done |
| 20 | `features/search/index.ts` | done |
| 21 | `features/submission/ui/StatusTimeline.tsx` | done |
| 22 | `features/submission/ui/Step1ArticleType.tsx` | done |
| 23 | `features/submission/ui/Step2Authors.tsx` | done |
| 24 | `features/submission/ui/Step3Uploads.tsx` | done |
| 25 | `features/submission/ui/Step4Metadata.tsx` | done |
| 26 | `features/submission/ui/Step5Review.tsx` | done |
| 27 | `features/submission/ui/Step5SuggestedReviewers.tsx` | done |
| 28 | `features/user/ui/AlertsPanel.tsx` | done |
| 29 | `features/user/ui/LoginForm.tsx` | done |
| 30 | `features/user/ui/OrdersPanel.tsx` | done |
| 31 | `features/user/ui/RegisterForm.tsx` | done |
| 32 | `features/user/ui/ResearchHistoryPanel.tsx` | done |
| 33 | `features/user/ui/SavedArticlesPanel.tsx` | done |
| 34 | `features/user/ui/SubmissionsPanel.tsx` | done |
| 35 | `features/user/index.ts` | done |

### Pages
| # | File | Status |
|---|------|--------|
| 1 | `pages/account/ui/AccountDashboard.tsx` | done |
| 2 | `pages/account/ui/LoginPage.tsx` | done |
| 3 | `pages/account/ui/RegisterPage.tsx` | done |
| 4 | `pages/article/ui/ArticlePage.tsx` | done |
| 5 | `pages/article/ui/ArticleReadingPage.tsx` | done |
| 6 | `pages/author/ui/AuthorPage.tsx` | done |
| 7 | `pages/authors/ui/AuthorGuidelinesPage.tsx` | done |
| 8 | `pages/book/ui/BookPage.tsx` | done |
| 9 | `pages/careers/ui/CareersPage.tsx` | done |
| 10 | `pages/chapter/ui/ChapterPage.tsx` | done |
| 11 | `pages/checkout/ui/APCCheckoutPage.tsx` | done |
| 12 | `pages/checkout/ui/CheckoutPage.tsx` | done |
| 13 | `pages/collections/ui/CollectionDetailPage.tsx` | done |
| 14 | `pages/collections/ui/CollectionsPage.tsx` | done |
| 15 | `pages/conference/ui/ConferencePage.tsx` | done |
| 16 | `pages/contact/ui/ContactPage.tsx` | done |
| 17 | `pages/disciplines/ui/DisciplinesPage.tsx` | done |
| 18 | `pages/editor/ui/DecisionForm.tsx` | done |
| 19 | `pages/editor/ui/EditorDashboard.tsx` | done |
| 20 | `pages/error/ui/ErrorPage.tsx` | done |
| 21 | `pages/error/ui/NotFoundPage.tsx` | done |
| 22 | `pages/forgot-password/ui/ForgotPasswordPage.tsx` | done |
| 23 | `pages/home/ui/HomePage.tsx` | done |
| 24 | `pages/journal/ui/JournalHomePage.tsx` | done |
| 25 | `pages/journal/ui/JournalIssueListPage.tsx` | done |
| 26 | `pages/journal/ui/JournalLayout.tsx` | done |
| 27 | `pages/journal/ui/JournalStaticPages.tsx` | done |
| 28 | `pages/journal-list/ui/JournalListPage.tsx` | done |
| 29 | `pages/news/ui/NewsDetailPage.tsx` | done |
| 30 | `pages/news/ui/NewsPage.tsx` | done |
| 31 | `pages/reviewer/ui/ReviewForm.tsx` | done |
| 32 | `pages/reviewer/ui/ReviewerDashboard.tsx` | done |
| 33 | `pages/search/ui/SearchResultsPage.tsx` | done |
| 34 | `pages/static/ui/StaticContentPage.tsx` | done |
| 35 | `pages/subject-area/ui/SubjectAreaPage.tsx` | done |
| 36 | `pages/submission/ui/ProofingPage.tsx` | done |
| 37 | `pages/submission/ui/RevisionForm.tsx` | done |
| 38 | `pages/submission/ui/SubmissionPage.tsx` | done |
| 39 | All `pages/*/index.ts` barrel files | done |

### Widgets
| # | File | Status |
|---|------|--------|
| 1 | `widgets/GlobalFooter/GlobalFooter.tsx` | done |
| 2 | `widgets/GlobalHeader/GlobalHeader.tsx` | done |
| 3 | `widgets/MegaMenu/MegaMenu.tsx` | done |
| 4 | `widgets/TopBanner/TopBanner.tsx` | done |
| 5 | `widgets/article-sidebar/ui/ArticleSidebar.tsx` | done |
| 6 | `widgets/book-sidebar/ui/BookSidebar.tsx` | done |
| 7 | `widgets/discipline-grid/ui/DisciplineGrid.tsx` | done |
| 8 | `widgets/featured-journals/ui/FeaturedJournals.tsx` | done |
| 9 | `widgets/home-hero/ui/HomeHero.tsx` | done |
| 10 | `widgets/journal-hero/ui/JournalHero.tsx` | done |
| 11 | `widgets/journal-sidebar/ui/JournalSidebar.tsx` | done |
| 12 | `widgets/metrics-panel/ui/MetricsPanel.tsx` | done |
| 13 | `widgets/news-section/ui/NewsSection.tsx` | done |
| 14 | `widgets/search-filter-panel/ui/SearchFilterPanelContainer.tsx` | done |
| 15 | `widgets/search-filter-panel/ui/SearchFilterPanelView.tsx` | done |
| 16 | `widgets/search-results-list/ui/SearchResultsList.tsx` | done |
| 17 | `widgets/search-results-sidebar/ui/SearchResultsSidebar.tsx` | done |
| 18 | `widgets/submission-wizard/ui/SubmissionWizard.tsx` | done |
| 19 | `widgets/submission-wizard/ui/WizardStepper.tsx` | done |
| 20 | `widgets/index.ts` | done |
| 21 | Widget barrel files (`*/index.ts`) | done |
| 22 | Widget `.stories.tsx` files | done |

## Phase 9 — Types & Interfaces

| # | File | Status |
|---|------|--------|
| 1 | `src/shared/types/api.types.ts` | done |
| 2 | `src/shared/types/search.types.ts` | done |
| 3 | `src/shared/types/submission.types.ts` | done |
| 4 | `src/shared/types/user.types.ts` | done |
| 5 | `src/entities/article/model/types.ts` | done |
| 6 | `src/entities/book/model/types.ts` | done |
| 7 | `src/entities/collection/model/types.ts` | done |
| 8 | `src/entities/conference/model/types.ts` | done |
| 9 | `src/entities/journal/model/types.ts` | done |
| 10 | `src/features/submission/model/types.ts` | done |

## Phase 10 — Tests

| # | File | Status |
|---|------|--------|
| 1 | `src/test/setup.ts` | done |
| 2 | `src/features/search/utils/searchQueryUtils.test.ts` | done |
| 3 | `src/widgets/search-filter-panel/ui/SearchFilterPanel.test.tsx` | done |
| 4 | `e2e/a11y.spec.ts` | done |
| 5 | `e2e/home.spec.ts` | done |
| 6 | `e2e/mobile.spec.ts` | done |

## Phase 11 — Assets & Static Files

| # | File | Status |
|---|------|--------|
| 1 | `src/assets/react.svg` | done |
| 2 | `public/vite.svg` | done |
| 3 | `public/mockServiceWorker.js` | done |
| 4 | `public/mock-data/articles.json` | done |
| 5 | `public/mock-data/auth-ip-check.json` | done |
| 6 | `public/mock-data/auth-login.json` | done |
| 7 | `public/mock-data/books.json` | done |
| 8 | `public/mock-data/careers.json` | done |
| 9 | `public/mock-data/chapters.json` | done |
| 10 | `public/mock-data/collections.json` | done |
| 11 | `public/mock-data/conferences.json` | done |
| 12 | `public/mock-data/homepage.json` | done |
| 13 | `public/mock-data/journals.json` | done |
| 14 | `public/mock-data/news.json` | done |
| 15 | `public/mock-data/reviewers.json` | done |
| 16 | `public/mock-data/site-config.json` | done |
| 17 | `public/mock-data/user.json` | done |

## Phase 12 — Project-Specific & Catch-All

| # | File | Status |
|---|------|--------|
| 1 | `scripts/assign_disciplines.py` | done |
| 2 | `scripts/expand_mock_data.py` | done |
| 3 | `fetch-dom.cjs` | done |
| 4 | `journal-website.jsx` | done |
| 5 | `raw-dom.html` | done |
| 6 | Entity stories (`*.stories.tsx`) | done |
| 7 | Final cross-document consistency check | done |
| 8 | `AUDIT_SUMMARY.md` creation | done |
