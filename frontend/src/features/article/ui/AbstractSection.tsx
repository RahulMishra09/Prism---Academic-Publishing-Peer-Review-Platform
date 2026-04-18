import React from 'react';
import type { Article, ArticleAbstractSection } from '../../../entities/article/model/types';

export interface AbstractSectionProps {
    article: Article;
    className?: string;
}

export const AbstractSection: React.FC<AbstractSectionProps> = ({ article, className }) => {
    if (!article.abstract) return null;

    return (
        <div className={`prose prose-lumex max-w-none ${className || ''}`} id="abstract">
            <h2 className="text-2xl font-serif text-lumex-blue font-bold mb-4">Abstract</h2>

            {article.abstract.length > 0 ? (
                <div className="space-y-4">
                    {article.abstract.map((section: ArticleAbstractSection, idx: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={idx}>
                            {section.heading && (
                                <h3 className="text-lg font-bold text-lumex-text mb-2 tracking-wide uppercase">
                                    {section.heading}
                                </h3>
                            )}
                            <p className="text-lumex-text leading-relaxed">{section.text}</p>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};
