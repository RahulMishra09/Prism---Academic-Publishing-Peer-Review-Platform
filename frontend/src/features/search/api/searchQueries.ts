import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../../../shared/api/base';
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

/** Build the real backend search from params */
async function realSearch(params: SearchParams): Promise<SearchResponse> {
    const sp = new URLSearchParams();
    if (params.query) sp.set('q', params.query);
    sp.set('page', String(params.page || 1));
    sp.set('pageSize', String(params.pageSize || 20));
    if (params.sortBy) {
        let backendSort = String(params.sortBy).toLowerCase().trim();
        if (backendSort === 'trending') backendSort = 'views';
        if (backendSort === 'downloads') backendSort = 'views'; // fallback if downloads is not supported
        sp.set('sortBy', backendSort);
    }
    if (params.titleSearch) sp.set('title', params.titleSearch);
    if (params.authorSearch) sp.set('author', params.authorSearch);
    if (params.doiSearch) sp.set('doi', params.doiSearch);
    if (params.filters.discipline?.length) sp.set('discipline', params.filters.discipline.join(','));
    if (params.filters.articleType?.length) sp.set('articleType', params.filters.articleType.join(','));
    if (params.filters.accessType?.length) sp.set('accessType', params.filters.accessType.join(','));
    if (params.filters.dateFrom) sp.set('dateFrom', params.filters.dateFrom);
    if (params.filters.dateTo) sp.set('dateTo', params.filters.dateTo);

    const res = await fetchClient<any>(`/search?${sp.toString()}`);
    
    // Map raw articles to the SearchResult structure expected by the frontend
    if (res && res.results && Array.isArray(res.results)) {
        res.results = res.results.map((item: any) => ({
            type: 'article',
            item: item,
            highlight: item.highlight
        }));
    }
    
    return res as SearchResponse;
}

/** Client-side mock search fallback — uses local JSON files */
async function mockSearch(params: SearchParams): Promise<SearchResponse> {
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

    const filtered = allArticles.filter((a: Article) => {
        let match = true;

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

        if (activeArticleTypes.length > 0 && a.articleType) {
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

    const results: SearchResult[] = filtered.map((a: Article) => ({ type: 'article', item: a }));

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

    return response;
}

export function useSearch(params: SearchParams) {
    return useQuery({
        queryKey: searchKeys.query(params),
        queryFn: async () => {
            try {
                return await realSearch(params);
            } catch {
                // Backend unavailable — fall back to client-side mock search
                console.warn('[Lumex] Search API failed, using mock data fallback');
                return mockSearch(params);
            }
        },
        enabled: true,
    });
}

export function useSearchSuggestions(query: string) {
    return useQuery({
        queryKey: searchKeys.suggestions(query),
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Array<{ type: string; title: string; doi?: string }> }>(
                    `/search/suggestions?q=${encodeURIComponent(query)}`
                );
                return res.data;
            } catch {
                // Fallback to client-side suggestions
                const res = await fetchFromJson<MockArticlesJson>('/mock-data/articles.json');
                const allArticles: Article[] = Array.isArray(res) ? res : (res.articles || []);
                const q = query.toLowerCase();
                return allArticles
                    .filter((a: Article) => a.title.toLowerCase().includes(q) || a.keywords?.some((k: string) => k.toLowerCase().includes(q)))
                    .slice(0, 5)
                    .map((a: Article) => ({ type: 'article', title: a.title, doi: a.doi }));
            }
        },
        enabled: query.length >= 3,
        staleTime: 60 * 1000,
    });
}
