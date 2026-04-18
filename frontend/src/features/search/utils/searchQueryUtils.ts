import type { SearchFilters, SearchParams, SortOption } from '../../../shared/types/search.types';

export function parseSearchParams(searchParams: URLSearchParams): SearchParams {
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = (searchParams.get('sort') || 'relevance') as SortOption;

    const filters: SearchFilters = {};

    if (searchParams.has('content-type')) {
        filters.contentType = searchParams
            .get('content-type')
            ?.split(',') as SearchFilters['contentType'];
    }
    if (searchParams.has('discipline')) {
        filters.discipline = searchParams.get('discipline')?.split(',');
    }
    if (searchParams.has('access-type')) {
        filters.accessType = searchParams
            .get('access-type')
            ?.split(',');
    }
    if (searchParams.has('language')) {
        filters.language = searchParams.get('language')?.split(',');
    }
    if (searchParams.has('journal')) {
        filters.journal = searchParams.get('journal')?.split(',');
    }
    if (searchParams.has('date-from')) {
        filters.dateFrom = searchParams.get('date-from') as string;
    }
    if (searchParams.has('date-to')) {
        filters.dateTo = searchParams.get('date-to') as string;
    }
    if (searchParams.has('article-type')) {
        filters.articleType = searchParams
            .get('article-type')
            ?.split(',');
    }

    // Advanced Fields
    const titleSearch = searchParams.get('title') || undefined;
    const authorSearch = searchParams.get('author') || undefined;
    const doiSearch = searchParams.get('doi') || undefined;

    return {
        query,
        page,
        pageSize: 20, // Default constant
        sortBy,
        filters,
        titleSearch,
        authorSearch,
        doiSearch,
    };
}

export function buildSearchParams(params: Partial<SearchParams>): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.set('q', params.query);
    if (params.page && params.page > 1) searchParams.set('page', params.page.toString());
    if (params.sortBy && params.sortBy !== 'relevance') searchParams.set('sort', params.sortBy);

    if (params.filters) {
        if (params.filters.contentType?.length) {
            searchParams.set('content-type', params.filters.contentType.join(','));
        }
        if (params.filters.discipline?.length) {
            searchParams.set('discipline', params.filters.discipline.join(','));
        }
        if (params.filters.accessType?.length) {
            searchParams.set('access-type', params.filters.accessType.join(','));
        }
        if (params.filters.language?.length) {
            searchParams.set('language', params.filters.language.join(','));
        }
        if (params.filters.journal?.length) {
            searchParams.set('journal', params.filters.journal.join(','));
        }
        if (params.filters.dateFrom) {
            searchParams.set('date-from', params.filters.dateFrom);
        }
        if (params.filters.dateTo) {
            searchParams.set('date-to', params.filters.dateTo);
        }
        if (params.filters.articleType?.length) {
            searchParams.set('article-type', params.filters.articleType.join(','));
        }
    }

    if (params.titleSearch) searchParams.set('title', params.titleSearch);
    if (params.authorSearch) searchParams.set('author', params.authorSearch);
    if (params.doiSearch) searchParams.set('doi', params.doiSearch);

    return searchParams;
}
