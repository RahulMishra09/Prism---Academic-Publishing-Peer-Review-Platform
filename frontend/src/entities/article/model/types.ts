export type AccessLevel = 'open_access' | 'subscribed' | 'requires_purchase' | 'free_to_read';
export type ArticleType =
    | 'research-article'
    | 'review-article'
    | 'letter'
    | 'editorial'
    | 'case-report'
    | 'correction'
    | 'brief-communication'
    | 'book-review'
    | 'short-communication'
    | 'erratum'
    | 'conference-paper';

export type LicenseType =
    | 'CC BY'
    | 'CC BY-NC'
    | 'CC BY-ND'
    | 'CC BY-SA'
    | 'CC BY-NC-ND'
    | 'CC BY-NC-SA'
    | 'Lumex Standard'
    | 'Open Government';

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
    ror?: string; // Research Organization Registry ID
}

export type CRediTRole =
    | 'Conceptualization'
    | 'Data curation'
    | 'Formal Analysis'
    | 'Funding acquisition'
    | 'Investigation'
    | 'Methodology'
    | 'Project administration'
    | 'Resources'
    | 'Software'
    | 'Supervision'
    | 'Validation'
    | 'Visualization'
    | 'Writing – original draft'
    | 'Writing – review & editing';

export interface ArticleAbstractSection {
    heading?: string;
    text: string;
}

export interface ArticleSection {
    id: string;
    title: string;
    level: 1 | 2 | 3;
    content: string; // HTML content
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
    subjectArea?: string; // Discipline/Field
    volume?: string;
    issue?: string;
    pages?: string;
    publishedDate: string; // ISO date
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
    | 'id'
    | 'doi'
    | 'title'
    | 'authors'
    | 'publishedDate'
    | 'articleType'
    | 'accessLevel'
    | 'journalTitle'
    | 'journalSlug'
    | 'metrics'
>;

export interface SupplementaryFile {
    id: string;
    name: string;
    description?: string;
    url: string;
    size: number; // bytes
    type: string; // MIME type
}
