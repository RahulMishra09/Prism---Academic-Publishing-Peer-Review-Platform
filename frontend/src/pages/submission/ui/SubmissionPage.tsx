import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { useSubmissionStore } from '../../../features/submission/model/useSubmissionStore';
import { SubmissionWizard } from '../../../widgets/submission-wizard/ui/SubmissionWizard';
import { Helmet } from 'react-helmet-async';

export const SubmissionPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { draft, updateDraft } = useSubmissionStore();

    useEffect(() => {
        // Ensure the journal slug is captured in the submission draft
        if (slug && draft.journalSlug !== slug) {
            updateDraft({ journalSlug: slug });
        }
    }, [slug, draft.journalSlug, updateDraft]);

    return (
        <div className="bg-lumex-bg min-h-screen pb-16">
            <Helmet>
                <title>Submit to {slug} | Lumex Research</title>
                <meta name="robots" content="noindex,nofollow" />
            </Helmet>

            <div className="bg-lumex-card border-b border-lumex-border py-4 mb-8">
                <Container>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-serif font-bold text-lumex-text">
                                Manuscript Submission System
                            </h1>
                            <span className="hidden sm:inline-block px-3 py-1 bg-lumex-blue/10 text-lumex-blue text-sm font-bold rounded-full">
                                {slug}
                            </span>
                        </div>
                        <Link
                            to="/account"
                            className="text-sm font-bold text-lumex-muted hover:text-lumex-text"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="max-w-5xl mx-auto">
                    <SubmissionWizard />
                </div>
            </Container>
        </div>
    );
};
