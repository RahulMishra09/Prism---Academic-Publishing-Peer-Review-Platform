import React from 'react';
import { Link, Stack } from '../../../shared/ui';
import { useSearchSuggestions } from '../api/searchQueries';

export interface SearchSuggestionsProps {
    query: string;
    onSelect: () => void;
    className?: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    query,
    onSelect,
    className,
}) => {
    const { data: suggestions, isLoading, isError } = useSearchSuggestions(query);

    if (query.length < 3) return null;

    return (
        <div
            className={`absolute top-full left-0 right-0 mt-1 bg-white border border-lumex-border shadow-lg rounded-md z-50 overflow-hidden ${className || ''}`}
        >
            {isLoading && (
                <div className="p-4 text-sm text-lumex-text-secondary animate-pulse">
                    Loading suggestions...
                </div>
            )}

            {isError && <div className="p-4 text-sm text-red-500">Failed to load suggestions.</div>}

            {!isLoading && !isError && (!suggestions || suggestions.length === 0) && (
                <div className="p-4 text-sm text-lumex-text-secondary">
                    No matches found for "{query}". Try a broader term.
                </div>
            )}

            {!isLoading && suggestions && suggestions.length > 0 && (
                <ul className="max-h-80 overflow-y-auto w-full py-2">
                    {suggestions.map((suggestion) => (
                        <li key={`${suggestion.doi}-${suggestion.type}`}>
                            <Link
                                to={`/article/${encodeURIComponent(suggestion.doi)}`}
                                onClick={onSelect}
                                className="block px-4 py-2 hover:bg-lumex-bg-light transition-colors text-lumex-text group w-full text-left"
                            >
                                <Stack direction="col" gap="none">
                                    <span className="text-xs uppercase font-bold text-lumex-text-secondary tracking-widest mb-1">
                                        {suggestion.type}
                                    </span>
                                    <span
                                        className="text-sm font-semibold group-hover:text-lumex-blue truncate"
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={{ __html: suggestion.title }}
                                    />
                                </Stack>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
