import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Checkbox,
    Stack,
} from '../../../shared/ui';
import type { SearchFacet, SearchFilters } from '../../../shared/types/search.types';

export interface SearchFilterPanelViewProps {
    facets: SearchFacet[];
    activeFilters: SearchFilters;
    onFilterToggle: (category: keyof SearchFilters, value: string) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
    hideHeader?: boolean;
    className?: string;
}

// Maps backend facet fields to local state filter keys
const FACET_MAPPING: Record<string, keyof SearchFilters> = {
    contentType: 'contentType',
    discipline: 'discipline',
    accessType: 'accessType',
    language: 'language',
    journal: 'journal',
    articleType: 'articleType',
};

export const SearchFilterPanelView: React.FC<SearchFilterPanelViewProps> = ({
    facets,
    activeFilters,
    onFilterToggle,
    onClearFilters,
    isLoading,
    hideHeader,
    className,
}) => {
    const hasActiveFilters = Object.values(activeFilters).some(v =>
        Array.isArray(v) ? v.length > 0 : !!v
    );

    return (
        <div className={`w-full ${className || ''}`}>
            {!hideHeader && (
                <div className="flex justify-between items-end mb-5 px-1">
                    <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-lumex-muted-more font-sans">
                        Refine your search
                    </h2>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="text-[0.75rem] font-bold text-lumex-blue hover:text-lumex-blue-dark transition-colors"
                            disabled={isLoading}
                        >
                            Clear all
                        </button>
                    )}
                </div>
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-[52px] bg-lumex-card/50 border border-lumex-border rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-lumex-border bg-lumex-card shadow-sm">
                    <Accordion type="multiple" className="w-full">
                        {facets.map(facet => {
                            const filterKey = FACET_MAPPING[facet.field];
                            if (!filterKey) return null;

                            return (
                                <AccordionItem 
                                    key={facet.field} 
                                    value={facet.field}
                                    className="border-b border-lumex-border last:border-0"
                                >
                                    <AccordionTrigger className="px-5 py-4 text-[0.82rem] font-bold text-lumex-text hover:text-lumex-blue hover:no-underline transition-colors [&[data-state=open]]:bg-lumex-bg-deep/30">
                                        {facet.label}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 pb-3">
                                        <Stack direction="col" gap="none" className="mt-1">
                                            {facet.values.map(val => {
                                                const isChecked = Array.isArray(
                                                    activeFilters[filterKey]
                                                )
                                                    ? (
                                                        activeFilters[filterKey] as string[]
                                                    ).includes(val.value)
                                                    : false;

                                                return (
                                                    <label
                                                        key={val.value}
                                                        className={`flex items-center cursor-pointer group px-3 py-2.5 rounded-lg transition-all hover:bg-lumex-bg-deep ${isChecked ? 'bg-lumex-bg-deep/50' : ''}`}
                                                    >
                                                        <div className="flex items-center mr-3">
                                                            <Checkbox
                                                                id={`filter-${facet.field}-${val.value}`}
                                                                checked={isChecked}
                                                                onCheckedChange={() =>
                                                                    onFilterToggle(
                                                                        filterKey,
                                                                        val.value
                                                                    )
                                                                }
                                                                className="border-lumex-border-hover data-[state=checked]:bg-lumex-blue data-[state=checked]:border-lumex-blue"
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex justify-between items-center min-w-0">
                                                            <span className={`text-[0.81rem] truncate transition-colors ${isChecked ? 'text-lumex-text font-medium' : 'text-lumex-text-secondary group-hover:text-lumex-text'}`}>
                                                                {val.label}
                                                            </span>
                                                            <span className="ml-2 text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-lumex-bg-deep-more text-lumex-muted-more min-w-[24px] text-center">
                                                                {val.count > 999 ? `${(val.count/1000).toFixed(1)}k` : val.count}
                                                            </span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </Stack>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
            )}
        </div>
    );
};
