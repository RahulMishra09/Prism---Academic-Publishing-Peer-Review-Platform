import React, { useState } from 'react';
import { Container, Button } from '@shared/ui';
import { useUserDashboard } from '../../../features/user';

export const ReviewerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'invitations' | 'pending' | 'completed'>('invitations');

    const { data: dashboardData, isLoading, isError } = useUserDashboard();

    if (isLoading) return (
        <div className="bg-lumex-bg-light min-h-screen py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumex-blue" />
        </div>
    );
    if (isError || !dashboardData) return <div className="p-12 text-center text-red-500 font-bold">Failed to load reviewer data.</div>;

    // Mock invitations since they might not be in the dashboard data yet
    const invitations = [
        { id: 'INV-7721', title: 'Machine Learning Approaches in Climate Modeling', journal: 'Journal of Environmental Science', invitedOn: '2026-03-01', deadline: '2026-03-15' },
    ];

    const pendingReviews = dashboardData.reviews.pending;
    const completedReviews = dashboardData.reviews.completed;

    return (
        <Container className="py-12 min-h-screen">
            <h1 className="text-3xl font-serif font-bold text-lumex-text mb-8">Reviewer Workspace</h1>

            <div className="flex gap-4 border-b border-lumex-border mb-8">
                <button
                    onClick={() => setActiveTab('invitations')}
                    className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'invitations' ? 'text-lumex-blue border-b-2 border-lumex-blue' : 'text-gray-500 hover:text-lumex-text'}`}
                >
                    Invitations ({invitations.length})
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'pending' ? 'text-lumex-blue border-b-2 border-lumex-blue' : 'text-gray-500 hover:text-lumex-text'}`}
                >
                    Active Reviews ({pendingReviews.length})
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'completed' ? 'text-lumex-blue border-b-2 border-lumex-blue' : 'text-gray-500 hover:text-lumex-text'}`}
                >
                    History ({completedReviews.length})
                </button>
            </div>

            {activeTab === 'invitations' && (
                <div className="space-y-6">
                    {invitations.length === 0 ? (
                        <p className="text-gray-500 italic">No new invitations today.</p>
                    ) : (
                        invitations.map(invitation => (
                            <div key={invitation.id} className="p-6 border-l-4 border-lumex-blue bg-blue-50/30 rounded-r-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-lumex-blue text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            New Invitation
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium italic">Sent: {new Date(invitation.invitedOn).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-lumex-text text-lg leading-snug mb-1">{invitation.title}</h3>
                                    <p className="text-sm text-lumex-text-secondary mb-3">{invitation.journal}</p>

                                    <div className="flex items-center gap-6 text-xs font-bold text-lumex-muted">
                                        <div className="flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            Response Due: {new Date(invitation.deadline).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                            ~8,500 words
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                                    <Button variant="primary" className="w-full justify-center">Accept Invitation</Button>
                                    <Button variant="outline" className="w-full justify-center text-red-600 hover:bg-red-50 hover:border-red-200">Decline</Button>
                                    <button className="text-xs text-lumex-blue font-bold hover:underline mt-1">View Abstract</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'pending' && (
                <div className="space-y-6">
                    {pendingReviews.length === 0 ? (
                        <p className="text-gray-500 italic">No pending reviews at this time.</p>
                    ) : (
                        pendingReviews.map(review => (
                            <div key={review.id} className="p-6 border border-lumex-border rounded-lg bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
                                            {review.status}
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium">Due: {review.deadline ? new Date(review.deadline).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <h3 className="font-bold text-lumex-text text-lg leading-snug">{review.title}</h3>
                                    <div className="text-sm text-gray-500 mt-2 flex gap-4">
                                        <span>Journal: {review.journal}</span>
                                        <span>Invited: {review.invitedOn ? new Date(review.invitedOn).toLocaleDateString() : 'N/A'}</span>
                                        <span>ID: {review.id}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                                    <Button variant="primary" className="w-full justify-center">Submit Review</Button>
                                    <Button variant="outline" className="w-full justify-center">View Manuscript</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'completed' && (
                <div className="space-y-6">
                    {completedReviews.map(review => (
                        <div key={review.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-gray-500">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-700 text-lg leading-snug">{review.title}</h3>
                                <div className="text-sm mt-2 flex gap-4">
                                    <span>Journal: {review.journal}</span>
                                    <span>ID: {review.id}</span>
                                </div>
                            </div>
                            <div className="shrink-0 text-sm text-right">
                                <p className="font-bold text-gray-800 mb-1">Recommendation:</p>
                                <p className="italic">{review.decision}</p>
                                <p className="mt-2 text-xs">Completed: {review.completedOn ? new Date(review.completedOn).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
};
