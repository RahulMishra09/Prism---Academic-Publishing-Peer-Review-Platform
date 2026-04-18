/** Parse the current URL search params into a typed object. */
export function parseSearchParams(search: string): {
    query: string;
    page: number;
    contentType: string;
    accessType: string[];
    discipline: string[];
    dateFrom: string;
    dateTo: string;
    language: string;
    sortBy: string;
} {
    const params = new URLSearchParams(search);
    return {
        query: params.get('query') ?? '',
        page: Number(params.get('page') ?? 1),
        contentType: params.get('contentType') ?? 'all',
        accessType: params.getAll('accessType'),
        discipline: params.getAll('discipline'),
        dateFrom: params.get('dateFrom') ?? '',
        dateTo: params.get('dateTo') ?? '',
        language: params.get('language') ?? '',
        sortBy: params.get('sortBy') ?? 'relevance',
    };
}

interface SearchUrlParams {
    query?: string;
    page?: number;
    contentType?: string;
    accessType?: string[];
    discipline?: string[];
    dateFrom?: string;
    dateTo?: string;
    language?: string;
    sortBy?: string;
}

/** Build a querystring from search parameters, omitting empty values. */
export function buildSearchParams(params: SearchUrlParams): string {
    const p = new URLSearchParams();
    if (params.query) p.set('query', params.query);
    if (params.page && params.page > 1) p.set('page', String(params.page));
    if (params.contentType && params.contentType !== 'all')
        p.set('contentType', params.contentType);
    if (params.sortBy && params.sortBy !== 'relevance') p.set('sortBy', params.sortBy);
    if (params.dateFrom) p.set('dateFrom', params.dateFrom);
    if (params.dateTo) p.set('dateTo', params.dateTo);
    if (params.language) p.set('language', params.language);
    params.accessType?.forEach(v => p.append('accessType', v));
    params.discipline?.forEach(v => p.append('discipline', v));
    return p.toString();
}

/** Returns the full /search URL. */
export function buildSearchUrl(params: SearchUrlParams): string {
    const qs = buildSearchParams(params);
    return `/search${qs ? `?${qs}` : ''}`;
}
