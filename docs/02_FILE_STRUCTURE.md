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
