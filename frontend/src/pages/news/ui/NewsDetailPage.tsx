import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Skeleton } from '../../../shared/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    summary: string;
    slug: string;
    content?: string;
}

export const NewsDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: newsItem, isLoading } = useQuery({
        queryKey: ['news', slug],
        queryFn: async () => {
            const res = await fetchWithFallback<{ news: NewsItem[] }>(
                '/news',
                '/mock-data/news.json'
            );
            return res.news.find(item => item.slug === slug);
        },
    });

    if (!isLoading && !newsItem) {
        return (
            <div className="py-20 text-center">
                <Container>
                    <h1 className="text-2xl font-bold text-lumex-text mb-4">News Story Not Found</h1>
                    <p className="text-lumex-muted mb-8">The story you are looking for does not exist or has been moved.</p>
                    <Link to="/news" className="text-lumex-blue font-bold hover:underline">
                        Back to News & Press
                    </Link>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Container>
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-lumex-muted mb-8" aria-label="Breadcrumb">
                        <Link to="/" className="hover:underline hover:text-lumex-blue transition-colors">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <Link to="/news" className="hover:underline hover:text-lumex-blue transition-colors">
                            News & Press
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-lumex-text font-semibold truncate max-w-[200px] inline-block align-bottom">
                            {isLoading ? '...' : newsItem?.title}
                        </span>
                    </nav>

                    {isLoading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-4 w-24 rounded-full" />
                            <Skeleton className="h-12 w-full" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                    ) : (
                        <article className="animate-fade-up">
                            <header className="mb-10">
                                <div className="flex items-center gap-3 mb-6 text-sm font-bold">
                                    <span className="text-lumex-blue bg-lumex-blue/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {newsItem?.category}
                                    </span>
                                    <time className="text-lumex-sub">
                                        {newsItem?.date && new Date(newsItem.date).toLocaleDateString('en-US', { 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </time>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-lumex-text leading-tight mb-8">
                                    {newsItem?.title}
                                </h1>
                                <div className="p-6 bg-lumex-card border-l-4 border-lumex-blue rounded-r-lg shadow-sm italic text-lg text-lumex-text leading-relaxed">
                                    {newsItem?.summary}
                                </div>
                            </header>

                            <div className="prose prose-lg max-w-none text-lumex-text leading-loose space-y-6">
                                <p>
                                    Lumex is proud to share this latest update with our community. As a leader in scientific publishing and research dissemination, 
                                    we are committed to excellence, transparency, and the advancement of global knowledge.
                                </p>
                                <p>
                                    This development represents a significant milestone in our journey. Our teams have worked tirelessly to ensure that this 
                                    initiative meets the highest standards of our partners and authors. We believe that by fostering a more open and 
                                    collaborative research environment, we can accelerate the pace of discovery and solve the most pressing challenges of our time.
                                </p>
                                
                                <div className="my-10 h-72 bg-lumex-card border border-lumex-border rounded-xl flex items-center justify-center text-lumex-muted overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-lumex-blue/5 to-transparent opacity-50" />
                                    <div className="relative text-center p-8">
                                        <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="font-serif italic">Institutional imagery or mission-related visual would represent this news story.</p>
                                    </div>
                                </div>

                                <p>
                                    "Our goal has always been to empower researchers," says the Lumex editorial director. "With this latest announcement, 
                                    we are taking another bold step toward a future where scientific information is a shared global resource, unrestricted 
                                    by traditional barriers."
                                </p>
                                
                                <p>
                                    We invite all our stakeholders—authors, reviewers, librarians, and institutions—to join us in this exciting new chapter. 
                                    Detailed information regarding the implementation phase will be shared through our usual communication channels in the coming weeks.
                                </p>
                            </div>

                            <footer className="mt-16 pt-8 border-t border-lumex-border">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-lumex-blue/10 flex items-center justify-center text-lumex-blue font-bold">
                                            L
                                        </div>
                                        <div>
                                            <div className="font-bold text-lumex-text">Lumex Press Office</div>
                                            <div className="text-sm text-lumex-muted">Official Communication Team</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="text-lumex-muted hover:text-lumex-blue transition-colors">
                                            <span className="sr-only">Share on Twitter</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                        </button>
                                        <button className="text-lumex-muted hover:text-lumex-blue transition-colors">
                                            <span className="sr-only">Share on LinkedIn</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-12 text-center">
                                    <Link to="/news" className="text-lumex-blue font-bold hover:underline flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to News & Press
                                    </Link>
                                </div>
                            </footer>
                        </article>
                    )}
                </div>
            </Container>
        </div>
    );
};
