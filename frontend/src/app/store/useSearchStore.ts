import { create } from 'zustand';
import type { SortOption, SearchFilters } from '../../shared/types/search.types';

const defaultFilters: SearchFilters = {};

interface SearchState {
    query: string;
    filters: SearchFilters;
    sortBy: SortOption;
    page: number;
    setQuery: (q: string) => void;
    setFilters: (f: Partial<SearchFilters>) => void;
    setSortBy: (sort: SortOption) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
    reset: () => void;
}

export const useSearchStore = create<SearchState>(set => ({
    query: '',
    filters: defaultFilters,
    sortBy: 'relevance',
    page: 1,

    setQuery: q => set({ query: q, page: 1 }),
    setFilters: f => set(state => ({ filters: { ...state.filters, ...f }, page: 1 })),
    setSortBy: sort => set({ sortBy: sort, page: 1 }),
    setPage: page => set({ page }),
    resetFilters: () => set({ filters: defaultFilters, page: 1 }),
    reset: () => set({ query: '', filters: defaultFilters, sortBy: 'relevance', page: 1 }),
}));
