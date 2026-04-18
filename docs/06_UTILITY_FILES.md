# Lumex Frontend Replica — Utility Files In Depth

## 1. doiUtils.ts
```typescript
// Parse and manipulate DOIs (e.g., "10.1007/s00285-023-01234-5")
export const parseDOI = (doi: string): { registrant: string; suffix: string } | null
export const formatDOI = (doi: string): string           // ensures "10." prefix
export const doiToUrl = (doi: string): string            // https://doi.org/{doi}
export const doiToLumexUrl = (doi: string): string    // /article/{doi}
export const extractJournalFromDOI = (doi: string): string | null
export const isValidDOI = (doi: string): boolean
export const normalizeDOI = (doi: string): string        // lowercase, trim
```

## 2. citationFormatter.ts
Formats an Article object into various citation styles:
```typescript
export type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'vancouver' | 'bibtex' | 'ris' | 'endnote';

export const formatCitation = (article: Article, style: CitationStyle): string

// APA: Author, A. A., & Author, B. B. (Year). Title. Journal Name, Volume(Issue), Pages. DOI
// MLA: Author. "Title." Journal Name vol.Volume, no.Issue (Year): Pages. Web.
// BibTeX: @article{key, author={}, title={}, journal={}, year={}, doi={}}
// RIS: multi-line RIS format for reference managers
// RIS download triggers file download
export const downloadCitation = (article: Article, style: 'ris' | 'bibtex' | 'endnote'): void
export const formatAuthorForCitation = (author: Author, style: CitationStyle): string
```

## 3. abstractParser.ts
Parses abstract content from various formats:
```typescript
// Parse HTML abstract with section headers (Background, Methods, Results, Conclusions)
export const parseStructuredAbstract = (html: string): ArticleAbstractSection[]

// Strip HTML tags for plain text display
export const abstractToPlainText = (abstract: ArticleAbstractSection[]): string

// Parse JATS XML abstract
export const parseJATSAbstract = (xml: string): ArticleAbstractSection[]

// Truncate abstract to N chars with ellipsis
export const truncateAbstract = (text: string, maxLength: number): string
```

## 4. xmlParser.ts
Parses JATS XML (NLM Journal Archiving and Interchange Tag Set) into structured article content:
```typescript
// Full JATS XML → Article sections
export const parseJATSArticle = (xmlString: string): {
  sections: ArticleSection[];
  figures: ArticleFigure[];
  tables: ArticleFigure[];
  references: ArticleReference[];
}

// Parse <sec> elements recursively
export const parseSection = (secElement: Element): ArticleSection

// Parse <fig> elements
export const parseFigure = (figElement: Element): ArticleFigure

// Parse <ref-list> element
export const parseReferences = (refListElement: Element): ArticleReference[]

// Convert JATS inline elements to HTML
export const jatsInlineToHTML = (element: Element): string
// Handles: <italic>, <bold>, <sup>, <sub>, <xref>, <ext-link>, <named-content>
```

## 5. authorUtils.ts
```typescript
export const formatAuthorName = (author: Author, format: 'full' | 'abbreviated' | 'lastFirst'): string
// full: "John A. Smith"
// abbreviated: "J. A. Smith"  
// lastFirst: "Smith, John A."

export const formatAuthorList = (authors: Author[], maxVisible?: number): string
// "Smith J., Jones A., Brown K. et al."

export const getCorrespondingAuthors = (authors: Author[]): Author[]

export const formatAffiliation = (affiliation: Affiliation): string

export const formatORCID = (orcid: string): string  // 0000-0000-0000-0000 format

export const orcidToUrl = (orcid: string): string   // https://orcid.org/{orcid}
```

## 6. dateUtils.ts
```typescript
export const formatPublicationDate = (isoDate: string): string  // "15 March 2024"
export const formatShortDate = (isoDate: string): string        // "Mar 2024"
export const formatYear = (isoDate: string): string             // "2024"
export const getPublicationStatus = (article: Article): 'epub-ahead' | 'published' | 'corrected'
export const daysSincePublication = (isoDate: string): number
export const isRecentlyPublished = (isoDate: string, days?: number): boolean  // default 30 days
```

## 7. searchQueryUtils.ts
```typescript
// Convert SearchParams to URLSearchParams
export const searchParamsToURL = (params: SearchParams): URLSearchParams

// Parse URL search params to SearchParams
export const urlToSearchParams = (urlParams: URLSearchParams): Partial<SearchParams>

// Build advanced search query string
export const buildAdvancedQuery = (fields: AdvancedSearchFields): string
// title:"machine learning" AND author:"Smith" AND year:2020-2024

// Highlight search terms in text
export const highlightTerms = (text: string, terms: string[]): string  // returns HTML with <mark>
```

## 8. accessUtils.ts
```typescript
export const getAccessLevel = (article: Article, user: User | null): AccessLevel

export const canViewFullText = (article: Article, user: User | null): boolean

export const canDownloadPDF = (article: Article, user: User | null): boolean

export const getAccessBadgeConfig = (accessLevel: AccessLevel): {
  label: string;
  color: string;
  icon: string;
}
// open_access → "Open Access", gold, lock-open icon
// free_to_read → "Free to Read", green
// subscribed → unlocked
// requires_purchase → "Buy Article", gray, price shown
```

## 9. metricUtils.ts
```typescript
export const formatImpactFactor = (value: number): string  // "5.234"
export const formatCiteScore = (value: number): string     // "8.7"
export const getQuartileColor = (q: string): string        // CSS color per Q1-Q4
export const formatMetricValue = (value: number, metric: MetricType): string
export const getImpactFactorTrend = (history: MetricHistory[]): 'up' | 'down' | 'stable'
```

## 10. urlUtils.ts
```typescript
export const getArticleUrl = (doi: string): string          // /article/{doi}
export const getJournalUrl = (slug: string): string         // /journal/{slug}
export const getJournalIssueUrl = (slug: string, vol: number, iss: number): string
export const getBookUrl = (isbn: string): string            // /book/{isbn}
export const getAuthorUrl = (authorId: string): string      // /author/{authorId}
export const getSearchUrl = (params: Partial<SearchParams>): string
export const getExternalDOIUrl = (doi: string): string      // https://doi.org/{doi}
export const isExternalUrl = (url: string): boolean
```

## 11. issnUtils.ts
```typescript
export const formatISSN = (issn: string): string    // "1234-5678" format
export const isValidISSN = (issn: string): boolean  // checksum validation
export const issnToJournalUrl = (issn: string): string
```

## 12. fileUtils.ts
```typescript
export const formatFileSize = (bytes: number): string  // "2.4 MB"
export const getFileExtension = (filename: string): string
export const isAllowedSubmissionFile = (file: File): boolean
// Allowed: .docx, .doc, .tex, .pdf, .png, .jpg, .tiff, .eps, .xlsx, .csv, .zip

export const validateManuscriptFile = (file: File): { valid: boolean; error?: string }
export const getMimeTypeLabel = (mimeType: string): string  // "PDF Document"
```

## 13. classNames.ts
```typescript
// clsx-compatible utility
export const cx = (...classes: (string | undefined | null | false)[]): string
```

---

## Document Parsers Summary

| Parser | Input | Output | Use Case |
|--------|-------|--------|----------|
| `xmlParser.ts` | JATS XML string | Structured ArticleSection[] | Full text article rendering |
| `abstractParser.ts` | HTML or JATS XML | ArticleAbstractSection[] | Abstract display |
| `citationFormatter.ts` | Article object | Formatted citation string / file | Citation export |
| `abstractParser.ts` | HTML string | Plain text | SEO meta description |

---

## React Query Hooks Reference (all in features/ or entities/)

```typescript
// Article hooks
useArticle(doi: string)
useArticleList(params: ArticleListParams)
useRelatedArticles(doi: string)

// Journal hooks
useJournal(slug: string)
useJournalList(filters: JournalListFilters)
useJournalIssues(slug: string)
useJournalIssue(slug: string, vol: number, iss: number)
useEditorialBoard(slug: string)

// Search hooks
useSearch(params: SearchParams)
useSearchSuggestions(query: string)  // debounced

// Author hooks
useAuthor(authorId: string)
useAuthorArticles(authorId: string)

// Book hooks
useBook(isbn: string)
useBookChapter(doi: string)

// User hooks (auth-protected)
useCurrentUser()
useSavedArticles()
useSubmissions()
useOrders()
useReviews()
```
