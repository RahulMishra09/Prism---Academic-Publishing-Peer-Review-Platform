import React from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { TwoColumnLayout } from '../../../app/layouts';
import { Container, Skeleton } from '../../../shared/ui';
import { useJournal } from '../../../entities/journal/api/journalQueries';
import { JournalHero } from '../../../widgets/journal-hero';
import { JournalSidebar } from '../../../widgets/journal-sidebar';

export const JournalLayout: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: journal, isLoading, isError } = useJournal(slug || '');

    if (!slug) {
        return <Navigate to="/journals" replace />;
    }

    if (isError) {
        return (
            <>
                <Container className="py-16 text-center">
                    <h1 className="text-3xl font-serif text-lumex-blue mb-4">
                        Journal Not Found
                    </h1>
                    <p className="text-lumex-muted">
                        The journal you're looking for could not be located or may have been
                        removed.
                    </p>
                </Container>
            </>
        );
    }

    if (isLoading || !journal) {
        return (
            <>
                <div className="bg-lumex-bg border-b border-lumex-border pt-6 pb-0">
                    <Container>
                        <Skeleton className="w-64 h-4 mb-6" />
                        <div className="flex gap-8 mb-8">
                            <Skeleton className="w-32 h-44" />
                            <div className="flex-1 space-y-4 pt-2">
                                <Skeleton className="w-1/4 h-6" />
                                <Skeleton className="w-3/4 h-12" />
                                <Skeleton className="w-full h-20" />
                            </div>
                        </div>
                        <div className="flex gap-4 pb-2">
                            <Skeleton className="w-24 h-8" />
                            <Skeleton className="w-32 h-8" />
                            <Skeleton className="w-20 h-8" />
                        </div>
                    </Container>
                </div>
                <Container className="py-8">
                    <TwoColumnLayout
                        main={
                            <div>
                                <Skeleton className="w-full h-96" />
                            </div>
                        }
                        sidebar={
                            <div>
                                <Skeleton className="w-full h-96" />
                            </div>
                        }
                    />
                </Container>
            </>
        );
    }

    return (
        <>
            <JournalHero journal={journal} baseUrl={`/journal/${slug}`} />
            <Container className="py-8">
                <TwoColumnLayout
                    main={<Outlet context={{ journal }} />}
                    sidebar={<JournalSidebar journal={journal} baseUrl={`/journal/${slug}`} />}
                />
            </Container>
        </>
    );
};
