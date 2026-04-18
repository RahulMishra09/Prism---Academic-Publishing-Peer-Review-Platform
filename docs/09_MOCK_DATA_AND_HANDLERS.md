# Lumex Frontend Replica — Mock Data & MSW Handlers

## Mock Data Strategy

All mock data should be realistic and mirror actual Lumex content structure.
Place in `src/mocks/data/`

---

## articles.mock.ts — Example Structure
```typescript
import type { Article } from '@entities/article/types';

export const mockArticle: Article = {
  id: 'art-001',
  doi: '10.1007/s00285-024-02112-3',
  title: 'Spatiotemporal dynamics of predator-prey systems with Allee effects: a mathematical framework',
  subtitle: undefined,
  authors: [
    {
      id: 'auth-001',
      name: 'Sarah Chen',
      firstName: 'Sarah',
      lastName: 'Chen',
      orcid: '0000-0002-1825-0097',
      isCorresponding: true,
      affiliations: [{
        id: 'aff-001',
        name: 'University of Cambridge',
        department: 'Department of Applied Mathematics',
        city: 'Cambridge',
        country: 'UK',
        ror: '013meh722',
      }],
      creditRoles: ['Conceptualization', 'Methodology', 'Writing – original draft'],
    },
    // more authors...
  ],
  abstract: [
    { heading: 'Background', text: 'Population dynamics in ecological systems...' },
    { heading: 'Methods', text: 'We employ a coupled system of reaction-diffusion equations...' },
    { heading: 'Results', text: 'Our analysis reveals three distinct dynamical regimes...' },
    { heading: 'Conclusions', text: 'The Allee threshold plays a critical role...' },
  ],
  keywords: ['Allee effect', 'predator-prey', 'reaction-diffusion', 'Turing patterns', 'bifurcation'],
  articleType: 'research-article',
  accessLevel: 'open_access',
  license: 'CC BY',
  journalSlug: 'journal-of-mathematical-biology',
  journalTitle: 'Journal of Mathematical Biology',
  journalISSN: '0303-6812',
  volume: '88',
  issue: '4',
  pages: '1-34',
  publishedDate: '2024-03-15T00:00:00Z',
  receivedDate: '2023-09-22T00:00:00Z',
  acceptedDate: '2024-02-10T00:00:00Z',
  onlineDate: '2024-02-28T00:00:00Z',
  language: 'en',
  pdfUrl: '/mock-pdf/article-001.pdf',
  metrics: {
    views: 1842,
    downloads: 342,
    citations: 7,
    altmetricScore: 23,
  },
};

export const mockArticles: Article[] = [mockArticle, /* ... more */];
```

---

## journals.mock.ts — Example Structure
```typescript
import type { Journal } from '@entities/journal/types';

export const mockJournal: Journal = {
  id: 'j-001',
  slug: 'journal-of-mathematical-biology',
  title: 'Journal of Mathematical Biology',
  abbreviation: 'J. Math. Biol.',
  printISSN: '0303-6812',
  electronicISSN: '1432-1416',
  publisher: 'Lumex',
  accessType: 'hybrid',
  discipline: ['Mathematics', 'Biology', 'Life Sciences'],
  description: 'The Journal of Mathematical Biology focuses on mathematical biology...',
  aimsAndScope: '<p>The Journal publishes papers in which...</p>',
  coverImageUrl: '/mock-images/jmb-cover.jpg',
  metrics: {
    impactFactor: 2.6,
    impactFactorYear: 2023,
    citeScore: 5.2,
    quartile: 'Q1',
    hIndex: 78,
  },
  foundedYear: 1974,
  frequency: 'Monthly',
  language: ['English'],
  indexedIn: ['Scopus', 'Web of Science', 'PubMed', 'MathSciNet', 'zbMATH'],
  currentVolume: 88,
  articleProcessingCharge: 2890,
  apaCurrency: 'EUR',
};
```

---

## MSW Handlers

### article.handlers.ts
```typescript
import { http, HttpResponse } from 'msw';
import { mockArticles } from '../data/articles.mock';

export const articleHandlers = [
  // GET single article by DOI
  http.get('/api/articles/:doi', ({ params }) => {
    const { doi } = params;
    const decodedDOI = decodeURIComponent(doi as string);
    const article = mockArticles.find(a => a.doi === decodedDOI);
    if (!article) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ data: article });
  }),

  // GET article list for a journal
  http.get('/api/journals/:slug/articles', ({ params, request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const articles = mockArticles.filter(a => a.journalSlug === params.slug);
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      data: articles.slice(start, start + pageSize),
      totalCount: articles.length,
      page, pageSize,
      totalPages: Math.ceil(articles.length / pageSize),
    });
  }),
];
```

### search.handlers.ts
```typescript
import { http, HttpResponse } from 'msw';
import { mockArticles } from '../data/articles.mock';
import type { SearchResponse } from '@shared/types/search.types';

export const searchHandlers = [
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = 20;

    const results = mockArticles
      .filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      )
      .map(a => ({ type: 'article' as const, item: a }));

    const response: SearchResponse = {
      results: results.slice((page - 1) * pageSize, page * pageSize),
      totalCount: results.length,
      page, pageSize,
      queryTime: 45,
      facets: [
        {
          field: 'contentType',
          label: 'Content Type',
          values: [
            { value: 'article', label: 'Article', count: results.length, selected: false },
          ],
        },
        // more facets...
      ],
    };
    return HttpResponse.json(response);
  }),

  // Typeahead suggestions
  http.get('/api/search/suggestions', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? '';
    const suggestions = mockArticles
      .filter(a => a.title.toLowerCase().startsWith(q.toLowerCase()))
      .slice(0, 5)
      .map(a => ({ type: 'article', title: a.title, doi: a.doi }));
    return HttpResponse.json({ data: suggestions });
  }),
];
```

### auth.handlers.ts
```typescript
import { http, HttpResponse } from 'msw';
import { mockUser } from '../data/user.mock';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    if (email === 'test@lumex.com' && password === 'password') {
      return HttpResponse.json({
        data: { user: mockUser, accessToken: 'mock-jwt-token-123' }
      });
    }
    return HttpResponse.json(
      { error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/register', async () => {
    return HttpResponse.json({ data: { message: 'Registration successful' } });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer mock-jwt-token-123') {
      return HttpResponse.json({ data: mockUser });
    }
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ data: { message: 'Logged out' } });
  }),
];
```

---

## Disciplines Mock (constants/disciplines.ts)
```typescript
export const DISCIPLINES = [
  { id: 'mathematics', label: 'Mathematics', icon: 'MdFunctions', journalCount: 142 },
  { id: 'physics', label: 'Physics & Astronomy', icon: 'MdScience', journalCount: 89 },
  { id: 'chemistry', label: 'Chemistry', icon: 'MdBiotech', journalCount: 112 },
  { id: 'life-sciences', label: 'Life Sciences', icon: 'MdEco', journalCount: 234 },
  { id: 'medicine', label: 'Medicine', icon: 'MdMedicalServices', journalCount: 318 },
  { id: 'computer-science', label: 'Computer Science', icon: 'MdComputer', journalCount: 98 },
  { id: 'engineering', label: 'Engineering', icon: 'MdEngineering', journalCount: 176 },
  { id: 'social-sciences', label: 'Social Sciences', icon: 'MdPeople', journalCount: 145 },
  { id: 'economics', label: 'Economics', icon: 'MdBarChart', journalCount: 87 },
  { id: 'psychology', label: 'Psychology', icon: 'MdPsychology', journalCount: 94 },
  { id: 'education', label: 'Education', icon: 'MdSchool', journalCount: 67 },
  { id: 'environment', label: 'Earth & Environmental', icon: 'MdTerrain', journalCount: 108 },
  { id: 'materials', label: 'Materials Science', icon: 'MdCategory', journalCount: 73 },
  { id: 'energy', label: 'Energy', icon: 'MdBolt', journalCount: 45 },
  { id: 'law', label: 'Law', icon: 'MdGavel', journalCount: 62 },
  // ... more
] as const;
```
