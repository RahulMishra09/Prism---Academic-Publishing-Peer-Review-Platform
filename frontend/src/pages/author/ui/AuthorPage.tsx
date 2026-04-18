import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { useArticlesList } from '../../../entities/article/api/articleQueries';
import { Helmet } from 'react-helmet-async';

export const AuthorPage: React.FC = () => {
    const { authorId } = useParams<{ authorId: string }>();
    const decodedName = authorId ? decodeURIComponent(authorId) : '';

    // Search articles by this author name
    const { data, isLoading } = useArticlesList({ page: 1, pageSize: 20, query: decodedName });
    const articles = data?.data ?? [];

    const initials = decodedName
        .split(' ')
        .slice(0, 2)
        .map(n => n[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <div className="min-h-[70vh] bg-lumex-bg py-12">
            <Helmet>
                <title>{decodedName || 'Author'} | Prism</title>
            </Helmet>
            <Container>
                {/* Profile header */}
                <div className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-lumex-blue/10 text-2xl font-serif font-bold text-lumex-blue">
                        {initials || '?'}
                    </div>
                    <div>
                        <p className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-lumex-blue">
                            Author Profile
                        </p>
                        <h1 className="font-serif text-3xl font-bold text-lumex-text">
                            {decodedName || 'Unknown Author'}
                        </h1>
                        <p className="mt-1 text-sm text-lumex-muted">
                            {articles.length > 0
                                ? `${articles.length} publication${articles.length !== 1 ? 's' : ''} found`
                                : 'No publications indexed yet'}
                        </p>
                    </div>
                </div>

                {/* Publications */}
                <div className="max-w-3xl">
                    <h2 className="mb-5 font-serif text-xl font-bold text-lumex-text border-b border-lumex-border pb-3">
                        Publications
                    </h2>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 rounded-xl border border-lumex-border bg-lumex-bg-deep animate-pulse" />
                            ))}
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="rounded-xl border border-lumex-border bg-lumex-bg p-10 text-center">
                            <p className="text-lumex-muted italic text-sm">
                                No publications found for this author in our database.
                            </p>
                            <Link to="/search" className="mt-4 inline-block text-sm font-semibold text-lumex-blue hover:underline">
                                Search all articles →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {articles.map(article => (
                                <Link
                                    key={article.doi}
                                    to={`/article/${encodeURIComponent(article.doi)}`}
                                    className="group block rounded-xl border border-lumex-border bg-lumex-bg-white p-5 transition-all hover:border-lumex-blue/30 hover:shadow-md hover:no-underline"
                                >
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        {article.accessLevel === 'open_access' && (
                                            <span className="rounded bg-lumex-open-bg px-2 py-0.5 text-[0.68rem] font-bold text-lumex-open-text">
                                                Open Access
                                            </span>
                                        )}
                                        <span className="rounded bg-lumex-bg-deep px-2 py-0.5 text-[0.68rem] font-semibold text-lumex-muted">
                                            {new Date(article.publishedDate).getFullYear()}
                                        </span>
                                    </div>
                                    <h3 className="font-serif font-semibold leading-snug text-lumex-text group-hover:text-lumex-blue transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm italic text-lumex-muted">{article.journalTitle}</p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {(article.keywords ?? []).slice(0, 4).map(kw => (
                                            <span key={kw} className="rounded bg-lumex-bg-deep px-2 py-0.5 text-[0.68rem] text-lumex-muted">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};
