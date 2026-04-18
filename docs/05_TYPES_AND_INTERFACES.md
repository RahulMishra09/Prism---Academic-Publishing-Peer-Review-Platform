# Lumex Frontend Replica — TypeScript Types & Interfaces

## Core Domain Types

### Article (entities/article/types.ts)
```typescript
export type AccessLevel = 'open_access' | 'subscribed' | 'requires_purchase' | 'free_to_read';
export type ArticleType = 
  | 'research-article' | 'review-article' | 'letter' | 'editorial'
  | 'case-report' | 'correction' | 'brief-communication' | 'book-review'
  | 'short-communication' | 'erratum' | 'conference-paper';

export type LicenseType = 
  | 'CC BY' | 'CC BY-NC' | 'CC BY-ND' | 'CC BY-SA' | 'CC BY-NC-ND'
  | 'CC BY-NC-SA' | 'Lumex Standard' | 'Open Government';

export interface Author {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  orcid?: string;
  email?: string;
  isCorresponding: boolean;
  affiliations: Affiliation[];
  equalContribution?: boolean;
  creditRoles?: CRediTRole[];
}

export interface Affiliation {
  id: string;
  name: string;
  department?: string;
  city?: string;
  country: string;
  ror?: string;  // Research Organization Registry ID
}

export type CRediTRole =
  | 'Conceptualization' | 'Data curation' | 'Formal Analysis' | 'Funding acquisition'
  | 'Investigation' | 'Methodology' | 'Project administration' | 'Resources'
  | 'Software' | 'Supervision' | 'Validation' | 'Visualization' | 'Writing – original draft'
  | 'Writing – review & editing';

export interface ArticleAbstractSection {
  heading?: string;
  text: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  content: string;  // HTML content
  subsections?: ArticleSection[];
}

export interface ArticleFigure {
  id: string;
  number: number;
  caption: string;
  url: string;
  highResUrl?: string;
  alt: string;
  type: 'figure' | 'table' | 'scheme' | 'equation';
}

export interface ArticleReference {
  id: string;
  index: number;
  rawText: string;
  doi?: string;
  url?: string;
  authors: string[];
  title?: string;
  journal?: string;
  year?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  type: 'journal' | 'book' | 'website' | 'conference' | 'preprint' | 'other';
}

export interface ArticleMetrics {
  views?: number;
  downloads?: number;
  citations?: number;
  altmetricScore?: number;
  altmetricBadgeUrl?: string;
}

export interface Article {
  id: string;
  doi: string;
  title: string;
  subtitle?: string;
  authors: Author[];
  abstract: ArticleAbstractSection[];
  fullAbstractHtml?: string;
  keywords: string[];
  articleType: ArticleType;
  accessLevel: AccessLevel;
  license?: LicenseType;
  journalSlug: string;
  journalTitle: string;
  journalISSN: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publishedDate: string;  // ISO date
  acceptedDate?: string;
  receivedDate?: string;
  onlineDate?: string;
  language: string;
  pdfUrl?: string;
  htmlUrl?: string;
  sections?: ArticleSection[];
  figures?: ArticleFigure[];
  tables?: ArticleFigure[];
  references?: ArticleReference[];
  supplementaryFiles?: SupplementaryFile[];
  metrics?: ArticleMetrics;
  price?: number;
  currency?: string;
  relatedArticles?: ArticleSummary[];
  retracted?: boolean;
  correctionNote?: string;
}

export type ArticleSummary = Pick<
  Article, 
  'id' | 'doi' | 'title' | 'authors' | 'publishedDate' | 'articleType' | 
  'accessLevel' | 'journalTitle' | 'journalSlug' | 'metrics'
>;

export interface SupplementaryFile {
  id: string;
  name: string;
  description?: string;
  url: string;
  size: number;  // bytes
  type: string;  // MIME type
}
```

### Journal (entities/journal/types.ts)
```typescript
export type JournalAccessType = 'hybrid' | 'gold_oa' | 'subscription' | 'free';

export interface JournalMetrics {
  impactFactor?: number;
  impactFactorYear?: number;
  citeScore?: number;
  hIndex?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  snip?: number;  // Source Normalized Impact per Paper
  sjr?: number;   // SCImago Journal Rank
}

export interface JournalEditorialBoard {
  editorInChief: Author[];
  managingEditors?: Author[];
  sectionEditors?: Array<Author & { section: string }>;
  associateEditors?: Author[];
  editorialBoard?: Author[];
  honoraryEditors?: Author[];
}

export interface JournalIssue {
  id: string;
  journalSlug: string;
  volume: number;
  issue: number;
  year: number;
  month?: number;
  publishedDate: string;
  articleCount: number;
  coverImageUrl?: string;
  articles?: ArticleSummary[];
}

export interface Journal {
  id: string;
  slug: string;
  title: string;
  abbreviation?: string;
  printISSN?: string;
  electronicISSN: string;
  publisher: string;
  accessType: JournalAccessType;
  discipline: string[];
  subdiscipline?: string[];
  description: string;
  aimsAndScope: string;  // HTML
  coverImageUrl?: string;
  logoUrl?: string;
  metrics?: JournalMetrics;
  foundedYear?: number;
  frequency?: string;  // e.g. "Monthly", "Bimonthly"
  language: string[];
  indexedIn?: string[];  // Scopus, Web of Science, PubMed, etc.
  editorialBoard?: JournalEditorialBoard;
  submissionUrl?: string;
  latestIssue?: JournalIssue;
  currentVolume?: number;
  articleProcessingCharge?: number;
  apaCurrency?: string;
}
```

### Search (shared/types/search.types.ts)
```typescript
export type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'citations' | 'views';
export type ContentTypeFilter = 'article' | 'book' | 'chapter' | 'conference-paper' | 'protocol';

export interface SearchFilters {
  contentType?: ContentTypeFilter[];
  discipline?: string[];
  journal?: string[];
  accessType?: AccessLevel[];
  language?: string[];
  dateFrom?: string;
  dateTo?: string;
  articleType?: ArticleType[];
}

export interface SearchParams {
  query: string;
  filters: SearchFilters;
  sortBy: SortOption;
  page: number;
  pageSize: number;
  // Advanced search fields
  titleSearch?: string;
  authorSearch?: string;
  abstractSearch?: string;
  issnSearch?: string;
  doiSearch?: string;
}

export interface SearchFacet {
  field: string;
  label: string;
  values: Array<{
    value: string;
    label: string;
    count: number;
    selected: boolean;
  }>;
}

export interface SearchResult {
  type: 'article' | 'book' | 'chapter' | 'journal' | 'conference-paper';
  item: Article | Book | BookChapter;
  highlight?: {
    title?: string;
    abstract?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  page: number;
  pageSize: number;
  facets: SearchFacet[];
  queryTime: number;
}
```

### User (shared/types/user.types.ts)
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  orcid?: string;
  affiliation?: string;
  role: 'reader' | 'author' | 'reviewer' | 'editor' | 'admin';
  savedArticles: string[];  // DOIs
  alerts: AlertSetting[];
  orders: Order[];
  submissions: Submission[];
  avatarUrl?: string;
}

export interface AlertSetting {
  id: string;
  type: 'journal-toc' | 'author' | 'keyword';
  target: string;  // journal slug / author ID / keyword
  email: string;
  frequency: 'immediately' | 'weekly' | 'monthly';
  active: boolean;
}

export interface Order {
  id: string;
  doi: string;
  articleTitle: string;
  amount: number;
  currency: string;
  date: string;
  receiptUrl?: string;
  accessType: 'permanent' | '48hr';
}
```

### Submission (features/submission/types.ts)
```typescript
export type ManuscriptType = 
  | 'original-research' | 'review' | 'short-communication'
  | 'letter' | 'case-study' | 'methodology' | 'technical-note';

export interface SubmissionAuthor {
  firstName: string;
  lastName: string;
  email: string;
  orcid?: string;
  affiliation: string;
  country: string;
  isCorresponding: boolean;
  order: number;
}

export interface SubmissionFile {
  id: string;
  file: File;
  type: 'manuscript' | 'figure' | 'supplementary' | 'cover-letter' | 'data';
  name: string;
  size: number;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
}

export interface SubmissionFormData {
  manuscriptType: ManuscriptType;
  title: string;
  abstract: string;
  keywords: string[];
  authors: SubmissionAuthor[];
  files: SubmissionFile[];
  coverLetter: string;
  suggestedReviewers: Array<{ name: string; email: string; institution: string }>;
  excludedReviewers: Array<{ name: string; email: string; reason: string }>;
  fundingInfo: string;
  conflictOfInterest: string;
  dataAvailability: string;
  agreeToTerms: boolean;
  agreeToEthics: boolean;
}
```

### API Types (shared/types/api.types.ts)
```typescript
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
```
