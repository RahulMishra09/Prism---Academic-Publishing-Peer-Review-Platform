import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Skeleton } from '../../../shared/ui';
import { useAdminJournal } from '../../../entities/journal/api/journalAdminQueries';
import { SpecialIssueManager } from '../../../features/journal-admin';

export const SpecialIssuePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: journal, isLoading } = useAdminJournal(slug ?? '');

    if (isLoading) {
        return (
            <Container className="py-12 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-40 w-full rounded-xl" />
            </Container>
        );
    }

    return (
        <Container className="py-10 min-h-screen">
            <SpecialIssueManager
                journalSlug={slug ?? ''}
                journalTitle={journal?.title ?? slug ?? ''}
            />
        </Container>
    );
};
