import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import type { Conference } from '../model/types';

export const conferenceKeys = {
    all: ['conferences'] as const,
    detail: (slug: string) => [...conferenceKeys.all, slug] as const,
};

export const useConference = (slug: string) => {
    return useQuery({
        queryKey: conferenceKeys.detail(slug),
        queryFn: async () => {
            try {
                const res = await fetchWithFallback<{ data: Conference }>(
                    `/conferences/${slug}`,
                    '/mock-data/conferences.json'
                );
                // Real API returns { data: Conference }
                if ('data' in res && res.data) return res.data;
                // Fallback JSON is Record<string, Conference>
                const fallback = res as unknown as Record<string, Conference>;
                const conference = fallback[slug];
                if (!conference) throw new Error(`Conference with slug "${slug}" not found`);
                return conference;
            } catch {
                // Final fallback: try mock JSON directly
                const raw = await fetch('/mock-data/conferences.json');
                const data = await raw.json() as Record<string, Conference>;
                const conference = data[slug];
                if (!conference) throw new Error(`Conference with slug "${slug}" not found`);
                return conference;
            }
        },
        enabled: !!slug,
    });
};
