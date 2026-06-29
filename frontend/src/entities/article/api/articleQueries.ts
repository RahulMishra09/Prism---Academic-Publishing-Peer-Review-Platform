import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import { fetchClient } from '../../../shared/api/base';
import { hasKey } from '../../../shared/lib/typeGuards';
import type { Article } from '../model/types';
import type { ApiResponse, PaginatedResponse } from '../../../shared/types/api.types';

export const articleKeys = {
    all: ['articles'] as const,
    byDoi: (doi: string) => [...articleKeys.all, 'detail', doi] as const,
    byJournal: (slug: string, page: number) =>
        [...articleKeys.all, 'journal', slug, page] as const,
    trending: () => [...articleKeys.all, 'trending'] as const,
    list: (params: { page: number; pageSize: number; discipline?: string; query?: string }) =>
        [...articleKeys.all, 'list', params] as const,
};

export function useArticle(doi: string) {
    return useQuery({
        queryKey: articleKeys.byDoi(doi),
        queryFn: async () => {
            const encodedDoi = encodeURIComponent(doi);
            const res = await fetchWithFallback<ApiResponse<Article>>(
                `/articles/${encodedDoi}`,
                `/mock-data/articles.json`
            );
            // Fallback JSON has { articles: [...] } shape
            if (hasKey(res, 'articles')) {
                const fallback = res.articles as Article[];
                const found = fallback.find(a => a.doi === doi || a.id === doi);
                if (!found) throw new Error(`Article DOI or ID "${doi}" not found in fallback data`);
                return found;
            }
            return (res).data;
        },
        enabled: !!doi,
    });
}

export function useJournalArticles(slug: string, page: number = 1, pageSize: number = 20) {
    return useQuery({
        queryKey: articleKeys.byJournal(slug, page),
        queryFn: async () => {
            const res = await fetchWithFallback<PaginatedResponse<Article>>(
                `/journals/${slug}/articles?page=${page}&pageSize=${pageSize}`,
                `/mock-data/articles.json`
            );
            if (hasKey(res, 'articles')) {
                const articles = (res.articles as Article[]).filter(
                    a => a.journalSlug === slug
                );
                const start = (page - 1) * pageSize;
                return {
                    data: articles.slice(start, start + pageSize),
                    totalCount: articles.length,
                    page,
                    pageSize,
                    totalPages: Math.ceil(articles.length / pageSize),
                } as PaginatedResponse<Article>;
            }
            return res;
        },
        enabled: !!slug,
    });
}

export function useArticlesList(params: {
    page: number;
    pageSize: number;
    discipline?: string;
    query?: string;
}) {
    return useQuery({
        queryKey: articleKeys.list(params),
        queryFn: async () => {
            const searchParams = new URLSearchParams({
                page: params.page.toString(),
                pageSize: params.pageSize.toString(),
            });
            if (params.discipline) searchParams.append('discipline', params.discipline);
            if (params.query) searchParams.append('query', params.query);

            const res = await fetchWithFallback<PaginatedResponse<Article>>(
                `/articles?${searchParams.toString()}`,
                `/mock-data/articles.json`
            );

            if (hasKey(res, 'articles')) {
                let articles = res.articles as Article[];
                if (params.discipline) {
                    articles = articles.filter(a =>
                        a.subjectArea?.toLowerCase() === params.discipline!.toLowerCase() ||
                        a.keywords?.some(k => k.toLowerCase().includes(params.discipline!.toLowerCase())) ||
                        a.journalTitle?.toLowerCase().includes(params.discipline!.toLowerCase())
                    );
                }
                if (params.query) {
                    const q = params.query.toLowerCase();
                    articles = articles.filter(a =>
                        a.title.toLowerCase().includes(q) ||
                        a.abstract?.some(s => s.text.toLowerCase().includes(q))
                    );
                }

                const start = (params.page - 1) * params.pageSize;
                const sliced = articles.slice(start, start + params.pageSize);
                return {
                    data: sliced,
                    totalCount: articles.length,
                    page: params.page,
                    pageSize: params.pageSize,
                    totalPages: Math.ceil(articles.length / params.pageSize),
                } as PaginatedResponse<Article>;
            }
            return res;
        },
    });
}

/** Prefetch an article on hover for instant navigation */
export function usePrefetchArticle() {
    const qc = useQueryClient();
    return useCallback((doi: string) => {
        void qc.prefetchQuery({
            queryKey: articleKeys.byDoi(doi),
            queryFn: async () => {
                const encodedDoi = encodeURIComponent(doi);
                const res = await fetchWithFallback<ApiResponse<Article>>(
                    `/articles/${encodedDoi}`,
                    `/mock-data/articles.json`
                );
                if (hasKey(res, 'articles')) {
                    const fallback = res.articles as Article[];
                    return fallback.find(a => a.doi === doi || a.id === doi) || null;
                }
                return (res).data;
            },
            staleTime: 5 * 60 * 1000,
        });
    }, [qc]);
}

// ── Article Extras ─────────────────────────────────────────────────

export function useArticleMetrics(doi: string) {
    return useQuery({
        queryKey: [...articleKeys.byDoi(doi), 'metrics'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: { views: number; downloads: number; citations: number } }>(
                    `/articles/${encodeURIComponent(doi)}/metrics`
                );
                return res.data;
            } catch {
                return null;
            }
        },
        enabled: !!doi,
    });
}

export function useArticleCitation(doi: string, format: 'apa' | 'mla' | 'bibtex' | 'ris' = 'apa') {
    return useQuery({
        queryKey: [...articleKeys.byDoi(doi), 'cite', format],
        queryFn: async () => {
            const res = await fetchClient<{ data: { citation: string; format: string } }>(
                `/articles/${encodeURIComponent(doi)}/cite?format=${format}`
            );
            return res.data;
        },
        enabled: !!doi,
    });
}

export function useArticleFigures(articleId: string) {
    return useQuery({
        queryKey: ['articles', articleId, 'figures'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Array<{ id: string; caption: string; url: string; order: number }> }>(
                    `/articles/${articleId}/figures`
                );
                return res.data;
            } catch {
                return [];
            }
        },
        enabled: !!articleId,
    });
}

export function useArticleSupplementary(articleId: string) {
    return useQuery({
        queryKey: ['articles', articleId, 'supplementary'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Array<{ id: string; label: string; url: string; fileType: string }> }>(
                    `/articles/${articleId}/supplementary`
                );
                return res.data;
            } catch {
                return [];
            }
        },
        enabled: !!articleId,
    });
}

export async function trackArticleDownload(doi: string) {
    try {
        await fetchClient(`/articles/${encodeURIComponent(doi)}/download`, { method: 'GET' });
    } catch {
        // Non-critical — don't block download
    }
}

/** Fetch the 5 trending articles shown on the homepage */
export function useTrendingArticles() {
    return useQuery({
        queryKey: articleKeys.trending(),
        queryFn: async () => {
            const res = await fetchWithFallback<PaginatedResponse<Article>>(
                `/articles?trending=true&pageSize=5`,
                `/mock-data/articles.json`
            );
            if (hasKey(res, 'articles')) {
                return res.articles as Article[];
            }
            return (res).data;
        },
    });
}
