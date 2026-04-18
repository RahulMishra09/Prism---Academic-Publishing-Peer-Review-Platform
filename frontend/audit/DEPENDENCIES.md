# Lumex Codebase Audit — Dependencies

> Third-party packages audit — used, unused, outdated, or misconfigured.

---

## Production Dependencies

| Package | Version | Used? | Purpose | Notes |
|---------|---------|-------|---------|-------|
| `@hookform/resolvers` | ^5.2.2 | ✅ | Zod resolver for react-hook-form | |
| `@radix-ui/react-accordion` | ^1.2.12 | ✅ | Accordion primitive | Shared UI wraps this |
| `@radix-ui/react-checkbox` | ^1.3.3 | ✅ | Checkbox primitive | |
| `@radix-ui/react-dialog` | ^1.1.15 | ✅ | Modal dialog primitive | |
| `@radix-ui/react-dropdown-menu` | ^2.1.16 | ✅ | Dropdown menus | |
| `@radix-ui/react-popover` | ^1.1.15 | ✅ | Popover primitive | |
| `@radix-ui/react-progress` | ^1.1.8 | ✅ | ProgressBar primitive | |
| `@radix-ui/react-radio-group` | ^1.3.8 | ✅ | Radio group primitive | |
| `@radix-ui/react-scroll-area` | ^1.2.10 | ⚠️ | Scroll area | Verify usage |
| `@radix-ui/react-select` | ^2.2.6 | ✅ | Select primitive | |
| `@radix-ui/react-separator` | ^1.1.8 | ⚠️ | Separator | Verify usage |
| `@radix-ui/react-tabs` | ^1.1.13 | ✅ | Tabs primitive | |
| `@radix-ui/react-toast` | ^1.2.15 | ✅ | Toast primitive | |
| `@radix-ui/react-tooltip` | ^1.2.8 | ✅ | Tooltip primitive | |
| `@tanstack/react-query` | ^5.90.21 | ✅ | Server state / data fetching | |
| `@tanstack/react-query-devtools` | ^5.91.3 | ✅ | Query devtools | Consider move to devDeps |
| `@tanstack/react-virtual` | ^3.13.19 | ⚠️ | Virtual scrolling | Verify usage |
| `autoprefixer` | ^10.4.0 | ✅ | PostCSS autoprefixer | ⚠️ **Should be devDependency** |
| `axios` | ^1.13.5 | ✅ | HTTP client | |
| `clsx` | ^2.1.1 | ✅ | Conditional classNames | |
| `date-fns` | ^4.1.0 | ✅ | Date formatting | |
| `framer-motion` | ^12.34.3 | ✅ | Animations | |
| `katex` | ^0.16.33 | ✅ | Math rendering | |
| `lodash-es` | ^4.17.23 | ⚠️ | Utility library | Check if tree-shaking works; verify usage |
| `msw` | ^2.12.10 | ✅ | Mock Service Worker | ⚠️ **Should be devDependency** |
| `pdfjs-dist` | ^5.4.624 | ✅ | PDF rendering backend | |
| `postcss` | ^8.4.0 | ✅ | CSS processor | ⚠️ **Should be devDependency** |
| `react` | ^18.3.0 | ✅ | UI framework | |
| `react-dom` | ^18.3.0 | ✅ | React DOM renderer | |
| `react-dropzone` | ^15.0.0 | ✅ | File upload drag-and-drop | |
| `react-helmet-async` | ^2.0.5 | ✅ | SEO / head management | |
| `react-hook-form` | ^7.71.2 | ✅ | Form state management | |
| `react-icons` | ^5.5.0 | ✅ | Icon library | |
| `react-katex` | ^3.1.0 | ✅ | React wrapper for KaTeX | |
| `react-markdown` | ^10.1.0 | ✅ | Markdown rendering | |
| `react-pdf` | ^10.4.1 | ✅ | PDF viewer component | |
| `react-router-dom` | ^7.13.1 | ✅ | Client-side routing | |
| `rehype-raw` | ^7.0.0 | ✅ | Allow raw HTML in markdown | |
| `rehype-sanitize` | ^6.0.0 | ✅ | Sanitize HTML in markdown | |
| `remark-gfm` | ^4.0.1 | ✅ | GFM markdown support | |
| `tailwindcss` | ^3.4.0 | ✅ | CSS framework | ⚠️ **Should be devDependency** |
| `zod` | ^4.3.6 | ✅ | Schema validation | |
| `zustand` | ^5.0.11 | ✅ | Global state management | |

## Dev Dependencies

| Package | Version | Used? | Purpose | Notes |
|---------|---------|-------|---------|-------|
| `@axe-core/playwright` | ^4.11.1 | ✅ | a11y testing | |
| `@eslint/js` | ^9.39.1 | ✅ | ESLint JS configs | |
| `@playwright/test` | ^1.58.2 | ✅ | E2E test runner | |
| `@storybook/react` | ^10.2.13 | ✅ | Component docs | |
| `@storybook/react-vite` | ^10.2.13 | ✅ | Storybook Vite builder | |
| `@testing-library/jest-dom` | ^6.9.1 | ✅ | DOM matchers | |
| `@testing-library/react` | ^16.3.2 | ✅ | React testing utils | |
| `@testing-library/user-event` | ^14.6.1 | ✅ | User interaction simulation | |
| `@types/node` | ^24.10.14 | ✅ | Node.js types | |
| `@types/react` | ^18.3.0 | ✅ | React types | |
| `@types/react-dom` | ^18.3.0 | ✅ | React DOM types | |
| `@typescript-eslint/eslint-plugin` | ^8.56.1 | ✅ | TS ESLint rules | |
| `@typescript-eslint/parser` | ^8.56.1 | ✅ | TS ESLint parser | |
| `@vitejs/plugin-react` | ^5.1.1 | ✅ | Vite React plugin | |
| `eslint` | ^9.39.3 | ✅ | Linter | |
| `eslint-plugin-react` | ^7.37.5 | ✅ | React lint rules | |
| `eslint-plugin-react-hooks` | ^7.0.1 | ✅ | Hooks lint rules | |
| `eslint-plugin-react-refresh` | ^0.4.24 | ✅ | HMR lint rules | |
| `globals` | ^16.5.0 | ✅ | Global var definitions | |
| `husky` | ^9.1.7 | ✅ | Git hooks | |
| `jsdom` | ^28.1.0 | ✅ | DOM environment for tests | |
| `lint-staged` | ^16.2.7 | ✅ | Run linters on staged files | |
| `prettier` | ^3.8.1 | ✅ | Code formatter | |
| `typescript` | ~5.9.3 | ✅ | TS compiler | |
| `typescript-eslint` | ^8.48.0 | ✅ | TS ESLint integration | |
| `vite` | ^7.3.1 | ✅ | Build tool | |
| `vite-bundle-visualizer` | ^1.2.1 | ✅ | Bundle analysis | |
| `vitest` | ^4.0.18 | ✅ | Unit test runner | |

## Findings

### Misplaced Dependencies
1. **`msw`** (package.json L44) — Mock Service Worker is a dev/test tool. Should be in `devDependencies`.
2. **`postcss`** (package.json L46) — PostCSS is a build tool. Should be in `devDependencies`.
3. **`autoprefixer`** (package.json L37) — Build tool plugin. Should be in `devDependencies`.
4. **`tailwindcss`** (package.json L60) — Build-time CSS framework. Should be in `devDependencies`.
5. **`@tanstack/react-query-devtools`** (package.json L35) — Devtools panel. Consider moving to `devDependencies` (though it tree-shakes in production).

### Packages Requiring Usage Verification
1. **`@radix-ui/react-scroll-area`** — No shared UI wrapper component found. May be used inline.
2. **`@radix-ui/react-separator`** — No shared UI wrapper component found. May be used inline.
3. **`@tanstack/react-virtual`** — No obvious usage discovered yet. Verify during Phase 8.
4. **`lodash-es`** — Verify actual number of functions used; might be replaceable with native alternatives.

### Missing Packages
_(none identified yet — will check during later phases)_
