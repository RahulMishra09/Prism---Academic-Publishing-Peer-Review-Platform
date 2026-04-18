import React from 'react';
import { Stack, Link } from '../../../shared/ui';
import type { Article } from '../model/types';
import { ArticleBadge } from './ArticleBadge';
import { ArticleMeta } from './ArticleMeta';
import { AuthorList } from './AuthorList';
import { KeywordList } from './KeywordList';

export interface ArticleCardFullProps {
    article: Article;
    className?: string;
}

export const ArticleCardFull: React.FC<ArticleCardFullProps> = ({ article, className }) => {
    return (
        <article
            className={`p-6 bg-lumex-card border border-lumex-border shadow-sm ${className || ''}`}
        >
            <Stack direction="col" gap="md">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <ArticleBadge type="article-type" articleType={article.articleType} />
                        <ArticleBadge type="access" accessLevel={article.accessLevel} />
                    </div>
                    {article.metrics && (
                        <div className="text-sm text-lumex-muted font-semibold">
                            {article.metrics.citations || 0} Citations •{' '}
                            {article.metrics.downloads || 0} Downloads
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-serif font-bold text-lumex-blue leading-tight">
                    <Link
                        to={`/article/${encodeURIComponent(article.doi)}`}
                        className="hover:underline"
                    >
                        {article.title}
                    </Link>
                </h2>

                <div className="mt-2 pb-4 border-b border-lumex-border">
                    <AuthorList authors={article.authors} maxVisible={10} className="text-base" />
                </div>

                <div className="py-2">
                    <ArticleMeta
                        doi={article.doi}
                        publishedDate={article.publishedDate}
                        journalTitle={article.journalTitle}
                        journalSlug={article.journalSlug}
                        volume={article.volume}
                        issue={article.issue}
                        pages={article.pages}
                    />
                </div>

                {article.abstract && article.abstract.length > 0 && (
                    <div className="mt-2 text-lumex-text text-sm leading-relaxed">
                        <h4 className="font-bold text-lumex-text mb-1">Abstract</h4>
                        <p className="line-clamp-4">
                            {article.abstract.map(a => a.text).join(' ')}
                        </p>
                    </div>
                )}

                {article.keywords && article.keywords.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-lumex-border-light">
                        <KeywordList keywords={article.keywords} maxVisible={5} />
                    </div>
                )}
            </Stack>
        </article>
    );
};
