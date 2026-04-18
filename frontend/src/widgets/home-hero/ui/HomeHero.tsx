import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { SearchBar } from '../../../features/search';
import { useHomepageData, type TrendingArticle } from '../../../features/homepage/api/homepageQueries';
import { useThemeStore } from '../../../entities/theme/model/useThemeStore';

export interface HomeHeroProps {
    className?: string;
}

/* Subtle dot-grid background */
const DotGrid: React.FC = () => (
    <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden
        style={{
            backgroundImage: 'radial-gradient(circle, var(--lumex-text) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
        }}
    />
);

/* Gradient orbs */
const Orbs: React.FC = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-lumex-blue/[0.06] blur-[100px]" />
        <div className="absolute -bottom-32 right-0 h-[500px] w-[500px] rounded-full bg-prism-violet/[0.05] blur-[90px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-prism-teal/[0.04] blur-[80px]" />
    </div>
);

const DISCIPLINE_TAGS = [
    'Neuroscience', 'Quantum Physics', 'Genomics', 'Climate Science',
    'Machine Learning', 'Oncology', 'Materials Science', 'Economics',
    'Immunology', 'Astrophysics',
];

export const HomeHero: React.FC<HomeHeroProps> = ({ className }) => {
    const { data: homepageData } = useHomepageData();
    const { theme } = useThemeStore();
    const stats = homepageData?.stats || [];

    const displayStats =
        stats.length > 0
            ? stats
            : [
                { value: '2.4M+', label: 'Articles indexed' },
                { value: '3,800+', label: 'Active journals' },
                { value: '38%', label: 'Open access' },
                { value: '140', label: 'Countries covered' },
            ];

    return (
        <section className={`relative overflow-hidden bg-lumex-bg pb-0 pt-14 md:pt-20 ${className || ''}`}>
            <DotGrid />
            <Orbs />

            {/* Announcement ribbon */}
            <div className="relative z-10 mb-10 flex justify-center">
                <Link
                    to="/collections"
                    className="inline-flex items-center gap-2.5 rounded-full border border-lumex-blue/20 bg-lumex-blue/5 px-4 py-1.5 text-[0.72rem] font-semibold text-lumex-blue transition-all hover:border-lumex-blue/40 hover:bg-lumex-blue/10 hover:no-underline"
                >
                    <span className="flex h-1.5 w-1.5 rounded-full bg-lumex-blue">
                        <span className="h-full w-full animate-ping rounded-full bg-lumex-blue opacity-75" />
                    </span>
                    <span className="uppercase tracking-wider">New · Special Collection: AI in Medicine 2025</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <Container className="relative z-10">
                {/* Heading block — centred, editorial */}
                <div className="mx-auto mb-10 max-w-4xl text-center">
                    <h1
                        className="mb-5 font-serif text-[2.6rem] font-bold leading-[1.08] md:text-[3.4rem] lg:text-[4rem]"
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        The Platform for{' '}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-lumex-blue via-prism-violet to-prism-teal bg-clip-text text-transparent">
                                Rigorous Science
                            </span>
                            {/* underline accent */}
                            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-lumex-blue via-prism-violet to-prism-teal opacity-40" />
                        </span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-[600px] text-[1.05rem] leading-relaxed text-lumex-muted">
                        Peer-reviewed research across every discipline — accessible to
                        researchers, clinicians, and policymakers worldwide.
                        Open access. Transparent review. Global reach.
                    </p>

                    {/* Search bar — centred, wide */}
                    <div className="mx-auto mb-4 max-w-2xl">
                        <SearchBar size="lg" hideAdvancedToggle />
                    </div>

                    {/* Quick links */}
                    <div className="mb-12 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-lumex-muted">
                        <Link to="/search" className="text-lumex-blue hover:underline">Advanced Search</Link>
                        <span className="opacity-30">·</span>
                        <Link to="/search?type=doi" className="text-lumex-blue hover:underline">Search by DOI</Link>
                        <span className="opacity-30">·</span>
                        <Link to="/disciplines" className="text-lumex-blue hover:underline">Browse by Subject</Link>
                        <span className="opacity-30">·</span>
                        <Link to="/journals" className="text-lumex-blue hover:underline">All Journals</Link>
                    </div>
                </div>

                {/* Stats band */}
                <div className="mx-auto mb-12 flex max-w-3xl flex-wrap justify-center gap-0 divide-x divide-lumex-border rounded-2xl border border-lumex-border bg-lumex-bg-white shadow-sm">
                    {displayStats.map(({ value, label }) => (
                        <div key={label} className="flex flex-1 flex-col items-center px-6 py-5 min-w-[120px]">
                            <span className="font-serif text-[1.85rem] font-bold leading-none text-lumex-text">
                                {value}
                            </span>
                            <span className="mt-1 text-center text-[0.7rem] font-medium uppercase tracking-wider text-lumex-muted">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Discipline tags scrolling marquee */}
                <div className="relative -mx-4 mb-0 overflow-hidden sm:-mx-6 lg:-mx-8">
                    {/* fade edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-lumex-bg to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-lumex-bg to-transparent" />
                    <div className="overflow-hidden py-3">
                        {/* single track doubled for seamless infinite scroll */}
                        <div className="flex w-max animate-marquee gap-2">
                            {[...DISCIPLINE_TAGS, ...DISCIPLINE_TAGS].map((tag, i) => (
                                <Link
                                    key={`${tag}-${i}`}
                                    to={`/search?query=${encodeURIComponent(tag)}`}
                                    className="shrink-0 rounded-full border border-lumex-border bg-lumex-bg-white px-3.5 py-1.5 text-xs font-medium text-lumex-muted transition-colors hover:border-lumex-blue/30 hover:text-lumex-blue hover:no-underline"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trending research cards — horizontal scroll on mobile */}
                {(homepageData?.trendingResearch || []).length > 0 && (
                    <div className="py-10">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-lumex-blue">
                                Trending Now
                            </p>
                            <Link to="/search?sort=trending" className="text-xs font-medium text-lumex-blue hover:underline">
                                View all →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            {(homepageData.trendingResearch as TrendingArticle[]).slice(0, 3).map((item) => {
                                const articleLink = item.link?.startsWith('/article/')
                                    ? `/article/${encodeURIComponent(item.link.replace('/article/', ''))}`
                                    : (item.link || '#');
                                const color = item.accentColor || '#1e3a8a';
                                return (
                                    <Link
                                        key={item.id}
                                        to={articleLink}
                                        className="group flex gap-3 rounded-xl border border-lumex-border bg-lumex-bg-white p-4 transition-all hover:border-lumex-blue/30 hover:shadow-md hover:no-underline"
                                    >
                                        <div className="w-[3px] shrink-0 self-stretch rounded-full" style={{ background: color }} />
                                        <div className="min-w-0">
                                            <span
                                                className="mb-1.5 inline-block rounded px-2 py-0.5 text-[0.66rem] font-bold"
                                                style={{
                                                    background: theme === 'dark' ? 'rgba(96,165,250,0.12)' : `${color}14`,
                                                    color: theme === 'dark' ? '#93c5fd' : color,
                                                }}
                                            >
                                                {item.category || item.journalSlug || 'Research'}
                                            </span>
                                            <p className="font-serif text-sm font-medium leading-snug text-lumex-text group-hover:text-lumex-blue transition-colors line-clamp-2">
                                                {item.title}
                                            </p>
                                            <p className="mt-1.5 text-[0.7rem] text-lumex-muted">
                                                {item.journal}{item.date ? ` · ${item.date}` : ''}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Container>

            {/* Bottom wave divider */}
            <div className="relative mt-4 h-16 overflow-hidden">
                <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
                    <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="var(--lumex-bg-deep)" />
                </svg>
            </div>
        </section>
    );
};
