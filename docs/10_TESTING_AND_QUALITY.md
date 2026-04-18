# Lumex Frontend Replica — Testing Strategy & Pixel-Perfect Guidelines

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
All utility files must have 100% coverage.

**Priority test files:**
- `doiUtils.test.ts`
- `citationFormatter.test.ts`
- `abstractParser.test.ts`
- `xmlParser.test.ts`
- `searchQueryUtils.test.ts`
- `accessUtils.test.ts`
- `authorUtils.test.ts`
- `dateUtils.test.ts`

**Component tests (key components):**
- `ArticleCard.test.tsx`
- `SearchBar.test.tsx`
- `AccessGate.test.tsx`
- `SubmissionWizard.test.tsx`
- `CitationTools.test.tsx`
- `Pagination.test.tsx`

### Integration Tests
- Full search flow: type → suggestions → submit → results → filter
- Article page render: abstract, full text, references
- Auth flow: login → protected route → logout
- Submission wizard: all 5 steps

### E2E Tests (Playwright)
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

**E2E test scenarios:**
1. Home page loads, discipline grid renders
2. Search: enter query → navigate to results → apply filter → paginate
3. Navigate to journal → view issues → click article
4. Article page: tabs work, PDF viewer opens, cite modal works
5. Login flow → access protected My Account page
6. Submit manuscript: complete all 5 steps
7. Mobile navigation: hamburger → menu → navigate

---

## Pixel-Perfect Guidelines

### Typography
| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Page title | Source Sans Pro | 600 | 28px | #222 |
| Article title | Merriweather | 700 | 24px | #222 |
| Section heading | Source Sans Pro | 600 | 18px | #222 |
| Body text | Source Sans Pro | 400 | 16px | #333 |
| Author names | Source Sans Pro | 400 | 14px | #025e8d |
| DOI | Source Code Pro | 400 | 13px | #025e8d |
| Abstract text | Source Sans Pro | 400 | 15px | #444 |
| Reference text | Source Sans Pro | 400 | 13px | #333 |
| Caption text | Source Sans Pro | 400 | 12px | #555 |
| Journal name | Source Sans Pro | 600 | 14px | #333 |

### Color Usage
| Context | Color |
|---------|-------|
| Primary action buttons | #e8181d (Lumex red) |
| Links | #025e8d |
| Link hover | #013f5f |
| Open Access badge | #f5a500 background |
| Free to Read badge | #4caf50 |
| Requires Purchase | #777 |
| Border/dividers | #dddddd |
| Light backgrounds | #f5f5f5 |
| Warning/notice | #fff3cd |
| Error | #f8d7da |

### Spacing Scale (mirrors Lumex)
```
4px   — xs (tight labels)
8px   — sm (internal padding)
12px  — md-sm
16px  — md (standard gap)
24px  — lg (section spacing)
32px  — xl
48px  — 2xl (major sections)
64px  — 3xl (page sections)
```

### Key Component Measurements
| Component | Measurement |
|-----------|------------|
| Global header height | 56px desktop, 48px mobile |
| Top announcement banner | 40px |
| Container max-width | 1200px |
| Article page sidebar width | 300px |
| Search filter panel width | 260px |
| Journal cover image | 120px × 160px |
| Article card min-height | 180px |

---

## Accessibility Requirements (WCAG 2.1 AA)

- All interactive elements have `:focus-visible` ring (2px, #025e8d offset)
- Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
- All images have `alt` attributes
- All form fields have associated `<label>` elements
- Skip-to-main-content link at top of page
- ARIA landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`, `<aside>`
- `aria-live` regions for dynamic search results
- Modal traps focus (Radix Dialog handles this)
- All tabs are keyboard navigable (arrow keys)
- Article figures have full captions as `aria-describedby`

---

## SEO Configuration (react-helmet-async)

Each page sets:
```tsx
<Helmet>
  <title>{article.title} | {journal.title} | Lumex</title>
  <meta name="description" content={truncateAbstract(abstractText, 160)} />
  <meta property="og:title" content={article.title} />
  <meta property="og:description" content={truncateAbstract(abstractText, 200)} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://link.lumex.com/article/${article.doi}`} />
  <meta name="citation_doi" content={article.doi} />
  <meta name="citation_title" content={article.title} />
  <meta name="citation_journal_title" content={journal.title} />
  <meta name="citation_issn" content={journal.electronicISSN} />
  <link rel="canonical" href={canonicalUrl} />
</Helmet>
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Bundle size (initial) | < 200KB gzipped |
| Time to Interactive | < 3s |
| Lighthouse Performance | > 85 |
| Lighthouse Accessibility | > 95 |
