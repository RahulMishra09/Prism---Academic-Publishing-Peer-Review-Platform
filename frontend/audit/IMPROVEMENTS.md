# Lumex Codebase Audit — Improvements

> **Priority**: `high` | `medium` | `low`

---

## High Priority

### I-001 — Move build/test packages to devDependencies ( Fixed) (✅ Fixed)
- `package.json` — `autoprefixer`, `msw`, `postcss`, `tailwindcss`

### I-002 — Add path aliases to `vitest.config.ts` ( Fixed) (✅ Fixed)
- Tests using `@shared/`, `@app/` will fail without matching aliases.

### I-003 — Extract router config from `App.tsx` (✅ Fixed)
- 482-line file is 90% route defs. Extract to `app/router/routes.tsx`.

### I-004 — Consolidate localStorage patterns (✅ Fixed)
- `useRecentlyViewed` and `useSavedArticles` duplicate `useLocalStorage` patterns.

### I-005 — Unify search types (✅ Fixed)
- Duplicate `SortOption`, `SearchFilters`, `ContentType` in `search.types.ts` and `useSearchStore.ts`. Use canonical types from `shared/types/`.

### I-006 — Create discriminated union type for API fallback responses (✅ Fixed)
- All query hooks use `(res as any)` to handle real API vs mock JSON. Type-safe solution: `type ApiOrFallback<T> = ApiResponse<T> | FallbackResponse<T>`.

## Medium Priority

### I-007 — Replace boilerplate README (✅ Fixed)
- Default Vite template. Add project docs, setup, architecture overview.

### I-008 — Enable type-aware ESLint (✅ Fixed)
- Upgrade to `recommendedTypeChecked` for better bug detection.

### I-009 — Add `.editorconfig` + `.gitattributes` (✅ Fixed)
- Cross-editor indent/EOL consistency.

### I-010 — Clean up root-level debug artifacts (✅ Fixed)
- `build.txt`, `lint_output*.txt`, etc. should be gitignored.

### I-011 — Unify toast systems (✅ Fixed)
- Remove toast from `useUIStore`; keep `useToast` singleton.

### I-012 — Type `fetchClient` error as proper Error class (✅ Fixed)
- Create `class ApiError extends Error`.

### I-013 — Fix hardcoded colors in CSS (✅ Fixed)
- `typography.css` has hardcoded body bg, link color, scrollbar thumb — break in dark mode.

### I-014 — Add missing dark mode CSS variable overrides (✅ Fixed)
- `--lumex-accent-dark`, `--lumex-red*`, `--lumex-oa-gold`, `--lumex-tag-*` missing from `.dark`.

### I-015 — Standardize query key factory pattern (✅ Fixed)
- `collectionQueries.ts` uses bare `['collections']` string literals; `articleQueries.ts` uses proper key factory. Apply factory pattern consistently.

### I-016 — Add barrel exports to all entities and features (✅ Fixed)
- `entities/theme/`, `entities/user/`, etc. missing `index.ts`. Inconsistent public API.

## Low Priority

### I-017 — Add `engines` field to `package.json` ( Fixed) (✅ Fixed)
- No minimum Node.js version specified.

### I-018 — Verify usage of `@tanstack/react-virtual`, `@radix-ui/react-scroll-area`, `@radix-ui/react-separator`, `lodash-es` ( Fixed) (✅ Fixed)

### I-019 — Replace `usePageTitle` hook usage with `<Helmet>` component ( Fixed) (✅ Fixed)
- Hook sets `document.title` directly, races with react-helmet-async.

### I-020 — Remove empty `src/components/layouts/` directory ( Fixed) (✅ Fixed)
- Dead directory with no files.
