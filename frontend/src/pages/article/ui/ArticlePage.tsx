import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { TwoColumnLayout } from '../../../app/layouts';
import { Container, Skeleton, useToast } from '../../../shared/ui';
import {
    ArticleHero,
    AbstractSection,
    ArticleBody,
    ReferencesSection,
    CitationTools,
    AccessGate,
    FigureViewer,
    useRecentlyViewed,
    useSavedArticles,
} from '../../../features/article';
import { ArticleSidebar } from '../../../widgets/article-sidebar';
import type { ArticleFigure } from '../../../entities/article/model/types';

import { useArticle } from '../../../entities/article/api/articleQueries';

type ArticleTab = 'article' | 'figures' | 'references';

export const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const doi = slug;
    const [activeTab, setActiveTab] = useState<ArticleTab>('article');
    const [showCitation, setShowCitation] = useState(false);
    const [viewerFigure, setViewerFigure] = useState<ArticleFigure | null>(null);
    const [figureIndex, setFigureIndex] = useState(0);

    const { data: article, isLoading, isError } = useArticle(doi || '');
    const { trackView } = useRecentlyViewed();
    const { isSaved, toggleSave } = useSavedArticles();
    const { toast } = useToast();

    useEffect(() => {
        if (article) {
            trackView(article);
        }
    }, [article, trackView]);

    const handleToggleSave = () => {
        if (!article) return;
        const saved = toggleSave(article);
        toast({
            title: saved ? 'Saved to Library' : 'Removed from Library',
            description: saved
                ? 'This article has been added to your library.'
                : 'This article has been removed from your library.',
        });
    };

    if (!doi) return <Navigate to="/" replace />;

    if (isLoading) {
        return (
            <Container className="py-12">
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <Skeleton className="h-64 w-full" />
            </Container>
        );
    }

    if (isError || !article) {
        return (
            <Container className="py-16 text-center">
                <h1 className="text-3xl font-serif text-lumex-blue mb-4">Article Not Found</h1>
                <p className="text-lumex-muted mb-8">
                    The article with DOI <code>{doi}</code> could not be found.
                </p>
                <Link to="/search" className="text-lumex-blue hover:underline font-bold">
                    ← Back to Search
                </Link>
            </Container>
        );
    }

    const allFigures = [...(article.figures || []), ...(article.tables || [])];

    const openFigureViewer = (figure: ArticleFigure) => {
        const idx = allFigures.findIndex(f => f.id === figure.id);
        setFigureIndex(idx >= 0 ? idx : 0);
        setViewerFigure(figure);
    };

    const tabs: { id: ArticleTab; label: string; count?: number }[] = [
        { id: 'article', label: 'Article' },
        { id: 'figures', label: 'Figures & Tables', count: allFigures.length },
        { id: 'references', label: 'References', count: article.references?.length },
    ];

    const abstractText = article.abstract?.map(s => s.text).join(' ') || '';

    return (
        <>
            <Helmet>
                <title>{article.title}</title>
                <meta name="description" content={abstractText ? `${abstractText.substring(0, 160)}...` : `Read the full research article: ${article.title}. Published by Prism.`} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={abstractText.substring(0, 160)} />
            </Helmet>
            {/* Article Hero (full-width) */}
            <ArticleHero
                article={article}
                isSaved={isSaved(article.doi)}
                onToggleSave={handleToggleSave}
                onDownloadPdf={() => {
                    if (article.pdfUrl) {
                        window.open(article.pdfUrl, '_blank');
                        toast({
                            title: 'Download Started',
                            description: 'The article PDF is opening in a new tab.',
                        });
                    }
                }}
                onCite={() => setShowCitation(true)}
                onShare={() => {
                    void navigator.clipboard.writeText(window.location.href);
                    toast({
                        title: 'Link Copied',
                        description: 'Article link copied to clipboard.',
                    });
                }}
            />

            {/* Tab Navigation */}
            <div className="sticky top-0 z-30 border-b border-lumex-border bg-lumex-bg-white/95 shadow-sm backdrop-blur-sm transition-colors duration-200">
                <Container>
                    <nav className="flex overflow-x-auto" aria-label="Article sections">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={[
                                    'relative whitespace-nowrap px-5 py-3.5 text-[0.82rem] font-semibold transition-colors',
                                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-t-full after:transition-all after:duration-150',
                                    activeTab === tab.id
                                        ? 'text-lumex-blue after:bg-lumex-blue'
                                        : 'text-lumex-muted after:bg-transparent hover:text-lumex-text',
                                ].join(' ')}
                            >
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="ml-2 rounded-md bg-lumex-bg-deep px-1.5 py-0.5 text-xs font-normal text-lumex-muted">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </Container>
            </div>

            {/* Main Content */}
            <TwoColumnLayout
                main={
                    <div className="py-8">
                        {/* Article Tab */}
                        {activeTab === 'article' && (
                            <>
                                {/* Access Gate – shown above abstract if paywalled */}
                                <AccessGate article={article} />

                                {/* Abstract */}
                                <div className="mb-10 pb-10 border-b border-lumex-border">
                                    <AbstractSection article={article} />
                                </div>

                                {/* Full Body (HTML sections) */}
                                <ArticleBody article={article} />
                            </>
                        )}

                        {/* Figures & Tables Tab */}
                        {activeTab === 'figures' && (
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-lumex-blue mb-8">
                                    Figures & Tables
                                </h2>
                                {allFigures.length === 0 ? (
                                    <p className="italic text-lumex-muted">
                                        No figures or tables available for this article.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {allFigures.map(fig => (
                                            <button
                                                key={fig.id}
                                                onClick={() => openFigureViewer(fig)}
                                                className="group overflow-hidden rounded-xl border border-lumex-border text-left transition-all hover:border-lumex-border-hover hover:shadow-md"
                                            >
                                                <div className="aspect-video overflow-hidden bg-lumex-bg-deep">
                                                    <img
                                                        src={fig.url}
                                                        alt={fig.alt}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="p-3.5">
                                                    <p className="mb-1 text-xs font-bold text-lumex-blue">
                                                        {fig.type === 'table' ? 'Table' : 'Fig.'}{' '}
                                                        {fig.number}
                                                    </p>
                                                    <p className="line-clamp-2 text-xs text-lumex-muted">
                                                        {fig.caption}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* References Tab */}
                        {activeTab === 'references' && (
                            <ReferencesSection references={article.references || []} />
                        )}
                    </div>
                }
                sidebar={<ArticleSidebar article={article} activeTab={activeTab} />}
            />

            {/* Citation Modal */}
            {showCitation && (
                <CitationTools
                    article={article}
                    isOpen={showCitation}
                    onClose={() => setShowCitation(false)}
                />
            )}

            {/* Figure Lightbox */}
            <FigureViewer
                figure={viewerFigure}
                isOpen={!!viewerFigure}
                onClose={() => setViewerFigure(null)}
                hasNext={figureIndex < allFigures.length - 1}
                hasPrev={figureIndex > 0}
                onNext={() => {
                    const next = figureIndex + 1;
                    setFigureIndex(next);
                    setViewerFigure(allFigures[next]);
                }}
                onPrev={() => {
                    const prev = figureIndex - 1;
                    setFigureIndex(prev);
                    setViewerFigure(allFigures[prev]);
                }}
            />
        </>
    );
};
