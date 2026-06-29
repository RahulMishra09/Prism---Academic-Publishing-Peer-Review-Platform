import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '../../../shared/api/base';
import { fetchFromJson } from '../../../shared/api/fetchWithFallback';

// ── Types ────────────────────────────────────────────────────

export interface SavedArticle {
    id: string;
    doi: string;
    title: string;
    authors: string;
    journalTitle: string;
    savedAt: string;
}

export interface UserAlert {
    id: string;
    type: 'journal' | 'topic' | 'KEYWORD' | 'JOURNAL' | 'DISCIPLINE' | 'AUTHOR';
    label: string;
    query?: string;
    discipline?: string;
    frequency: 'weekly' | 'monthly' | string;
    active: boolean;
}

export interface UserSubmission {
    id: string;
    title: string;
    journal: string;
    journalSlug?: string;
    status: string;
    submittedAt: string;
    keywords?: string[];
}

export interface PeerReview {
    id: string;
    title: string;
    journal: string;
    deadline?: string;
    status?: string;
    invitedOn?: string;
    completedOn?: string;
    decision?: string;
}

export interface UserProfile {
    name: string;
    email: string;
    institution: string;
    firstName?: string;
    lastName?: string;
    orcid?: string;
    bio?: string;
    avatarUrl?: string;
    role?: string;
}

export interface DashboardStats {
    submissions: number;
    orders: number;
    alerts: number;
    bookmarks: number;
    savedArticles: number;
}

export interface DashboardData {
    profile: UserProfile;
    stats: DashboardStats;
    reviews: { pending: number; completed: number };
    recentSubmissions: UserSubmission[];
    recentOrders: Array<{
        id: string;
        amount: number;
        currency: string;
        status: string;
        itemType: string;
        itemRef: string;
        createdAt: string;
    }>;
}

/** Legacy shape for mock data compatibility */
export interface UserDashboardData {
    profile: UserProfile;
    savedArticles: SavedArticle[];
    alerts: UserAlert[];
    submissions: UserSubmission[];
    reviews: {
        pending: PeerReview[];
        completed: PeerReview[];
    };
}

// ── Query keys ───────────────────────────────────────────────

export const userDashboardKeys = {
    all: ['userDashboard'] as const,
    dashboard: () => [...userDashboardKeys.all, 'overview'] as const,
    submissions: (page: number) => [...userDashboardKeys.all, 'submissions', page] as const,
    orders: (page: number) => [...userDashboardKeys.all, 'orders', page] as const,
    savedArticles: (page: number) => [...userDashboardKeys.all, 'saved', page] as const,
    alerts: () => [...userDashboardKeys.all, 'alerts'] as const,
    profile: () => [...userDashboardKeys.all, 'profile'] as const,
};

// ── Mock fallback loader ─────────────────────────────────────

async function loadMockDashboard(): Promise<UserDashboardData> {
    const data = await fetchFromJson<UserDashboardData>('/mock-data/user.json');

    // Merge with localStorage saved articles
    const stored = localStorage.getItem('lumex_saved_articles');
    if (stored) {
        try {
            const localSaved = JSON.parse(stored) as SavedArticle[];
            const existingDois = new Set(data.savedArticles.map(a => a.doi));
            const uniqueLocal = localSaved.filter((a: SavedArticle) => !existingDois.has(a.doi));
            data.savedArticles = [...uniqueLocal, ...data.savedArticles];
        } catch (e) {
            console.error('Failed to parse saved articles', e);
        }
    }
    return data;
}

// ── Main dashboard hook (overview + stats) ───────────────────

export function useUserDashboard() {
    return useQuery<UserDashboardData>({
        queryKey: userDashboardKeys.all,
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: DashboardData & { user?: UserProfile } }>('/users/me/dashboard');
                const d = res.data;
                const profile = d.profile || d.user;

                // Map backend response to legacy UserDashboardData shape
                return {
                    profile: {
                        name: profile?.name || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User',
                        email: profile?.email || '',
                        institution: profile?.institution || '',
                        firstName: profile?.firstName,
                        lastName: profile?.lastName,
                        orcid: profile?.orcid,
                        bio: profile?.bio,
                        avatarUrl: profile?.avatarUrl,
                        role: profile?.role,
                    },
                    savedArticles: [], // Loaded separately via useSavedArticlesQuery
                    alerts: [], // Loaded separately via useAlertsQuery
                    submissions: d.recentSubmissions.map(s => ({
                        id: s.id,
                        title: s.title,
                        journal: s.journalSlug || s.journal || '',
                        journalSlug: s.journalSlug,
                        status: s.status,
                        submittedAt: s.submittedAt,
                        keywords: s.keywords,
                    })),
                    reviews: {
                        pending: [],
                        completed: [],
                    },
                } satisfies UserDashboardData;
            } catch {
                console.warn('[Lumex] Dashboard API failed, using mock data');
                return loadMockDashboard();
            }
        },
        staleTime: 5 * 60 * 1000,
    });
}

// ── Profile ──────────────────────────────────────────────────

export function useProfile() {
    return useQuery({
        queryKey: userDashboardKeys.profile(),
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: UserProfile }>('/users/me');
                return res.data;
            } catch {
                const mock = await loadMockDashboard();
                return mock.profile;
            }
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: Partial<UserProfile>) => {
            const res = await fetchClient<{ data: UserProfile }>('/users/me', {
                method: 'PUT',
                body: JSON.stringify(input),
            });
            return res.data;
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: userDashboardKeys.all });
        },
    });
}

// ── Submissions ──────────────────────────────────────────────

export function useMySubmissions(page = 1, pageSize = 10) {
    return useQuery({
        queryKey: userDashboardKeys.submissions(page),
        queryFn: async () => {
            try {
                const res = await fetchClient<{
                    data: UserSubmission[];
                    totalCount: number;
                    page: number;
                    pageSize: number;
                    totalPages: number;
                }>(`/users/me/submissions?page=${page}&pageSize=${pageSize}`);
                return res;
            } catch {
                const mock = await loadMockDashboard();
                return {
                    data: mock.submissions,
                    totalCount: mock.submissions.length,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                };
            }
        },
    });
}

// ── Orders ───────────────────────────────────────────────────

export interface Order {
    id: string;
    amount: number;
    currency: string;
    status: string;
    itemType: string;
    itemRef: string;
    receiptUrl?: string;
    createdAt: string;
}

export function useMyOrders(page = 1, pageSize = 10) {
    return useQuery({
        queryKey: userDashboardKeys.orders(page),
        queryFn: async () => {
            try {
                const res = await fetchClient<{
                    data: Order[];
                    totalCount: number;
                    page: number;
                    pageSize: number;
                    totalPages: number;
                }>(`/users/me/orders?page=${page}&pageSize=${pageSize}`);
                return res;
            } catch {
                return { data: [] as Order[], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 };
            }
        },
    });
}

// ── Order Detail ────────────────────────────────────────────

export interface OrderDetail {
    orderId: string;
    amount: number;
    currency: string;
    status: string;
    itemType: string;
    itemRef: string;
    createdAt: string;
    receiptUrl?: string;
}

export function useOrderDetail(orderId: string | null) {
    return useQuery({
        queryKey: ['orderDetail', orderId],
        queryFn: async () => {
            if (!orderId) return null;
            try {
                const res = await fetchClient<{ data: OrderDetail }>(`/checkout/orders/${orderId}`);
                return res.data;
            } catch {
                return null;
            }
        },
        enabled: !!orderId,
    });
}

// ── Saved Articles ───────────────────────────────────────────

export function useSavedArticlesQuery(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: userDashboardKeys.savedArticles(page),
        queryFn: async () => {
            try {
                const res = await fetchClient<{
                    data: Array<{
                        id: string;
                        doi: string;
                        title: string;
                        discipline?: string;
                        savedId: string;
                        savedAt: string;
                        journal?: { slug: string; title: string };
                        authors?: Array<{ firstName: string; lastName: string }>;
                    }>;
                    totalCount: number;
                }>(`/users/me/saved-articles?page=${page}&pageSize=${pageSize}`);

                // Map to SavedArticle shape
                const articles: SavedArticle[] = res.data.map(a => ({
                    id: a.savedId || a.id,
                    doi: a.doi,
                    title: a.title,
                    authors: a.authors?.map(au => `${au.firstName} ${au.lastName}`).join(', ') || '',
                    journalTitle: a.journal?.title || '',
                    savedAt: a.savedAt,
                }));
                return { articles, totalCount: res.totalCount };
            } catch {
                // Fallback to localStorage
                const stored = localStorage.getItem('lumex_saved_articles');
                const articles: SavedArticle[] = stored ? JSON.parse(stored) : [];
                return { articles, totalCount: articles.length };
            }
        },
    });
}

export function useSaveArticle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (articleId: string) => {
            return fetchClient('/users/me/saved-articles/' + articleId, { method: 'POST' });
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: userDashboardKeys.savedArticles(1) });
        },
    });
}

export function useUnsaveArticle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (articleId: string) => {
            return fetchClient('/users/me/saved-articles/' + articleId, { method: 'DELETE' });
        },
        onMutate: async (articleId: string) => {
            // Optimistic update — remove article from list immediately
            await qc.cancelQueries({ queryKey: userDashboardKeys.savedArticles(1) });
            const prev = qc.getQueryData<{ articles: SavedArticle[]; totalCount: number }>(userDashboardKeys.savedArticles(1));
            if (prev) {
                qc.setQueryData(userDashboardKeys.savedArticles(1), {
                    ...prev,
                    articles: prev.articles.filter(a => a.doi !== articleId && a.id !== articleId),
                    totalCount: Math.max(0, prev.totalCount - 1),
                });
            }
            return { prev };
        },
        onError: (_err, _id, context) => {
            // Rollback on failure
            if (context?.prev) {
                qc.setQueryData(userDashboardKeys.savedArticles(1), context.prev);
            }
        },
        onSettled: () => {
            void qc.invalidateQueries({ queryKey: userDashboardKeys.savedArticles(1) });
        },
    });
}

// ── Reading History ─────────────────────────────────────────

export interface ReadingHistoryItem {
    id: string;
    doi: string;
    title: string;
    authors: string;
    journalTitle: string;
    viewedAt: string;
}

export function useReadingHistory(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...userDashboardKeys.all, 'history', page],
        queryFn: async () => {
            try {
                const res = await fetchClient<{
                    data: Array<{
                        id: string;
                        doi: string;
                        title: string;
                        authors?: Array<{ firstName: string; lastName: string }>;
                        journal?: { title: string };
                        viewedAt: string;
                    }>;
                    totalCount: number;
                }>(`/users/me/history?page=${page}&pageSize=${pageSize}`);

                const items: ReadingHistoryItem[] = res.data.map(h => ({
                    id: h.id,
                    doi: h.doi,
                    title: h.title,
                    authors: h.authors?.map(a => `${a.firstName} ${a.lastName}`).join(', ') || '',
                    journalTitle: h.journal?.title || '',
                    viewedAt: h.viewedAt,
                }));
                return { items, totalCount: res.totalCount };
            } catch {
                return null; // Fall back to localStorage in the component
            }
        },
    });
}

export function useTrackArticleView() {
    return useMutation({
        mutationFn: async (articleId: string) => {
            return fetchClient(`/users/me/history/${articleId}`, { method: 'POST' });
        },
    });
}

// ── Alerts ───────────────────────────────────────────────────

export function useAlertsQuery(enabled = true) {
    return useQuery({
        queryKey: userDashboardKeys.alerts(),
        enabled,
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: UserAlert[] }>('/users/me/alerts');
                return (res.data || []).map(a => ({
                    ...a,
                    label: a.label || a.query || a.discipline || 'Alert',
                    type: a.type || 'topic',
                    frequency: a.frequency || 'weekly',
                    active: a.active !== false,
                }));
            } catch {
                const mock = await loadMockDashboard();
                return mock.alerts;
            }
        },
    });
}

export function useAddAlert() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: { type: string; query?: string; discipline?: string; journalId?: string }) => {
            return fetchClient<{ data: UserAlert }>('/users/me/alerts', {
                method: 'POST',
                body: JSON.stringify(input),
            });
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: userDashboardKeys.alerts() });
        },
    });
}

export function useUpdateAlert() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ alertId, input }: { alertId: string; input: { type?: string; query?: string; discipline?: string; journalId?: string } }) => {
            return fetchClient<{ data: UserAlert }>(`/users/me/alerts/${alertId}`, {
                method: 'PUT',
                body: JSON.stringify(input),
            });
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: userDashboardKeys.alerts() });
        },
    });
}

export function useRemoveAlert() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (alertId: string) => {
            return fetchClient(`/users/me/alerts/${alertId}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: userDashboardKeys.alerts() });
        },
    });
}
