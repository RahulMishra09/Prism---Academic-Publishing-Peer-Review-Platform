import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams, buildSearchParams } from '../utils/searchQueryUtils';
import type { SearchParams, SearchFilters, SortOption } from '../../../shared/types/search.types';

export function useSearchState() {
    const [searchParams, setSearchParams] = useSearchParams();

    const state = useMemo<SearchParams>(() => {
        return parseSearchParams(searchParams);
    }, [searchParams]);

    const setQuery = useCallback(
        (query: string) => {
            const nextParams = buildSearchParams({ ...state, query, page: 1 });
            setSearchParams(nextParams, { replace: true });
        },
        [state, setSearchParams]
    );

    const setPage = useCallback(
        (page: number) => {
            const nextParams = buildSearchParams({ ...state, page });
            setSearchParams(nextParams, { replace: true }); // Prevent clogging browser history on pagination
        },
        [state, setSearchParams]
    );

    const setSortBy = useCallback(
        (sortBy: SortOption) => {
            const nextParams = buildSearchParams({ ...state, sortBy, page: 1 });
            setSearchParams(nextParams, { replace: true });
        },
        [state, setSearchParams]
    );

    const updateFilters = useCallback(
        (newFilters: Partial<SearchFilters>) => {
            const mergedFilters = { ...state.filters, ...newFilters };

            // Clean up empty filter arrays
            (Object.keys(mergedFilters) as Array<keyof SearchFilters>).forEach(key => {
                if (Array.isArray(mergedFilters[key]) && mergedFilters[key]?.length === 0) {
                    delete mergedFilters[key];
                } else if (!mergedFilters[key]) {
                    delete mergedFilters[key];
                }
            });

            const nextParams = buildSearchParams({ ...state, filters: mergedFilters, page: 1 });
            setSearchParams(nextParams, { replace: true });
        },
        [state, setSearchParams]
    );

    const clearFilters = useCallback(() => {
        const nextParams = buildSearchParams({ ...state, filters: {}, page: 1 });
        setSearchParams(nextParams, { replace: true });
    }, [state, setSearchParams]);

    const toggleFilter = useCallback(
        (category: keyof SearchFilters, value: string) => {
            const currentValues = (state.filters[category] as string[] | undefined) || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            updateFilters({ [category]: newValues });
        },
        [state, updateFilters]
    );

    // Execute a completely new search from Advanced panel for instance
    const executeSearch = useCallback(
        (newParams: Partial<SearchParams>) => {
            const nextParams = buildSearchParams({ ...state, ...newParams, page: 1 });
            setSearchParams(nextParams, { replace: false }); // Generate history push
        },
        [state, setSearchParams]
    );

    // Count how many filter values are active across all categories
    const activeFiltersCount = useMemo(() => {
        return (Object.values(state.filters) as (string | string[] | undefined)[]).reduce((count: number, val) => {
            if (Array.isArray(val)) return count + val.length;
            if (val) return count + 1;
            return count;
        }, 0);
    }, [state.filters]);

    return {
        state,
        setQuery,
        setPage,
        setSortBy,
        updateFilters,
        clearFilters,
        toggleFilter,
        executeSearch,
        activeFiltersCount,
    };
}
