import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Skeleton } from '../../../shared/ui';
import { DISCIPLINES } from '../../../shared/constants/disciplines';
import { JournalCard } from '../../../entities/journal/ui/JournalCard';
import { ArticleCardFull } from '../../../entities/article/ui/ArticleCardFull';
import { useJournalsList } from '../../../entities/journal/api/journalQueries';
import { useArticlesList } from '../../../entities/article/api/articleQueries';
import type { Article } from '../../../entities/article/model/types';
import type { Journal } from '../../../entities/journal/model/types';

export const SubjectAreaPage: React.FC = () => {
    const { subject } = useParams<{ subject: string }>();

    // Find the discipline object based on the slug to get a proper label
    const discipline = DISCIPLINES.find(d => d.slug === subject);
    const displayTitle = discipline?.label ?? (subject ? subject.charAt(0).toUpperCase() + subject.slice(1).replace(/-/g, ' ') : 'Discipline');

    // Fetch journals data using centralized hook
    const { data: journalsData, isLoading: isJournalsLoading } = useJournalsList({
        page: 1,
        pageSize: 3,
        discipline: displayTitle
    });

    // Fetch articles data using centralized hook
    const { data: articlesData, isLoading: isArticlesLoading } = useArticlesList({
        page: 1,
        pageSize: 5,
        discipline: displayTitle
    });

    const journals = journalsData?.data || [];
    const articles = articlesData?.data || [];


    return (
        <div className="py-12 min-h-[70vh] bg-lumex-bg">
            <Container>
                {/* Breadcrumb Navigation */}
                <nav className="text-sm text-lumex-muted mb-8" aria-label="Breadcrumb">
                    <Link to="/" className="hover:underline hover:text-lumex-blue transition-colors">
                        Home
                    </Link>
                    <span className="mx-2">/</span>
                    <Link to="/disciplines" className="hover:underline hover:text-lumex-blue transition-colors">
                        Disciplines
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-lumex-text font-semibold">
                        {displayTitle}
                    </span>
                </nav>

                {/* Header Section */}
                <div className="mb-12 border-b border-lumex-border pb-6">
                    <h1 className="text-4xl font-serif font-bold text-lumex-text mb-4">
                        {displayTitle}
                    </h1>
                    <p className="text-lg text-lumex-muted max-w-3xl leading-relaxed">
                        Explore the latest research, journals, articles, and book chapters published by Lumex across the expansive field of {displayTitle}. Stay updated with groundbreaking discoveries and foundational studies.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content Area - Latest Articles */}
                    <div className="lg:w-2/3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-lumex-text font-serif">Latest Articles</h2>
                            <Link to={`/search?query=${subject}&type=article`} className="text-sm font-semibold text-lumex-blue hover:underline">
                                View all articles →
                            </Link>
                        </div>

                        {isArticlesLoading && (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                                ))}
                            </div>
                        )}
                        {!isArticlesLoading && articles.length > 0 && (
                            <div className="space-y-6">
                                {articles.map((article: Article) => (
                                    <ArticleCardFull key={article.id} article={article} />
                                ))}
                            </div>
                        )}
                        {!isArticlesLoading && articles.length === 0 && (
                            <div className="bg-lumex-card p-8 rounded-xl border border-lumex-border text-center">
                                <p className="text-lumex-muted">No articles found in this discipline yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Top Journals */}
                    <aside className="lg:w-1/3">
                        <div className="bg-lumex-card p-6 rounded-xl border border-lumex-border shadow-sm">
                            <h2 className="text-xl font-bold text-lumex-text font-serif mb-6 border-b border-lumex-border pb-2">
                                Top Journals
                            </h2>

                            {isJournalsLoading && (
                                <div className="space-y-6">
                                    {[1, 2, 3].map(i => (
                                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                                    ))}
                                </div>
                            )}
                            {!isJournalsLoading && journals.length > 0 && (
                                <div className="space-y-6">
                                    {journals.map((journal: Journal) => (
                                        <JournalCard key={journal.id} journal={journal} />
                                    ))}
                                </div>
                            )}
                            {!isJournalsLoading && journals.length === 0 && (
                                <p className="text-lumex-muted text-sm text-center">No journals found in this discipline yet.</p>
                            )}

                            <div className="mt-8">
                                <Link
                                    to={`/journals?subject=${subject}`}
                                    className="block w-full rounded-lg bg-lumex-blue/10 py-2.5 text-center text-sm font-bold text-lumex-blue transition-colors hover:bg-lumex-blue hover:text-white dark:hover:bg-lumex-blue/20"
                                >
                                    Browse all {displayTitle} journals
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </Container>
        </div>
    );
};
