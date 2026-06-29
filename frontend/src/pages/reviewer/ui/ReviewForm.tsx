import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

interface ReviewSubmission {
    id: string;
    title: string;
    abstract?: string;
    keywords?: string[];
    journalSlug?: string;
    submittedAt?: string;
    coAuthors?: Array<{ firstName: string; lastName: string; affiliation?: string }>;
    files?: Array<{ id: string; fileName: string; fileType: string; mimeType: string; fileSize: number }>;
    reviewerAssignment?: { status: string; dueDate?: string; assignedAt?: string };
}

export const ReviewForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { data: submission, isLoading: subLoading } = useQuery({
        queryKey: ['submissionForReview', id],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: ReviewSubmission }>(`/submissions/${id}/review`);
                return res.data;
            } catch {
                return null;
            }
        },
        enabled: !!id,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        const scores: Record<string, number> = {};
        const criteria = [
            'originality', 'methodology', 'dataQuality', 'clarity',
            'significance', 'figuresQuality', 'references', 'ethics',
        ];
        for (const c of criteria) {
            const val = formData.get(c);
            if (val) scores[c] = Number(val);
        }

        try {
            await fetchClient(`/submissions/${id}/review`, {
                method: 'POST',
                body: JSON.stringify({
                    recommendation: formData.get('recommendation'),
                    commentsForAuthor: formData.get('commentsToAuthor'),
                    commentsForEditor: formData.get('confidentialComments') || formData.get('commentsToAuthor'),
                    scoreOriginality: scores.originality,
                    scoreMethodology: scores.methodology,
                    scoreClarity: scores.clarity,
                    scoreSignificance: scores.significance,
                }),
            });
            void navigate('/reviewer');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadFile = async (fileId: string, fileName: string) => {
        try {
            const res = await fetchClient<{ data: { url: string } }>(`/submissions/${id}/files/${fileId}/download`);
            window.open(res.data.url, '_blank');
        } catch {
            alert(`Failed to download ${fileName}`);
        }
    };

    if (subLoading) {
        return (
            <Container className="py-12 max-w-4xl">
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lumex-blue" />
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-12 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Submit Review</h1>
            <p className="text-gray-500 mb-8">Manuscript ID: {id}</p>

            {/* Submission Details */}
            {submission && (
                <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-bold text-lumex-text mb-4">Manuscript Details</h2>
                    <h3 className="text-xl font-serif font-bold text-lumex-text mb-2">{submission.title}</h3>
                    {submission.abstract && (
                        <p className="text-sm text-lumex-text-secondary leading-relaxed mb-4 whitespace-pre-line">{submission.abstract}</p>
                    )}
                    {submission.keywords && submission.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {submission.keywords.map((kw, i) => (
                                <span key={i} className="text-xs bg-lumex-card border border-lumex-border px-2 py-0.5 rounded-full text-lumex-text">{kw}</span>
                            ))}
                        </div>
                    )}
                    {submission.coAuthors && submission.coAuthors.length > 0 && (
                        <p className="text-sm text-lumex-muted mb-4">
                            Authors: {submission.coAuthors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                        </p>
                    )}
                    {submission.reviewerAssignment?.dueDate && (
                        <p className="text-sm text-orange-600 font-medium">
                            Review due: {new Date(submission.reviewerAssignment.dueDate).toLocaleDateString()}
                        </p>
                    )}
                    {submission.files && submission.files.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-lumex-border">
                            <h4 className="text-sm font-bold text-lumex-text mb-2">Manuscript Files</h4>
                            <div className="space-y-2">
                                {submission.files.map(file => (
                                    <div key={file.id} className="flex items-center justify-between bg-lumex-card border border-lumex-border rounded px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lumex-text font-medium truncate">{file.fileName}</span>
                                            <span className="text-[10px] uppercase font-bold text-lumex-sub bg-lumex-bg-deep px-1.5 py-0.5 rounded">{file.fileType}</span>
                                        </div>
                                        <button onClick={() => void handleDownloadFile(file.id, file.fileName)} className="text-lumex-blue hover:underline text-xs font-bold">
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8 bg-white p-8 border border-lumex-border rounded-lg shadow-sm">

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        1. Structured Scorecard
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Please evaluate the manuscript based on the following professional criteria (1 = Poor, 5 = Excellent).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Originality and Novelty', name: 'originality' },
                            { label: 'Methodological Rigor', name: 'methodology' },
                            { label: 'Data Quality and Analysis', name: 'dataQuality' },
                            { label: 'Clarity of Writing', name: 'clarity' },
                            { label: 'Significance to the Field', name: 'significance' },
                            { label: 'Quality of Figures/Tables', name: 'figuresQuality' },
                            { label: 'Adequacy of References', name: 'references' },
                            { label: 'Compliance with Ethics', name: 'ethics' },
                        ].map((criteria) => (
                            <div key={criteria.name} className="flex justify-between items-center p-3 border border-lumex-border rounded-lg bg-gray-50/50">
                                <span className="text-sm font-medium text-lumex-text">{criteria.label}</span>
                                <select name={criteria.name} className="p-1 border border-lumex-border rounded bg-white text-sm" required>
                                    <option value="">--</option>
                                    <option value="5">5</option>
                                    <option value="4">4</option>
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        2. Detailed Evaluation
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-lumex-text mb-2">Comments to Authors *</label>
                            <p className="text-xs text-gray-500 mb-2">
                                Provide specific, constructive feedback. These comments will be shared with the authors.
                            </p>
                            <textarea
                                name="commentsToAuthor"
                                className="w-full p-4 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue min-h-[250px] text-sm"
                                placeholder="Start typing your evaluation here..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-lumex-text mb-2">Confidential Remarks to Editor (Optional)</label>
                            <textarea
                                name="confidentialComments"
                                className="w-full p-4 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue min-h-[120px] text-sm bg-gray-50/30"
                                placeholder="Confidential comments for the editorial board..."
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        3. Recommendation *
                    </h2>
                    <select name="recommendation" className="w-full p-3 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue font-bold text-lumex-text" required>
                        <option value="">Select a recommendation...</option>
                        <option value="ACCEPT">Accept without changes</option>
                        <option value="MINOR_REVISION">Accept with minor revisions</option>
                        <option value="MAJOR_REVISION">Major revisions required</option>
                        <option value="REJECT">Reject</option>
                    </select>
                </section>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="pt-6 border-t border-lumex-border flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => void navigate('/reviewer')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </div>
            </form>
        </Container>
    );
};
