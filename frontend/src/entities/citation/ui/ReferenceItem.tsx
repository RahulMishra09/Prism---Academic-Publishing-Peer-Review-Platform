import React from 'react';
import { Link } from '../../../shared/ui';
import type { ArticleReference } from '../../article/model/types';

export interface ReferenceItemProps {
    reference: ArticleReference;
    className?: string;
}

export const ReferenceItem: React.FC<ReferenceItemProps> = ({ reference, className }) => {
    return (
        <div
            id={`ref-${reference.index}`}
            className={`flex gap-3 text-sm text-lumex-text-main leading-relaxed ${className || ''}`}
        >
            <span className="font-semibold w-5 shrink-0 text-right select-none">
                {reference.index}.
            </span>
            <div className="flex-1">
                {/* Render fully parsed strings directly avoiding complex XML parser rewrites for mock phase */}
                <span>{reference.authors.join(', ')} </span>
                {reference.year && <span>({reference.year}). </span>}

                {reference.title &&
                    (reference.url || reference.doi ? (
                        <Link
                            to={reference.url || `https://doi.org/${reference.doi}`}
                            className="text-lumex-blue hover:underline font-serif"
                            external={!!reference.url} // if it's an external url open in new tab
                        >
                            {reference.title}
                        </Link>
                    ) : (
                        <span className="font-serif italic">{reference.title}.</span>
                    ))}

                {reference.journal && <span> {reference.journal}, </span>}
                {reference.volume && <span className="font-semibold">{reference.volume}</span>}
                {reference.issue && <span>({reference.issue})</span>}
                {reference.pages && <span>, {reference.pages}. </span>}

                {reference.doi && !reference.url && (
                    <span className="block mt-1">
                        <Link
                            to={`https://doi.org/${reference.doi}`}
                            className="text-lumex-blue text-xs hover:underline break-all"
                            external
                        >
                            https://doi.org/{reference.doi}
                        </Link>
                    </span>
                )}
            </div>
        </div>
    );
};
