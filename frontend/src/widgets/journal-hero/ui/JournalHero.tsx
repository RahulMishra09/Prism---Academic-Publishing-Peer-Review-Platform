import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Container,
    Stack,
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Badge,
} from '../../../shared/ui';
import type { Journal } from '../../../entities/journal/model/types';
import { MetricsPanel } from '../../metrics-panel';

export interface JournalHeroProps {
    journal: Journal;
    className?: string;
    baseUrl: string;
}

export const JournalHero: React.FC<JournalHeroProps> = ({ journal, className, baseUrl }) => {
    const metrics = [
        { label: 'Impact Factor', value: journal.metrics?.impactFactor || 'N/A' },
        { label: 'CiteScore', value: journal.metrics?.citeScore || 'N/A' },
        { label: 'Downloads', value: journal.metrics?.downloads?.toLocaleString() || 'N/A' },
    ].filter(m => m.value !== 'N/A');

    return (
        <div className={`border-b border-lumex-border bg-lumex-bg-white ${className || ''}`}>
            <Container className="pt-6 pb-0">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/journals">Journals A-Z</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{journal.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    {/* Cover Image */}
                    {journal.coverImageUrl && (
                        <div className="w-32 md:w-48 shrink-0 shadow-md border border-lumex-border">
                            <img
                                src={journal.coverImageUrl}
                                alt={`Cover of ${journal.title}`}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Journal Info */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            {journal.openAccess && (
                                <Badge
                                    variant="oa"
                                    className="px-2 py-0.5 text-xs font-bold shadow-sm whitespace-nowrap"
                                >
                                    Open Access
                                </Badge>
                            )}
                            <span className="text-sm font-semibold text-lumex-muted uppercase tracking-wider">
                                Journal
                            </span>
                            <span className="text-xs text-lumex-sub">ISSN: {journal.issn}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif text-lumex-text font-bold leading-tight mb-4">
                            {journal.title}
                        </h1>

                        <p className="text-lg text-lumex-text-secondary max-w-3xl mb-6">
                            {journal.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm font-medium">
                            {journal.editors && journal.editors.length > 0 && (
                                <div className="flex items-center text-lumex-text">
                                    <span className="text-lumex-muted mr-2">Editor-in-Chief:</span>
                                    <a
                                        href={`${baseUrl}/editors`}
                                        className="text-lumex-blue hover:underline"
                                    >
                                        {journal.editors[0].name}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>

            {/* Embedded Metrics Row (Desktop only, mobile will stack via sidebar) */}
            <div className="hidden md:block bg-lumex-bg-deep border-y border-lumex-border">
                <Container>
                    <MetricsPanel
                        metrics={metrics}
                        layout="row"
                        title=""
                        className="border-t-0 bg-transparent py-4 md:py-4 shadow-none px-0"
                    />
                </Container>
            </div>

            {/* Navigation Tabs */}
            <Container className="pt-2 px-0 sm:px-4 lg:px-6">
                <nav className="flex overflow-x-auto no-scrollbar border-b border-lumex-border">
                    <Stack direction="row" gap="md" className="min-w-max px-4 sm:px-0">
                        <TabLink to={baseUrl} end>
                            Journal home
                        </TabLink>
                        <TabLink to={`${baseUrl}/issues`}>Volumes and issues</TabLink>
                        <TabLink to={`${baseUrl}/about`}>About</TabLink>
                        <TabLink to={`${baseUrl}/editors`}>Editorial board</TabLink>
                        <TabLink to={`${baseUrl}/submission-guidelines`}>
                            Submission guidelines
                        </TabLink>
                    </Stack>
                </nav>
            </Container>
        </div>
    );
};

const TabLink = ({
    to,
    children,
    end = false,
}: {
    to: string;
    children: React.ReactNode;
    end?: boolean;
}) => (
    <NavLink
        end={end}
        to={to}
        className={({ isActive }) =>
            [
                'relative whitespace-nowrap px-2 py-3.5 text-[0.82rem] font-semibold transition-colors',
                isActive
                    ? 'text-lumex-blue'
                    : 'text-lumex-muted hover:text-lumex-text',
            ].join(' ')
        }
    >
        {({ isActive }) => (
            <>
                {children}
                {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-t-full bg-lumex-blue" />
                )}
            </>
        )}
    </NavLink>
);
