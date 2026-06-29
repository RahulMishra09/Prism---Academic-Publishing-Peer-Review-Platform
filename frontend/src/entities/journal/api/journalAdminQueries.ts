import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import { fetchClient } from '../../../shared/api/base';
import { hasKey } from '../../../shared/lib/typeGuards';
import { useJournalAdminStore } from '../../../app/store/useJournalAdminStore';
import { journalKeys } from './journalQueries';
import type { Journal, JournalDraft, JournalStatus, SpecialIssue } from '../model/types';

// ── All Journals (real API + mock fallback + store-created) ────────────────

export function useAdminJournalsList() {
    const managedJournals = useJournalAdminStore(s => s.managedJournals);

    return useQuery({
        queryKey: journalKeys.adminList,
        queryFn: async () => {
            const res = await fetchWithFallback<{ journals?: Journal[]; data?: Journal[] }>(
                '/journals/admin/all',
                '/mock-data/journals.json'
            );
            const base: Journal[] = res.data || (hasKey(res, 'journals') ? (res.journals as Journal[]) : []);
            // Merge store-managed journals (store takes priority for same slug)
            const merged = [...base];
            for (const [slug, j] of Object.entries(managedJournals)) {
                const idx = merged.findIndex(x => x.slug === slug);
                if (idx >= 0) merged[idx] = j;
                else merged.push(j);
            }
            return merged;
        },
    });
}

// ── Single journal for admin editing ──────────────────────────────────────

export function useAdminJournal(slug: string) {
    const managedJournals = useJournalAdminStore(s => s.managedJournals);

    return useQuery({
        queryKey: [...journalKeys.bySlug(slug), 'admin'],
        queryFn: async () => {
            if (managedJournals[slug]) return managedJournals[slug];

            const res = await fetchWithFallback<{ journals?: Journal[]; data?: Journal }>(
                `/journals/admin/${slug}`,
                '/mock-data/journals.json'
            );
            if (res.data && !Array.isArray(res.data)) return res.data as Journal;
            const journals: Journal[] = hasKey(res, 'journals') ? (res.journals as Journal[]) : [];
            const found = journals.find(j => j.slug === slug);
            if (!found) throw new Error(`Journal "${slug}" not found`);
            return found;
        },
        enabled: !!slug,
    });
}

// ── Special Issues ─────────────────────────────────────────────────────────

export function useSpecialIssues(journalSlug: string) {
    const storeIssues = useJournalAdminStore(s => s.specialIssues[journalSlug]) ?? [];

    return useQuery({
        queryKey: journalKeys.specialIssues(journalSlug),
        queryFn: async () => {
            const res = await fetchWithFallback<{ specialIssues?: SpecialIssue[]; data?: SpecialIssue[] }>(
                `/journals/${journalSlug}/special-issues`,
                '/mock-data/special-issues.json'
            );
            const mockIssues: SpecialIssue[] = (res.data || (hasKey(res, 'specialIssues')
                ? (res.specialIssues as SpecialIssue[])
                : [])).filter(si => si.journalSlug === journalSlug);

            const merged = [...mockIssues];
            for (const si of storeIssues) {
                const idx = merged.findIndex(x => x.id === si.id);
                if (idx >= 0) merged[idx] = si;
                else merged.push(si);
            }
            return merged;
        },
        enabled: !!journalSlug,
    });
}

export function useAllSpecialIssues() {
    return useQuery({
        queryKey: ['journals', 'all-special-issues'],
        queryFn: async () => {
            const res = await fetchWithFallback<{ specialIssues?: SpecialIssue[]; data?: SpecialIssue[] }>(
                '/special-issues',
                '/mock-data/special-issues.json'
            );
            return res.data || (hasKey(res, 'specialIssues') ? (res.specialIssues as SpecialIssue[]) : []);
        },
    });
}

export function useSpecialIssue(journalSlug: string, issueId: string) {
    const { data: issues } = useSpecialIssues(journalSlug);
    return issues?.find(si => si.id === issueId);
}

// ── Mutations (real API first, fallback to store) ──────────────────────────

export function useCreateJournal() {
    const qc = useQueryClient();
    const createJournalStore = useJournalAdminStore(s => s.createJournal);

    return useMutation({
        mutationFn: async (draft: JournalDraft) => {
            try {
                const res = await fetchClient<{ data: Journal }>('/journals', {
                    method: 'POST',
                    body: JSON.stringify(draft),
                });
                return res.data;
            } catch {
                return createJournalStore(draft);
            }
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: journalKeys.adminList });
            void qc.invalidateQueries({ queryKey: journalKeys.all });
        },
    });
}

export function useUpdateJournal() {
    const qc = useQueryClient();
    const updateJournalStore = useJournalAdminStore(s => s.updateJournal);

    return useMutation({
        mutationFn: async ({ slug, draft }: { slug: string; draft: JournalDraft }) => {
            try {
                await fetchClient(`/journals/${slug}`, {
                    method: 'PUT',
                    body: JSON.stringify(draft),
                });
            } catch {
                updateJournalStore(slug, draft);
            }
        },
        onSuccess: (_data, vars) => {
            void qc.invalidateQueries({ queryKey: journalKeys.adminList });
            void qc.invalidateQueries({ queryKey: journalKeys.bySlug(vars.slug) });
        },
    });
}

export function useSetJournalStatus() {
    const qc = useQueryClient();
    const setJournalStatusStore = useJournalAdminStore(s => s.setJournalStatus);

    return useMutation({
        mutationFn: async ({ slug, status }: { slug: string; status: JournalStatus }) => {
            try {
                await fetchClient(`/journals/${slug}`, {
                    method: 'PUT',
                    body: JSON.stringify({ status }),
                });
            } catch {
                setJournalStatusStore(slug, status);
            }
        },
        onSuccess: (_data, vars) => {
            void qc.invalidateQueries({ queryKey: journalKeys.adminList });
            void qc.invalidateQueries({ queryKey: journalKeys.bySlug(vars.slug) });
        },
    });
}

export function useDeleteJournal() {
    const qc = useQueryClient();
    const deleteJournalStore = useJournalAdminStore(s => s.deleteJournal);

    return useMutation({
        mutationFn: async (slug: string) => {
            try {
                await fetchClient(`/journals/${slug}`, { method: 'DELETE' });
            } catch {
                deleteJournalStore(slug);
            }
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: journalKeys.adminList });
            void qc.invalidateQueries({ queryKey: journalKeys.all });
        },
    });
}

export function useCreateSpecialIssue() {
    const qc = useQueryClient();
    const createSpecialIssueStore = useJournalAdminStore(s => s.createSpecialIssue);

    return useMutation({
        mutationFn: async (issue: Omit<SpecialIssue, 'id' | 'createdAt' | 'updatedAt'>) =>
            createSpecialIssueStore(issue),
        onSuccess: (_data, vars) => {
            void qc.invalidateQueries({ queryKey: journalKeys.specialIssues(vars.journalSlug) });
        },
    });
}

export function useUpdateSpecialIssue() {
    const qc = useQueryClient();
    const updateSpecialIssueStore = useJournalAdminStore(s => s.updateSpecialIssue);

    return useMutation({
        mutationFn: async ({
            journalSlug,
            issueId,
            updates,
        }: {
            journalSlug: string;
            issueId: string;
            updates: Partial<SpecialIssue>;
        }) => {
            updateSpecialIssueStore(journalSlug, issueId, updates);
        },
        onSuccess: (_data, vars) => {
            void qc.invalidateQueries({ queryKey: journalKeys.specialIssues(vars.journalSlug) });
        },
    });
}

export function useDeleteSpecialIssue() {
    const qc = useQueryClient();
    const deleteSpecialIssueStore = useJournalAdminStore(s => s.deleteSpecialIssue);

    return useMutation({
        mutationFn: async ({ journalSlug, issueId }: { journalSlug: string; issueId: string }) => {
            deleteSpecialIssueStore(journalSlug, issueId);
        },
        onSuccess: (_data, vars) => {
            void qc.invalidateQueries({ queryKey: journalKeys.specialIssues(vars.journalSlug) });
        },
    });
}
