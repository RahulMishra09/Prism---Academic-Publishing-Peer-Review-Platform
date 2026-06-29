import React, { useState } from 'react';
import type { ArticleReference } from '../../../entities/article/model/types';

export interface ReferencesSectionProps {
    references: ArticleReference[];
    className?: string;
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({ references, className }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <section className={`mt-12 ${className || ''}`} id="references">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full text-left mb-6 group"
            >
                <h2 className="text-2xl font-serif font-bold text-lumex-blue">
                    References
                    <span className="ml-3 text-lg font-normal text-gray-500">
                        ({references.length})
                    </span>
                </h2>
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
                    className={`text-gray-400 group-hover:text-lumex-blue transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {expanded && (
                <ol className="space-y-4">
                    {references.map(ref => (
                        <li
                            key={ref.id}
                            id={`ref-${ref.id}`}
                            className="flex gap-4 text-sm text-lumex-text leading-relaxed group hover:bg-lumex-bg-light p-2 -mx-2 rounded transition-colors"
                        >
                            <span className="text-gray-400 font-bold shrink-0 w-6 text-right">
                                {ref.index}.
                            </span>
                            <div>
                                {ref.rawText ? (
                                    <span>{ref.rawText}</span>
                                ) : (
                                    <span>
                                        {ref.authors?.slice(0, 3).join(', ')}
                                        {(ref.authors?.length || 0) > 3 ? ' et al.' : ''}
                                        {ref.year && ` (${ref.year}). `}
                                        {ref.title && <span>{ref.title}. </span>}
                                        {ref.journal && <em>{ref.journal}</em>}
                                        {ref.volume && (
                                            <>
                                                <strong> {ref.volume}</strong>
                                            </>
                                        )}
                                        {ref.issue && `(${ref.issue})`}
                                        {ref.pages && `, ${ref.pages}`}
                                    </span>
                                )}
                                {ref.doi && (
                                    <span className="ml-2">
                                        <a
                                            href={`https://doi.org/${ref.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lumex-blue hover:underline font-medium text-xs"
                                        >
                                            https://doi.org/{ref.doi}
                                        </a>
                                    </span>
                                )}
                                {ref.url && !ref.doi && (
                                    <span className="ml-2">
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lumex-blue hover:underline font-medium text-xs"
                                        >
                                            Link
                                        </a>
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};
