import React from 'react';
import { useSearchState, useSearch } from '../../../features/search';
import { SearchFilterPanelView } from './SearchFilterPanelView';

export interface SearchFilterPanelProps {
    hideHeader?: boolean;
    className?: string;
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({ 
    className,
    hideHeader,
}) => {
    const { state, toggleFilter, clearFilters } = useSearchState();

    // React Query will utilize the URL sync'd state implicitly resolving cached responses
    const { data: searchResponse, isFetching } = useSearch(state);

    // Fallback to empty facets if data is fetching or absent
    const facets = searchResponse?.facets || [];

    return (
        <SearchFilterPanelView
            facets={facets}
            activeFilters={state.filters}
            onFilterToggle={toggleFilter}
            onClearFilters={clearFilters}
            isLoading={isFetching}
            hideHeader={hideHeader}
            className={className}
        />
    );
};
