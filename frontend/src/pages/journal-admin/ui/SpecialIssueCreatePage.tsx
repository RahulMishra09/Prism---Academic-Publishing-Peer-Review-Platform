import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { useAdminJournal } from '../../../entities/journal/api/journalAdminQueries';
import { SpecialIssueForm } from '../../../features/journal-admin';

export const SpecialIssueCreatePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: journal } = useAdminJournal(slug ?? '');

    return (
        <Container>
            <SpecialIssueForm
                mode="create"
                journalSlug={slug ?? ''}
                journalTitle={journal?.title ?? slug ?? ''}
            />
        </Container>
    );
};
