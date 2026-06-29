import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Journal, JournalDraft, JournalStatus, SpecialIssue } from '../../entities/journal/model/types';

// Derive a Journal-like object from a JournalDraft
function draftToJournal(draft: JournalDraft, id: string): Journal {
    return {
        id,
        slug: draft.slug,
        title: draft.title,
        abbreviation: draft.abbreviation,
        electronicISSN: draft.electronicISSN,
        printISSN: draft.printISSN,
        publisher: draft.publisher,
        accessType: draft.accessType,
        discipline: draft.discipline,
        subdiscipline: draft.subdiscipline,
        description: draft.description,
        aimsAndScope: draft.aimsAndScope,
        coverImageUrl: draft.coverImageUrl,
        logoUrl: draft.logoUrl,
        foundedYear: draft.foundedYear,
        frequency: draft.frequency,
        language: draft.language,
        indexedIn: draft.indexedIn,
        articleProcessingCharge: draft.articleProcessingCharge,
        apaCurrency: draft.apaCurrency,
        openAccess: draft.openAccess,
        editors: draft.editors,
        status: draft.status ?? 'active',
    };
}

interface JournalAdminState {
    // Created / edited journals (keyed by slug)
    managedJournals: Record<string, Journal>;
    // Special issues (keyed by journalSlug → SpecialIssue[])
    specialIssues: Record<string, SpecialIssue[]>;

    // Journal CRUD
    createJournal: (draft: JournalDraft) => Journal;
    updateJournal: (slug: string, draft: JournalDraft) => void;
    archiveJournal: (slug: string) => void;
    deleteJournal: (slug: string) => void;
    setJournalStatus: (slug: string, status: JournalStatus) => void;

    // Special issue CRUD
    createSpecialIssue: (issue: Omit<SpecialIssue, 'id' | 'createdAt' | 'updatedAt'>) => SpecialIssue;
    updateSpecialIssue: (journalSlug: string, issueId: string, updates: Partial<SpecialIssue>) => void;
    deleteSpecialIssue: (journalSlug: string, issueId: string) => void;

    // Getters (convenience)
    getJournal: (slug: string) => Journal | undefined;
    getSpecialIssues: (journalSlug: string) => SpecialIssue[];
    getSpecialIssue: (journalSlug: string, issueId: string) => SpecialIssue | undefined;
}

export const useJournalAdminStore = create<JournalAdminState>()(
    persist(
        (set, get) => ({
            managedJournals: {},
            specialIssues: {},

            // ── Journal CRUD ───────────────────────────────────────────────
            createJournal: (draft: JournalDraft) => {
                const id = `journal-admin-${Date.now()}`;
                const journal = draftToJournal(draft, id);
                set(state => ({
                    managedJournals: { ...state.managedJournals, [draft.slug]: journal },
                }));
                return journal;
            },

            updateJournal: (slug: string, draft: JournalDraft) => {
                set(state => {
                    const existing = state.managedJournals[slug];
                    const updated = draftToJournal(draft, existing?.id ?? `journal-admin-${Date.now()}`);
                    const next = { ...state.managedJournals };
                    // Handle slug change
                    if (slug !== draft.slug) {
                        delete next[slug];
                    }
                    next[draft.slug] = updated;
                    return { managedJournals: next };
                });
            },

            archiveJournal: (slug: string) => {
                set(state => {
                    const journal = state.managedJournals[slug];
                    if (!journal) return state;
                    return {
                        managedJournals: {
                            ...state.managedJournals,
                            [slug]: { ...journal, status: 'archived' },
                        },
                    };
                });
            },

            deleteJournal: (slug: string) => {
                set(state => {
                    const next = { ...state.managedJournals };
                    delete next[slug];
                    const nextIssues = { ...state.specialIssues };
                    delete nextIssues[slug];
                    return { managedJournals: next, specialIssues: nextIssues };
                });
            },

            setJournalStatus: (slug: string, status: JournalStatus) => {
                set(state => {
                    const journal = state.managedJournals[slug];
                    if (!journal) return state;
                    return {
                        managedJournals: {
                            ...state.managedJournals,
                            [slug]: { ...journal, status },
                        },
                    };
                });
            },

            // ── Special Issue CRUD ─────────────────────────────────────────
            createSpecialIssue: (issue) => {
                const id = `si-${Date.now()}`;
                const now = new Date().toISOString();
                const newIssue: SpecialIssue = { ...issue, id, createdAt: now, updatedAt: now };
                set(state => ({
                    specialIssues: {
                        ...state.specialIssues,
                        [issue.journalSlug]: [
                            ...(state.specialIssues[issue.journalSlug] ?? []),
                            newIssue,
                        ],
                    },
                }));
                return newIssue;
            },

            updateSpecialIssue: (journalSlug, issueId, updates) => {
                set(state => ({
                    specialIssues: {
                        ...state.specialIssues,
                        [journalSlug]: (state.specialIssues[journalSlug] ?? []).map(si =>
                            si.id === issueId
                                ? { ...si, ...updates, updatedAt: new Date().toISOString() }
                                : si
                        ),
                    },
                }));
            },

            deleteSpecialIssue: (journalSlug, issueId) => {
                set(state => ({
                    specialIssues: {
                        ...state.specialIssues,
                        [journalSlug]: (state.specialIssues[journalSlug] ?? []).filter(
                            si => si.id !== issueId
                        ),
                    },
                }));
            },

            // ── Convenience getters ────────────────────────────────────────
            getJournal: (slug) => get().managedJournals[slug],
            getSpecialIssues: (journalSlug) => get().specialIssues[journalSlug] ?? [],
            getSpecialIssue: (journalSlug, issueId) =>
                (get().specialIssues[journalSlug] ?? []).find(si => si.id === issueId),
        }),
        {
            name: 'lumex-journal-admin',
            partialize: state => ({
                managedJournals: state.managedJournals,
                specialIssues: state.specialIssues,
            }),
        }
    )
);
