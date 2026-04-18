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
