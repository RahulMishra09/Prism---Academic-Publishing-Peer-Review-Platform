import { useQuery } from '@tanstack/react-query';
import { fetchFromJson } from '../../../shared/api/fetchWithFallback';
import type { Conference } from '../model/types';

export const conferenceKeys = {
    all: ['conferences'] as const,
    detail: (slug: string) => [...conferenceKeys.all, slug] as const,
};

export const useConference = (slug: string) => {
    return useQuery({
        queryKey: conferenceKeys.detail(slug),
        queryFn: async () => {
            const data = await fetchFromJson<Record<string, Conference>>('/mock-data/conferences.json');
            const conference = data[slug];
            if (!conference) {
                throw new Error(`Conference with slug "${slug}" not found`);
            }
            return conference;
        },
        enabled: !!slug,
    });
};
