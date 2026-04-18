# Lumex Frontend Replica — Libraries, Config & Setup

## package.json — All Dependencies

### Core
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "typescript": "^5.5.0"
  }
}
```

### State Management
```json
{
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.52.0",
  "@tanstack/react-query-devtools": "^5.52.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.0",
  "@hookform/resolvers": "^3.9.0"
}
```

### HTTP
```json
{
  "axios": "^1.7.0",
  "msw": "^2.4.0"
}
```

### Styling
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "clsx": "^2.1.0"
}
```

### UI Primitives (Radix UI)
```json
{
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-dialog": "^1.1.0",
  "@radix-ui/react-dropdown-menu": "^2.1.0",
  "@radix-ui/react-popover": "^1.1.0",
  "@radix-ui/react-select": "^2.1.0",
  "@radix-ui/react-tabs": "^1.1.0",
  "@radix-ui/react-tooltip": "^1.1.0",
  "@radix-ui/react-checkbox": "^1.1.0",
  "@radix-ui/react-radio-group": "^1.2.0",
  "@radix-ui/react-separator": "^1.1.0",
  "@radix-ui/react-progress": "^1.1.0",
  "@radix-ui/react-toast": "^1.2.0",
  "@radix-ui/react-scroll-area": "^1.1.0"
}
```

### Rich Text / Content
```json
{
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0",
  "rehype-raw": "^7.0.0",
  "rehype-sanitize": "^6.0.0",
  "katex": "^0.16.0",
  "react-katex": "^3.0.0"
}
```

### PDF
```json
{
  "pdfjs-dist": "^4.6.0",
  "react-pdf": "^9.1.0"
}
```

### Virtualization & Performance
```json
{
  "@tanstack/react-virtual": "^3.10.0"
}
```

### Icons & Animation
```json
{
  "react-icons": "^5.3.0",
  "framer-motion": "^11.5.0"
}
```

### SEO & Head
```json
{
  "react-helmet-async": "^2.0.0"
}
```

### File Upload
```json
{
  "react-dropzone": "^14.2.0"
}
```

### Utilities
```json
{
  "date-fns": "^3.6.0",
  "lodash-es": "^4.17.0"
}
```

### Dev Dependencies
```json
{
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@playwright/test": "^1.47.0",
    "@storybook/react": "^8.3.0",
    "@storybook/react-vite": "^8.3.0",
    "eslint": "^9.10.0",
    "@typescript-eslint/parser": "^8.6.0",
    "@typescript-eslint/eslint-plugin": "^8.6.0",
    "eslint-plugin-react": "^7.36.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.3.0",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0",
    "vite-bundle-visualizer": "^1.2.0"
  }
}
```

---

## vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          'query-vendor': ['@tanstack/react-query'],
          'pdf-vendor': ['pdfjs-dist'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

## tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@app/*": ["./src/app/*"],
      "@pages/*": ["./src/pages/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*": ["./src/shared/*"],
      "@mocks/*": ["./src/mocks/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lumex: {
          red: '#e8181d',
          'red-dark': '#c0141a',
          blue: '#025e8d',
          'blue-dark': '#013f5f',
          'oa-gold': '#f5a500',
          text: '#222222',
          muted: '#6b6b6b',
          border: '#dddddd',
          'bg-light': '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Source Sans Pro', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1400px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Key Config Files Summary

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build, path aliases, chunk splitting |
| `tsconfig.json` | TypeScript strict mode + path aliases |
| `tailwind.config.ts` | Lumex brand tokens, custom breakpoints |
| `.eslintrc.cjs` | TypeScript ESLint + React hooks rules |
| `.prettierrc` | Code formatting (2 spaces, single quotes) |
| `vitest.config.ts` | Unit test config with jsdom env |
| `playwright.config.ts` | E2E test config |
| `src/mocks/browser.ts` | MSW browser service worker setup |
| `public/mockServiceWorker.js` | MSW service worker (auto-generated) |

---

## MSW Setup (Mock Service Worker)

### src/mocks/browser.ts
```typescript
import { setupWorker } from 'msw/browser';
import { articleHandlers } from './handlers/article.handlers';
import { journalHandlers } from './handlers/journal.handlers';
import { searchHandlers } from './handlers/search.handlers';
import { authHandlers } from './handlers/auth.handlers';

export const worker = setupWorker(
  ...articleHandlers,
  ...journalHandlers,
  ...searchHandlers,
  ...authHandlers,
);
```

### src/app/main.tsx
```typescript
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('../mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode><App /></StrictMode>
  );
});
```

---

## Storybook Setup

All shared/ui components get a `.stories.tsx` file:
```
Button.stories.tsx
Badge.stories.tsx
ArticleCard.stories.tsx
JournalCard.stories.tsx
SearchBar.stories.tsx
```

Each story shows all variants (sizes, states, access types) for visual QA.
