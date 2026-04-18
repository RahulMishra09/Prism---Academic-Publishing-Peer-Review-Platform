import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from '@shared/ui';

export const ReviewForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            alert('Review submitted successfully! Thank you for your contribution.');
            void navigate('/reviewer');
        }, 1500);
    };

    return (
        <Container className="py-12 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Submit Review</h1>
            <p className="text-gray-500 mb-8">Manuscript ID: {id}</p>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-lumex-border rounded-lg shadow-sm">

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        1. Structured Scorecard
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Please evaluate the manuscript based on the following professional criteria (1 = Poor, 5 = Excellent).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Originality and Novelty',
                            'Methodological Rigor',
                            'Data Quality and Analysis',
                            'Clarity of Writing',
                            'Significance to the Field',
                            'Quality of Figures/Tables',
                            'Adequacy of References',
                            'Compliance with Ethics',
                        ].map((criteria) => (
                            <div key={criteria} className="flex justify-between items-center p-3 border border-lumex-border rounded-lg bg-gray-50/50">
                                <span className="text-sm font-medium text-lumex-text">{criteria}</span>
                                <select className="p-1 border border-lumex-border rounded bg-white text-sm" required>
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
                                className="w-full p-4 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue min-h-[250px] text-sm"
                                placeholder="Start typing your evaluation here..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-lumex-text mb-2">Confidential Remarks to Editor (Optional)</label>
                            <textarea
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
                    <select className="w-full p-3 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue font-bold text-lumex-text" required>
                        <option value="">Select a recommendation...</option>
                        <option value="accept">Accept without changes</option>
                        <option value="minor">Accept with minor revisions</option>
                        <option value="major">Major revisions required</option>
                        <option value="reject">Reject</option>
                    </select>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-lumex-text border-b border-lumex-border pb-2 mb-4">
                        4. Annotated Manuscript (Optional)
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        If you have made comments directly on the PDF/Word file, you may upload the annotated version here.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50">
                        <input type="file" className="hidden" id="review-upload" />
                        <label htmlFor="review-upload" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="text-sm font-bold text-lumex-blue">Upload Annotated Manuscript</span>
                            <span className="text-xs text-gray-400 block mt-1">PDF, DOCX up to 10MB</span>
                        </label>
                    </div>
                </section>

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
