/**
 * useHomepageData — fetches homepage-specific content from the JSON data file.
 *
 * Serves as the single source of truth for all homepage sections:
 * stats, quick links, call for papers, trending research, platform stats.
 *
 * To switch to a real API, change the fetchFromJson call to a fetchWithFallback
 * call pointing at your API endpoint.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import { hasKey } from '../../../shared/lib/typeGuards';
import type { ApiResponse } from '../../../shared/types/api.types';

export interface HomepageStat {
    value: string;
    label: string;
}

export interface QuickLink {
    title: string;
    description: string;
    href: string;
    bg: string;
}

export interface CallForPaper {
    id: number;
    collection: string;
    title: string;
    deadline: string;
    journal: string;
    journalSlug: string;
    description: string;
    imageUrl?: string;
    collectionSlug?: string;
}

export interface TrendingArticle {
    id: number;
    category: string;
    title: string;
    date: string;
    summary: string;
    journal: string;
    journalSlug: string;
    link: string;
    imageUrl?: string;
    accentColor?: string;
}

export interface PlatformStats {
    totalJournals: number;
    totalBooks: number;
    totalArticles: number;
    totalConferences: number;
}

export interface HomepageData {
    stats: HomepageStat[];
    quickLinks: QuickLink[];
    callForPapers: CallForPaper[];
    trendingResearch: TrendingArticle[];
    platformStats: PlatformStats;
    disciplineCounts: Record<string, string>;
}

export const homepageKeys = {
    all: ['homepage'] as const,
    data: () => [...homepageKeys.all, 'data'] as const,
};

export function useHomepageData() {
    return useQuery<HomepageData>({
        queryKey: homepageKeys.data(),
        queryFn: async () => {
            const res = await fetchWithFallback<ApiResponse<HomepageData>>(
                '/homepage',
                '/mock-data/homepage.json'
            );
            // If fallback JSON is returned directly (no `data` wrapper), it's the raw HomepageData
            if (!hasKey(res, 'data')) {
                return res as HomepageData;
            }
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 min
    });
}
