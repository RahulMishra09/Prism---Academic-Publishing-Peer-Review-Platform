import React from 'react';
import type { Article, ArticleSection } from '../../../entities/article/model/types';

export interface ArticleBodyProps {
    article: Article;
    className?: string;
    onFigureClick?: (figureId: string) => void;
    onReferenceClick?: (referenceId: string) => void;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ article, className }) => {
    const renderSection = (section: ArticleSection) => {
        const HeaderTag = `h${Math.min(section.level + 2, 6)}` as keyof JSX.IntrinsicElements;
        let headerClass = 'text-lg font-bold text-lumex-text mt-6 mb-3';
        if (section.level === 1) headerClass = 'text-2xl font-serif font-bold text-lumex-blue mt-10 mb-6 pb-2 border-b border-lumex-border';
        else if (section.level === 2) headerClass = 'text-xl font-bold text-lumex-text mt-8 mb-4';

        return (
            <div key={section.id} id={section.id} className="article-section scroll-mt-24">
                <HeaderTag className={headerClass}>{section.title}</HeaderTag>

                {/* 
                  Dangerous inner HTML is used because article content is typically
                  delivered as curated HTML generated from JATS XML. In a production
                  system, this must be sanitized strictly before rendering.
                */}
                <div
                    className="prose prose-lumex max-w-none text-lumex-text leading-relaxed"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: section.content }}
                />

                {/* Recursively render subsections */}
                {section.subsections && section.subsections.length > 0 && (
                    <div className="pl-0 mt-6">
                        {section.subsections.map((sub: ArticleSection) => renderSection(sub))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`article-body font-sans text-[17px] ${className || ''}`}>
            {/* Sections */}
            {article.sections && article.sections.length > 0 ? (
                <div className="space-y-4">
                    {article.sections.map((section: ArticleSection) => renderSection(section))}
                </div>
            ) : (
                <div className="py-12 text-center text-lumex-muted italic">
                    <p>Full article text is not available or requires a subscription.</p>
                </div>
            )}
        </div>
    );
};
