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
    institution: string;
    department: string;
    city: string;
    country: string;
    orcid?: string;
    isCorresponding: boolean;
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
    // Step 2
    authors: AuthorInfo[];
    // Step 3
    uploadedFiles: SubmissionFile[];
    // Step 4
    title: string;
    abstract: string;
    keywords: string[];
    coverLetter: string;
    competingInterests: string;
    fundingStatement: string;
    dataAvailability: string;
    ethicsApproval?: string;
    // Step 6 (Suggested Reviewers)
    suggestedReviewers: SuggestedReviewer[];
    opposedReviewers?: string;
    // Step 5 (Agreements)
    agreedToTerms: boolean;
}
