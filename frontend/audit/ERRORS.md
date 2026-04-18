# Lumex Codebase Audit — Errors & Bugs

> **Severity**: `critical` | `moderate` | `minor`

---

## Critical

### E-005 — Duplicate toast notification systems ( Fixed) (✅ Fixed)
- **Files**: `src/app/store/useUIStore.ts` L3–38, `src/shared/ui/Toast/useToast.ts` L1–62
- Two parallel toast systems sharing no state. `Toaster.tsx` uses System B only; System A (`useUIStore`) is likely dead code.
- **Fix**: Remove toast management from `useUIStore`.

### E-006 — Duplicate `HelmetProvider` ( Fixed) (✅ Fixed)
- **Files**: `src/main.tsx` L16, `src/App.tsx` L472
- Double-wrapped `HelmetProvider` creates two contexts. The inner shadows the outer.
- **Fix**: Remove from one location (keep in `main.tsx`).

### E-007 — `ROUTES.DISCIPLINE` path doesn't match router ( Fixed) (✅ Fixed)
- `src/shared/constants/routes.ts` L15 → `/discipline/${subject}`
- `src/App.tsx` L172 → `path: 'subject/:subject'`
- Links using `ROUTES.DISCIPLINE` will 404.
- **Fix**: Align route constant to `/subject/`.

## Moderate

### E-001 — Phantom `@mocks` path alias ( Fixed) (✅ Fixed)
- `vite.config.ts` L15, `tsconfig.app.json` L50–52 → `src/mocks/` doesn't exist.

### E-002 — `vitest.config.ts` missing path aliases ( Fixed) (✅ Fixed)
- No aliases matching `vite.config.ts`. Tests using `@shared/`, `@app/` will fail.

### E-008 — `fetchClient` throws plain object, not Error ( Fixed) (✅ Fixed)
- `src/shared/api/base.ts` L26–31 — `catch(err)` blocks checking `err instanceof Error` won't match.
- **Fix**: Create `class ApiError extends Error`.

### E-009 — `useThemeStore` reads `window.matchMedia` at module init ( Fixed) (✅ Fixed)
- `src/entities/theme/model/useThemeStore.ts` L15 — crashes in SSR/test environments.

### E-012 — Duplicate `SortOption` and `SearchFilters` types ( Fixed) (✅ Fixed)
- `src/shared/types/search.types.ts` L4: `SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'citations' | 'views'`
- `src/app/store/useSearchStore.ts` L3: `SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'citations' | 'title'`
- Different values (`views` vs `title`). `SearchFilters` also duplicated with different shapes.
- **Fix**: Use a single canonical type from `shared/types/`.

### E-013 — Extensive `as any` type assertions in API query files ( Fixed) (✅ Fixed)
- `src/entities/article/api/articleQueries.ts` — 7 instances of `(res as any)`
- `src/entities/journal/api/journalQueries.ts` — 3 instances
- Fragile pattern for fallback JSON handling. A type mismatch silently produces undefined.
- **Fix**: Create a discriminated union type for API vs fallback responses.

### E-014 — Submission schema step numbering mismatch ( Fixed) (✅ Fixed)
- `src/features/submission/model/submissionSchema.ts` — `Step5Schema` validates `agreedToTerms`, `Step6Schema` validates `suggestedReviewers`
- `src/shared/types/submission.types.ts` — Comments say Step 5 = Agreements, Step 6 = Suggested Reviewers
- In `FullSubmissionSchema` L90–91, `Step6Schema` is spread before `Step5Schema`.

## Minor

### E-003 — Build artifacts not gitignored ( Fixed) (✅ Fixed)
- `.gitignore` — `build.txt`, log files, debug artifacts tracked in VCS.

### E-004 — Prettier LF vs Windows CRLF conflict ( Fixed) (✅ Fixed)
- `.prettierrc` L9 — `endOfLine: "lf"` without `.gitattributes`.

### E-010 — `useCopyToClipboard` setTimeout not cleaned on unmount ( Fixed) (✅ Fixed)
- `src/shared/hooks/useCopyToClipboard.ts` L19

### E-011 — `usePageTitle` redundant with `react-helmet-async` ( Fixed) (✅ Fixed)
- `src/shared/hooks/usePageTitle.ts` — sets `document.title` directly, bypassing Helmet.

### E-015 — `SearchResult.item` typed with explicit `any` ( Fixed) (✅ Fixed)
- `src/shared/types/search.types.ts` L51 — `item: Article | Journal | any`

### E-016 — `ConferencePaper.id` is `number`, all other entity IDs are `string` ( Fixed) (✅ Fixed)
- `src/entities/conference/model/types.ts` L2 — inconsistent ID type.

### E-017 — `components/layouts/` directory is empty ( Fixed) (✅ Fixed)
- `src/components/layouts/` exists but contains no files. Dead directory.
