# Lumex Frontend

Lumex is an open-access scientific publishing platform interface, built with a modern React stack and an explicit focus on type-safety, maintainability, and architectural sanity.

## Tech Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript 5 (Targeting Node >= 20)
- **Styling:** Tailwind CSS + Radix UI Primitives
- **State Management:** Zustand (Client state), TanStack Query (Server state)
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router DOM (v6 Data Router)
- **Testing:** Vitest + React Testing Library + Playwright

## Architecture: Feature-Sliced Design (FSD)

This project strictly adheres to the Feature-Sliced Design architectural methodology, organizing code by domain and responsibility rather than technical layers.

```text
src/
├── app/          # Core initialization: providers, router setup, global styles, root stores
├── pages/        # Route-level components: assemble widgets/features into full views
├── widgets/      # Compositional blocks: assemble features/entities into layout chunks (e.g. Header, Sidebar)
├── features/     # User interactions/business logic: modular capabilities (e.g. search, submit-article)
├── entities/     # Domain data: models, API queries, atomic UI for business objects (e.g. user, article)
└── shared/       # Cross-cutting concerns: base UI components, API clients, utilities, shared hooks
```

## Local Development
1. `npm install`
2. `npm run dev`

The dev server uses mock API handlers/JSON files for fallback UI development without a linked backend.

## Quality Standards
- Strict TypeScript enabled (`eslint-plugin-react` and `@typescript-eslint/recommended-type-checked`)
- Consistent naming: `PascalCase` components/interfaces, `camelCase` functions/variables/files.
- UI components live globally in `shared/ui` or co-located near their domain if highly specialized.
- Barrel exports `index.ts` strictly bound module directories.
