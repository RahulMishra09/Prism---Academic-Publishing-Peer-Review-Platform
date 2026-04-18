# Lumex Codebase Audit — Central Registry

> Source-of-truth for all reusable pieces in the Lumex project.

---

## Custom Hooks

### Shared Hooks (`src/shared/hooks/`)

| Hook | Purpose | Params | Returns |
|------|---------|--------|---------|
| `useCopyToClipboard` | Copy text to clipboard, auto-reset after 2s | — | `{ copied, copy(text), error }` |
| `useDebounce<T>` | Debounce any value | `(value: T, delay = 300)` | `T` (debounced) |
| `useIntersectionObserver<T>` | Observe element visibility | `(options?: { triggerOnce?, threshold?, root?, rootMargin? })` | `[ref, isIntersecting]` |
| `useLocalStorage<T>` | Persist state in localStorage with cross-tab sync | `(key: string, initialValue: T)` | `[value, setValue]` |
| `useMediaQuery` | Reactive media query matching (uses `useSyncExternalStore`) | `(query: string)` | `boolean` |
| `useBreakpoint` | Convenience for Lumex breakpoints (mobile/tablet/desktop/wide) | — | `{ isMobile, isTablet, isDesktop, isWide }` |
| `usePageTitle` | Set `document.title` directly | `(title: string, suffix = ' \| Lumex')` | `void` |
| `useScrollPosition` | Track `window.scrollY` throttled via rAF | — | `number` |

### Feature Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useRecentlyViewed` | `features/article/hooks/` | Track recently viewed articles in localStorage (max 8) |
| `useSavedArticles` | `features/article/hooks/` | Save/unsave articles to localStorage |
| `useSearchState` | `features/search/api/` | URL-synced search state via `useSearchParams` |
| `useUserDashboard` | `features/user/api/` | TanStack Query hook for user dashboard data |

---

## Toast / Notification System

> **System**: Module Singleton (`useToast`) in `src/shared/ui/Toast/useToast.ts`

- **Variants**: `default | destructive`
- **Trigger**: `toast({ title?, description?, variant? })` (importable anywhere)
- **Auto-dismiss**: 5s, max 5 toasts
- **Used by**: `Toaster` component rendered in `App.tsx`

---

## Theme System

- **Store**: `src/entities/theme/model/useThemeStore.ts` (Zustand + persist)
- **Tokens**: CSS variables in `src/shared/ui/styles/variables.css` (`:root` + `.dark`)
- **Toggle**: `useThemeStore().toggleTheme()` / `setTheme('dark'|'light')`
- **Application**: `App.tsx` adds/removes `dark` class on `<html>`
- **Tailwind**: `darkMode: 'class'` in `tailwind.config.ts`
- **Persistence**: localStorage key `lumex-theme-storage`

---

## Global State

| Store | Location | Manages | Persistence |
|-------|----------|---------|-------------|
| `useAuthStore` | `app/store/` | User auth, institutional access, login/logout | `lumex-auth` (localStorage) |
| `useSearchStore` | `app/store/` | Search query, filters, sort, page | No |
| `useUIStore` | `app/store/` | Modal registry, toast queue | No |
| `useThemeStore` | `entities/theme/model/` | Light/dark theme | `lumex-theme-storage` |
| `useSubmissionStore` | `features/submission/model/` | Manuscript submission wizard draft | `lumex-submission-draft` |

---

## Shared UI Components (`src/shared/ui/`)

Accordion, Alert, Badge, Breadcrumb, Button, Checkbox, Image, Input, Layout (Container/Grid/Stack), Link, Modal, Pagination, ProgressBar, Radio, ScrollToTop, Select, Skeleton, Spinner, Tabs, Tag, Toast/Toaster, Tooltip

> All wrap Radix UI primitives. Full props API to be documented during Phase 7.

---

## API / Fetch Layer

- **Base client**: `src/shared/api/base.ts` → `fetchClient<T>(endpoint, options)` — adds auth token from localStorage
- **Fallback wrapper**: `src/shared/api/fetchWithFallback.ts` → Tries real API, falls back to `/public/mock-data/*.json`
- **Direct JSON**: `fetchFromJson<T>(jsonPath)` — fetches static JSON only
- **Query client**: `src/shared/api/queryClient.ts` — TanStack RC with 5min staleTime, 1 retry, no refetch on focus
- **Site config**: `src/shared/api/useSiteConfig.ts` — Global metrics/social links, `staleTime: Infinity`

### Entity Query Hooks (to be fully documented in Phase 5 continuation)
`articleQueries.ts`, `collectionQueries.ts`, `conferenceQueries.ts`, `journalQueries.ts`, `userQueries.ts`, `homepageQueries.ts`, `searchQueries.ts`

---

## Routing Conventions

- **Route constants**: `src/shared/constants/routes.ts` — `ROUTES` object with static paths and builder functions
- **Router**: `createBrowserRouter` in `App.tsx` with 38 lazy-loaded routes
- **Guards**: `ProtectedRoute` (redirects to /login with location state), `GuestRoute` (redirects authenticated users home)
- **Layout**: All routes nested under `PageLayout` (header/footer wrapper)
- **Lazy loading**: All pages use `React.lazy()` with named export pattern via barrel files

---

## Form Handling

- **Library**: React Hook Form v7 + `@hookform/resolvers`
- **Validation**: Zod v4 (`submissionSchema.ts`)
- **File uploads**: `react-dropzone`
- **Multi-step wizard**: `useSubmissionStore` for draft persistence

---

## Constants & Enums

| Constant | Location | Purpose |
|----------|----------|---------|
| `ROUTES` | `shared/constants/routes.ts` | All route paths |
| `ARTICLE_TYPES` | `shared/constants/articleTypes.ts` | 12 article type options |
| `DISCIPLINES` | `shared/constants/disciplines.ts` | 12 academic disciplines with slugs/icons |
| `LICENSE_TYPES` | `shared/constants/licenseTypes.ts` | 4 Creative Commons license types |

---

## Utility Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `parseSearchParams` | `features/search/utils/searchQueryUtils.ts` | Parse URLSearchParams → SearchParams object |
| `buildSearchParams` | `features/search/utils/searchQueryUtils.ts` | Build URLSearchParams from SearchParams |
