import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Skeleton } from '../../../shared/ui';
import { ArticleCardFull } from '../../../entities/article/ui/ArticleCardFull';
import type { Article, ArticleSummary } from '../../../entities/article/model/types';
import { useCollection, useCollectionArticles } from '../../../entities/collection/api/collectionQueries';

export const CollectionDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: collection, isLoading: isCollectionLoading } = useCollection(slug);
    const { data: articles = [], isLoading: isArticlesLoading } = useCollectionArticles(slug);

    if (!isCollectionLoading && !collection) {
        return (
            <div className="py-20 text-center">
                <Container>
                    <h1 className="text-2xl font-bold text-lumex-text mb-4">Collection Not Found</h1>
                    <p className="text-lumex-muted mb-8">The collection you are looking for does not exist or has been moved.</p>
                    <Link to="/collections" className="text-lumex-blue font-bold hover:underline">
                        Back to All Collections
                    </Link>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-12 min-h-[70vh] bg-lumex-bg">
            <Container>
                {/* Breadcrumb Navigation */}
                <nav className="text-sm text-lumex-muted mb-8" aria-label="Breadcrumb">
                    <Link to="/" className="hover:underline hover:text-lumex-blue transition-colors">
                        Home
                    </Link>
                    <span className="mx-2">/</span>
                    <Link to="/collections" className="hover:underline hover:text-lumex-blue transition-colors">
                        Collections
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-lumex-text font-semibold">
                        {isCollectionLoading ? '...' : collection?.title}
                    </span>
                </nav>

                {/* Header Section */}
                <div className="mb-12 border-b border-lumex-border pb-8">
                    {isCollectionLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-2/3" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-5/6" />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                                <div className="max-w-3xl">
                                    <h1 className="text-4xl font-serif font-bold text-lumex-text mb-4">
                                        {collection?.title}
                                    </h1>
                                    <p className="text-xl text-lumex-muted leading-relaxed">
                                        {collection?.description}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center md:items-end">
                                    <span className="text-lumex-blue font-bold text-3xl font-serif">{collection?.articleCount}</span>
                                    <span className="text-xs uppercase tracking-wider text-lumex-muted font-bold">Articles</span>
                                </div>
                            </div>
                            <div className="text-sm text-lumex-sub">
                                Last updated: {collection?.updatedAt ? new Date(collection.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                            </div>
                        </>
                    )}
                </div>

                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-lumex-text font-serif mb-8 flex items-center gap-3">
                        Featured Research
                        <div className="h-px flex-grow bg-lumex-border" />
                    </h2>

                    {isArticlesLoading && (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-48 w-full rounded-xl" />
                            ))}
                        </div>
                    )}
                    {!isArticlesLoading && articles.length > 0 && (
                        <div className="space-y-8">
                            {articles.map((article: ArticleSummary) => (
                                <ArticleCardFull key={article.id} article={article as unknown as Article} />
                            ))}
                        </div>
                    )}
                    {!isArticlesLoading && articles.length === 0 && (
                        <div className="bg-lumex-card p-12 rounded-2xl border border-lumex-border text-center shadow-sm">
                            <div className="mb-4 text-lumex-blue/20">
                                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-lumex-text mb-2">No articles in this collection yet</h3>
                            <p className="text-lumex-muted max-w-sm mx-auto">We are currently curating content for this collection. Please check back later for the latest updates.</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};
