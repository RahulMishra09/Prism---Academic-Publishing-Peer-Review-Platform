import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from '@shared/ui';
import { submitReview } from '../../../features/reviewer/api/reviewsApi';
import type { SubmitReviewPayload } from '../../../features/reviewer/api/reviewsApi';

const RECOMMENDATION_OPTIONS: { value: SubmitReviewPayload['recommendation']; label: string }[] = [
    { value: 'ACCEPT', label: 'Accept without changes' },
    { value: 'MINOR_REVISION', label: 'Accept with minor revisions' },
    { value: 'MAJOR_REVISION', label: 'Major revisions required' },
    { value: 'REJECT', label: 'Reject' },
];

export const ReviewForm: React.FC = () => {
    const { id: assignmentId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        strengths: '',
        weaknesses: '',
        score: '' as string,
        recommendation: '' as SubmitReviewPayload['recommendation'] | '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.strengths || !form.weaknesses || !form.score || !form.recommendation) {
            setError('Please fill in all required fields.');
            return;
        }
        if (!assignmentId) {
            setError('Invalid assignment ID.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await submitReview(assignmentId, {
                strengths: form.strengths,
                weaknesses: form.weaknesses,
                score: parseInt(form.score, 10),
                recommendation: form.recommendation as SubmitReviewPayload['recommendation'],
            });
            void navigate('/reviewer');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="py-12 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Submit Review</h1>
            <p className="text-lumex-muted mb-8">Assignment ID: {assignmentId}</p>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8 bg-lumex-bg-white p-8 border border-lumex-border rounded-xl shadow-sm">

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        1. Strengths *
                    </h2>
                    <textarea
                        className="w-full p-4 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue focus:ring-2 focus:ring-lumex-blue/20 min-h-[180px] text-sm bg-lumex-bg-white transition"
                        placeholder="Describe the key strengths of this manuscript..."
                        required
                        value={form.strengths}
                        onChange={e => setForm(f => ({ ...f, strengths: e.target.value }))}
                    />
                </section>

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        2. Weaknesses *
                    </h2>
                    <textarea
                        className="w-full p-4 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue focus:ring-2 focus:ring-lumex-blue/20 min-h-[180px] text-sm bg-lumex-bg-white transition"
                        placeholder="Describe the weaknesses and areas for improvement..."
                        required
                        value={form.weaknesses}
                        onChange={e => setForm(f => ({ ...f, weaknesses: e.target.value }))}
                    />
                </section>

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        3. Overall Score (1–10) *
                    </h2>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        className="w-32 px-4 py-2.5 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue focus:ring-2 focus:ring-lumex-blue/20 text-sm bg-lumex-bg-white"
                        placeholder="1–10"
                        required
                        value={form.score}
                        onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                    />
                </section>

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        4. Recommendation *
                    </h2>
                    <select
                        className="w-full p-3 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue focus:ring-2 focus:ring-lumex-blue/20 font-semibold text-lumex-text bg-lumex-bg-white"
                        required
                        value={form.recommendation}
                        onChange={e => setForm(f => ({ ...f, recommendation: e.target.value as SubmitReviewPayload['recommendation'] }))}
                    >
                        <option value="">Select a recommendation...</option>
                        {RECOMMENDATION_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </section>

                {error && (
                    <div className="rounded-md bg-lumex-red/10 border border-lumex-red/20 px-4 py-3 text-sm text-lumex-red" role="alert">
                        {error}
                    </div>
                )}

                <div className="pt-6 border-t border-lumex-border flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => void navigate('/reviewer')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting…' : 'Submit Review'}
                    </Button>
                </div>
            </form>
        </Container>
    );
};
