import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Skeleton } from '../../../shared/ui';
import { useTrendingArticles } from '../../../entities/article/api/articleQueries';
import { useThemeStore } from '../../../entities/theme/model/useThemeStore';
import type { Article } from '../../../entities/article/model/types';

export interface NewsSectionProps {
    className?: string;
}

type TrendingArticle = Article & {
    accentColor?: string;
    heroImageUrl?: string;
    journalTitle?: string;
    citationCount?: number;
    subjects?: string[];
    tags?: string[];
};

const fallbackAccentColors = ['#5b7cf6', '#0ea5e9', '#14b8a6', '#6366f1', '#7c3aed', '#0891b2'];

export const NewsSection: React.FC<NewsSectionProps> = ({ className }) => {
    const { data: trendingArticles, isLoading, isError } = useTrendingArticles();
    const { theme } = useThemeStore();

    return (
        <section className={`py-16 ${className || ''}`}>
            <Container>
                {/* Section header */}
                <div className="mb-7 flex items-end justify-between">
                    <div>
                        <p className="mb-1.5 text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-lumex-blue">
                            Trending
                        </p>
                        <h2
                            className="font-serif text-[1.72rem] font-semibold"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Most Read This Week
                        </h2>
                    </div>
                    <Link
                        to="/search?sort=trending"
                        className="text-sm font-medium text-lumex-blue hover:underline"
                    >
                        All articles →
                    </Link>
                </div>

                {/* Article cards — 2-column grid */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {isLoading &&
                        ['ns1', 'ns2', 'ns3', 'ns4'].map((id) => (
                            <div
                                key={id}
                                className="flex gap-4 rounded-card border border-lumex-border bg-lumex-bg-white p-5"
                            >
                                <Skeleton className="h-full w-1 flex-shrink-0 rounded" />
                                <div className="flex-1">
                                    <Skeleton className="mb-3 h-4 w-1/4" />
                                    <Skeleton className="mb-2 h-5 w-full" />
                                    <Skeleton className="mb-2 h-5 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}

                    {isError && (
                        <div className="col-span-full py-8 text-center text-red-500">
                            Failed to load trending research.
                        </div>
                    )}

                    {!isLoading &&
                        !isError &&
                        (trendingArticles as TrendingArticle[])?.slice(0, 4).map((item, index) => {
                            const color =
                                item.accentColor ||
                                fallbackAccentColors[index % fallbackAccentColors.length];

                            return (
                                <Link
                                    key={item.id}
                                    to={`/article/${encodeURIComponent(item.doi)}`}
                                    className="group flex gap-4 rounded-card border border-lumex-border bg-lumex-card p-5 transition-all hover:border-lumex-border-hover hover:bg-lumex-card-hover hover:shadow-md hover:no-underline"
                                >
                                    {/* Accent bar */}
                                    <div
                                        className="w-1 flex-shrink-0 self-stretch rounded-sm"
                                        style={{ background: color }}
                                    />

                                    <div className="min-w-0 flex-1">
                                        {/* Tags row */}
                                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                                            {(item.subjects || item.tags || [])
                                                .slice(0, 2)
                                                .map((tag: string) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded px-2 py-0.5 text-[0.69rem] font-bold"
                                                        style={{
                                                            background: theme === 'dark' ? 'rgba(96, 165, 250, 0.15)' : `${color}14`,
                                                            color: theme === 'dark' ? '#60a5fa' : color,
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}

                                            <span
                                                className={`ml-auto rounded px-2 py-0.5 text-[0.69rem] font-semibold ${item.accessLevel === 'open_access'
                                                    ? 'bg-lumex-open-bg text-lumex-open-text'
                                                    : 'bg-lumex-sub-bg text-lumex-sub-text'
                                                    }`}
                                            >
                                                {item.accessLevel === 'open_access'
                                                    ? '🔓 Open'
                                                    : '🔒 Sub'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="mb-1.5 font-serif text-[0.95rem] font-medium leading-snug text-lumex-text group-hover:text-lumex-blue">
                                            {item.title}
                                        </h3>

                                        {/* Authors */}
                                        <p className="mb-1 text-[0.77rem] text-lumex-muted">
                                            {item.authors?.map((a) => {
                                                const author = a as unknown as Record<string, string> | string;
                                                return typeof author === 'string'
                                                    ? author
                                                    : `${author.given || author.firstName || ''} ${author.family || author.lastName || ''}`.trim()
                                            })
                                                .slice(0, 3)
                                                .join(', ')}
                                            {(item.authors?.length || 0) > 3 ? ' et al.' : ''}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex flex-wrap gap-3.5 text-[0.71rem] text-lumex-sub">
                                            <span>{item.journalTitle || ''}</span>
                                            <span>{item.publishedDate || ''}</span>
                                            {item.citationCount != null && (
                                                <span className="ml-auto">
                                                    🔗 {item.citationCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </Container>
        </section>
    );
};
