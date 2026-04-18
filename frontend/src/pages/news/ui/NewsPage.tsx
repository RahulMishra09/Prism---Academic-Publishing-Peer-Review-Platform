import React from 'react';
import { Container, Skeleton } from '../../../shared/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import { Link } from 'react-router-dom';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    summary: string;
    slug: string;
}

export const NewsPage: React.FC = () => {
    const { data: news = [], isLoading } = useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            const res = await fetchWithFallback<{ news: NewsItem[] }>(
                '/news',
                '/mock-data/news.json'
            );
            return res.news || [];
        },
    });

    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 border-b border-lumex-border pb-8">
                        <h1 className="text-4xl font-serif font-bold text-lumex-text mb-4">
                            News & Press
                        </h1>
                        <p className="text-xl text-lumex-muted leading-relaxed">
                            Stay updated with the latest announcements, platform updates, and press releases from Lumex.
                        </p>
                    </header>

                    <div className="space-y-8">
                        {isLoading && ['n1', 'n2', 'n3', 'n4'].map((id) => (
                            <Skeleton key={id} className="h-32 w-full rounded-lg" />
                        ))}
                        {!isLoading && news.length === 0 && (
                            <p className="text-lumex-muted italic py-12 text-center">
                                No news articles found.
                            </p>
                        )}
                        {!isLoading && news.length > 0 && (
                            news.map((item) => (
                                <article
                                    key={item.id}
                                    className="pb-8 border-b border-lumex-border last:border-0 group"
                                >
                                    <div className="flex items-center gap-3 mb-2 text-sm font-medium">
                                        <span className="text-lumex-blue bg-lumex-blue/10 px-2.5 py-0.5 rounded-full">
                                            {item.category}
                                        </span>
                                        <time className="text-lumex-sub">
                                            {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </time>
                                    </div>
                                    <h2 className="text-2xl font-bold text-lumex-text mb-3 group-hover:text-lumex-blue transition-colors">
                                        <Link to={`/news/${item.slug}`}>
                                            {item.title}
                                        </Link>
                                    </h2>
                                    <p className="text-lumex-muted leading-relaxed mb-4">
                                        {item.summary}
                                    </p>
                                    <Link
                                        to={`/news/${item.slug}`}
                                        className="text-sm font-bold text-lumex-blue hover:underline inline-flex items-center gap-1"
                                    >
                                        Read full story <span aria-hidden="true">&rarr;</span>
                                    </Link>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
