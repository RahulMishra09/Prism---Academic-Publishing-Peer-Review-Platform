import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Skeleton } from '../../../shared/ui';
import { useAdminJournal } from '../../../entities/journal/api/journalAdminQueries';
import { JournalForm } from '../../../features/journal-admin';
import type { JournalDraft } from '../../../entities/journal/model/types';

export const JournalEditPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: journal, isLoading, error } = useAdminJournal(slug ?? '');

    if (isLoading) {
        return (
            <Container className="py-12 space-y-4 max-w-4xl mx-auto">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </Container>
        );
    }

    if (error || !journal) {
        return (
            <Container className="py-24 text-center">
                <p className="text-lumex-muted">Journal not found.</p>
            </Container>
        );
    }

    const initialData: Partial<JournalDraft> = {
        title: journal.title,
        abbreviation: journal.abbreviation,
        slug: journal.slug,
        electronicISSN: journal.electronicISSN,
        printISSN: journal.printISSN,
        publisher: journal.publisher,
        accessType: journal.accessType,
        discipline: journal.discipline,
        subdiscipline: journal.subdiscipline,
        description: journal.description,
        aimsAndScope: journal.aimsAndScope,
        coverImageUrl: journal.coverImageUrl,
        logoUrl: journal.logoUrl,
        foundedYear: journal.foundedYear,
        frequency: journal.frequency,
        language: journal.language,
        indexedIn: journal.indexedIn,
        articleProcessingCharge: journal.articleProcessingCharge,
        apaCurrency: journal.apaCurrency,
        openAccess: journal.openAccess,
        editors: journal.editors,
        status: journal.status ?? 'active',
    };

    return (
        <JournalForm
            mode="edit"
            initialData={initialData}
            originalSlug={journal.slug}
        />
    );
};
