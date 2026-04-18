import React from 'react';
import { Stack, Link } from '../../../shared/ui';
import type { ArticleSummary, Article } from '../model/types';
import { ArticleBadge } from './ArticleBadge';
import { ArticleMeta } from './ArticleMeta';
import { AuthorList } from './AuthorList';

export interface ArticleCardProps {
    article: ArticleSummary | Article;
    className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, className }) => {
    return (
        <article
            className={`py-6 border-b border-lumex-border last:border-0 ${className || ''}`}
        >
            <Stack direction="col" gap="sm">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <ArticleBadge type="article-type" articleType={article.articleType} />
                    <ArticleBadge type="access" accessLevel={article.accessLevel} />
                </div>

                <h3 className="text-xl font-serif font-bold text-lumex-blue leading-snug">
                    <Link
                        to={`/article/${encodeURIComponent(article.doi)}`}
                        className="hover:underline"
                    >
                        {article.title}
                    </Link>
                </h3>

                <div className="mt-1">
                    <AuthorList authors={article.authors} maxVisible={3} className="text-sm" />
                </div>

                <div className="mt-2 text-sm text-lumex-text-secondary line-clamp-2">
                    {'abstract' in article && article.abstract && article.abstract.length > 0 && (
                        <span>{article.abstract[0].text}</span>
                    )}
                </div>

                <div className="mt-3">
                    <ArticleMeta
                        doi={article.doi}
                        publishedDate={article.publishedDate}
                        journalTitle={article.journalTitle}
                        journalSlug={article.journalSlug}
                        volume={'volume' in article ? article.volume : undefined}
                        issue={'issue' in article ? article.issue : undefined}
                    />
                </div>
            </Stack>
        </article>
    );
};
