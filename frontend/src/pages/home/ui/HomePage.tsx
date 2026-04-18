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

/* ── How It Works ─────────────────────────────────────────────── */
const HOW_IT_WORKS = [
    {
        step: '01',
        title: 'Submit Your Manuscript',
        body: 'Upload your research through our structured submission portal. We support all major formats and guide you through every step.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
        ),
        color: '#1e3a8a',
    },
    {
        step: '02',
        title: 'Expert Peer Review',
        body: 'Assigned reviewers from your field evaluate methodology, significance, and validity. Double-blind by default, with full audit trails.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.143-.563-4.157-1.548-5.892" />
            </svg>
        ),
        color: '#6d28d9',
    },
    {
        step: '03',
        title: 'Publish & Reach Millions',
        body: 'Accepted articles are assigned a DOI, indexed globally, and discoverable by 4M+ researchers, clinicians, and policymakers.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
        color: '#0f766e',
    },
];

const HowItWorks: React.FC = () => (
    <section className="bg-lumex-bg-deep py-20 border-b border-lumex-border">
        <Container>
            <div className="mb-12 text-center">
                <p className="mb-2 text-[0.69rem] font-bold uppercase tracking-[0.14em] text-lumex-blue">
                    Publishing Process
                </p>
                <h2
                    className="font-serif text-[1.9rem] font-bold text-lumex-text"
                    style={{ letterSpacing: '-0.025em' }}
                >
                    From Submission to Global Impact
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-lumex-muted">
                    A transparent, rigorous process designed to uphold scientific integrity while getting your research out to the world.
                </p>
            </div>

            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* connector line (desktop only) */}
                <div
                    className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px md:block"
                    style={{
                        background: 'linear-gradient(90deg, transparent 8%, var(--lumex-border) 20%, var(--lumex-border) 80%, transparent 92%)',
                    }}
                    aria-hidden
                />

                {HOW_IT_WORKS.map(({ step, title, body, icon, color }) => (
                    <div key={step} className="relative flex flex-col items-center text-center">
                        {/* Step bubble */}
                        <div
                            className="relative z-10 mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 bg-lumex-bg"
                            style={{ borderColor: color, color }}
                        >
                            {icon}
                            <span
                                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.55rem] font-bold text-white"
                                style={{ background: color }}
                            >
                                {step.replace('0', '')}
                            </span>
                        </div>
                        <h3 className="mb-2 font-serif text-base font-semibold text-lumex-text">{title}</h3>
                        <p className="text-[0.82rem] leading-relaxed text-lumex-muted">{body}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                <Link
                    to="/publish"
                    className="inline-flex items-center gap-2 rounded-xl bg-lumex-blue px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-lumex-blue/20 transition-all hover:-translate-y-px hover:bg-lumex-blue-dark hover:no-underline"
                >
                    Start Your Submission
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </Container>
    </section>
);

/* ── Open Standards Trust Strip ──────────────────────────────── */
const STANDARDS = [
    {
        label: 'COPE Member',
        sub: 'Ethics compliance',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
    },
    {
        label: 'CrossRef DOI',
        sub: 'Persistent identifiers',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
        ),
    },
    {
        label: 'Open Access',
        sub: 'DOAJ indexed',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
    },
    {
        label: 'ORCID Integration',
        sub: 'Author identity',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        label: 'PubMed Indexed',
        sub: 'Global discoverability',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        ),
    },
    {
        label: 'CC Licensing',
        sub: 'Creative Commons',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        ),
    },
];

const TrustStrip: React.FC = () => (
    <section className="border-b border-lumex-border bg-lumex-bg py-12">
        <Container>
            <p className="mb-6 text-center text-[0.69rem] font-bold uppercase tracking-[0.14em] text-lumex-muted">
                Open Standards We Uphold
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                {STANDARDS.map(({ label, sub, icon }) => (
                    <div
                        key={label}
                        className="flex items-center gap-2.5 rounded-full border border-lumex-border bg-lumex-bg-white px-4 py-2 text-sm"
                    >
                        <span className="text-lumex-blue">{icon}</span>
                        <span>
                            <span className="font-semibold text-lumex-text">{label}</span>
                            <span className="ml-1.5 text-[0.72rem] text-lumex-muted">{sub}</span>
                        </span>
                    </div>
                ))}
            </div>
        </Container>
    </section>
);

/* ── CTA Banner with Testimonial ─────────────────────────────── */
const CTABanner: React.FC = () => (
    <section className="py-16">
        <Container>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lumex-blue via-prism-violet to-prism-teal p-px shadow-xl">
                <div className="relative rounded-2xl bg-lumex-bg-white/[0.97] dark:bg-lumex-bg-deep/[0.97]">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lumex-blue/5 blur-3xl" aria-hidden />
                    <div className="pointer-events-none absolute -bottom-12 left-8 h-48 w-48 rounded-full bg-prism-violet/5 blur-3xl" aria-hidden />

                    <div className="relative grid grid-cols-1 gap-0 lg:grid-cols-5">
                        {/* Left — CTA */}
                        <div className="col-span-3 px-10 py-12 sm:px-14">
                            <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-lumex-blue">
                                Publish with Prism
                            </p>
                            <h2
                                className="mb-3 font-serif text-3xl font-bold leading-tight text-lumex-text"
                                style={{ letterSpacing: '-0.025em' }}
                            >
                                Ready to Share Your Research?
                            </h2>
                            <p className="mb-8 max-w-[420px] text-[0.93rem] leading-relaxed text-lumex-muted">
                                Submit to our peer-reviewed journals. Transparent peer review,
                                open access options, and a global readership of 4M+ researchers.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/publish"
                                    className="rounded-xl bg-lumex-blue px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-lumex-blue/20 transition-all hover:-translate-y-px hover:bg-lumex-blue-dark hover:no-underline active:translate-y-0"
                                >
                                    Submit Manuscript
                                </Link>
                                <Link
                                    to="/authors"
                                    className="rounded-xl border border-lumex-border px-6 py-3 text-sm font-medium text-lumex-muted transition-all hover:border-lumex-blue/40 hover:text-lumex-blue hover:no-underline"
                                >
                                    Submission Guidelines
                                </Link>
                            </div>
                        </div>

                        {/* Right — Testimonial */}
                        <div className="col-span-2 flex items-center border-t border-lumex-border px-10 py-10 lg:border-l lg:border-t-0 lg:px-10">
                            <figure className="w-full">
                                <blockquote className="mb-4">
                                    <svg className="mb-3 h-7 w-7 text-lumex-blue/30" fill="currentColor" viewBox="0 0 32 32" aria-hidden>
                                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                    </svg>
                                    <p className="font-reading text-[1.05rem] italic leading-relaxed text-lumex-text">
                                        "Prism gave our study the global reach it deserved. The transparent review process built confidence with the broader scientific community."
                                    </p>
                                </blockquote>
                                <figcaption className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lumex-blue/10 font-serif text-sm font-bold text-lumex-blue">
                                        DR
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-lumex-text">Dr. Riya Desai</p>
                                        <p className="text-[0.72rem] text-lumex-muted">Computational Biology, IISc Bangalore</p>
                                    </div>
                                </figcaption>
                            </figure>
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
                <title>Home | Prism</title>
                <meta name="description" content="Prism — explore peer-reviewed research across every scientific discipline. Open access journals, trending articles, and global scholarly publishing." />
            </Helmet>
            <HomeHero />
            <DisciplineGrid />
            <HowItWorks />
            <NewsSection />
            <FeaturedJournals />
            <TrustStrip />
            <MetricsStrip />
            <CTABanner />
        </>
    );
};
