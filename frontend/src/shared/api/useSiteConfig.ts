import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from './fetchWithFallback';

export interface SiteConfig {
    metrics: Array<{
        label: string;
        value: string;
        sub: string;
        color: string;
    }>;
    socialLinks: {
        twitter: string;
        facebook: string;
        linkedin: string;
        youtube: string;
    };
}

export const siteConfigKeys = {
    all: ['site-config'] as const,
};

export function useSiteConfig() {
    return useQuery({
        queryKey: siteConfigKeys.all,
        queryFn: async () => {
            return fetchWithFallback<SiteConfig>(
                '/site-config',
                '/mock-data/site-config.json'
            );
        },
        staleTime: Infinity, // Global config doesn't change often
    });
}
