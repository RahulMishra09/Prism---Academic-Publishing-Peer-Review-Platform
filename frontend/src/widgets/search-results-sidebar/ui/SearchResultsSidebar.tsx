import React from 'react';
import { Link } from 'react-router-dom';
import { SearchFilterPanel } from '../../search-filter-panel';
import { Stack, Skeleton } from '../../../shared/ui';
import { useArticlesList } from '../../../entities/article/api/articleQueries';
import type { ArticleSummary } from '../../../entities/article/model/types';

interface SearchResultsSidebarProps {
    className?: string;
}

const CompactArticleLink: React.FC<{ article: ArticleSummary }> = ({ article }) => (
    <div className="py-3 border-b border-lumex-border last:border-0 group">
        <h5 className="text-sm font-bold text-lumex-text group-hover:text-lumex-blue transition-colors line-clamp-2 mb-1 leading-snug">
            <Link to={`/article/${encodeURIComponent(article.doi)}`}>
                {article.title}
            </Link>
        </h5>
        <div className="flex items-center gap-2 text-[10px] text-lumex-muted font-semibold uppercase tracking-tight">
            <span className="truncate max-w-[120px]">{article.journalTitle}</span>
            <span>•</span>
            <span>{new Date(article.publishedDate).getFullYear()}</span>
        </div>
    </div>
);

export const SearchResultsSidebar: React.FC<SearchResultsSidebarProps> = ({ className }) => {
    // Fetch some generic trending articles for the sidebar
    const { data: trendingData, isLoading: isTrendingLoading } = useArticlesList({
        page: 1,
        pageSize: 3,
    });

    const trendingArticles = trendingData?.data || [];

    return (
        <aside className={`space-y-4 ${className || ''}`}>
            {/* Filters Section */}
            <div className="bg-lumex-card border border-lumex-border rounded-xl shadow-sm transition-colors duration-200">
                <SearchFilterPanel className="border-0 shadow-none" hideHeader />
            </div>

            {/* Trending Research Section */}
            <div className="bg-lumex-card border border-lumex-border rounded-xl p-4 shadow-sm transition-colors duration-200">
                <h4 className="text-[0.72rem] font-bold text-lumex-muted mb-4 uppercase tracking-[0.08em] border-b border-lumex-border pb-2">
                    Trending Research
                </h4>
                {isTrendingLoading && (
                    <Stack direction="col" gap="none">
                        {['skel-1', 'skel-2', 'skel-3'].map(id => (
                            <div key={id} className="py-3 border-b border-lumex-border last:border-0">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        ))}
                    </Stack>
                )}
                {!isTrendingLoading && trendingArticles.length > 0 && (
                    <div className="divide-y divide-lumex-border">
                        {trendingArticles.map(a => (
                            <CompactArticleLink key={a.doi} article={a} />
                        ))}
                    </div>
                )}
                {!isTrendingLoading && trendingArticles.length === 0 && (
                    <p className="text-xs text-lumex-muted italic py-2">No trending research available.</p>
                )}
            </div>

            {/* Help & Support Widget */}
            <div className="bg-lumex-blue/5 border border-lumex-blue/20 rounded-xl p-4 shadow-sm">
                <h4 className="text-[0.82rem] font-bold text-lumex-blue mb-2">
                    Need Search Help?
                </h4>
                <p className="text-[0.78rem] text-lumex-text opacity-80 mb-4 leading-relaxed">
                    Learn how to use Boolean operators and wildcards in your search queries.
                </p>
                <Link 
                    to="/help/search" 
                    className="inline-flex items-center text-[0.78rem] font-bold text-lumex-blue hover:underline"
                >
                    View Search Guide
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                    >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </aside>
    );
};
