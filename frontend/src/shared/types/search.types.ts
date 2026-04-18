import type { Article } from '../../entities/article/model/types';
import type { Journal } from '../../entities/journal/model/types';
import type { Book, BookChapter } from '../../entities/book/model/types';

export type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'citations' | 'views';
export type ContentTypeFilter =
    | 'article'
    | 'book'
    | 'chapter'
    | 'journal'
    | 'conference-paper'
    | 'protocol';

export interface SearchFilters {
    contentType?: ContentTypeFilter[];
    discipline?: string[];
    journal?: string[];
    accessType?: string[];
    language?: string[];
    dateFrom?: string;
    dateTo?: string;
    articleType?: string[];
}

export interface SearchParams {
    query: string;
    filters: SearchFilters;
    sortBy: SortOption;
    page: number;
    pageSize: number;
    // Advanced search fields
    titleSearch?: string;
    authorSearch?: string;
    abstractSearch?: string;
    issnSearch?: string;
    doiSearch?: string;
}

export interface SearchFacet {
    field: string;
    label: string;
    values: Array<{
        value: string;
        label: string;
        count: number;
        selected: boolean;
    }>;
}

export interface SearchResult {
    type: ContentTypeFilter;
    item: Article | Journal | Book | BookChapter | Record<string, unknown>;
    highlight?: {
        title?: string;
        abstract?: string;
    };
}

export interface SearchResponse {
    results: SearchResult[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    facets: SearchFacet[];
    queryTime: number;
}
