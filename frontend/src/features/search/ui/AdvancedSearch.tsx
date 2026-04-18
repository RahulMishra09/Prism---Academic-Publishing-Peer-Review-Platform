import React, { useState } from 'react';
import { useSearchState } from '../api/useSearchState';
import { Input, Button, Stack, Container } from '../../../shared/ui';

export interface AdvancedSearchProps {
    onClose?: () => void;
    className?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onClose, className }) => {
    const { state, executeSearch } = useSearchState();

    const [formData, setFormData] = useState({
        query: state.query || '',
        titleSearch: state.titleSearch || '',
        authorSearch: state.authorSearch || '',
        doiSearch: state.doiSearch || '',
        dateFrom: state.filters?.dateFrom || '',
        dateTo: state.filters?.dateTo || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch({
            query: formData.query,
            titleSearch: formData.titleSearch,
            authorSearch: formData.authorSearch,
            doiSearch: formData.doiSearch,
            filters: {
                ...state.filters,
                dateFrom: formData.dateFrom || undefined,
                dateTo: formData.dateTo || undefined,
            }
        });
        if (onClose) onClose();
    };

    return (
        <div
            className={`bg-lumex-bg-deep border-y border-lumex-border py-8 ${className || ''}`}
            id="advanced-search"
        >
            <Container>
                <div className="max-w-3xl mx-auto bg-white p-6 shadow-sm border border-lumex-border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif text-lumex-blue font-bold">
                            Advanced Search
                        </h2>
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-500 hover:text-lumex-blue"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
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

                    <form onSubmit={handleSubmit}>
                        <Stack direction="col" gap="md">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <label
                                    className="text-sm font-bold text-lumex-text md:text-right"
                                    htmlFor="adv-query"
                                >
                                    Find Resources
                                </label>
                                <div className="md:col-span-3">
                                    <Input
                                        id="adv-query"
                                        name="query"
                                        value={formData.query}
                                        onChange={handleChange}
                                        placeholder="with all of the words"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mt-2">
                                <label
                                    className="text-sm font-bold text-lumex-text md:text-right"
                                    htmlFor="adv-title"
                                >
                                    Title
                                </label>
                                <div className="md:col-span-3">
                                    <Input
                                        id="adv-title"
                                        name="titleSearch"
                                        value={formData.titleSearch}
                                        onChange={handleChange}
                                        placeholder="Search inside title"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mt-2">
                                <label
                                    className="text-sm font-bold text-lumex-text md:text-right"
                                    htmlFor="adv-author"
                                >
                                    Author(s)
                                </label>
                                <div className="md:col-span-3">
                                    <Input
                                        id="adv-author"
                                        name="authorSearch"
                                        value={formData.authorSearch}
                                        onChange={handleChange}
                                        placeholder={'e.g. "Smith" or "Smith, J."'}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mt-2">
                                <label
                                    className="text-sm font-bold text-lumex-text md:text-right"
                                    htmlFor="adv-doi"
                                >
                                    DOI
                                </label>
                                <div className="md:col-span-3">
                                    <Input
                                        id="adv-doi"
                                        name="doiSearch"
                                        value={formData.doiSearch}
                                        onChange={handleChange}
                                        placeholder="e.g. 10.1007/s00285-024-02112-3"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mt-2">
                                <label
                                    className="text-sm font-bold text-lumex-text md:text-right"
                                    htmlFor="adv-date-from"
                                >
                                    Published between
                                </label>
                                <div className="md:col-span-3 flex items-center gap-3">
                                    <Input
                                        id="adv-date-from"
                                        name="dateFrom"
                                        type="number"
                                        min="1800"
                                        max={new Date().getFullYear()}
                                        value={formData.dateFrom}
                                        onChange={handleChange}
                                        placeholder="Year (e.g. 2020)"
                                        className="w-full"
                                    />
                                    <span className="text-lumex-muted font-medium">and</span>
                                    <Input
                                        id="adv-date-to"
                                        name="dateTo"
                                        type="number"
                                        min="1800"
                                        max={new Date().getFullYear()}
                                        value={formData.dateTo}
                                        onChange={handleChange}
                                        placeholder="Year (e.g. 2024)"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-4 pt-4 border-t border-lumex-border">
                                <Button type="submit" variant="primary">
                                    Execute Search
                                </Button>
                            </div>
                        </Stack>
                    </form>
                </div>
            </Container>
        </div>
    );
};
