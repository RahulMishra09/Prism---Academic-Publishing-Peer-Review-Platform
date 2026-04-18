import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HomeHero } from '../../../widgets/home-hero';
import { DisciplineGrid } from '../../../widgets/discipline-grid';
import { FeaturedJournals } from '../../../widgets/featured-journals';
import { NewsSection } from '../../../widgets/news-section';
import { Container, Skeleton } from '../../../shared/ui';
import { useSiteConfig } from '../../../shared/api/useSiteConfig';

/* Metrics strip — matches the reference "Articles Published YTD" section */
const MetricsStrip: React.FC = () => {
    const { data: config, isLoading } = useSiteConfig();
    const metrics = config?.metrics || [];

    if (isLoading) {
        return (
            <section className="py-16">
                <Container>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-32 rounded-[10px]" />
                        ))}
                    </div>
                </Container>
            </section>
        );
    }

    if (!metrics.length) return null;

    return (
        <section className="py-16">
            <Container>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map(m => (
                        <div
                            key={m.label}
                            className="rounded-[10px] border border-lumex-border bg-lumex-card p-5"
                        >
                            <div
                                className="mb-1 font-serif text-3xl font-semibold"
                                style={{ color: m.color }}
                            >
                                {m.value}
                            </div>
                            <div className="mb-1 text-sm font-semibold text-lumex-text">
                                {m.label}
                            </div>
                            <div className="text-xs text-lumex-muted">{m.sub}</div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

/* Call to Action — "Ready to Publish Your Research?" */
const CTABanner: React.FC = () => (
    <section className="py-16">
        <Container>
            <div className="flex flex-col items-center justify-between gap-8 rounded-[14px] border border-lumex-border bg-lumex-accent-soft p-10 sm:flex-row sm:p-12">
                <div className="max-w-[540px]">
                    <h2
                        className="mb-2.5 font-serif text-3xl font-semibold"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        Ready to Publish Your Research?
                    </h2>
                    <p className="text-[0.93rem] leading-relaxed text-lumex-muted">
                        Submit to our peer-reviewed journals. Transparent peer review, open access
                        options, and global readership of 4M+ researchers.
                    </p>
                </div>
                <div className="flex flex-shrink-0 flex-col items-start gap-2.5">
                    <Link
                        to="/publish"
                        className="rounded-lg bg-lumex-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-lumex-blue-dark hover:no-underline"
                    >
                        Submit Manuscript
                    </Link>
                    <Link
                        to="/authors"
                        className="rounded-lg border border-lumex-border px-5 py-2.5 text-sm font-medium text-lumex-muted transition-all hover:border-lumex-blue hover:text-lumex-blue hover:no-underline"
                    >
                        Submission Guidelines
                    </Link>
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
                <meta name="description" content="Welcome to Lumex Research. Explore our journals, latest articles, and special collections across all major scientific disciplines." />
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
