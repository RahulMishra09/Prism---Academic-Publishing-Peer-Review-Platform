import React from 'react';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { StatusTimeline } from '../../submission/ui/StatusTimeline';
import type { UserSubmission } from '../api/useUserDashboard';

export interface SubmissionsPanelProps {
    pastSubmissions?: UserSubmission[];
}

export const SubmissionsPanel: React.FC<SubmissionsPanelProps> = ({ pastSubmissions = [] }) => {
    const { draft, currentStep } = useSubmissionStore();

    return (
        <div className="space-y-8">
            {/* Current Draft */}
            <section>
                <h3 className="text-lg font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">
                    Current Draft
                </h3>
                {!draft || !draft.manuscriptType ? (
                    <div className="bg-gray-50 border border-lumex-border rounded p-6 text-center text-gray-500">
                        <p>You have no active submission drafts.</p>
                        <a href="/journals" className="text-lumex-blue hover:underline mt-2 inline-block font-medium">
                            Find a journal to submit to
                        </a>
                    </div>
                ) : (
                    <div className="bg-lumex-bg-deep border hover:border-lumex-blue transition-colors border-lumex-border rounded-lg p-5">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-lumex-text text-lg">
                                    {draft.title || 'Untitled Manuscript'}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    {draft.manuscriptType || 'Unspecified Type'} · Step {currentStep} of {currentStep > 5 ? 6 : 5}
                                </p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                                Draft
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                            {draft.abstract || 'No abstract provided.'}
                        </p>
                        <div className="mt-4 pt-4 border-t border-lumex-border flex justify-end">
                            <a href={`/journal/nature/submit`} className="text-sm font-bold text-lumex-blue hover:underline flex items-center gap-1">
                                Continue Submission
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>
                )}
            </section>

            {/* Past Submissions */}
            <section>
                <h3 className="text-lg font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">
                    Submission History
                </h3>
                <div className="space-y-6">
                    {pastSubmissions.map((sub) => {
                        let statusColor = 'bg-gray-100 text-gray-800';
                        if (sub.status === 'Accepted' || sub.status === 'Published') statusColor = 'bg-green-100 text-green-800';
                        else if (sub.status === 'Under Review') statusColor = 'bg-blue-100 text-lumex-blue';
                        else if (sub.status === 'Revision Required') statusColor = 'bg-orange-100 text-orange-800';
                        else if (sub.status === 'Proofing') statusColor = 'bg-purple-100 text-purple-800';

                        return (
                        <div key={sub.id} className="bg-lumex-card border border-lumex-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
                                <div className="flex-1">
                                    <h4 className="font-bold text-lumex-text">{sub.title}</h4>
                                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                                        <span>{sub.journal}</span>
                                        <span>·</span>
                                        <span>ID: {sub.id}</span>
                                        <span>·</span>
                                        <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-4">
                                    {sub.status === 'Revision Required' && (
                                        <a
                                            href={`/submit-revision/${sub.id}`}
                                            className="text-xs font-bold text-lumex-blue hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                                        >
                                            Submit Revision
                                        </a>
                                    )}
                                    {sub.status === 'Accepted' && (
                                        <a
                                            href={`/checkout-apc/${sub.id}`}
                                            className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg border border-green-700 shadow-sm"
                                        >
                                            Pay APC Fee
                                        </a>
                                    )}
                                    {sub.status === 'Proofing' && (
                                        <a
                                            href={`/submit-proofing/${sub.id}`}
                                            className="text-xs font-bold text-lumex-blue hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                                        >
                                            Review Proof
                                        </a>
                                    )}
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
                                        {sub.status}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Manuscript Progress</p>
                                <StatusTimeline currentStatus={sub.status} submittedAt={sub.submittedAt} />
                            </div>
                        </div>
                    )})}
                </div>
            </section>
        </div>
    );
};
