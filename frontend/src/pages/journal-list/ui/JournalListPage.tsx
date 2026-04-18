import React from 'react';
import { Container, Skeleton } from '../../../shared/ui';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import type { Journal } from '../../../entities/journal/model/types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const JournalListPage: React.FC = () => {
    const [activeLetter, setActiveLetter] = React.useState('A');

    const { data: journals = [], isLoading } = useQuery({
        queryKey: ['all-journals'],
        queryFn: async () => {
            const res = await fetchWithFallback<{ journals?: Journal[]; data?: Journal[] }>(
                '/journals?pageSize=1000',
                '/mock-data/journals.json'
            );
            return ('journals' in res && res.journals ? res.journals : res.data) || [];
        },
    });

    const filtered = journals.filter(j => j.title.toUpperCase().startsWith(activeLetter));

    return (
        <div className="py-10 bg-lumex-bg min-h-[70vh]">
            <Container>
                <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">
                    Browse by Journal
                </h1>
                <p className="text-lumex-muted mb-8">
                    Browse all journals alphabetically or by discipline.
                </p>

                {/* A-Z nav */}
                <div className="flex flex-wrap gap-1 mb-8">
                    {ALPHABET.map(letter => (
                        <button
                            key={letter}
                            onClick={() => setActiveLetter(letter)}
                            className={`w-9 h-9 text-sm font-bold rounded transition-colors ${activeLetter === letter
                                ? 'bg-lumex-blue text-white'
                                : 'bg-lumex-card border border-lumex-border text-lumex-text hover:border-lumex-blue hover:text-lumex-blue'
                                }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading && ['s1', 's2', 's3', 's4', 's5', 's6'].map((id) => (
                        <Skeleton key={id} className="h-24 w-full rounded-lg" />
                    ))}
                    {!isLoading && filtered.length === 0 && (
                        <p className="col-span-3 text-lumex-muted italic py-8 text-center">
                            No journals found for "{activeLetter}"
                        </p>
                    )}
                    {!isLoading && filtered.length > 0 && (
                        filtered.map(journal => (
                            <Link
                                key={journal.id}
                                to={`/journal/${journal.slug}`}
                                className="bg-lumex-card border border-lumex-border rounded-lg p-4 hover:border-lumex-blue hover:shadow-md transition-all group"
                            >
                                <h3 className="font-bold text-lumex-blue group-hover:underline mb-1 text-sm">
                                    {journal.title}
                                </h3>
                                <p className="text-xs text-lumex-muted">ISSN {journal.issn}</p>
                                {journal.metrics?.impactFactor && (
                                    <p className="text-xs text-lumex-muted mt-1">
                                        IF: {journal.metrics.impactFactor}
                                    </p>
                                )}
                            </Link>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
};
