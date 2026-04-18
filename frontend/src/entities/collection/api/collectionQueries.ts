import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '@shared/api/fetchWithFallback';
import type { Collection } from '../model/types';
import type { ArticleSummary } from '../../article/model/types';

export const collectionKeys = {
    all: ['collections'] as const,
    list: () => [...collectionKeys.all, 'list'] as const,
    detail: (slug: string) => [...collectionKeys.all, 'detail', slug] as const,
    articles: (slug: string) => [...collectionKeys.detail(slug), 'articles'] as const,
};

export const useCollectionsList = () => {
    return useQuery({
        queryKey: collectionKeys.list(),
        queryFn: async () => {
            const res = await fetchWithFallback<{ collections: Collection[] }>(
                '/collections',
                '/mock-data/collections.json'
            );
            return res.collections || [];
        },
    });
};

export const useCollection = (slug?: string) => {
    return useQuery({
        queryKey: slug ? collectionKeys.detail(slug) : [],
        queryFn: async () => {
            if (!slug) return null;
            const res = await fetchWithFallback<{ collections: Collection[] }>(
                '/collections',
                '/mock-data/collections.json'
            );
            return res.collections?.find(c => c.slug === slug) || null;
        },
        enabled: !!slug,
    });
};

export const useCollectionArticles = (slug?: string) => {
    return useQuery({
        queryKey: slug ? collectionKeys.articles(slug) : [],
        queryFn: async () => {
            if (!slug) return [];
            const res = await fetchWithFallback<{ articles: (ArticleSummary & { collectionSlug?: string })[] }>(
                '/articles',
                '/mock-data/articles.json'
            );

            // Filter articles that belong to this collection
            // In a real API, this would be a server-side filter
            return res.articles?.filter(a => a.collectionSlug === slug) || [];
        },
        enabled: !!slug,
    });
};
