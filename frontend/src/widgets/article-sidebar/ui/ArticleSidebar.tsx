import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article, ArticleSummary } from '../../../entities/article/model/types';
import { ArticleTableOfContents, useRecentlyViewed } from '../../../features/article';
import { useArticlesList } from '../../../entities/article/api/articleQueries';
import { Skeleton, Stack } from '../../../shared/ui';

export interface ArticleSidebarProps {
    article: Article;
    activeTab: string;
    className?: string;
}

const CompactArticleLink: React.FC<{ article: ArticleSummary | Article }> = ({ article }) => (
    <div className="py-3 border-b border-lumex-border last:border-0 group">
        <h5 className="text-sm font-bold text-lumex-text group-hover:text-lumex-blue transition-colors line-clamp-2 mb-1 leading-snug">
            <Link to={`/article/${encodeURIComponent(article.doi)}`}>
                {article.title}
            </Link>
        </h5>
        <div className="flex items-center gap-2 text-[10px] text-lumex-muted font-semibold uppercase tracking-tight">
            <span className="truncate max-w-[150px]">{article.journalTitle}</span>
            <span>•</span>
            <span>{new Date(article.publishedDate).getFullYear()}</span>
        </div>
    </div>
);

export const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
    article,
    activeTab,
    className,
}) => {
    const [showMetrics, setShowMetrics] = useState(true);
    const { recentArticles } = useRecentlyViewed();

    // Fetch articles from the same subject area
    const { data: trendingData, isLoading: isTrendingLoading } = useArticlesList({
        page: 1,
        pageSize: 5,
        discipline: article.subjectArea,
    });

    // Filter out the current article from recent and trending
    const displayRecent = recentArticles.filter(a => a.doi !== article.doi).slice(0, 5);
    const displayTrending = (trendingData?.data || []).filter(a => a.doi !== article.doi).slice(0, 5);

    return (
        <aside className={`space-y-6 ${className || ''}`}>
            {/* Article Access Badge */}
            <div className="bg-lumex-card border border-lumex-border rounded-lg p-4 text-sm shadow-sm transition-colors duration-200">
                <div className="flex items-center gap-2 mb-3">
                    {article.accessLevel === 'open_access' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-lumex-open-bg text-lumex-open-text rounded font-bold text-xs">
                            Open Access
                        </span>
                    )}
                    {article.accessLevel === 'subscribed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-lumex-sub-bg text-lumex-sub-text rounded font-bold text-xs">
                            Subscribed
                        </span>
                    )}
                    {(article.accessLevel !== 'open_access' && article.accessLevel !== 'subscribed') && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-lumex-bg text-lumex-text rounded font-bold text-xs">
                            Access Required
                        </span>
                    )}
                </div>
                {article.pdfUrl &&
                    (article.accessLevel === 'open_access' ||
                        article.accessLevel === 'subscribed') && (
                        <a
                            href={article.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-lumex-blue hover:underline font-bold"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            View Full PDF
                        </a>
                    )}
            </div>

            {/* Article Metrics */}
            {article.metrics && (
                <div className="bg-lumex-card border border-lumex-border rounded-lg p-4 shadow-sm transition-colors duration-200">
                    <button
                        onClick={() => setShowMetrics(!showMetrics)}
                        className="flex items-center justify-between w-full text-sm font-bold text-lumex-text mb-3 tracking-tight"
                    >
                        Article Metrics
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform ${showMetrics ? 'rotate-180' : ''}`}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    {showMetrics && (
                        <div className="grid grid-cols-2 gap-2 text-center">
                            {article.metrics.views !== undefined && (
                                <div className="bg-lumex-bg-deep rounded p-2">
                                    <div className="text-xl font-bold text-lumex-blue">
                                        {article.metrics.views.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] font-bold text-lumex-muted uppercase tracking-tighter">Views</div>
                                </div>
                            )}
                            {article.metrics.downloads !== undefined && (
                                <div className="bg-lumex-bg-deep rounded p-2">
                                    <div className="text-xl font-bold text-lumex-blue">
                                        {article.metrics.downloads.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] font-bold text-lumex-muted uppercase tracking-tighter">Downloads</div>
                                </div>
                            )}
                            {article.metrics.citations !== undefined && (
                                <div className="bg-lumex-bg-deep rounded p-2">
                                    <div className="text-xl font-bold text-lumex-blue">
                                        {article.metrics.citations.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] font-bold text-lumex-muted uppercase tracking-tighter">Citations</div>
                                </div>
                            )}
                            {article.metrics.altmetricScore !== undefined && (
                                <div className="bg-lumex-bg-deep rounded p-2">
                                    <div className="text-xl font-bold text-lumex-blue">
                                        {article.metrics.altmetricScore}
                                    </div>
                                    <div className="text-[10px] font-bold text-lumex-muted uppercase tracking-tighter">Altmetric</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Sticky Table of Contents – only on "article" tab */}
            {activeTab === 'article' && article.sections && article.sections.length > 0 && (
                <ArticleTableOfContents sections={article.sections} />
            )}

            {/* Trending in Subject */}
            <div className="bg-lumex-card border border-lumex-border rounded-lg p-4 shadow-sm transition-colors duration-200">
                <h4 className="text-xs font-bold text-lumex-text mb-4 uppercase tracking-[0.05em] border-b border-lumex-border pb-2">
                    Trending in {article.subjectArea || 'Research'}
                </h4>
                {isTrendingLoading && (
                    <Stack direction="col" gap="md">
                        {[1, 2, 3].map(i => (
                            <div key={`skeleton-${i}`} className="space-y-2 py-3 border-b border-lumex-border last:border-0">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        ))}
                    </Stack>
                )}
                {!isTrendingLoading && displayTrending.length > 0 && (
                    <div>
                        {displayTrending.map(a => (
                            <CompactArticleLink key={a.doi} article={a} />
                        ))}
                    </div>
                )}
                {!isTrendingLoading && displayTrending.length === 0 && (
                    <p className="text-xs text-lumex-muted italic">No trending articles found in this category.</p>
                )}
            </div>

            {/* Recently Viewed */}
            {displayRecent.length > 0 && (
                <div className="bg-lumex-card border border-lumex-border rounded-lg p-4 shadow-sm transition-colors duration-200">
                    <h4 className="text-xs font-bold text-lumex-text mb-4 uppercase tracking-[0.05em] border-b border-lumex-border pb-2">
                        Recently Viewed
                    </h4>
                    <div>
                        {displayRecent.map(a => (
                            <CompactArticleLink key={a.doi} article={a} />
                        ))}
                    </div>
                </div>
            )}

            {/* Keywords */}
            {article.keywords && article.keywords.length > 0 && (
                <div className="bg-lumex-card border border-lumex-border rounded-lg p-4 shadow-sm transition-colors duration-200">
                    <h4 className="text-xs font-bold text-lumex-text mb-3 uppercase tracking-wider">
                        Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {article.keywords.map((kw) => (
                            <Link
                                key={kw}
                                to={`/search?query=${encodeURIComponent(kw)}`}
                                className="px-3 py-1 bg-lumex-bg-deep border border-lumex-border rounded text-[11px] text-lumex-blue hover:bg-lumex-blue hover:text-white transition-colors font-bold"
                            >
                                {kw}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* DOI */}
            <div className="bg-lumex-card border border-lumex-border rounded-lg p-4 text-sm shadow-sm transition-colors duration-200">
                <h4 className="text-xs font-bold text-lumex-muted mb-2 uppercase tracking-wider">
                    Digital Object Identifier (DOI)
                </h4>
                <a
                    href={`https://doi.org/${article.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lumex-blue hover:underline break-all text-[11px] font-medium"
                >
                    https://doi.org/{article.doi}
                </a>
            </div>
        </aside>
    );
};
