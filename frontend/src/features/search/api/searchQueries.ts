import { useQuery } from '@tanstack/react-query';
import { fetchFromJson } from '../../../shared/api/fetchWithFallback';
import type { SearchResponse, SearchParams, SearchResult } from '../../../shared/types/search.types';
import type { Article, ArticleAbstractSection, Author } from '../../../entities/article/model/types';

/** Shape of the /mock-data/articles.json fallback file */
interface MockArticlesJson {
    articles: Article[];
}

export const searchKeys = {
    all: ['search'] as const,
    query: (params: SearchParams) => [...searchKeys.all, 'execute', params] as const,
    suggestions: (q: string) => [...searchKeys.all, 'suggestions', q] as const,
};

export function useSearch(params: SearchParams) {
    return useQuery({
        queryKey: searchKeys.query(params),
        queryFn: async () => {
            // Fetch all articles
            const res = await fetchFromJson<MockArticlesJson>('/mock-data/articles.json');
            const allArticles: Article[] = Array.isArray(res) ? res : (res.articles || []);

            const q = (params.query || '').toLowerCase();
            const titleSearch = (params.titleSearch || '').toLowerCase();
            const authorSearch = (params.authorSearch || '').toLowerCase();
            const doiSearch = (params.doiSearch || '').toLowerCase();
            const page = params.page || 1;
            const pageSize = params.pageSize || 20;

            const activeArticleTypes = params.filters.articleType || [];
            const activeSubjectAreas = params.filters.discipline || [];
            const activeAccessTypes = params.filters.accessType || [];

            // Filter
            const filtered = allArticles.filter((a: Article) => {
                let match = true;

                // Advanced Search Logic
                if (q) {
                    match = match && (
                        a.title.toLowerCase().includes(q) ||
                        a.abstract?.some((s: ArticleAbstractSection) => s.text.toLowerCase().includes(q)) ||
                        a.keywords?.some((k: string) => k.toLowerCase().includes(q)) ||
                        a.authors?.some((au: Author) => au.lastName.toLowerCase().includes(q))
                    );
                }
                if (titleSearch) match = match && a.title.toLowerCase().includes(titleSearch);
                if (authorSearch) match = match && a.authors?.some((au: Author) => au.lastName.toLowerCase().includes(authorSearch));
                if (doiSearch) match = match && a.doi.toLowerCase().includes(doiSearch);

                // Sidebar Facet Filtering
                if (activeArticleTypes.length > 0 && a.articleType) {
                    // Match any selected type
                    match = match && activeArticleTypes.some((t: string) => a.articleType.toLowerCase().includes(t.toLowerCase()));
                }

                if (activeSubjectAreas.length > 0 && a.subjectArea) {
                    match = match && activeSubjectAreas.some((s: string) => a.subjectArea!.toLowerCase().includes(s.toLowerCase()));
                }

                if (activeAccessTypes.length > 0) {
                    const isOa = a.accessLevel === 'open_access';
                    if (activeAccessTypes.includes('open-access') && !isOa) match = false;
                    if (activeAccessTypes.includes('subscription') && isOa) match = false;
                }

                // Date Filtering Logic
                if (params.filters.dateFrom) {
                    const pubYear = new Date(a.publishedDate).getFullYear();
                    if (pubYear < parseInt(params.filters.dateFrom)) match = false;
                }
                if (params.filters.dateTo) {
                    const pubYear = new Date(a.publishedDate).getFullYear();
                    if (pubYear > parseInt(params.filters.dateTo)) match = false;
                }

                return match;
            });

            // Map to results
            const results: SearchResult[] = filtered.map((a: Article) => ({ type: 'article', item: a }));

            // Generate basic facets dynamically based on the CURRENT result set
            const articleTypeFacet = {
                field: 'articleType',
                label: 'Article Type',
                values: [
                    { value: 'research', label: 'Research Article', count: filtered.filter((a: Article) => a.articleType?.toLowerCase().includes('research')).length, selected: false },
                    { value: 'review', label: 'Review Article', count: filtered.filter((a: Article) => a.articleType?.toLowerCase().includes('review')).length, selected: false },
                    { value: 'brief', label: 'Brief Communication', count: filtered.filter((a: Article) => a.articleType?.toLowerCase().includes('brief')).length, selected: false }
                ].filter(v => v.count > 0)
            };

            const accessTypeFacet = {
                field: 'accessType',
                label: 'Access Type',
                values: [
                    { value: 'open-access', label: 'Open Access', count: filtered.filter((a: Article) => a.accessLevel === 'open_access').length, selected: false },
                    { value: 'subscription', label: 'Subscription', count: filtered.filter((a: Article) => a.accessLevel !== 'open_access').length, selected: false }
                ].filter(v => v.count > 0)
            };

            const subjectAreaFacet = {
                field: 'discipline',
                label: 'Subject Area',
                values: [
                    { value: 'biology', label: 'Biology', count: filtered.filter((a: Article) => a.subjectArea?.toLowerCase().includes('biology')).length, selected: false },
                    { value: 'medicine', label: 'Medicine', count: filtered.filter((a: Article) => a.subjectArea?.toLowerCase().includes('med')).length, selected: false },
                    { value: 'physics', label: 'Physics', count: filtered.filter((a: Article) => a.subjectArea?.toLowerCase().includes('physic')).length, selected: false }
                ].filter(v => v.count > 0)
            };

            const response: SearchResponse = {
                results: results.slice((page - 1) * pageSize, page * pageSize),
                totalCount: results.length,
                page,
                pageSize,
                totalPages: Math.max(1, Math.ceil(results.length / pageSize)),
                queryTime: 42,
                facets: [accessTypeFacet, articleTypeFacet, subjectAreaFacet].filter(f => f.values.length > 0),
            };

            // Simulate network delay
            await new Promise(res => setTimeout(res, 500));
            return response;
        },
        enabled: true, // Always search, even empty query gets everything
    });
}

export function useSearchSuggestions(query: string) {
    return useQuery({
        queryKey: searchKeys.suggestions(query),
        queryFn: async () => {
            const res = await fetchFromJson<MockArticlesJson>('/mock-data/articles.json');
            const allArticles: Article[] = Array.isArray(res) ? res : (res.articles || []);
            const q = query.toLowerCase();

            const suggestions = allArticles
                .filter((a: Article) => a.title.toLowerCase().includes(q) || a.keywords?.some((k: string) => k.toLowerCase().includes(q)))
                .slice(0, 5)
                .map((a: Article) => ({ type: 'article', title: a.title, doi: a.doi }));

            return suggestions;
        },
        enabled: query.length >= 3,
        staleTime: 60 * 1000,
    });
}
