import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Stack, Skeleton } from '../../../shared/ui';
import type { Journal } from '../../../entities/journal/model/types';

export const JournalIssueListPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();

    // In a real app we would use a useJournalIssues(journal.id) hook
    // Mocking layout directly for UI parity
    const isLoading = false;
    const mockVolumes = [
        { number: 45, year: 2024, issues: 12 },
        { number: 44, year: 2023, issues: 12 },
        { number: 43, year: 2022, issues: 12 },
        { number: 42, year: 2021, issues: 12 },
    ];

    return (
        <div className="space-y-8">
            <div className="border-b border-lumex-border pb-3">
                <h2 className="text-2xl font-serif text-lumex-blue font-bold">
                    Volumes and issues
                </h2>
            </div>

            <div className="bg-lumex-bg-deep p-6 mb-8 border border-lumex-border">
                <h3 className="text-lg font-bold text-lumex-text mb-4">
                    Search within this journal
                </h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search terms"
                        className="flex-1 px-4 py-2 border border-lumex-border bg-lumex-bg-white focus:outline-none focus:border-lumex-blue focus:ring-1 focus:ring-lumex-blue text-lumex-text text-sm"
                    />
                    <button className="bg-lumex-blue text-white px-6 font-bold uppercase text-sm tracking-wider hover:bg-lumex-blue-dark transition-colors">
                        Search
                    </button>
                </div>
                <a
                    href="#"
                    className="text-sm text-lumex-blue font-bold hover:underline mt-3 block"
                >
                    Advanced search
                </a>
            </div>

            <p className="text-lumex-text-secondary">Browse the archive of {journal.title}.</p>

            {isLoading ? (
                <Stack direction="col" gap="md">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </Stack>
            ) : (
                <Stack
                    direction="col"
                    gap="none"
                    className="divide-y divide-lumex-border border-t border-b border-lumex-border"
                >
                    {mockVolumes.map(vol => (
                        <div
                            key={vol.number}
                            className="py-4 flex justify-between items-center group cursor-pointer hover:bg-lumex-card transition-colors px-2"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-lumex-blue group-hover:underline">
                                    Volume {vol.number} ({vol.year})
                                </h3>
                                <p className="text-sm text-lumex-text-secondary mt-1">
                                    {vol.issues} issues
                                </p>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-lumex-sub group-hover:text-lumex-blue"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    ))}
                </Stack>
            )}
        </div>
    );
};
