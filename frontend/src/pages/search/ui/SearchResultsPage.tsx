import React, { useState } from 'react';
import { Container, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../../../shared/ui';
import { SearchBar, AdvancedSearch, useSearchState, useSearch } from '../../../features/search';
import { SearchResultsSidebar } from '../../../widgets/search-results-sidebar';
import { SearchResultsList } from '../../../widgets/search-results-list';

export const SearchResultsPage: React.FC = () => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const { state, activeFiltersCount } = useSearchState();
    const { data: response } = useSearch(state);

    const totalResults = response?.totalCount || 0;
    const query = state.query || 'All Research';

    return (
        <>
            {/* Search Header Banner */}
            <div className="border-b border-lumex-border bg-lumex-bg-white py-6 pt-5">
                <Container>
                    <div className="mb-6">
                        <Breadcrumb className="mb-4">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Search Results</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="mb-1 font-serif text-2xl font-bold text-lumex-text">
                                    Results for "<span className="text-lumex-blue">{query}</span>"
                                </h1>
                                <p className="text-sm text-lumex-muted font-medium">
                                    Showing {totalResults.toLocaleString()} relevant research articles and books
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDrawer(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-lumex-card border border-lumex-border rounded-lg text-sm font-bold text-lumex-text hover:border-lumex-blue transition-all shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="4" y1="6" x2="20" y2="6" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                        <line x1="11" y1="18" x2="13" y2="18" />
                                    </svg>
                                    Refine & Discover
                                    {activeFiltersCount > 0 && (
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-lumex-blue text-white text-[10px] font-bold">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                                
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-lumex-blue hover:text-lumex-blue-dark transition-colors"
                                >
                                    Advanced Search
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-4xl">
                        <SearchBar size="md" hideAdvancedToggle={true} />
                    </div>
                </Container>
            </div>

            {showAdvanced && <AdvancedSearch onClose={() => setShowAdvanced(false)} />}

            {/* Universal Filter & Discovery Drawer */}
            {showDrawer && (
                <div
                    className="fixed inset-0 z-[100]"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-lumex-bg-deep/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowDrawer(false)}
                    />
                    {/* Drawer Panel */}
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-lumex-bg border-l border-lumex-border shadow-2xl animate-in slide-in-from-right duration-300 ease-out overflow-y-auto">
                        <div className="sticky top-0 z-10 flex items-center justify-between p-5 px-6 bg-lumex-bg/90 backdrop-blur-md border-b border-lumex-border">
                            <div>
                                <h2 className="text-lg font-serif text-lumex-text font-bold">Refine & Discover</h2>
                                <p className="text-xs text-lumex-muted font-medium uppercase tracking-wider mt-0.5">Filter results & explore more</p>
                            </div>
                            <button
                                onClick={() => setShowDrawer(false)}
                                className="p-2 text-lumex-muted hover:text-lumex-text transition-colors rounded-full hover:bg-lumex-bg-deep"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 pb-28">
                            <SearchResultsSidebar />
                        </div>
                        {/* Sticky Bottom Actions */}
                        <div className="sticky bottom-0 left-0 right-0 w-full p-6 bg-gradient-to-t from-lumex-bg via-lumex-bg/95 to-transparent border-t border-lumex-border/50">
                            <button
                                onClick={() => setShowDrawer(false)}
                                className="w-full bg-lumex-blue hover:bg-lumex-blue-dark text-white py-4 rounded-xl font-bold shadow-xl shadow-lumex-blue/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Apply Changes & Close
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Results Body */}
            <main>
                <Container className="py-10">
                    <div className="max-w-5xl mx-auto">
                        <SearchResultsList />
                    </div>
                </Container>
            </main>
        </>
    );
};
