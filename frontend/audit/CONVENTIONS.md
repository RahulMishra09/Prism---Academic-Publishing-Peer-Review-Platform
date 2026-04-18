# Lumex Codebase Audit — Conventions

> Inferred or explicit coding standards, naming patterns, folder structure rules, and architectural decisions.

---

## Architecture

- **Pattern**: Feature-Sliced Design (FSD) — `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`
- **There is also a `components/layouts/` directory** which sits outside FSD layer hierarchy (appears empty)
- **Build tool**: Vite 7 with React plugin
- **Language**: TypeScript with strict mode enabled (`tsconfig.app.json`)
- **State management**: Zustand stores (`@app/store/`, entity and feature stores)
- **Server state**: TanStack React Query
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v3 with CSS variable-based design tokens
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest (unit), Playwright (e2e), axe-core (a11y)
- **Mocking**: MSW (Mock Service Worker) with `/public/mock-data/` JSON files
- **Components**: Radix UI primitives wrapped in custom shared components
- **Animation**: Framer Motion
- **SEO**: react-helmet-async

## Folder Structure

```
frontend/
├── src/
│   ├── app/          ← Application shell: layouts, router guards, global stores
│   ├── pages/        ← Route-level page components (1 dir per route)
│   ├── widgets/      ← Complex composed UI blocks (header, footer, sidebars)
│   ├── features/     ← Business feature logic (UI + hooks + API)
│   ├── entities/     ← Domain entities (types, UI cards, API queries)
│   ├── shared/       ← Reusable primitives: UI components, hooks, utils, types, API, constants
│   ├── components/   ← Legacy(?) directory with only layout files (mostly empty)
│   ├── assets/       ← Static assets (SVGs)
│   └── test/         ← Test setup
├── e2e/              ← Playwright e2e tests
├── public/           ← Static files + mock data JSON files
├── scripts/          ← Python utility scripts for mock data
└── docs/             ← Project documentation (11 files)
```

## Naming Conventions

- **Files**: PascalCase for components (`ArticleCard.tsx`), camelCase for hooks (`useDebounce.ts`), camelCase for utilities and constants
- **Directories**: kebab-case for multi-word dirs (`search-filter-panel/`), camelCase for single-word dirs (`article/`)
- **Stores**: `use<Name>Store.ts` (Zustand convention)
- **Query hooks**: `<entity>Queries.ts` for TanStack Query definitions
- **Types**: `types.ts` in `model/` subdirectory per entity
- **Barrel files**: `index.ts` for public API exports from each module

## Import / Export Patterns

- **Path aliases**: `@app/*`, `@pages/*`, `@widgets/*`, `@features/*`, `@entities/*`, `@shared/*`, `@mocks/*`
- **Barrel exports**: Each FSD slice exports via `index.ts`
- **Type imports**: ESLint enforces `type` keyword for type-only imports (`consistent-type-imports` rule)

## Styling Conventions

- **CSS framework**: Tailwind CSS v3 with `darkMode: 'class'`
- **Design tokens**: CSS variables (`--lumex-*`) mapped into Tailwind config (`lumex.*` classes)
- **Fonts**: Plus Jakarta Sans (sans), Fraunces (serif), Source Code Pro (mono)
- **Custom breakpoints**: sm=576, md=768, lg=992, xl=1200, 2xl=1400
- **Animations**: Custom `fadeUp` and `float` keyframes defined in Tailwind config
- **Custom CSS**: Additional styles in `src/shared/ui/styles/variables.css` and `typography.css`

## Code Quality Enforcement

- **Pre-commit hook**: Husky runs `lint-staged` → ESLint fix + Prettier write on staged `.ts`/`.tsx`/`.css` files
- **ESLint**: Flat config with strict React/TS rules, `no-console` (warn), `eqeqeq` (error), `prefer-const` (error)
- **Prettier**: 4-space tabs, single quotes, trailing commas, LF line endings, 100 char print width
- **TypeScript**: Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

## Inconsistencies

### CONV-001 — Mixed directory naming (camelCase vs kebab-case in `widgets/`) ( Fixed) (✅ Fixed)
- `widgets/GlobalFooter/` (PascalCase) vs `widgets/article-sidebar/` (kebab-case)
- Not necessarily wrong (PascalCase for standalone, kebab-case for composed), but convention is unclear

### CONV-002 — `components/layouts/` directory alongside FSD `app/layouts/` ( Fixed) (✅ Fixed)
- Both `src/components/layouts/` and `src/app/layouts/` exist. The `components/` dir appears empty. Should be removed or clarified.

### CONV-003 — Some entities have `index.ts` barrel export, some don't ( Fixed) (✅ Fixed)
- `entities/conference/index.ts` exists but other entity dirs (like `entities/theme/`) don't have one. Inconsistent public API pattern.
