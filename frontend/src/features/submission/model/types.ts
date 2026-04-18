export type ManuscriptType =
    | 'original-research'
    | 'review'
    | 'short-communication'
    | 'letter'
    | 'case-study'
    | 'methodology'
    | 'technical-note';

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
