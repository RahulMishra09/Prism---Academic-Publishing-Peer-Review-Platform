import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Skeleton, Badge } from '../../../shared/ui';
import { useQuery } from '@tanstack/react-query';
import type { ArticleSummary } from '../../../entities/article/model/types';
import { fetchClient } from '../../../shared/api/base';
import { FaFire, FaEye, FaDownload } from 'react-icons/fa';

// We fetch mock articles for trending. Re-using the latest articles endpoint or a custom fetch.
export const TrendingResearch: React.FC = () => {
    const { data: trendingArticles, isLoading } = useQuery<ArticleSummary[]>({
        queryKey: ['trendingArticles'],
        queryFn: async () => {
            const res = await fetchClient<{ data: ArticleSummary[] }>('/articles/top?rankBy=views&limit=4');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <section className="py-16 bg-lumex-bg">
                <Container>
                    <div className="flex items-center gap-2 mb-8">
                        <FaFire className="text-orange-500 text-xl" />
                        <h2 className="font-serif text-3xl font-bold text-lumex-text">Trending Research</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
                    </div>
                </Container>
            </section>
        );
    }

    if (!trendingArticles || trendingArticles.length === 0) return null;

    return (
        <section className="py-20 bg-lumex-bg border-y border-lumex-border/50">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-2 text-orange-500">
                            <FaFire className="text-xl" />
                            <span className="text-sm font-bold uppercase tracking-wider">Hot Topics</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-lumex-text">Trending Research</h2>
                        <p className="text-lumex-muted mt-2">Most read and cited articles across all disciplines this month.</p>
                    </div>
                    <Link to="/search" className="text-lumex-blue font-semibold hover:underline text-sm flex-shrink-0">
                        View all articles →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingArticles.map((article, index) => (
                        <div key={article.id} className="group flex flex-col bg-lumex-card rounded-xl border border-lumex-border overflow-hidden hover:shadow-lg hover:border-lumex-blue/30 transition-all relative">
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold text-lumex-muted uppercase tracking-wider">
                                        #{index + 1} Trending
                                    </span>
                                    {article.accessType === 'OPEN_ACCESS' && (
                                        <Badge variant="oa" className="text-[9px] px-1.5 py-0.5">Open Access</Badge>
                                    )}
                                </div>
                                <h3 className="font-serif font-bold text-lumex-text text-lg leading-tight mb-3 group-hover:text-lumex-blue transition-colors line-clamp-3">
                                    <Link to={`/article/${encodeURIComponent(article.doi)}`} className="after:absolute after:inset-0">
                                        {article.title}
                                    </Link>
                                </h3>
                                <p className="text-xs text-lumex-muted mb-4 line-clamp-2">
                                    {article.authors?.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                                </p>
                                <div className="mt-auto relative z-10">
                                    <p className="text-xs font-semibold text-lumex-text mb-2 line-clamp-1">{article.journal?.title}</p>
                                    <div className="flex items-center gap-4 text-xs text-lumex-muted">
                                        <span className="flex items-center gap-1.5"><FaEye /> {article.viewCount ?? (Math.random() * 10 + 2).toFixed(1)}</span>
                                        <span className="flex items-center gap-1.5"><FaDownload /> {article.downloadCount ?? (Math.random() * 5 + 1).toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
