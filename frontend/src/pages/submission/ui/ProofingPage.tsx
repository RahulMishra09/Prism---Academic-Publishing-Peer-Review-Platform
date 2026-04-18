import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from '@shared/ui';

export const ProofingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [_approved, setApproved] = useState(false);
    const [comments, setComments] = useState('');

    const handleApprove = () => {
        setApproved(true);
        alert('Proof approved successfully! Your manuscript will now move to the final publication stage.');
        void navigate('/account');
    };

    return (
        <Container className="py-12 max-w-5xl">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-lumex-blue mb-4">
                    <button onClick={() => void navigate('/account')} className="text-sm font-bold hover:underline">← Back to Dashboard</button>
                </div>
                <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Review Gallery Proof</h1>
                <p className="text-lumex-text-secondary italic">Manuscript ID: {id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Proof Viewer */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg aspect-[1/1.414] flex flex-col items-center justify-center p-12 text-center shadow-inner overflow-hidden relative group">
                        <div className="absolute inset-0 bg-lumex-bg-white m-8 shadow-lg flex flex-col p-12 text-left font-serif transform group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="border-b-2 border-lumex-text pb-4 mb-6">
                                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-lumex-blue">Lumex Scientific Publishing</p>
                                <h1 className="text-xl font-bold mt-2 leading-tight">Quantum Computing in Healthcare: Opportunities and Challenges</h1>
                                <p className="text-xs mt-2 font-sans italic">Jane Doe, John Smith, Elena Rodriguez</p>
                            </div>

                            <div className="space-y-4 text-xs leading-relaxed text-justify">
                                <p><span className="font-bold">Abstract:</span> The integration of quantum computing into healthcare systems presents a paradigm shift in data processing and personalized medicine...</p>
                                <p className="font-bold mt-4">1. Introduction</p>
                                <p>Progress in quantum hardware has reached a critical threshold where practical applications in drug discovery and genomic analysis are becoming feasible...</p>
                                <div className="w-full h-32 bg-lumex-bg-deep border border-dashed border-lumex-border flex items-center justify-center my-4">
                                    <p className="text-[10px] text-lumex-sub font-sans italic">[Figure 1: Comparison of Classical vs Quantum Search Algorithms]</p>
                                </div>
                                <p>Furthermore, the ethical implications of quantum-enhanced encryption must be addressed as healthcare data becomes increasingly centralized...</p>
                            </div>

                            <div className="absolute bottom-8 right-12 text-[8px] font-sans text-lumex-sub">
                                Page 1 of 14 · Lumex-ID: {id}
                            </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-4 flex justify-center">
                            <span className="bg-black/60 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">Simulated Typeset Proof · Click to zoom</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions and Comments */}
                <div className="space-y-6">
                    <section className="bg-white p-6 border border-lumex-border rounded-lg shadow-sm">
                        <h2 className="text-lg font-bold text-lumex-text mb-4 border-b pb-2">Production Status</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-lumex-blue">Awaiting Author Approval</span>
                        </div>
                        <p className="text-xs text-lumex-text-secondary leading-relaxed">
                            Please review the typeset proof carefully. Check author names, affiliations, figures, and formatting.
                        </p>
                    </section>

                    <section className="bg-white p-6 border border-lumex-border rounded-lg shadow-sm">
                        <h2 className="text-lg font-bold text-lumex-text mb-4 border-b pb-2">Corrections & Feedback</h2>
                        <textarea
                            className="w-full h-40 p-3 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue mb-4"
                            placeholder="If you have minor corrections, please list them here (e.g., 'Typo in Table 2, row 3')..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                className="w-full bg-green-600 border-green-600 hover:bg-green-700"
                                onClick={handleApprove}
                            >
                                Approve for Publication
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled={!comments}
                                onClick={() => {
                                    alert('Corrections submitted to the production team.');
                                    void navigate('/account');
                                }}
                            >
                                Request Minor Corrections
                            </Button>
                        </div>
                    </section>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <h3 className="text-xs font-bold text-lumex-blue uppercase mb-2">Important Note</h3>
                        <p className="text-[10px] text-lumex-text-secondary leading-relaxed">
                            Once approved, no further changes can be made to the manuscript content. Publication usually occurs within 7-10 business days of proof approval.
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
};
