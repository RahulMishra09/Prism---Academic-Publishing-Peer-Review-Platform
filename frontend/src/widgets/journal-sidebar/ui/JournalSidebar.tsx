import React from 'react';
import { Button, Stack } from '../../../shared/ui';
import type { Journal } from '../../../entities/journal/model/types';
import { MetricsPanel } from '../../metrics-panel';

export interface JournalSidebarProps {
    journal: Journal;
    className?: string;
    baseUrl: string;
}

export const JournalSidebar: React.FC<JournalSidebarProps> = ({ journal, className, baseUrl }) => {
    const metrics = [
        { label: 'Impact Factor', value: journal.metrics?.impactFactor || 'N/A', trend: 'up' },
        { label: '5-year Impact Factor', value: '5.2', trend: 'neutral' }, // Mocking for visual parity
        { label: 'CiteScore', value: journal.metrics?.citeScore || 'N/A', trend: 'up' },
        { label: 'Downloads', value: journal.metrics?.downloads?.toLocaleString() || 'N/A', trend: 'up' },
    ].filter(m => m.value !== 'N/A') as { label: string; value: string | number; trend: 'up' | 'neutral' | 'down' }[];

    return (
        <div className={`space-y-6 ${className || ''}`}>
            {/* Primary Actions */}
            <Stack direction="col" gap="sm">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-base font-bold shadow-md"
                    onClick={() => (window.location.href = `${baseUrl}/submit`)}
                >
                    Submit manuscript
                </Button>
                <Button variant="outline" size="lg" className="w-full text-base font-bold border-2">
                    Explore published articles
                </Button>
            </Stack>

            <hr className="border-lumex-border" />

            {/* Mobile-only Metrics Panel (Hidden on Desktop where Hero handles it) */}
            <div className="md:hidden">
                <MetricsPanel
                    metrics={metrics}
                    layout="grid"
                    title="Journal metrics"
                    className="p-5"
                />
            </div>

            {/* Abstracting and Indexing */}
            <div className="bg-lumex-bg-white border text-sm border-lumex-border p-5">
                <h4 className="font-bold text-lumex-text mb-3">Abstracted and indexed in</h4>
                <p className="text-lumex-text-secondary leading-relaxed mb-3 line-clamp-4 hover:line-clamp-none transition-all">
                    Science Citation Index Expanded (SciSearch), Journal Citation Reports/Science
                    Edition, PubMed/Medline, SCOPUS, EMBASE, Chemical Abstracts Service (CAS),
                    Google Scholar, EBSCO, CSA, ProQuest, CAB International, Academic OneFile,
                    AGRICOLA...
                </p>
                <a href="#" className="text-lumex-blue hover:underline font-medium block">
                    Show all 42 indexing services
                </a>
            </div>

            {/* Popular Context Links */}
            <div className="bg-lumex-bg-light p-5">
                <Stack direction="col" gap="sm" className="text-sm font-bold text-lumex-blue">
                    <a href="#" className="hover:underline flex items-center justify-between">
                        Electronic ISSN <span>{journal.issn}</span>
                    </a>
                    <a href="#" className="hover:underline flex items-center justify-between">
                        Print ISSN <span>0948-2838</span>
                    </a>
                    <hr className="border-gray-300 my-2" />
                    <a href="#" className="hover:underline">
                        Contact the journal
                    </a>
                    <a href="#" className="hover:underline">
                        Pricing and access options
                    </a>
                    <a href="#" className="hover:underline">
                        Sign up for alerts
                    </a>
                </Stack>
            </div>
        </div>
    );
};
