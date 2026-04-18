import type { Author, ArticleSummary } from '../../article/model/types';

export type JournalAccessType = 'hybrid' | 'gold_oa' | 'subscription' | 'free';

export interface JournalMetrics {
    impactFactor?: number;
    impactFactorYear?: number;
    citeScore?: number;
    hIndex?: number;
    quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    snip?: number; // Source Normalized Impact per Paper
    sjr?: number; // SCImago Journal Rank
    downloads?: number;
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
    aimsAndScope: string; // HTML
    coverImageUrl?: string;
    logoUrl?: string;
    metrics?: JournalMetrics;
    foundedYear?: number;
    frequency?: string; // e.g. "Monthly", "Bimonthly"
    language: string[];
    indexedIn?: string[]; // Scopus, Web of Science, PubMed, etc.
    editorialBoard?: JournalEditorialBoard;
    editorialHighlights?: Array<{
        id: string;
        title: string;
        description: string;
        url: string;
    }>;
    submissionUrl?: string;
    latestIssue?: JournalIssue;
    currentVolume?: number;
    articleProcessingCharge?: number;
    apaCurrency?: string;
    issn?: string;
    editors?: { name: string; role?: string; affiliation?: string }[];
    openAccess?: boolean;
}
