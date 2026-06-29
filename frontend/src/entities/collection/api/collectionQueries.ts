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
            const res = await fetchWithFallback<{ collections?: Collection[]; data?: Collection[] }>(
                '/collections',
                '/mock-data/collections.json'
            );
            // Backend returns { data: [...] }, mock returns { collections: [...] }
            return res.data || res.collections || [];
        },
    });
};

export const useCollection = (slug?: string) => {
    return useQuery({
        queryKey: slug ? collectionKeys.detail(slug) : [],
        queryFn: async () => {
            if (!slug) return null;
            // Try fetching single collection from backend
            const res = await fetchWithFallback<{ collections?: Collection[]; data?: any }>(
                `/collections/${slug}`,
                '/mock-data/collections.json'
            );
            // Backend single: { data: Collection }
            let collection = null;
            if (res.data && !Array.isArray(res.data)) {
                collection = res.data;
            } else {
                // Backend list or mock fallback
                const list = (Array.isArray(res.data) ? res.data : res.collections) || [];
                collection = list.find(c => c.slug === slug) || null;
            }
            
            if (!collection) return null;
            
            return {
                ...collection,
                imageUrl: collection.coverImageUrl || collection.imageUrl,
                articleCount: collection._count?.articles ?? collection.articleCount ?? 0,
                updatedAt: collection.updatedAt || collection.createdAt || new Date().toISOString()
            } as Collection;
        },
        enabled: !!slug,
    });
};

export const useCollectionArticles = (slug?: string) => {
    return useQuery({
        queryKey: slug ? collectionKeys.articles(slug) : [],
        queryFn: async () => {
            if (!slug) return [];
            const res = await fetchWithFallback<{ articles?: (ArticleSummary & { collectionSlug?: string })[]; data?: (ArticleSummary & { collectionSlug?: string })[] }>(
                `/collections/${slug}/articles`,
                '/mock-data/articles.json'
            );
            // Backend returns { data: [...] }, mock returns { articles: [...] }
            const articles = res.data || res.articles || [];
            return articles.filter(a => !a.collectionSlug || a.collectionSlug === slug);
        },
        enabled: !!slug,
    });
};
