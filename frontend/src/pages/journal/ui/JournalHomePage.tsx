import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useJournalArticles } from '../../../entities/article/api/articleQueries';
import { Helmet } from 'react-helmet-async';
import { ArticleCard } from '../../../entities/article/ui/ArticleCard';
import { Stack, Skeleton, Button } from '../../../shared/ui';
import type { Journal } from '../../../entities/journal/model/types';
import type { ArticleSummary } from '../../../entities/article/model/types';

export const JournalHomePage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();

    // Custom mock hook usage picking up 5 articles associated with Journal
    const { data: response, isLoading } = useJournalArticles(journal.slug);
    const articles = response?.data || [];

    return (
        <div className="space-y-12">
            <Helmet>
                <title>{journal.title}</title>
                <meta name="description" content={`Explore the latest research, articles, and editorial insights from ${journal.title}. Published by Lumex.`} />
            </Helmet>
            {/* Latest Articles Section */}
            <section>
                <div className="flex justify-between items-end border-b border-lumex-border pb-3 mb-6">
                    <h2 className="text-2xl font-serif text-lumex-blue font-bold">
                        Latest articles
                    </h2>
                    <a
                        href={`/journal/${journal.slug}/articles`}
                        className="text-sm text-lumex-blue hover:underline font-bold"
                    >
                        View all
                    </a>
                </div>

                {isLoading ? (
                    <Stack direction="col" gap="lg">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col gap-2">
                                <Skeleton className="w-3/4 h-6" />
                                <Skeleton className="w-1/2 h-4" />
                                <Skeleton className="w-full h-16 mt-2" />
                            </div>
                        ))}
                    </Stack>
                ) : (
                    <Stack direction="col" gap="lg" className="divide-y divide-lumex-border">
                        {articles?.map((article: ArticleSummary) => (
                            <div key={article.id} className="pt-4 first:pt-0">
                                <ArticleCard article={article} />
                            </div>
                        ))}

                        {(!articles || articles.length === 0) && (
                            <p className="text-lumex-muted italic py-4">
                                No recent articles published.
                            </p>
                        )}
                    </Stack>
                )}

                {articles && articles.length > 0 && (
                    <div className="mt-8">
                        <Button
                            variant="outline"
                            className="text-lumex-blue border-lumex-blue hover:bg-lumex-bg-deep"
                        >
                            View all volumes and issues
                        </Button>
                    </div>
                )}
            </section>

            {/* Editor's Choice Section (Dynamic) */}
            {journal.editorialHighlights && journal.editorialHighlights.length > 0 && (
                <section className="bg-lumex-card p-6 md:p-8 -mx-4 md:mx-0 rounded-xl border border-lumex-border">
                    <h2 className="text-2xl font-serif text-lumex-text font-bold mb-6">
                        From the editors
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {journal.editorialHighlights.map(highlight => (
                            <div key={highlight.id}>
                                <span className="text-lumex-blue text-xs font-bold uppercase tracking-wider mb-2 block">
                                    Editorial Highlight
                                </span>
                                <h3
                                    className="text-xl font-bold text-lumex-text hover:text-lumex-blue cursor-pointer leading-tight mb-3 transition-colors"
                                    onClick={() => (window.location.href = highlight.url)}
                                >
                                    {highlight.title}
                                </h3>
                                <p className="text-sm text-lumex-muted leading-relaxed">
                                    {highlight.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
