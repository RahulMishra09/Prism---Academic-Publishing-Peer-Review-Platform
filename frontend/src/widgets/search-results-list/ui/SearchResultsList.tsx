import React from 'react';
import { useSearch, useSearchState } from '../../../features/search';
import { ArticleCardFull } from '../../../entities/article/ui/ArticleCardFull';
import { BookCard } from '../../../entities/book/ui/BookCard';
import type { Article } from '../../../entities/article/model/types';
import type { Book } from '../../../entities/book/model/types';
import {
    Stack,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    Skeleton,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../../../shared/ui';
import type { SortOption } from '../../../shared/types/search.types';

export interface SearchResultsListProps {
    className?: string;
}

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'citations', label: 'Most Cited' },
];

export const SearchResultsList: React.FC<SearchResultsListProps> = ({ className }) => {
    const { state, setPage, setSortBy } = useSearchState();
    const { data: response, isLoading, isError, isFetching } = useSearch(state);

    if (isError) {
        return (
            <div className="py-8 text-center text-red-600">
                Failed to fetch search results. Please try again later.
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className={`w-full ${className || ''}`}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-lumex-border">
                    <Skeleton className="w-48 h-6" />
                    <Skeleton className="w-32 h-10" />
                </div>
                <Stack direction="col" gap="lg">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={`skeleton-${i}`} className="flex gap-4">
                            <Skeleton className="h-40 w-32" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </div>
                    ))}
                </Stack>
            </div>
        );
    }

    if (!response || response.results.length === 0) {
        return (
            <div className={`py-16 text-center ${className || ''}`}>
                <h2 className="text-2xl font-serif text-lumex-text mb-4">No results found</h2>
                <p className="text-lumex-text-secondary">
                    Please try modifying your search query or removing some filters.
                </p>
            </div>
        );
    }

    return (
        <div
            className={`w-full ${className || ''} ${isFetching ? 'opacity-60 pointer-events-none' : ''}`}
        >
            {/* Top Bar: Sort only since count is in header */}
            <div className="flex justify-end items-center mb-6 pb-4 border-b border-lumex-border">
                <div className="flex items-center gap-3">
                    <span className="text-[0.82rem] font-bold text-lumex-muted-more uppercase tracking-wider whitespace-nowrap">
                        Sort by:
                    </span>
                    <Select
                        value={state.sortBy}
                        onValueChange={value => setSortBy(value as SortOption)}
                    >
                        <SelectTrigger className="w-44 bg-lumex-card border-lumex-border rounded-lg h-9 text-[0.82rem] font-medium text-lumex-text hover:border-lumex-border-hover transition-all">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-lumex-card border-lumex-border shadow-xl">
                            {SORT_OPTIONS.map(opt => (
                                <SelectItem 
                                    key={opt.value} 
                                    value={opt.value}
                                    className="text-[0.82rem] py-2.5 transition-colors focus:bg-lumex-bg-deep cursor-pointer"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results List */}
            <Stack
                direction="col"
                gap="none"
                className="divide-y divide-lumex-border border rounded-md border-lumex-border"
            >
                {response.results.map((result) => {
                    const stableKey = result.type === 'article' || result.type === 'conference-paper'
                        ? `${result.type}-${(result.item as Article).doi}`
                        : `${result.type}-${(result.item as Book).isbn}`;

                    if (result.type === 'article' || result.type === 'conference-paper') {
                        // TS cast required due to generic item union returned by generic search API mock
                        return (
                            <div
                                key={stableKey}
                                className="p-4 sm:p-6 hover:bg-lumex-bg-light transition-colors"
                            >
                                <ArticleCardFull article={result.item as Article} />
                            </div>
                        );
                    } else if (result.type === 'book' || result.type === 'chapter') {
                        return (
                            <div
                                key={stableKey}
                                className="p-4 sm:p-6 hover:bg-lumex-bg-light transition-colors"
                            >
                                <BookCard book={result.item as Book} />
                            </div>
                        );
                    }
                    return null;
                })}
            </Stack>

            {/* Pagination */}
            {response.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => state.page > 1 && setPage(state.page - 1)}
                                    className={
                                        state.page <= 1 ? 'pointer-events-none opacity-50' : ''
                                    }
                                />
                            </PaginationItem>

                            {/* Only show up to 3 pages around current for simplicity */}
                            {Array.from({ length: Math.min(3, response.totalPages) }).map(
                                (_, i) => {
                                    let pageNum = state.page;
                                    if (state.page === 1) pageNum = i + 1;
                                    else if (state.page === response.totalPages)
                                        pageNum = response.totalPages - 2 + i;
                                    else pageNum = state.page - 1 + i;

                                    if (pageNum < 1 || pageNum > response.totalPages) return null;

                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                isActive={state.page === pageNum}
                                                onClick={() => setPage(pageNum)}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        state.page < response.totalPages && setPage(state.page + 1)
                                    }
                                    className={
                                        state.page >= response.totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};
