import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { DISCIPLINES, DISCIPLINE_ICONS } from '../../../shared/constants/disciplines';
const ArrowRight = () => <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;

export const DisciplinesPage: React.FC = () => {
    return (
        <div className="py-12 min-h-[70vh] bg-lumex-bg">
            <Container>
                {/* Header */}
                <div className="mb-12 border-b border-lumex-border pb-8 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-serif font-bold text-lumex-text mb-4">
                        Browse by Discipline
                    </h1>
                    <p className="text-lg text-lumex-muted leading-relaxed">
                        Explore our comprehensive collection of research across all major scientific, technical, and medical disciplines. Find journals, articles, and books tailored to your field of study.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {DISCIPLINES.map(discipline => (
                        <Link
                            key={discipline.slug}
                            to={`/subject/${discipline.slug}`}
                            className="group relative flex flex-col justify-between bg-lumex-card p-6 rounded-xl border border-lumex-border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-lumex-blue ring-1 ring-transparent hover:ring-lumex-blue-soft focus:outline-none focus-visible:ring-lumex-blue"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-lumex-muted group-hover:text-lumex-blue transition-colors duration-300">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={DISCIPLINE_ICONS[discipline.slug] ?? ''} />
                                    </svg>
                                </span>
                                <div className="h-8 w-8 rounded-full bg-lumex-bg flex items-center justify-center text-lumex-muted group-hover:bg-lumex-blue group-hover:text-white transition-colors">
                                    <ArrowRight />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold font-serif text-lumex-text group-hover:text-lumex-blue transition-colors">
                                    {discipline.label}
                                </h2>
                            </div>

                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-lumex-blue transition-all duration-300 group-hover:w-full rounded-b-xl" />
                        </Link>
                    ))}
                </div>
            </Container>
        </div>
    );
};
