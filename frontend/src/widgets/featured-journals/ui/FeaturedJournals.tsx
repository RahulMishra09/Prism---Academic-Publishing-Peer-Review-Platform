import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Skeleton, AnimateIn } from '../../../shared/ui';
import { useJournalsList } from '../../../entities/journal/api/journalQueries';
import { useHomepageData } from '../../../features/homepage/api/homepageQueries';

export interface FeaturedJournalsProps {
    className?: string;
}

interface FeaturedJournalMock {
    id?: string;
    slug?: string;
    title?: string;
    name?: string;
    subjectArea?: string;
    field?: string;
    issn?: string;
    impactFactor?: number | string;
    h5Index?: number | string;
    acceptanceRate?: number | string;
    turnaround?: string;
    metrics?: {
        impactFactor?: number;
        hIndex?: number;
    };
}

export const FeaturedJournals: React.FC<FeaturedJournalsProps> = ({ className }) => {
    const { data: homepageData } = useHomepageData();
    const callForPapers = homepageData?.callForPapers || [];

    const {
        data: journalsResp,
        isLoading,
        isError,
    } = useJournalsList({
        page: 1,
        pageSize: 6,
    });

    /* Color per index for visual variety */
    const ACCENT_COLORS = ['#5b7cf6', '#0ea5e9', '#6366f1', '#14b8a6', '#7c3aed', '#0891b2', '#0284c7', '#2563eb'];

    return (
        <>
            {/* Call for Papers / Special Collections */}
            {callForPapers.length > 0 && (
                <section className="border-b border-t border-lumex-border bg-lumex-bg-deep py-16">
                    <Container>
                        <div className="mb-7 flex items-end justify-between">
                            <div>
                                <p className="mb-1.5 text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-lumex-blue">
                                    Curated
                                </p>
                                <h2
                                    className="font-serif text-[1.72rem] font-semibold"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    Special Collections
                                </h2>
                            </div>
                            <Link
                                to="/collections"
                                className="text-sm font-medium text-lumex-blue hover:underline"
                            >
                                All collections →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {callForPapers.map((cfp, i) => {
                                const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
                                return (
                                    <Link
                                        key={cfp.id}
                                        to={`/collection/${cfp.collectionSlug}`}
                                        className="group block overflow-hidden rounded-card border border-lumex-border bg-lumex-card transition-all hover:border-lumex-border-hover hover:bg-lumex-card-hover hover:shadow-md hover:no-underline"
                                    >
                                        <div className="h-[3px]" style={{ background: color }} />
                                        <div className="p-6">
                                            <div className="mb-3 flex items-center gap-2">
                                                <span
                                                    className="rounded px-2 py-0.5 text-[0.69rem] font-semibold"
                                                    style={{
                                                        background: `${color}14`,
                                                        color,
                                                    }}
                                                >
                                                    {cfp.collection}
                                                </span>
                                                <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[0.69rem] font-semibold text-amber-600">
                                                    Deadline: {cfp.deadline}
                                                </span>
                                            </div>
                                            <h3 className="mb-2 font-serif text-base font-medium leading-snug text-lumex-text group-hover:text-lumex-blue transition-colors">
                                                {cfp.title}
                                            </h3>
                                            <p className="text-[0.7rem] text-lumex-muted">
                                                {cfp.journal}
                                            </p>
                                            <div
                                                className="mt-4 inline-block rounded-lg border border-lumex-border px-4 py-2 text-[0.79rem] font-medium text-lumex-muted transition-all group-hover:border-lumex-blue group-hover:text-lumex-blue"
                                            >
                                                View Full Collection →
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </Container>
                </section>
            )}

            {/* Featured Journals Grid */}
            <section className={`py-16 ${className || ''}`}>
                <Container>
                    <AnimateIn className="mb-7 flex items-end justify-between">
                        <div>
                            <p className="mb-1.5 text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-lumex-blue">
                                Publications
                            </p>
                            <h2
                                className="font-serif text-[1.72rem] font-semibold"
                                style={{ letterSpacing: '-0.02em' }}
                            >
                                Featured Journals
                            </h2>
                        </div>
                        <Link
                            to="/journals"
                            className="text-sm font-medium text-lumex-blue hover:underline"
                        >
                            All journals →
                        </Link>
                    </AnimateIn>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading &&
                            ['fj1', 'fj2', 'fj3', 'fj4', 'fj5', 'fj6'].map((id) => (
                                <div
                                    key={id}
                                    className="rounded-card border border-lumex-border bg-lumex-card p-5"
                                >
                                    <div className="mb-4 flex gap-3">
                                        <Skeleton className="h-14 w-11 flex-shrink-0 rounded-md" />
                                        <div className="flex-1">
                                            <Skeleton className="mb-2 h-5 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                    <Skeleton className="mb-3 h-14 w-full rounded-lg" />
                                    <Skeleton className="h-9 w-full" />
                                </div>
                            ))}

                        {isError && (
                            <div className="col-span-full py-8 text-center text-red-500">
                                Failed to load featured journals. Please try again later.
                            </div>
                        )}

                        {!isLoading &&
                            !isError &&
                            journalsResp?.data?.map?.((journal: FeaturedJournalMock, idx: number) => {
                                const color = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                                const initials = (String(journal.title || journal.name || ''))
                                    .split(' ')
                                    .map((w: string) => w[0])
                                    .join('')
                                    .slice(0, 3);

                                return (
                                    <AnimateIn key={String(journal.id || idx)} delay={idx * 80}>
                                        <Link
                                            to={`/journal/${journal.slug || journal.id}`}
                                            className="group block overflow-hidden rounded-card border border-lumex-border bg-lumex-card transition-all hover:-translate-y-0.5 hover:border-lumex-border-hover hover:bg-lumex-card-hover hover:shadow-md hover:no-underline"
                                        >
                                        <div className="h-[3px]" style={{ background: color }} />
                                        <div className="p-5">
                                            {/* Journal icon + title */}
                                            <div className="mb-4 flex items-start gap-3">
                                                <div
                                                    className="flex h-[52px] w-[42px] flex-shrink-0 items-center justify-center rounded-md border"
                                                    style={{
                                                        background: `${color}14`,
                                                        borderColor: `${color}22`,
                                                    }}
                                                >
                                                    <span
                                                        className="font-serif text-[0.68rem] font-bold"
                                                        style={{ color }}
                                                    >
                                                        {initials}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-serif text-[0.95rem] font-medium leading-snug text-lumex-text">
                                                        {journal.title || journal.name}
                                                    </h3>
                                                    <p className="text-[0.7rem] text-lumex-muted">
                                                        {journal.subjectArea || journal.field || ''}
                                                        {journal.issn
                                                            ? ` · ISSN ${journal.issn}`
                                                            : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Metrics mini-grid */}
                                            <div className="mb-3.5 grid grid-cols-4 overflow-hidden rounded-lg border border-lumex-border">
                                                {[
                                                    {
                                                        label: 'IF',
                                                        value: journal.metrics?.impactFactor ?? journal.impactFactor ?? '—',
                                                        highlight: true,
                                                    },
                                                    {
                                                        label: 'H5',
                                                        value: journal.metrics?.hIndex ?? journal.h5Index ?? '—',
                                                    },
                                                    {
                                                        label: 'Accept',
                                                        value: journal.acceptanceRate
                                                            ? `${journal.acceptanceRate}%`
                                                            : '24%',
                                                    },
                                                    {
                                                        label: 'TAT',
                                                        value: journal.turnaround ?? '45d',
                                                    },
                                                ].map((m, mi) => (
                                                    <div
                                                        key={m.label}
                                                        className="py-2 text-center"
                                                        style={{
                                                            borderRight:
                                                                mi < 3
                                                                    ? '1px solid var(--lumex-border)'
                                                                    : 'none',
                                                        }}
                                                    >
                                                        <div
                                                            className="text-[0.95rem] font-bold"
                                                            style={{
                                                                color: m.highlight
                                                                    ? color
                                                                    : 'var(--lumex-text)',
                                                            }}
                                                        >
                                                            {m.value}
                                                        </div>
                                                        <div className="mt-0.5 text-[0.61rem] text-lumex-sub">
                                                            {m.label}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2">
                                                <span className="flex-1 rounded-lg bg-lumex-blue py-2 text-center text-[0.78rem] font-semibold text-white transition-all group-hover:bg-lumex-blue-dark">
                                                    Browse Articles
                                                </span>
                                                <span className="rounded-lg border border-lumex-border px-3.5 py-2 text-[0.78rem] font-medium text-lumex-muted transition-all group-hover:border-lumex-blue group-hover:text-lumex-blue">
                                                    Submit →
                                                </span>
                                            </div>
                                        </div>
                                        </Link>
                                        </AnimateIn>
                                );
                            })}
                    </div>
                </Container>
            </section>
        </>
    );
};
