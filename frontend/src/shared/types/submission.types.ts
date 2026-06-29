export type ManuscriptType =
    | 'Research Article'
    | 'Review Article'
    | 'Brief Communication'
    | 'Case Report'
    | 'Editorial'
    | 'Letter to Editor';

export interface AuthorInfo {
    id: string; // Used for drag/drop list rendering
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    institution: string;
    department: string;
    city: string;
    country: string;
    orcid?: string;
    isCorresponding: boolean;
    /** True if this author was auto-parsed from a manuscript upload */
    autoParsed?: boolean;
}

export interface SubmissionFile {
    id: string; // Unique ID
    file: File;
    type: 'manuscript' | 'figure' | 'table' | 'supplementary' | 'cover_letter';
    name: string;
    size: number;
}

export interface SuggestedReviewer {
    id: string;
    name: string;
    email: string;
    institution: string;
    reason: string;
}

export interface SubmissionDraft {
    journalSlug: string;
    // Step 1
    manuscriptType: ManuscriptType | '';
    // Step 2 (Files)
    uploadedFiles: SubmissionFile[];
    // Step 3 (General Info)
    subjectArea: string;
    classification: string;
    keywords: string[];
    // Step 4 (Review Preferences)
    suggestedReviewers: SuggestedReviewer[];
    opposedReviewers?: string;
    // Step 5 (Comments)
    coverLetter: string;
    additionalComments: string;
    // Step 6 (Manuscript Data)
    authors: AuthorInfo[];
    title: string;
    abstract: string;
    competingInterests: string;
    fundingStatement: string;
    dataAvailability: string;
    ethicsApproval?: string;
    // Step 7 (Agreements)
    agreedToTerms: boolean;
}
