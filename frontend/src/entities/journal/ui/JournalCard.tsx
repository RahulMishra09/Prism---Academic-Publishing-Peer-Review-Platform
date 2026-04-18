import React from 'react';
import { Stack, Link, Image } from '../../../shared/ui';
import type { Journal } from '../model/types';
import { JournalBadge } from './JournalBadge';

export interface JournalCardProps {
    journal: Journal;
    className?: string;
}

export const JournalCard: React.FC<JournalCardProps> = ({ journal, className }) => {
    return (
        <article className={`group relative flex flex-col overflow-hidden rounded-xl bg-lumex-card border border-lumex-border transition-all duration-300 hover:border-lumex-blue/40 hover:shadow-xl ${className || ''}`}>
            
            {/* Top part: Cover Image Area */}
            {journal.coverImageUrl ? (
                <div className="relative h-48 w-full overflow-hidden bg-lumex-bg-deep flex items-center justify-center p-4 isolate">
                    {/* Blurred background for aesthetic */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110 pointer-events-none" 
                        style={{ backgroundImage: `url(${journal.coverImageUrl})` }}
                    />
                    {/* Dark gradient overlay at the bottom for better transition */}
                    <div className="absolute inset-0 bg-gradient-to-t from-lumex-card via-transparent to-transparent opacity-80 pointer-events-none" />
                    
                    {/* Actual Book Cover */}
                    <Image
                        src={journal.coverImageUrl}
                        alt={`Cover of ${journal.title}`}
                        className="relative z-10 h-full w-auto object-contain shadow-md rounded-sm group-hover:scale-105 transition-transform duration-500"
                        containerClassName="h-full z-10 relative"
                    />
                </div>
            ) : (
                <div className="h-3 w-full bg-gradient-to-r from-lumex-blue to-lumex-accent" />
            )}

            {/* Bottom part: Content Area */}
            <div className="flex flex-col flex-1 p-5 lg:p-6 min-w-0">
                <Stack direction="col" gap="sm" className="h-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2 relative z-20">
                        <JournalBadge type="access" accessType={journal.accessType} />
                        {journal.metrics?.quartile && (
                            <JournalBadge type="quartile" quartile={journal.metrics.quartile} />
                        )}
                    </div>

                    <h3 className="text-xl font-serif text-lumex-text font-bold leading-tight transition-colors mb-2 z-20 relative">
                        <Link to={`/journal/${journal.slug}`} className="hover:underline hover:text-lumex-blue">
                            {journal.title}
                        </Link>
                    </h3>

                    <div className="text-xs text-lumex-muted mb-2">
                        Published by <span className="font-semibold text-lumex-text">{journal.publisher}</span>
                        {(journal.printISSN || journal.electronicISSN) && <span className="mx-1.5 opacity-50 font-bold">•</span>}
                        {journal.electronicISSN && `Electronic ISSN ${journal.electronicISSN}`}
                        {!journal.electronicISSN && journal.printISSN && `Print ISSN ${journal.printISSN}`}
                    </div>

                    {journal.metrics?.impactFactor && (
                        <div className="grid grid-cols-2 gap-4 border-y border-lumex-border py-4 my-3 bg-lumex-blue/5 -mx-5 px-5 lg:-mx-6 lg:px-6">
                            <div>
                                <div className="text-[10px] uppercase font-bold text-lumex-sub tracking-wider mb-1">{journal.metrics.impactFactorYear || '2024'} Impact Factor:</div>
                                <div className="text-lg font-bold text-lumex-blue">{journal.metrics.impactFactor}</div>
                            </div>
                            {journal.metrics.citeScore && (
                                <div className="border-l border-lumex-border pl-4">
                                    <div className="text-[10px] uppercase font-bold text-lumex-sub tracking-wider mb-1">CiteScore:</div>
                                    <div className="text-lg font-bold text-lumex-text">{journal.metrics.citeScore}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {journal.description && (
                        <p className="text-sm text-lumex-sub line-clamp-3 leading-relaxed mb-4">
                            {journal.description}
                        </p>
                    )}

                    <div className="mt-auto pt-2 pb-1 flex justify-between items-end">
                        <div className="text-[11px] text-lumex-muted leading-relaxed max-w-[80%] pr-2">
                            {journal.discipline && journal.discipline.length > 0 && (
                                <>
                                    <span className="font-semibold">Disciplines:</span>{' '}
                                    {journal.discipline.slice(0, 2).join(', ')}
                                </>
                            )}
                        </div>
                    </div>
                </Stack>
            </div>
            {/* Absolute Link overlay */}
            <Link to={`/journal/${journal.slug}`} className="absolute inset-0 z-10" aria-label={`View ${journal.title}`} />
        </article>
    );
};
