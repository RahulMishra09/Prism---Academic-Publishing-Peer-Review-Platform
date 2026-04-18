# Lumex Audit Fix — Remaining Items

## Remaining Errors (2)
- [x] E-013 — Replace `as any` in API query files with typed fallback handling
- [x] E-011 — Remove `usePageTitle` hook, migrate consumers to `<Helmet>`

## Remaining Improvements (9)
- [x] I-003 — Extract router config from `App.tsx` to `app/router/routes.tsx`
- [x] I-004 — Consolidate localStorage patterns in hooks
- [x] I-006 — Discriminated union type for API fallback (linked to E-013)
- [x] I-007 — Replace boilerplate README
- [x] I-008 — Enable type-aware ESLint
- [x] I-015 — Standardize query key factory pattern
- [x] I-016 — Add barrel exports to all entities/features
- [x] I-017 — Add `engines` field to `package.json`
- [x] I-018 — Verify usage of 4 possibly unused packages

## Verification
- [x] `npx tsc -b --noEmit` — clean build
- [x] Update audit .md files in `frontend/audit/`

## ESLint Pass
- [x] Run `npx eslint "src/**/*.{ts,tsx}"` to find errors and warnings.
- [x] Fix identified ESLint errors and warnings.
