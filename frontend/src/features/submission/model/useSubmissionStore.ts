import { create } from 'zustand';
import type { SubmissionDraft, AuthorInfo, SubmissionFile, SuggestedReviewer } from '../../../shared/types/submission.types';

const STORAGE_KEY = 'lumex-submission-draft';

interface SubmissionState {
    currentStep: number;
    draft: Partial<SubmissionDraft>;
    /** Whether the user has resolved the draft recovery prompt */
    draftResolved: boolean;
    /** Whether a saved draft exists in localStorage */
    hasSavedDraft: boolean;

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

    /** Merge parsed authors into draft, avoiding duplicates by email */
    setParsedAuthors: (authors: AuthorInfo[]) => void;
    /** Set parsed metadata (title, abstract, keywords) from manuscript */
    setParsedMetadata: (data: { title?: string; abstract?: string; keywords?: string[] }) => void;

    /** Explicitly save the current draft to localStorage */
    saveDraft: () => void;
    /** Resume a previously saved draft from localStorage */
    resumeDraft: () => void;
    /** Discard saved draft and start fresh */
    startFresh: () => void;
    /** Full reset (after successful submission) */
    resetDraft: () => void;
}

const emptyDraft: Partial<SubmissionDraft> = {
    journalSlug: '',
    manuscriptType: '',
    uploadedFiles: [],
    subjectArea: '',
    classification: '',
    keywords: [],
    suggestedReviewers: [],
    opposedReviewers: '',
    coverLetter: '',
    additionalComments: '',
    authors: [],
    title: '',
    abstract: '',
    competingInterests: '',
    fundingStatement: '',
    dataAvailability: '',
    ethicsApproval: '',
    agreedToTerms: false,
};

function checkHasSavedDraft(): boolean {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        // Check if there's meaningful data (not just empty defaults)
        return parsed.currentStep > 1 ||
            (parsed.draft?.manuscriptType && parsed.draft.manuscriptType !== '') ||
            (parsed.draft?.title && parsed.draft.title !== '') ||
            (parsed.draft?.authors && parsed.draft.authors.length > 0) ||
            (parsed.draft?.uploadedFiles && parsed.draft.uploadedFiles.length > 0);
    } catch {
        return false;
    }
}

function loadDraftFromStorage(): { currentStep: number; draft: Partial<SubmissionDraft> } | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return { currentStep: parsed.currentStep || 1, draft: parsed.draft || emptyDraft };
    } catch {
        return null;
    }
}

function saveDraftToStorage(currentStep: number, draft: Partial<SubmissionDraft>): void {
    try {
        // Strip File objects before saving (can't serialize)
        const cleanDraft = {
            ...draft,
            uploadedFiles: (draft.uploadedFiles || []).map((f: SubmissionFile) => ({
                id: f.id,
                name: f.name,
                size: f.size,
                type: f.type,
                // Don't persist the actual File object
            })),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, draft: cleanDraft }));
    } catch {
        // Silently fail on storage quota or similar
    }
}

function clearDraftFromStorage(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Silently fail
    }
}

export const useSubmissionStore = create<SubmissionState>()(
    (set, get) => ({
        currentStep: 1,
        draft: { ...emptyDraft },
        draftResolved: !checkHasSavedDraft(), // If no saved draft, skip the prompt
        hasSavedDraft: checkHasSavedDraft(),

        setStep: (step) => set({ currentStep: step }),
        nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
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

        setParsedAuthors: (parsedAuthors) => set((state) => {
            const existing = state.draft.authors || [];
            const existingEmails = new Set(existing.map((a: AuthorInfo) => a.email.toLowerCase()).filter(Boolean));

            const newAuthors = parsedAuthors.filter(
                (a) => !a.email || !existingEmails.has(a.email.toLowerCase())
            );

            return {
                draft: {
                    ...state.draft,
                    authors: [...existing, ...newAuthors],
                },
            };
        }),

        setParsedMetadata: (data) => set((state) => ({
            draft: {
                ...state.draft,
                ...(data.title && !state.draft.title ? { title: data.title } : {}),
                ...(data.abstract && !state.draft.abstract ? { abstract: data.abstract } : {}),
                ...(data.keywords && (!state.draft.keywords || state.draft.keywords.length === 0) ? { keywords: data.keywords } : {}),
            },
        })),

        saveDraft: () => {
            const { currentStep, draft } = get();
            saveDraftToStorage(currentStep, draft);
        },

        resumeDraft: () => {
            const saved = loadDraftFromStorage();
            if (saved) {
                set({
                    currentStep: saved.currentStep,
                    draft: saved.draft,
                    draftResolved: true,
                    hasSavedDraft: false,
                });
            } else {
                set({ draftResolved: true, hasSavedDraft: false });
            }
        },

        startFresh: () => {
            clearDraftFromStorage();
            set({
                currentStep: 1,
                draft: { ...emptyDraft },
                draftResolved: true,
                hasSavedDraft: false,
            });
        },

        resetDraft: () => {
            clearDraftFromStorage();
            set({
                currentStep: 1,
                draft: { ...emptyDraft },
                draftResolved: true,
                hasSavedDraft: false,
            });
        },
    })
);
