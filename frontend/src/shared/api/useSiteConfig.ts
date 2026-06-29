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

interface BackendSiteConfig {
    success?: boolean;
    data?: Record<string, string | number | boolean>;
    [key: string]: unknown;
}

/** Transform the backend flat key-value config into our structured SiteConfig */
function transformBackendConfig(raw: BackendSiteConfig): SiteConfig {
    const d = raw.data || raw;
    const get = (key: string) => String((d as Record<string, unknown>)[key] || '');

    return {
        metrics: [
            { label: 'Total Articles', value: get('total_articles') || '0', sub: 'Published', color: '#3b5bdb' },
        ],
        socialLinks: {
            twitter: get('social_twitter'),
            facebook: get('social_facebook'),
            linkedin: get('social_linkedin'),
            youtube: get('social_youtube'),
        },
    };
}

export const siteConfigKeys = {
    all: ['site-config'] as const,
};

export function useSiteConfig() {
    return useQuery({
        queryKey: siteConfigKeys.all,
        queryFn: async () => {
            const res = await fetchWithFallback<SiteConfig | BackendSiteConfig>(
                '/site-config',
                '/mock-data/site-config.json'
            );
            // If it has the expected `metrics` array, it's already the right shape (mock data)
            if ('metrics' in res && Array.isArray(res.metrics)) {
                return res as SiteConfig;
            }
            // Backend response — transform flat key-value to structured SiteConfig
            return transformBackendConfig(res as BackendSiteConfig);
        },
        staleTime: 60 * 60 * 1000, // 1 hour — site config rarely changes
    });
}
