import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from '@shared/ui';
import { useAuthStore } from '../../../app/store/useAuthStore';
import { fetchClient } from '../../../shared/api/base';
import { canMakeDecision, getRoleLabel } from '../../../shared/lib/roles';

export const DecisionForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userRole = useAuthStore(state => state.user?.role);
    const hasPermission = canMakeDecision(userRole);
    const [decision, setDecision] = useState<string>('');
    const [letter, setLetter] = useState<string>('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const DECISION_MAP: Record<string, string> = {
        accept: 'ACCEPTED',
        minor: 'REVISION_REQUIRED',
        major: 'REVISION_REQUIRED',
        reject: 'REJECTED',
    };

    const handleSendDecision = async () => {
        if (!decision || !id) return;
        setSending(true);
        setError('');
        try {
            await fetchClient(`/submissions/${id}/decision`, {
                method: 'POST',
                body: JSON.stringify({
                    decision: DECISION_MAP[decision],
                    notes: letter,
                }),
            });
            void navigate('/editor');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send decision.');
        } finally {
            setSending(false);
        }
    };

    if (!hasPermission) {
        return (
            <Container className="py-12 max-w-5xl">
                <div className="flex items-center gap-2 text-lumex-blue mb-4">
                    <button onClick={() => void navigate('/editor')} className="text-sm font-bold hover:underline">← Back to Dashboard</button>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-8 text-center">
                    <h2 className="text-xl font-bold text-orange-500 mb-2">Insufficient Permissions</h2>
                    <p className="text-sm text-orange-400">
                        Your role ({userRole ? getRoleLabel(userRole) : 'Unknown'}) does not have permission to make editorial decisions.
                        Contact the Chief Editor to make a decision on manuscript {id}.
                    </p>
                </div>
            </Container>
        );
    }

    const generateLetter = () => {
        let text = `Dear Author,\n\nThank you for submitting your manuscript "${id}: Quantum Computing in Healthcare" to Lumex. \n\n`;

        if (decision === 'accept') {
            text += `I am pleased to inform you that your manuscript has been accepted for publication in its current form. Our production team will contact you shortly regarding the next steps.`;
        } else if (decision === 'minor') {
            text += `Following the peer-review process, we are interested in publishing your work subject to minor revisions. Please address the reviewers' comments below and resubmit within 14 days.`;
        } else if (decision === 'major') {
            text += `Based on the reviewers' evaluations, we require major revisions before a final decision can be made. The reviewers have raised several significant points that must be addressed in your resubmission.`;
        } else if (decision === 'reject') {
            text += `I regret to inform you that we are unable to accept your manuscript for publication in Lumex at this time. The reviewers' feedback highlights several fundamental concerns that preclude publication.`;
        }

        text += `\n\nReviewer 1 Comments:\n- The methodology section requires more detail on the sampling process.\n- Clarify the implications of Figure 3.\n\nReviewer 2 Comments:\n- Well-written and significant contribution.\n- Address minor typos in the conclusion.\n\nBest regards,\n\nThe Editorial Office\nLumex`;
        setLetter(text);
    };

    return (
        <Container className="py-12 max-w-5xl">
            <div className="flex items-center gap-2 text-lumex-blue mb-4">
                <button onClick={() => void navigate('/editor')} className="text-sm font-bold hover:underline">← Back to Dashboard</button>
            </div>

            <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">Final Editorial Decision</h1>
            <p className="text-lumex-muted mb-8">Review the peer evaluations and finalize the decision for manuscript {id}.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Decision & Letter */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-lumex-card p-6 border border-lumex-border rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4 border-b border-lumex-border pb-2">
                            <h2 className="text-lg font-bold text-lumex-text">1. Decision Recommendation</h2>
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-lumex-blue/10 text-lumex-blue px-2 py-1 rounded flex items-center gap-1.5 border border-lumex-blue/20">
                                ✨ AI Prediction: 85% Accept
                            </span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <select
                                value={decision}
                                onChange={(e) => setDecision(e.target.value)}
                                className="w-full p-3 border border-lumex-border rounded-lg outline-none focus:border-lumex-blue font-bold text-lumex-text bg-lumex-bg-white"
                            >
                                <option value="">Select final decision...</option>
                                <option value="accept">Accept</option>
                                <option value="minor">Minor Revision</option>
                                <option value="major">Major Revision</option>
                                <option value="reject">Reject</option>
                            </select>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-fit border-lumex-blue text-lumex-blue hover:bg-lumex-blue/10"
                                onClick={generateLetter}
                                disabled={!decision}
                            >
                                ✨ Generate AI Editorial Report
                            </Button>
                        </div>
                    </section>

                    <section className="bg-lumex-card p-6 border border-lumex-border rounded-lg shadow-sm">
                        <h2 className="text-lg font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">2. Decision Letter</h2>
                        <textarea
                            value={letter}
                            onChange={(e) => setLetter(e.target.value)}
                            className="w-full h-[500px] p-4 text-sm font-mono border border-lumex-border rounded-lg outline-none focus:border-lumex-blue bg-lumex-bg-white text-lumex-text"
                            placeholder="Final letter to the authors..."
                        />
                    </section>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => void navigate('/editor')}>Save Draft</Button>
                        <Button
                            variant="primary"
                            className="bg-orange-600 border-orange-600 hover:bg-orange-700"
                            onClick={() => void handleSendDecision()}
                            disabled={!decision || sending}
                        >
                            {sending ? 'Sending...' : 'Send Decision to Authors'}
                        </Button>
                    </div>
                </div>

                {/* Right: Reviewer Summaries */}
                <div className="space-y-6">
                    <div className="bg-lumex-blue/10 border border-lumex-blue/20 p-6 rounded-lg sticky top-8">
                        <h3 className="text-sm font-bold text-lumex-blue uppercase tracking-wider mb-4">Reviewer Feedback Summary</h3>

                        <div className="space-y-6">
                            <div className="pb-4 border-b border-lumex-blue/20">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-lumex-text">Reviewer 1</span>
                                    <span className="text-[10px] font-bold uppercase bg-orange-500/15 text-orange-500 px-2 py-0.5 rounded">Major Revision</span>
                                </div>
                                <p className="text-xs text-lumex-muted line-clamp-3">
                                    The submission provides interesting new data but the methodology is lacking core controls...
                                </p>
                                <button className="text-[10px] font-bold text-lumex-blue mt-1 hover:underline">Read Full Review →</button>
                            </div>

                            <div className="pb-4 border-b border-lumex-blue/20">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-lumex-text">Reviewer 2</span>
                                    <span className="text-[10px] font-bold uppercase bg-green-500/15 text-green-500 px-2 py-0.5 rounded">Accept</span>
                                </div>
                                <p className="text-xs text-lumex-muted line-clamp-3">
                                    High quality work with significant implications for urban planning...
                                </p>
                                <button className="text-[10px] font-bold text-lumex-blue mt-1 hover:underline">Read Full Review →</button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-[10px] font-bold text-lumex-muted uppercase mb-2">Metrics Average</h4>
                            <div className="space-y-2 text-lumex-text">
                                <div className="flex justify-between text-xs">
                                    <span>Novelty</span>
                                    <span className="font-bold">4.5 / 5</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span>Methodology</span>
                                    <span className="font-bold text-red-500">2.0 / 5</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span>Clarity</span>
                                    <span className="font-bold">4.0 / 5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};
