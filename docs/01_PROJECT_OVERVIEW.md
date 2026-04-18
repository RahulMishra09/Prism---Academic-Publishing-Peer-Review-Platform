# Lumex Frontend Replica — Project Overview

## Project Goal
Build a pixel-perfect, feature-complete 1:1 frontend replica of lumex.com using React + TypeScript. This document defines the complete project lifecycle, architecture, file structure, libraries, and principles.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS + CSS Modules (for scoped overrides) |
| State Management | Zustand (global) + React Query (server state) |
| Routing | React Router v6 |
| Form Handling | React Hook Form + Zod |
| HTTP Client | Axios + React Query |
| PDF Rendering | react-pdf / pdfjs-dist |
| Rich Text / Abstract Parsing | react-markdown + remark-gfm |
| DOI / Citation Utilities | Custom parsers |
| Virtualization | @tanstack/react-virtual |
| UI Primitives | Radix UI (headless) |
| Icons | react-icons (fa, md sets) |
| Animation | Framer Motion |
| Testing | Vitest + React Testing Library + Playwright (E2E) |
| Linting | ESLint + Prettier + Husky |
| i18n | react-i18next |
| Analytics (mock) | Custom event hook layer |

---

## Architecture Style
**Feature-Sliced Design (FSD)** — Layers: app → pages → widgets → features → entities → shared

---

## Development Principles
1. **Component isolation** — every component is independently renderable with mock data
2. **Type safety** — no `any`, strict TypeScript throughout
3. **Accessibility (WCAG 2.1 AA)** — all interactive elements keyboard navigable
4. **Mobile-first responsive** — mirrors Lumex's breakpoints (sm: 576, md: 768, lg: 992, xl: 1200, 2xl: 1400)
5. **Mock-first** — all data comes from mock JSON/fixtures so backend is not needed
6. **Lazy loading** — route-level code splitting for all pages
7. **SEO-ready** — react-helmet-async for head management
8. **Pixel-perfect** — match Lumex's exact typography, spacing, color tokens
