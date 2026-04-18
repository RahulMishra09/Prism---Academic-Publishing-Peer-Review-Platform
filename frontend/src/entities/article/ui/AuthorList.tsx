import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../../shared/ui';
import type { Author } from '../model/types';

export interface AuthorListProps {
    authors: Author[];
    maxVisible?: number;
    className?: string;
}

export const AuthorList: React.FC<AuthorListProps> = ({ authors, maxVisible = 10, className }) => {
    if (!authors || authors.length === 0) return null;

    const isTruncated = authors.length > maxVisible;
    const visibleAuthors = isTruncated ? authors.slice(0, maxVisible) : authors;

    return (
        <div className={`text-base leading-relaxed text-lumex-text ${className || ''}`}>
            {visibleAuthors.map((author, index) => {
                const isLastVisible = index === visibleAuthors.length - 1;
                const displayName = author.name || `${author.firstName} ${author.lastName}`;

                return (
                    <React.Fragment key={author.id}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-help hover:underline hover:text-lumex-blue transition-colors">
                                        {displayName}
                                        {author.isCorresponding && (
                                            <sup className="ml-0.5" aria-hidden="true">
                                                ✉
                                            </sup>
                                        )}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    align="center"
                                    className="max-w-xs text-left"
                                >
                                    <div className="font-bold mb-1">{displayName}</div>
                                    {author.orcid && (
                                        <div className="mb-2 text-xs opacity-90">
                                            ORCID: {author.orcid}
                                        </div>
                                    )}
                                    {author.affiliations && author.affiliations.length > 0 && (
                                        <ul className="list-disc pl-4 space-y-1">
                                            {author.affiliations.map(aff => (
                                                <li key={aff.id}>
                                                    {aff.department ? `${aff.department}, ` : ''}
                                                    {aff.name}, {aff.city ? `${aff.city}, ` : ''}
                                                    {aff.country}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {author.isCorresponding && (
                                        <div className="mt-2 text-xs italic">
                                            Corresponding Author
                                        </div>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {!isLastVisible && <span className="mr-1">,</span>}
                    </React.Fragment>
                );
            })}

            {isTruncated && <span className="italic ml-1 text-lumex-muted">et al.</span>}
        </div>
    );
};
