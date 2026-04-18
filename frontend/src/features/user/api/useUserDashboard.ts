import { useQuery } from '@tanstack/react-query';
import { fetchFromJson } from '../../../shared/api/fetchWithFallback';

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
    type: 'journal' | 'topic';
    label: string;
    frequency: 'weekly' | 'monthly';
    active: boolean;
}

export interface UserSubmission {
    id: string;
    title: string;
    journal: string;
    status: string;
    submittedAt: string;
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
}

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

export const userDashboardKeys = {
    all: ['userDashboard'] as const,
};

export function useUserDashboard() {
    return useQuery<UserDashboardData>({
        queryKey: userDashboardKeys.all,
        queryFn: async () => {
            const data = await fetchFromJson<UserDashboardData>('/mock-data/user.json');

            // Merge with localStorage saved articles
            const stored = localStorage.getItem('lumex_saved_articles');
            if (stored) {
                try {
                    const localSaved = JSON.parse(stored) as SavedArticle[];
                    // Filter out duplicates (prefer mock data if both exist)
                    const existingDois = new Set(data.savedArticles.map(a => a.doi));
                    const uniqueLocal = localSaved.filter((a: SavedArticle) => !existingDois.has(a.doi));
                    data.savedArticles = [...uniqueLocal, ...data.savedArticles];
                } catch (e) {
                    console.error('Failed to parse saved articles in useUserDashboard', e);
                }
            }

            // Simulate a brief network delay
            await new Promise(res => setTimeout(res, 400));
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}
