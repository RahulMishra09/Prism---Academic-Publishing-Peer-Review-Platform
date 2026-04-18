import React, { useState, useRef, useEffect } from 'react';
import { useSearchState } from '../api/useSearchState';
import { Input, Button } from '../../../shared/ui';
import { SearchSuggestions } from './SearchSuggestions';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export interface SearchBarProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    hideAdvancedToggle?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    className,
    size = 'md',
    hideAdvancedToggle = false,
}) => {
    const { state, setQuery } = useSearchState();
    const [localQuery, setLocalQuery] = useState(state.query);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef<HTMLFormElement>(null);

    // Debounce logic utilized exclusively for driving the TypeAhead suggestion popup
    const debouncedQueryForSuggestions = useDebounce(localQuery, 300);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsFocused(false);
        if (localQuery.trim() !== state.query) {
            setQuery(localQuery.trim());
        }
    };

    const handleSuggestionSelect = () => {
        setIsFocused(false);
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const inputHeights = {
        sm: 'h-9 text-sm',
        md: 'h-11 text-base',
        lg: 'h-14 text-lg',
    };

    return (
        <form
            ref={wrapperRef}
            onSubmit={handleSubmit}
            className={`relative flex flex-col w-full ${className || ''}`}
        >
            <div className="flex w-full">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Search over 15 million scientific documents"
                        value={localQuery}
                        onChange={e => setLocalQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        className="w-full"
                        inputClassName={`w-full bg-lumex-bg-white text-lumex-text pl-4 pr-10 shadow-inner rounded-r-none ${inputHeights[size]} ring-offset-lumex-blue focus-visible:ring-lumex-blue-light dark:focus-visible:ring-lumex-blue`}
                        aria-label="Search terms"
                        autoComplete="off"
                    />
                    {localQuery && (
                        <button
                            type="button"
                            onClick={() => setLocalQuery('')}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-lumex-muted hover:text-lumex-text`}
                            aria-label="Clear search"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                <Button
                    type="submit"
                    size={size === 'sm' ? 'sm' : 'lg'}
                    className={`rounded-l-none ${inputHeights[size]} px-4 sm:px-8 bg-lumex-blue text-white hover:bg-lumex-blue-dark border-0 flex items-center justify-center`}
                    aria-label="Submit Search"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={iconSizes[size]}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span className="hidden sm:inline-block ml-2 font-bold uppercase tracking-wider text-sm transition-transform active:scale-95">
                        Search
                    </span>
                </Button>
            </div>

            {isFocused && debouncedQueryForSuggestions && (
                <SearchSuggestions
                    query={debouncedQueryForSuggestions}
                    onSelect={handleSuggestionSelect}
                />
            )}

            {!hideAdvancedToggle && (
                <a
                    href="#advanced-search"
                    className="mt-2 text-sm text-lumex-blue hover:text-lumex-blue-dark font-medium self-end flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                    >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Advanced search
                </a>
            )}

        </form>
    );
};
