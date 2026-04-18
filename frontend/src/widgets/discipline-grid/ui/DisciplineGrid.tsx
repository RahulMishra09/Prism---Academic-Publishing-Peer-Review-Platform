import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { DISCIPLINES, DISCIPLINE_ICONS } from '../../../shared/constants/disciplines';
import { useHomepageData } from '../../../features/homepage/api/homepageQueries';
import { useThemeStore } from '../../../entities/theme/model/useThemeStore';

export interface DisciplineGridProps {
    className?: string;
}

const COLORS: Record<string, string> = {
    'biological-sciences': '#0ea5e9',
    'business-management': '#4f46e5',
    chemistry: '#0284c7',
    'computer-science': '#6366f1',
    'earth-environmental-sciences': '#14b8a6',
    'health-sciences': '#0891b2',
    'humanities-social-sciences': '#4f46e5',
    'materials-science': '#0ea5e9',
    mathematics: '#7c3aed',
    'physics-astronomy': '#5b7cf6',
    statistics: '#6366f1',
    'technology-engineering': '#2563eb',
};

export const DisciplineGrid: React.FC<DisciplineGridProps> = ({ className }) => {
    const { data: homepageData } = useHomepageData();
    const { theme } = useThemeStore();
    const counts = homepageData?.disciplineCounts || {};

    return (
        <section
            className={`border-b border-t border-lumex-border bg-lumex-bg-deep py-16 ${className || ''}`}
        >
            <Container>
                {/* Section header */}
                <div className="mb-7 flex items-end justify-between">
                    <div>
                        <p className="mb-1.5 text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-lumex-blue">
                            Browse
                        </p>
                        <h2
                            className="font-serif text-[1.72rem] font-semibold"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Research Disciplines
                        </h2>
                    </div>
                    <Link
                        to="/disciplines"
                        className="text-sm font-medium text-lumex-blue hover:underline"
                    >
                        All Fields →
                    </Link>
                </div>

                {/* Card grid — 6 columns on desktop */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {DISCIPLINES.map(discipline => {
                        const color = COLORS[discipline.slug] || '#3b5bdb';
                        const count = counts[discipline.slug] || '—';

                        return (
                            <Link
                                key={discipline.slug}
                                to={`/subject/${discipline.slug}`}
                                className="group cursor-pointer rounded-[9px] border border-lumex-border bg-lumex-card p-3.5 text-center transition-all hover:border-lumex-border-hover hover:bg-lumex-card-hover hover:shadow-md hover:no-underline"
                            >
                                <div className="mb-2 flex justify-center">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: theme === 'dark' ? '#60a5fa' : color }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={DISCIPLINE_ICONS[discipline.slug] ?? ''} />
                                    </svg>
                                </div>
                                <div className="text-xs font-semibold text-lumex-text">
                                    {discipline.label}
                                </div>
                                <div
                                    className="mt-0.5 text-[0.68rem] font-bold"
                                    style={{ color: theme === 'dark' ? '#60a5fa' : color }}
                                >
                                    {count}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};
