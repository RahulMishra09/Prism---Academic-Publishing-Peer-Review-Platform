import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SubmissionDraft, AuthorInfo, SubmissionFile, SuggestedReviewer } from '../../../shared/types/submission.types';

interface SubmissionState {
    currentStep: number;
    draft: Partial<SubmissionDraft>;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    updateDraft: (data: Partial<SubmissionDraft>) => void;

    // Complex state handlers
    addAuthor: (author: AuthorInfo) => void;
    updateAuthor: (id: string, author: AuthorInfo) => void;
    removeAuthor: (id: string) => void;
    reorderAuthors: (authors: AuthorInfo[]) => void;

    addFiles: (files: SubmissionFile[]) => void;
    removeFile: (id: string) => void;

    addReviewer: (reviewer: SuggestedReviewer) => void;
    updateReviewer: (id: string, reviewer: SuggestedReviewer) => void;
    removeReviewer: (id: string) => void;

    resetDraft: () => void;
}

const initialState = {
    currentStep: 1,
    draft: {
        journalSlug: '',
        manuscriptType: '',
        authors: [],
        uploadedFiles: [],
        title: '',
        abstract: '',
        keywords: [],
        coverLetter: '',
        competingInterests: '',
        fundingStatement: '',
        dataAvailability: '',
        ethicsApproval: '',
        suggestedReviewers: [],
        opposedReviewers: '',
        agreedToTerms: false,
    } as Partial<SubmissionDraft>,
};

export const useSubmissionStore = create<SubmissionState>()(
    persist(
        (set) => ({
            ...initialState,

            setStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

            updateDraft: (data) => set((state) => ({
                draft: { ...state.draft, ...data }
            })),

            addAuthor: (author) => set((state) => ({
                draft: {
                    ...state.draft,
                    authors: [...(state.draft.authors || []), author]
                }
            })),

            updateAuthor: (id, author) => set((state) => ({
                draft: {
                    ...state.draft,
                    authors: (state.draft.authors || []).map((a: AuthorInfo) => a.id === id ? author : a)
                }
            })),

            removeAuthor: (id) => set((state) => ({
                draft: {
                    ...state.draft,
                    authors: (state.draft.authors || []).filter((a: AuthorInfo) => a.id !== id)
                }
            })),

            reorderAuthors: (authors) => set((state) => ({
                draft: { ...state.draft, authors }
            })),

            addFiles: (files) => set((state) => ({
                draft: {
                    ...state.draft,
                    uploadedFiles: [...(state.draft.uploadedFiles || []), ...files]
                }
            })),

            removeFile: (id) => set((state) => ({
                draft: {
                    ...state.draft,
                    uploadedFiles: (state.draft.uploadedFiles || []).filter((f: SubmissionFile) => f.id !== id)
                }
            })),

            addReviewer: (reviewer) => set((state) => ({
                draft: {
                    ...state.draft,
                    suggestedReviewers: [...(state.draft.suggestedReviewers || []), reviewer]
                }
            })),

            updateReviewer: (id, reviewer) => set((state) => ({
                draft: {
                    ...state.draft,
                    suggestedReviewers: (state.draft.suggestedReviewers || []).map((r) => r.id === id ? reviewer : r)
                }
            })),

            removeReviewer: (id) => set((state) => ({
                draft: {
                    ...state.draft,
                    suggestedReviewers: (state.draft.suggestedReviewers || []).filter((r) => r.id !== id)
                }
            })),

            resetDraft: () => set(initialState),
        }),
        {
            name: 'lumex-submission-draft', // Persist draft to localStorage
        }
    )
);
