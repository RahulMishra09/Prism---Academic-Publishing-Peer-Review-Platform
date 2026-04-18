import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilterPanel } from './SearchFilterPanelContainer';
import { useSearchState, useSearch } from '../../../features/search';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks
vi.mock('../../../features/search', () => ({
    useSearchState: vi.fn(),
    useSearch: vi.fn(),
}));

describe('SearchFilterPanel Integration', () => {
    const mockToggleFilter = vi.fn();
    const mockClearFilters = vi.fn();
    const queryClient = new QueryClient();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock the search state
        (useSearchState as Mock).mockReturnValue({
            state: {
                query: 'quantum',
                page: 1,
                filters: {
                    articleType: ['research', 'review'],
                },
            },
            toggleFilter: mockToggleFilter,
            clearFilters: mockClearFilters,
            activeFiltersCount: 2,
        });

        // Mock the search response (facets)
        (useSearch as Mock).mockReturnValue({
            data: {
                facets: [
                    {
                        field: 'articleType',
                        label: 'Article Type',
                        values: [
                            { value: 'research', label: 'Research Article', count: 42 },
                            { value: 'review', label: 'Review Article', count: 12 },
                            { value: 'short-comm', label: 'Short Communication', count: 5 },
                        ],
                    },
                ],
            },
            isFetching: false,
        });
    });

    const renderPanel = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <SearchFilterPanel />
                </BrowserRouter>
            </QueryClientProvider>
        );
    };

    it('renders the filter panel with active filters', async () => {
        renderPanel();
        const user = userEvent.setup();

        // Assert headings and clear button
        expect(screen.getByText('Refine your search')).toBeInTheDocument();
        expect(screen.getByText('Clear all')).toBeInTheDocument();

        // Assert Article Type is present, then expand it
        const articleTypeHeader = screen.getByText('Article Type');
        expect(articleTypeHeader).toBeInTheDocument();
        await user.click(articleTypeHeader);

        // Assert values inside accordion are rendered
        expect(screen.getByText('Research Article')).toBeInTheDocument();
        expect(screen.getByText('Review Article')).toBeInTheDocument();
    });

    it('calls toggleFilter when a checkbox is clicked', async () => {
        renderPanel();
        const user = userEvent.setup();

        // Expand the accordion
        await user.click(screen.getByText('Article Type'));

        // Find the "Short Communication" checkbox
        const labels = screen.getAllByText('Short Communication');
        const shortCommLabel = labels[0]; // the visible one

        await user.click(shortCommLabel);

        expect(mockToggleFilter).toHaveBeenCalledWith('articleType', 'short-comm');
    });

    it('calls clearFilters when clear all is clicked', async () => {
        renderPanel();
        const user = userEvent.setup();

        const clearBtn = screen.getByText('Clear all');
        await user.click(clearBtn);

        expect(mockClearFilters).toHaveBeenCalled();
    });
});
