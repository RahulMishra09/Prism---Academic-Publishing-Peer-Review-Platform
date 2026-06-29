import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

export const RevisionForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [rebuttal, setRebuttal] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch submission reviews to show reviewer comments
    const { data: reviews } = useQuery({
        queryKey: ['submissions', id, 'reviews'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Array<{ id: string; commentsToAuthor?: string; recommendation?: string; scores?: Record<string, number> }> }>(
                    `/submissions/${id}/reviews`
                );
                return res.data;
            } catch {
                return null;
            }
        },
        enabled: !!id,
    });

    // Use real reviews if available, otherwise show placeholder
    const reviewerComments = reviews && reviews.length > 0
        ? reviews.map((r, i) => ({
            reviewer: `Reviewer ${i + 1}`,
            comment: r.commentsToAuthor || 'No comments provided.',
            recommendation: r.recommendation,
        }))
        : [
            { reviewer: 'Reviewer 1', comment: 'The methodology section is a bit thin. Please provide more details on the control group.', recommendation: 'MAJOR_REVISION' },
            { reviewer: 'Reviewer 2', comment: 'The results are compelling, but Figure 2 is difficult to read. Suggest increasing contrast.', recommendation: 'MINOR_REVISION' },
        ];

    const handleSubmitRevision = async () => {
        if (!rebuttal.trim()) {
            setError('Please provide a response to the reviewers.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await fetchClient(`/submissions/${id}/revision`, {
                method: 'POST',
                body: JSON.stringify({ rebuttalLetter: rebuttal }),
            });
            void navigate('/account');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit revision. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="py-12 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Submit Revision</h1>
                <p className="text-lumex-text-secondary">Manuscript ID: {id}</p>
            </div>

            <div className="space-y-10">
                {/* Reviewer Comments Section */}
                <section className="bg-amber-50/30 border border-amber-100 p-6 rounded-lg">
                    <h2 className="text-lg font-bold text-lumex-text mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        Reviewer Feedback
                    </h2>
                    <div className="space-y-6">
                        {reviewerComments.map((rc) => (
                            <div key={rc.reviewer} className="bg-lumex-bg-white p-4 rounded border border-lumex-border shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold text-lumex-text">{rc.reviewer}</p>
                                    {rc.recommendation && (
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-lumex-bg-deep text-lumex-muted">
                                            {rc.recommendation.replace(/_/g, ' ')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-lumex-text-secondary italic">"{rc.comment}"</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Rebuttal Section */}
                <section>
                    <h2 className="text-lg font-bold text-lumex-text mb-4 border-b pb-2">1. Response to Reviewers (Rebuttal)</h2>
                    <p className="text-sm text-gray-500 mb-3">
                        Please provide a point-by-point response to the reviewers' comments. This is essential for the re-evaluation of your manuscript.
                    </p>
                    <textarea
                        value={rebuttal}
                        onChange={(e) => setRebuttal(e.target.value)}
                        className="w-full p-4 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue min-h-[300px] text-sm font-sans"
                        placeholder="Type your response here..."
                        required
                    />
                </section>

                {/* Revised File Upload */}
                <section>
                    <h2 className="text-lg font-bold text-lumex-text mb-4 border-b pb-2">2. Upload Revised Manuscript</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Ensure all changes are highlighted or tracked if requested by the editor.
                    </p>
                    <div className="border-2 border-dashed border-lumex-border rounded-lg p-10 text-center hover:border-lumex-blue transition-colors bg-lumex-bg-deep/50">
                        <input type="file" className="hidden" id="revision-upload" />
                        <label htmlFor="revision-upload" className="cursor-pointer group">
                            <div className="bg-lumex-bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-blue"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            </div>
                            <span className="text-sm font-bold text-lumex-text block mb-1">Click to upload revised file</span>
                            <span className="text-xs text-gray-400">Word or PDF (max 20MB)</span>
                        </label>
                    </div>
                </section>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="pt-6 border-t border-lumex-border flex justify-end gap-4">
                    <Button variant="outline" onClick={() => void navigate('/account')}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={() => void handleSubmitRevision()}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Revised Manuscript'}
                    </Button>
                </div>
            </div>
        </Container>
    );
};
