import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HomeHero } from '../../../widgets/home-hero';
import { DisciplineGrid } from '../../../widgets/discipline-grid';
import { FeaturedJournals } from '../../../widgets/featured-journals';
import { NewsSection } from '../../../widgets/news-section';
import { Container, Skeleton } from '../../../shared/ui';
import { useSiteConfig } from '../../../shared/api/useSiteConfig';

const MetricsStrip: React.FC = () => {
    const { data: config, isLoading } = useSiteConfig();
    const metrics = config?.metrics || [];

    if (isLoading) {
        return (
            <section className="border-b border-lumex-border bg-lumex-bg-deep py-14">
                <Container>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-28 rounded-xl" />
                        ))}
                    </div>
                </Container>
            </section>
        );
    }

    if (!metrics.length) return null;

    const METRIC_COLORS = ['text-lumex-blue', 'text-prism-violet', 'text-prism-teal', 'text-lumex-oa-gold'];
    const METRIC_BG = ['bg-lumex-blue/5', 'bg-prism-violet/5', 'bg-prism-teal/5', 'bg-lumex-oa-gold/5'];
    const METRIC_BORDER = ['border-lumex-blue/10', 'border-prism-violet/10', 'border-prism-teal/10', 'border-lumex-oa-gold/10'];

    return (
        <section className="border-b border-t border-lumex-border bg-lumex-bg-deep py-14">
            <Container>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {metrics.map((m, i) => (
                        <div
                            key={m.label}
                            className={`rounded-xl border p-6 ${METRIC_BG[i % 4]} ${METRIC_BORDER[i % 4]}`}
                        >
                            <div className={`mb-1.5 font-serif text-[2.1rem] font-bold leading-none ${METRIC_COLORS[i % 4]}`}>
                                {m.value}
                            </div>
                            <div className="mb-0.5 text-sm font-semibold text-lumex-text">{m.label}</div>
                            <div className="text-xs text-lumex-muted">{m.sub}</div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

const CTABanner: React.FC = () => (
    <section className="py-16">
        <Container>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lumex-blue via-prism-violet to-prism-teal p-px shadow-xl">
                <div className="relative rounded-2xl bg-lumex-bg-white/[0.97] px-10 py-12 dark:bg-lumex-bg-deep/[0.97] sm:px-14">
                    {/* decorative blobs */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lumex-blue/5 blur-3xl" aria-hidden />
                    <div className="pointer-events-none absolute -bottom-12 left-8 h-48 w-48 rounded-full bg-prism-violet/5 blur-3xl" aria-hidden />

                    <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                        <div className="max-w-[540px]">
                            <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-lumex-blue">
                                Publish with Prism
                            </p>
                            <h2 className="mb-3 font-serif text-3xl font-bold leading-tight tracking-tight text-lumex-text">
                                Ready to Share Your Research?
                            </h2>
                            <p className="text-[0.93rem] leading-relaxed text-lumex-muted">
                                Submit to our peer-reviewed journals. Transparent peer review,
                                open access options, and a global readership of 4M+ researchers.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2.5">
                            <Link
                                to="/publish"
                                className="rounded-xl bg-lumex-blue px-7 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-lumex-blue/20 transition-all hover:-translate-y-px hover:bg-lumex-blue-dark hover:shadow-xl hover:no-underline active:translate-y-0"
                            >
                                Submit Manuscript
                            </Link>
                            <Link
                                to="/authors"
                                className="rounded-xl border border-lumex-border px-6 py-2.5 text-center text-sm font-medium text-lumex-muted transition-all hover:border-lumex-blue/40 hover:text-lumex-blue hover:no-underline"
                            >
                                Submission Guidelines
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    </section>
);

export const HomePage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Home</title>
                <meta name="description" content="Prism — explore peer-reviewed research across every scientific discipline. Open access journals, trending articles, and global scholarly publishing." />
            </Helmet>
            <HomeHero />
            <DisciplineGrid />
            <NewsSection />
            <FeaturedJournals />
            <MetricsStrip />
            <CTABanner />
        </>
    );
};
