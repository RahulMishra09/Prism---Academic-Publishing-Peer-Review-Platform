import type { Author, ArticleSummary } from '../../article/model/types';

export type JournalStatus = 'active' | 'archived' | 'draft';

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
    status?: JournalStatus;
    specialIssues?: SpecialIssue[];
}

// ── Special Issue ─────────────────────────────────────────────────────────

export type SpecialIssueStatus =
    | 'call-for-papers'
    | 'submissions-closed'
    | 'under-review'
    | 'published';

export interface SpecialIssueGuestEditor {
    name: string;
    affiliation: string;
    email?: string;
}

export interface SpecialIssue {
    id: string;
    journalSlug: string;
    title: string;
    description: string;
    guestEditors: SpecialIssueGuestEditor[];
    status: SpecialIssueStatus;
    callForPapersDeadline?: string; // ISO date
    expectedPublicationDate?: string; // ISO date
    publishedDate?: string; // ISO date
    volume?: number;
    issueNumber?: string; // e.g. "S1", "S2"
    coverImageUrl?: string;
    topics: string[];
    articleCount: number;
    articles?: ArticleSummary[];
    createdAt: string;
    updatedAt: string;
}

// ── Journal Draft (create / edit form) ───────────────────────────────────

export interface JournalEditor {
    name: string;
    role?: string;
    affiliation?: string;
    email?: string;
}

export interface JournalDraft {
    title: string;
    abbreviation?: string;
    slug: string;
    electronicISSN: string;
    printISSN?: string;
    publisher: string;
    accessType: JournalAccessType;
    discipline: string[];
    subdiscipline?: string[];
    description: string;
    aimsAndScope: string;
    coverImageUrl?: string;
    coverImageFile?: File; // for local upload preview
    logoUrl?: string;
    foundedYear?: number;
    frequency?: string;
    language: string[];
    indexedIn?: string[];
    articleProcessingCharge?: number;
    apaCurrency?: string;
    openAccess?: boolean;
    editors?: JournalEditor[];
    status?: JournalStatus;
}
