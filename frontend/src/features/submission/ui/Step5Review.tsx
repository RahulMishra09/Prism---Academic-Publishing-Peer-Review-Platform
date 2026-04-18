import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step6Schema, type Step6Data } from '@features/submission/model/submissionSchema';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import type { AuthorInfo, SuggestedReviewer, SubmissionFile } from '../../../shared/types/submission.types';
import { Button } from '@shared/ui';
import { Link, useNavigate } from 'react-router-dom';
import { createPaper, submitPaper } from '../api/papersApi';

export const Step5Review: React.FC = () => {
    const { draft, updateDraft, prevStep, resetDraft } = useSubmissionStore();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Step6Data>({
        resolver: zodResolver(Step6Schema),
        defaultValues: {
            agreedToTerms: draft.agreedToTerms || false,
        },
    });

    const onSubmit = async (data: Step6Data) => {
        updateDraft(data as Partial<typeof draft>);
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // 1. Create paper draft on the backend
            const paper = await createPaper({
                title: draft.title ?? 'Untitled Manuscript',
                abstract: draft.abstract ?? '',
                domain: draft.journalSlug ?? 'general',
                keywords: draft.keywords ?? [],
            });

            // 2. Submit the paper for review
            await submitPaper(paper.id);

            setSubmissionSuccess(true);
            resetDraft();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submissionSuccess) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="w-20 h-20 bg-lumex-open-bg rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-open-text">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h2 className="text-3xl font-serif text-lumex-text font-bold mb-4">Submission Successful</h2>
                <p className="text-lg text-lumex-muted mb-8">
                    Thank you for submitting your manuscript to Lumex. You will receive an email confirmation shortly.
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => void navigate('/account')}
                >
                    Go to My Account
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 6: Review & Submit
            </h2>
            <p className="text-lumex-muted mb-8">
                Please review all the information below. Once you are satisfied, agree to the terms and click Submit.
            </p>

            <div className="bg-lumex-bg-deep border border-lumex-border rounded-md p-6 mb-8 shadow-sm">

                {/* Type & Title */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-3 pb-2 border-b border-lumex-border">
                        Manuscript Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                        <div className="text-sm font-bold text-lumex-muted">Type</div>
                        <div className="sm:col-span-3 text-sm text-lumex-text">{draft.manuscriptType || 'Not specified'}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                        <div className="text-sm font-bold text-lumex-muted">Title</div>
                        <div className="sm:col-span-3 text-sm font-bold text-lumex-blue">{draft.title || 'Not specified'}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="text-sm font-bold text-lumex-muted">Abstract</div>
                        <div className="sm:col-span-3 text-sm text-lumex-text whitespace-pre-line">{draft.abstract || 'Not specified'}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                        <div className="text-sm font-bold text-lumex-muted">Keywords</div>
                        <div className="sm:col-span-3 text-sm text-lumex-text">
                            {draft.keywords?.join(', ') || 'None'}
                        </div>
                    </div>
                </div>

                {/* Disclosures */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-3 pb-2 border-b border-lumex-border">
                        Declarations & Disclosures
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="text-sm font-bold text-lumex-muted">Competing Interests</div>
                            <div className="sm:col-span-3 text-sm text-lumex-text">{draft.competingInterests || 'None'}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="text-sm font-bold text-lumex-muted">Funding</div>
                            <div className="sm:col-span-3 text-sm text-lumex-text">{draft.fundingStatement || 'None'}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="text-sm font-bold text-lumex-muted">Data Availability</div>
                            <div className="sm:col-span-3 text-sm text-lumex-text">{draft.dataAvailability || 'None'}</div>
                        </div>
                        {draft.ethicsApproval && (
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="text-sm font-bold text-lumex-muted">Ethics Approval</div>
                                <div className="sm:col-span-3 text-sm text-lumex-text">{draft.ethicsApproval}</div>
                            </div>
                        )}
                        {draft.coverLetter && (
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="text-sm font-bold text-lumex-muted">Cover Letter</div>
                                <div className="sm:col-span-3 text-sm text-lumex-text italic truncate">Provided (Internal only)</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Authors */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-3 pb-2 border-b border-lumex-border">
                        Authors
                    </h3>
                    <ul className="space-y-4">
                        {draft.authors?.map((author: AuthorInfo, idx: number) => (
                            <li key={String(author.id || idx)} className="text-sm text-lumex-text bg-lumex-card p-3 border border-lumex-border rounded shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold">{idx + 1}. {author.firstName} {author.lastName}</span>
                                    {author.isCorresponding && <span className="text-[10px] font-bold uppercase bg-lumex-blue text-white px-2 py-0.5 rounded">Corresponding</span>}
                                </div>
                                <div className="text-lumex-muted leading-relaxed">
                                    {author.department}, {author.institution}<br />
                                    {author.city}, {author.country}<br />
                                    <span className="text-lumex-blue">{author.email}</span>
                                    {author.orcid && <span className="ml-3 text-lumex-sub">ORCID: {author.orcid}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Suggested Reviewers */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-3 pb-2 border-b border-lumex-border">
                        Suggested Reviewers
                    </h3>
                    <ul className="space-y-2">
                        {draft.suggestedReviewers?.map((rev: SuggestedReviewer, idx: number) => (
                            <li key={String(rev.id || idx)} className="text-sm text-lumex-text flex gap-4">
                                <span className="font-bold text-lumex-muted">{idx + 1}.</span>
                                <div>
                                    <span className="font-bold">{rev.name}</span> ({rev.institution})
                                    <div className="text-xs text-lumex-muted mt-0.5 italic">Reason: {rev.reason}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Files */}
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-3 pb-2 border-b border-lumex-border">
                        Uploaded Files
                    </h3>
                    <ul className="space-y-2 text-sm text-lumex-text">
                        {draft.uploadedFiles?.map((file: SubmissionFile) => (
                            <li key={String(file.id || file.name)} className="flex justify-between items-center bg-lumex-card p-2 border border-lumex-border rounded">
                                <span className="truncate max-w-[60%] font-medium">{String(file.name)}</span>
                                <span className="bg-lumex-bg-deep px-2 py-1 rounded text-[10px] font-bold uppercase text-lumex-muted tracking-wide">{String(file.type || '').replace('_', ' ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <div className="bg-lumex-blue/10 border border-lumex-blue/30 p-4 rounded-md mb-8">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <div className="mt-1">
                            <input
                                type="checkbox"
                                {...register('agreedToTerms')}
                                disabled={isSubmitting}
                                className="h-5 w-5 rounded border-lumex-border bg-lumex-bg-white text-lumex-blue focus:ring-lumex-blue"
                            />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-lumex-text block mb-1">Declaration of Authorship & Submission Terms</span>
                            <span className="text-sm text-lumex-muted">
                                By checking this box, I confirm that this manuscript represents original,
                                unpublished work that is not currently under consideration for publication elsewhere.
                                I agree to the <Link to="/terms" className="text-lumex-blue hover:underline">Terms of Service</Link> and
                                <Link to="/privacy-policy" className="text-lumex-blue hover:underline ml-1">Privacy Policy</Link>.
                            </span>
                        </div>
                    </label>
                    {errors.agreedToTerms && (
                        <p className="text-lumex-red text-sm mt-2 ml-8 font-bold">{errors.agreedToTerms.message}</p>
                    )}
                </div>

                {submitError && (
                    <div className="mb-4 rounded-md bg-lumex-red/10 border border-lumex-red/20 px-4 py-3 text-sm text-lumex-red" role="alert">
                        {submitError}
                    </div>
                )}

                <div className="flex justify-between pt-6 border-t border-lumex-border">
                    <Button type="button" variant="outline" size="lg" onClick={prevStep} disabled={isSubmitting}>
                        Back
                    </Button>
                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="min-w-[180px]">
                        {isSubmitting ? 'Submitting…' : 'Submit Manuscript'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
