import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Button, Skeleton } from '@shared/ui';
import { useConference } from '../../../entities/conference';

export const ConferencePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: conference, isLoading, error } = useConference(slug || '');

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen">
                <div className="bg-lumex-blue h-[300px] flex items-center justify-center">
                    <Container text-center>
                        <Skeleton className="h-10 w-3/4 mx-auto bg-white/20 mb-4" />
                        <Skeleton className="h-6 w-1/2 mx-auto bg-white/20" />
                    </Container>
                </div>
                <Container className="py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-3 space-y-8">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-40 w-full" />
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error || !conference) {
        return (
            <Container className="py-20 text-center">
                <h1 className="text-3xl font-bold text-lumex-text mb-4">Conference Not Found</h1>
                <p className="text-lumex-text-secondary mb-8">
                    {error instanceof Error ? error.message : "The conference you're looking for doesn't exist or hasn't been added yet."}
                </p>
                <Link to="/">
                    <Button variant="primary">Return Home</Button>
                </Link>
            </Container>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>{conference.title}</title>
                <meta name="description" content={`Access the full proceedings and accepted papers from ${conference.title}. Held in ${conference.location} on ${conference.date}.`} />
            </Helmet>
            {/* Hero Section */}
            <div className="bg-lumex-blue text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-lumex-blue-dark opacity-10 pattern-diagonal-lines" />
                <Container className="relative z-10 text-center">
                    <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold tracking-wider uppercase mb-4">
                        Conference Proceedings
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 max-w-4xl mx-auto leading-tight transition-all duration-700 ease-out">
                        {conference.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg text-white/90">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            {conference.date}
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            {conference.location}
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-8 border-b border-lumex-border pb-4">
                            <h2 className="text-2xl font-serif font-bold text-lumex-text">
                                Accepted Papers ({conference.papers.length})
                            </h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Sort by Title</Button>
                                <Button variant="outline" size="sm">Sort by Citations</Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {conference.papers.map((paper) => (
                                <article key={paper.id} className="p-6 border border-lumex-border rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1 bg-white">
                                    <h3 className="text-xl font-bold text-lumex-blue mb-2 hover:underline cursor-pointer leading-snug">
                                        {paper.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 font-medium">{paper.authors}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-lumex-blue bg-lumex-blue-soft px-3 py-1.5 rounded-full border border-lumex-blue/10">
                                            {paper.citations} Citations
                                        </span>
                                        <div className="flex gap-4">
                                            <a href="#" className="text-sm font-bold text-lumex-blue hover:text-lumex-blue-dark transition-colors flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                                PDF
                                            </a>
                                            <a href="#" className="text-sm font-bold text-lumex-blue hover:text-lumex-blue-dark transition-colors flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                Abstract
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-lumex-bg-light p-8 rounded-xl border border-lumex-border sticky top-24 shadow-sm">
                            <h3 className="font-bold text-lumex-text mb-4 text-lg">About this Conference</h3>
                            <p className="text-sm text-lumex-text-secondary mb-6 leading-relaxed">
                                {conference.about}
                            </p>

                            <h4 className="font-bold text-sm text-lumex-text mb-3 uppercase tracking-wider">Key Topics</h4>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {conference.topics.map(tag => (
                                    <span key={tag} className="text-xs bg-white border border-lumex-border px-2.5 py-1.5 rounded-md text-lumex-text-secondary font-medium hover:border-lumex-blue transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Button variant="primary" className="w-full py-4 text-base shadow-md">
                                Buy Proceedings — ${conference.price.toFixed(2)}
                            </Button>
                            <p className="text-center text-[0.7rem] text-lumex-sub mt-4">
                                Secure processing provided by Lumex Payments
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};
