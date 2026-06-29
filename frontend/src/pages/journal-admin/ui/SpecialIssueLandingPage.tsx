import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Badge, Skeleton } from '../../../shared/ui';
import { useJournal } from '../../../entities/journal/api/journalQueries';
import { useSpecialIssues } from '../../../entities/journal/api/journalAdminQueries';
import type { SpecialIssueStatus } from '../../../entities/journal/model/types';

const STATUS_CONFIG: Record<SpecialIssueStatus, { label: string; color: string; icon: string }> = {
    'call-for-papers': {
        label: 'Call for Papers Open',
        color: 'bg-lumex-blue/10 text-lumex-blue border border-lumex-blue/30',
        icon: '📢',
    },
    'submissions-closed': {
        label: 'Submissions Closed',
        color: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
        icon: '🔒',
    },
    'under-review': {
        label: 'Under Review',
        color: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
        icon: '🔍',
    },
    published: {
        label: 'Published',
        color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        icon: '✅',
    },
};

export const SpecialIssueLandingPage: React.FC = () => {
    const { slug, issueId } = useParams<{ slug: string; issueId: string }>();
    const { data: journal, isLoading: journalLoading } = useJournal(slug ?? '');
    const { data: issues, isLoading: issuesLoading } = useSpecialIssues(slug ?? '');

    const issue = issues?.find(si => si.id === issueId);
    const isLoading = journalLoading || issuesLoading;

    if (isLoading) {
        return (
            <div className="bg-lumex-bg min-h-screen py-12">
                <Container className="space-y-6 max-w-4xl mx-auto">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                </Container>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="bg-lumex-bg min-h-screen">
                <Container className="py-24 text-center">
                    <p className="text-4xl mb-4">📋</p>
                    <h1 className="text-2xl font-bold text-lumex-text mb-2">Special Issue Not Found</h1>
                    <p className="text-lumex-muted mb-6">This special issue may have been removed or doesn't exist.</p>
                    <Link to={`/journal/${slug ?? ''}`} className="text-lumex-blue hover:underline">
                        ← Back to Journal
                    </Link>
                </Container>
            </div>
        );
    }

    const cfg = STATUS_CONFIG[issue.status];

    return (
        <div className="bg-lumex-bg min-h-screen">
            {/* Hero */}
            <div className="relative overflow-hidden">
                {issue.coverImageUrl ? (
                    <div className="absolute inset-0">
                        <img
                            src={issue.coverImageUrl}
                            alt={issue.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-lumex-bg" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-lumex-blue/20 via-lumex-bg-deep to-lumex-bg" />
                )}
                <Container className="relative py-20 max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8 text-white/70">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <span>›</span>
                        <Link to="/journals" className="hover:text-white transition-colors">Journals</Link>
                        <span>›</span>
                        <Link to={`/journal/${slug ?? ''}`} className="hover:text-white transition-colors">
                            {journal?.title ?? slug}
                        </Link>
                        <span>›</span>
                        <span className="text-white">Special Issue</span>
                    </nav>

                    {/* Status Badge */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${cfg.color}`}>
                            <span>{cfg.icon}</span>
                            {cfg.label}
                        </span>
                        {issue.issueNumber && (
                            <span className="text-xs text-white/60 border border-white/20 rounded-full px-2.5 py-0.5">
                                Vol. {issue.volume} · Issue {issue.issueNumber}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">
                        {issue.title}
                    </h1>

                    {/* Journal link */}
                    {journal && (
                        <Link
                            to={`/journal/${slug ?? ''}`}
                            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6"
                        >
                            {journal.coverImageUrl && (
                                <img
                                    src={journal.coverImageUrl}
                                    alt={journal.title}
                                    className="w-6 h-8 object-cover rounded border border-white/20"
                                />
                            )}
                            <span>{journal.title}</span>
                        </Link>
                    )}
                </Container>
            </div>

            {/* Main Content */}
            <Container className="py-12 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Main content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* About */}
                        <section>
                            <h2 className="text-xl font-serif font-bold text-lumex-text mb-4">About This Special Issue</h2>
                            <div
                                className="prose prose-sm max-w-none text-lumex-muted leading-relaxed [&_p]:mb-3"
                                dangerouslySetInnerHTML={{ __html: issue.description }}
                            />
                        </section>

                        {/* Topics */}
                        {issue.topics.length > 0 && (
                            <section>
                                <h2 className="text-xl font-serif font-bold text-lumex-text mb-4">Topics of Interest</h2>
                                <div className="flex flex-wrap gap-2">
                                    {issue.topics.map(t => (
                                        <Badge key={t} variant="default">{t}</Badge>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Articles (if published) */}
                        {issue.status === 'published' && (
                            <section>
                                <h2 className="text-xl font-serif font-bold text-lumex-text mb-4">
                                    Articles ({issue.articleCount})
                                </h2>
                                {issue.articles && issue.articles.length > 0 ? (
                                    <div className="space-y-4">
                                        {issue.articles.map(a => (
                                            <div key={a.id} className="bg-lumex-card border border-lumex-border rounded-xl p-4">
                                                <Link to={`/article/${encodeURIComponent(a.doi)}`} className="font-semibold text-lumex-text hover:text-lumex-blue transition-colors">
                                                    {a.title}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-lumex-card border border-lumex-border rounded-xl p-8 text-center">
                                        <p className="text-lumex-muted text-sm">
                                            {issue.articleCount} articles published in this special issue.
                                        </p>
                                        <Link
                                            to={`/search?query=${encodeURIComponent(issue.title)}&type=article`}
                                            className="mt-3 inline-block text-sm text-lumex-blue hover:underline"
                                        >
                                            Search articles →
                                        </Link>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* CTA for CFP */}
                        {issue.status === 'call-for-papers' && journal?.submissionUrl && (
                            <section className="bg-lumex-blue/5 border border-lumex-blue/20 rounded-2xl p-8">
                                <h2 className="text-xl font-serif font-bold text-lumex-text mb-3">Submit Your Research</h2>
                                <p className="text-lumex-muted text-sm mb-4">
                                    We invite original research and review articles relevant to the themes of this special issue.
                                    Please follow the journal's author guidelines when preparing your manuscript.
                                </p>
                                <a
                                    href={journal.submissionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-lumex-blue text-white text-sm font-bold hover:bg-lumex-blue/90 transition-colors"
                                >
                                    Submit Manuscript →
                                </a>
                            </section>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <aside className="space-y-6">
                        {/* Key dates */}
                        <div className="bg-lumex-card border border-lumex-border rounded-xl p-5">
                            <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-4">Key Dates</h3>
                            <div className="space-y-3">
                                {issue.callForPapersDeadline && (
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-lumex-blue text-sm mt-0.5">📅</span>
                                        <div>
                                            <p className="text-xs font-semibold text-lumex-text">CFP Deadline</p>
                                            <p className="text-xs text-lumex-muted">
                                                {new Date(issue.callForPapersDeadline).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {issue.expectedPublicationDate && issue.status !== 'published' && (
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-lumex-muted text-sm mt-0.5">📆</span>
                                        <div>
                                            <p className="text-xs font-semibold text-lumex-text">Expected Publication</p>
                                            <p className="text-xs text-lumex-muted">
                                                {new Date(issue.expectedPublicationDate).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {issue.publishedDate && (
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-emerald-400 text-sm mt-0.5">✅</span>
                                        <div>
                                            <p className="text-xs font-semibold text-lumex-text">Published</p>
                                            <p className="text-xs text-lumex-muted">
                                                {new Date(issue.publishedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {issue.issueNumber && (
                                    <div className="flex items-start gap-2.5">
                                        <span className="text-lumex-muted text-sm mt-0.5">📖</span>
                                        <div>
                                            <p className="text-xs font-semibold text-lumex-text">Volume / Issue</p>
                                            <p className="text-xs text-lumex-muted">Vol. {issue.volume} · {issue.issueNumber}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guest Editors */}
                        {issue.guestEditors.length > 0 && (
                            <div className="bg-lumex-card border border-lumex-border rounded-xl p-5">
                                <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-4">Guest Editors</h3>
                                <div className="space-y-4">
                                    {issue.guestEditors.map((ge, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-lumex-blue/10 border border-lumex-blue/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lumex-blue font-bold text-sm">
                                                    {ge.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-lumex-text truncate">{ge.name}</p>
                                                <p className="text-xs text-lumex-muted truncate">{ge.affiliation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* About the journal */}
                        {journal && (
                            <div className="bg-lumex-card border border-lumex-border rounded-xl p-5">
                                <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-3">About the Journal</h3>
                                {journal.coverImageUrl && (
                                    <img
                                        src={journal.coverImageUrl}
                                        alt={journal.title}
                                        className="w-full h-28 object-cover rounded-lg mb-3 border border-lumex-border"
                                    />
                                )}
                                <Link
                                    to={`/journal/${slug ?? ''}`}
                                    className="text-sm font-semibold text-lumex-text hover:text-lumex-blue transition-colors block mb-1"
                                >
                                    {journal.title}
                                </Link>
                                <p className="text-xs text-lumex-muted line-clamp-3">{journal.description}</p>
                                {journal.metrics?.impactFactor && (
                                    <p className="mt-2 text-xs">
                                        <span className="font-bold text-lumex-text">{journal.metrics.impactFactor.toFixed(1)}</span>
                                        <span className="text-lumex-muted"> Impact Factor</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </aside>
                </div>
            </Container>
        </div>
    );
};
