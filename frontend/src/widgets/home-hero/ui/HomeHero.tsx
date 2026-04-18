import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { SearchBar } from '../../../features/search';
import { useHomepageData, type TrendingArticle } from '../../../features/homepage/api/homepageQueries';
import { useThemeStore } from '../../../entities/theme/model/useThemeStore';

export interface HomeHeroProps {
    className?: string;
}

/* Mesh gradient background overlay — blurred CSS circles */
const MeshGradient: React.FC = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
            className="absolute rounded-full"
            style={{
                width: 700,
                height: 700,
                background: 'rgba(59,91,219,0.1)',
                filter: 'blur(100px)',
                top: -260,
                left: -180,
            }}
        />
        <div
            className="animate-float absolute rounded-full"
            style={{
                width: 500,
                height: 500,
                background: 'rgba(99,102,241,0.08)',
                filter: 'blur(90px)',
                bottom: -160,
                right: -120,
            }}
        />
        <div
            className="absolute rounded-full"
            style={{
                width: 360,
                height: 360,
                background: 'rgba(14,165,233,0.07)',
                filter: 'blur(80px)',
                top: '38%',
                left: '42%',
            }}
        />
        <div
            className="absolute rounded-full"
            style={{
                width: 280,
                height: 280,
                background: 'rgba(124,58,237,0.05)',
                filter: 'blur(70px)',
                top: '18%',
                right: '8%',
            }}
        />
    </div>
);

export const HomeHero: React.FC<HomeHeroProps> = ({ className }) => {
    const { data: homepageData } = useHomepageData();
    const { theme } = useThemeStore();
    const stats = homepageData?.stats || [];

    /* Fallback stats if API hasn't loaded yet */
    const displayStats =
        stats.length > 0
            ? stats
            : [
                { value: '2.4M+', label: 'Articles' },
                { value: '3,800+', label: 'Journals' },
                { value: '38%', label: 'Open Access' },
                { value: '140', label: 'Countries' },
            ];

    return (
        <section className={`relative overflow-hidden py-16 md:py-20 ${className || ''}`}>
            <MeshGradient />

            <Container className="relative z-10">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left column */}
                    <div className="animate-fade-up">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-lumex-blue/20 bg-lumex-blue-soft px-3 py-1">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lumex-blue" />
                            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-lumex-blue">
                                Open Access · 2025
                            </span>
                        </div>

                        {/* Heading */}
                        <h1
                            className="mb-5 font-serif text-4xl font-semibold leading-[1.12] md:text-5xl lg:text-[3.4rem]"
                            style={{ letterSpacing: '-0.025em' }}
                        >
                            The Home of
                            <br />
                            <span className="italic text-lumex-blue">Rigorous Science</span>
                        </h1>

                        {/* Description */}
                        <p className="mb-8 max-w-[450px] text-base leading-relaxed text-lumex-muted">
                            Peer-reviewed research across every discipline — accessible to
                            researchers, clinicians, and policymakers worldwide.
                        </p>

                        {/* Search bar */}
                        <div className="mb-6 flex">
                            <div className="relative w-full lg:max-w-2xl">
                                <SearchBar size="lg" hideAdvancedToggle />
                            </div>
                        </div>

                        {/* Quick links */}
                        <p className="mb-8 text-xs text-lumex-muted">
                            <Link
                                to="/search"
                                className="text-lumex-blue hover:underline"
                            >
                                Advanced Search
                            </Link>
                            {' · '}
                            <Link
                                to="/search?type=doi"
                                className="text-lumex-blue hover:underline"
                            >
                                Search by DOI
                            </Link>
                            {' · '}
                            <Link
                                to="/disciplines"
                                className="text-lumex-blue hover:underline"
                            >
                                Browse by Subject
                            </Link>
                        </p>

                        {/* Stats row */}
                        <div className="flex gap-8 border-t border-lumex-border pt-5">
                            {displayStats.map(({ value, label }) => (
                                <div key={label}>
                                    <div className="font-serif text-2xl font-semibold text-lumex-text">
                                        {value}
                                    </div>
                                    <div className="mt-0.5 text-xs font-normal text-lumex-muted">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right column — preview cards */}
                    <div className="hidden flex-col gap-2.5 lg:flex">
                        {(homepageData?.trendingResearch || []).slice(0, 3).map((item: TrendingArticle) => {
                            const articleLink = item.link?.startsWith('/article/')
                                ? `/article/${encodeURIComponent(item.link.replace('/article/', ''))}`
                                : (item.link || '#');

                            return (
                                <Link
                                    key={item.id}
                                    to={articleLink}
                                    className="group flex gap-3.5 rounded-[10px] border border-lumex-border bg-lumex-bg-white p-4 transition-all hover:border-lumex-border-hover hover:bg-lumex-card-hover hover:shadow-md hover:no-underline"
                                >
                                <div
                                    className="w-[3px] flex-shrink-0 self-stretch rounded-sm"
                                    style={{ background: item.accentColor || '#5b7cf6' }}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                                        <span
                                            className="rounded px-2 py-0.5 text-[0.69rem] font-bold"
                                            style={{
                                                background: theme === 'dark' ? 'rgba(96, 165, 250, 0.15)' : `${item.accentColor || '#5b7cf6'}14`,
                                                color: theme === 'dark' ? '#60a5fa' : (item.accentColor || '#5b7cf6'),
                                            }}
                                        >
                                            {item.category || item.journalSlug || 'Research'}
                                        </span>
                                    </div>
                                    <p className="mb-1 font-serif text-sm font-medium leading-snug text-lumex-text">
                                        {item.title}
                                    </p>
                                    <p className="text-[0.71rem] text-lumex-muted">
                                        {item.journal} {item.date ? `· ${item.date}` : ''}
                                    </p>
                                </div>
                            </Link>
                        ); })}
                        <div className="flex justify-end">
                            <Link
                                to="/search"
                                className="text-[0.79rem] font-medium text-lumex-blue hover:underline"
                            >
                                View all articles →
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
