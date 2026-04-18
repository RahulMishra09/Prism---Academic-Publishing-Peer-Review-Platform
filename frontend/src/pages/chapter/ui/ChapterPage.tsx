import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Skeleton } from '../../../shared/ui';
import { ChapterHero } from '../../../features/chapter';
import {
    AbstractSection,
    ArticleBody,
    ReferencesSection,
    CitationTools,
    AccessGate,
    FigureViewer,
} from '../../../features/article';
import { ArticleSidebar } from '../../../widgets/article-sidebar';
import { TwoColumnLayout } from '../../../app/layouts';
import type { BookChapter } from '../../../entities/book/model/types';
import type { Article, ArticleFigure } from '../../../entities/article/model/types';

import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';

const fetchChapter = async (doi: string): Promise<{ chapter: BookChapter; article: Article }> => {
    const encodeDoi = encodeURIComponent(doi);
    const chapterRes = await fetchWithFallback<{ chapters?: BookChapter[]; data?: BookChapter[] }>(
        `/chapters/${encodeDoi}`,
        '/mock-data/chapters.json'
    );
    const chapterList = ('chapters' in chapterRes ? chapterRes.chapters : chapterRes.data) || [];
    const chapter = chapterList.find((c: BookChapter) => c.doi === doi) || chapterList[0];
    if (!chapter) throw new Error('Chapter not found');
    // Build an Article-compatible object from the chapter for reusing article reading components
    const articleProxy: Article = {
        id: chapter.id,
        doi: chapter.doi,
        title: chapter.title,
        authors: chapter.authors,
        abstract: [],
        sections: [],
        figures: [],
        tables: [],
        references: [],
        keywords: [],
        journalTitle: chapter.bookTitle,
        journalSlug: '',
        journalISSN: '',
        publishedDate: String(chapter.publishYear),
        accessLevel: 'requires_purchase' as const,
        articleType: 'book-review' as const,
        language: 'en',
    };
    return { chapter, article: articleProxy };
};

type ChapterTab = 'chapter' | 'figures' | 'references';

export const ChapterPage: React.FC = () => {
    const params = useParams();
    const doi = params['*'];
    const [activeTab, setActiveTab] = useState<ChapterTab>('chapter');
    const [showCitation, setShowCitation] = useState(false);
    const [viewerFigure, setViewerFigure] = useState<ArticleFigure | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['chapter', doi],
        queryFn: () => fetchChapter(doi!),
        enabled: !!doi,
    });

    if (!doi) return <Navigate to="/" replace />;

    if (isLoading) {
        return (
            <Container className="py-12 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-48 w-full" />
            </Container>
        );
    }

    if (isError || !data) {
        return (
            <Container className="py-16 text-center">
                <h1 className="text-3xl font-serif text-lumex-blue mb-4">Chapter Not Found</h1>
                <p className="text-lumex-muted mb-8">
                    DOI: <code>{doi}</code>
                </p>
                <Link to="/" className="text-lumex-blue hover:underline font-bold">
                    ← Home
                </Link>
            </Container>
        );
    }

    const { chapter, article } = data;
    const allFigures = article.figures || [];

    const tabs: { id: ChapterTab; label: string; count?: number }[] = [
        { id: 'chapter', label: 'Chapter' },
        { id: 'figures', label: 'Figures', count: allFigures.length },
        { id: 'references', label: 'References', count: article.references?.length },
    ];

    return (
        <>
            <ChapterHero
                chapter={chapter}
                onDownloadPdf={() => { }}
                onCite={() => setShowCitation(true)}
            />

            {/* Tab Bar */}
            <div className="border-b border-lumex-border bg-white sticky top-0 z-30 shadow-sm">
                <Container>
                    <nav className="flex gap-0 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-lumex-blue text-lumex-blue'
                                        : 'border-transparent text-lumex-muted hover:text-lumex-text hover:border-lumex-border'
                                    }`}
                            >
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-lumex-bg-deep text-lumex-muted rounded text-xs font-normal">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </Container>
            </div>

            <TwoColumnLayout
                main={
                    <div className="py-8">
                        {activeTab === 'chapter' && (
                            <>
                                <AccessGate article={article} />
                                <div className="mb-10 pb-10 border-b border-lumex-border">
                                    <AbstractSection article={article} />
                                </div>
                                <ArticleBody article={article} />
                            </>
                        )}
                        {activeTab === 'figures' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allFigures.length === 0 ? (
                                    <p className="col-span-3 text-lumex-sub italic text-center py-12">
                                        No figures available.
                                    </p>
                                ) : (
                                    allFigures.map(fig => (
                                        <button
                                            key={fig.id}
                                            onClick={() => setViewerFigure(fig)}
                                            className="text-left border border-lumex-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="aspect-video bg-lumex-bg-deep">
                                                <img
                                                    src={fig.url}
                                                    alt={fig.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <p className="text-xs font-bold text-lumex-blue mb-1">
                                                    Fig. {fig.number}
                                                </p>
                                                <p className="text-xs text-lumex-muted line-clamp-2">
                                                    {fig.caption}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'references' && (
                            <ReferencesSection references={article.references || []} />
                        )}
                    </div>
                }
                sidebar={<ArticleSidebar article={article} activeTab={activeTab} />}
            />

            {showCitation && (
                <CitationTools
                    article={article}
                    isOpen={showCitation}
                    onClose={() => setShowCitation(false)}
                />
            )}
            <FigureViewer
                figure={viewerFigure}
                isOpen={!!viewerFigure}
                onClose={() => setViewerFigure(null)}
                hasNext={false}
                hasPrev={false}
            />
        </>
    );
};
