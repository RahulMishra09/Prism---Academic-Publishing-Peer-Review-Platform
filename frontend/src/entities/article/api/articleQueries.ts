import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
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
                const found = fallback.find(a => a.doi === doi);
                if (!found) throw new Error(`Article DOI "${doi}" not found in fallback data`);
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
