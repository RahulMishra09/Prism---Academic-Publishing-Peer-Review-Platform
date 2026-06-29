import React, { useState } from 'react';
import { Container, Button } from '@shared/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../../../shared/api/base';
import { useUserDashboard } from '../../../features/user';

interface ReviewAssignment {
    id: string;
    submissionId: string;
    title: string;
    journal: string;
    status: string;
    deadline?: string;
    invitedOn?: string;
    completedOn?: string;
    decision?: string;
}

interface ReviewerDashboardData {
    invitations: ReviewAssignment[];
    active: ReviewAssignment[];
    completed: ReviewAssignment[];
}

export const ReviewerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'invitations' | 'pending' | 'completed'>('invitations');

    // Try real backend first, fall back to dashboard mock data
    const { data: reviewerData, isLoading: reviewerLoading } = useQuery({
        queryKey: ['reviewer', 'dashboard'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: ReviewerDashboardData }>('/submissions/reviewer/dashboard');
                return res.data;
            } catch {
                return null;
            }
        },
    });

    const { data: dashboardData, isLoading: dashLoading } = useUserDashboard();

    const isLoading = reviewerLoading || dashLoading;

    if (isLoading) return (
        <div className="bg-lumex-bg min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 space-y-6">
                <div className="h-8 w-64 bg-lumex-bg-deep rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-lumex-card border border-lumex-border rounded-xl animate-pulse" />)}
                </div>
                <div className="bg-lumex-card border border-lumex-border rounded-xl p-6 space-y-4">
                    <div className="h-5 w-40 bg-lumex-bg-deep rounded animate-pulse" />
                    {[1,2,3].map(i => <div key={i} className="h-20 w-full bg-lumex-bg-deep rounded animate-pulse" />)}
                </div>
            </div>
        </div>
    );

    // Use real reviewer data if available, otherwise fall back to dashboard mock
    const invitations = reviewerData?.invitations ?? [];
    const pendingReviews = reviewerData?.active ?? dashboardData?.reviews.pending ?? [];
    const completedReviews = reviewerData?.completed ?? dashboardData?.reviews.completed ?? [];

    return (
        <Container className="py-12 min-h-screen">
            <h1 className="text-3xl font-serif font-bold text-lumex-text mb-8">Reviewer Workspace</h1>

            <div className="flex gap-4 border-b border-lumex-border mb-8">
                <button
                    onClick={() => setActiveTab('invitations')}
                    className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'invitations' ? 'text-lumex-blue border-b-2 border-lumex-blue' : 'text-lumex-sub hover:text-lumex-text'}`}
                >
                    Invitations ({invitations.length})
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'pending' ? 'text-lumex-blue border-b-2 border-lumex-blue' : 'text-lumex-sub hover:text-lumex-text'}`}
                >
                    Active Reviews ({pendingReviews.length})
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`pb-3 px-2 font-bold transition-colors ${activeTab === 'completed' ? 'text-lumex-blue border-b-2 border-lumex-blue' : 'text-lumex-sub hover:text-lumex-text'}`}
                >
                    History ({completedReviews.length})
                </button>
            </div>

            {activeTab === 'invitations' && (
                <div className="space-y-6">
                    {invitations.length === 0 ? (
                        <p className="text-lumex-sub italic">No new invitations today.</p>
                    ) : (
                        invitations.map(invitation => (
                            <div key={invitation.id} className="p-6 border-l-4 border-lumex-blue bg-lumex-blue/5 rounded-r-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-lumex-blue text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            New Invitation
                                        </span>
                                        <span className="text-sm text-lumex-sub font-medium italic">Sent: {invitation.invitedOn ? new Date(invitation.invitedOn).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <h3 className="font-bold text-lumex-text text-lg leading-snug mb-1">{invitation.title}</h3>
                                    <p className="text-sm text-lumex-muted mb-3">{invitation.journal}</p>
                                    {invitation.deadline && (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-lumex-muted">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            Response Due: {new Date(invitation.deadline).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                                    <Button variant="primary" className="w-full justify-center"
                                        onClick={() => {
                                            void fetchClient(`/submissions/${invitation.submissionId}/review-status`, {
                                                method: 'POST',
                                                body: JSON.stringify({ status: 'ACCEPTED' }),
                                            });
                                        }}
                                    >Accept Invitation</Button>
                                    <Button variant="outline" className="w-full justify-center text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                                        onClick={() => {
                                            void fetchClient(`/submissions/${invitation.submissionId}/review-status`, {
                                                method: 'POST',
                                                body: JSON.stringify({ status: 'DECLINED' }),
                                            });
                                        }}
                                    >Decline</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'pending' && (
                <div className="space-y-6">
                    {pendingReviews.length === 0 ? (
                        <p className="text-lumex-sub italic">No pending reviews at this time.</p>
                    ) : (
                        pendingReviews.map(review => (
                            <div key={review.id} className="p-6 border border-lumex-border rounded-lg bg-lumex-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-red-500/15 text-red-500 text-xs font-bold px-2 py-0.5 rounded uppercase">
                                            {review.status}
                                        </span>
                                        <span className="text-sm text-lumex-sub font-medium">Due: {review.deadline ? new Date(review.deadline).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <h3 className="font-bold text-lumex-text text-lg leading-snug">{review.title}</h3>
                                    <div className="text-sm text-lumex-muted mt-2 flex gap-4">
                                        <span>Journal: {review.journal}</span>
                                        <span>ID: {review.id}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                                    <Button variant="primary" className="w-full justify-center"
                                        onClick={() => { window.location.href = `/reviewer/${review.submissionId || review.id}/review`; }}
                                    >Submit Review</Button>
                                    <Button variant="outline" className="w-full justify-center">View Manuscript</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'completed' && (
                <div className="space-y-6">
                    {completedReviews.length === 0 ? (
                        <p className="text-lumex-sub italic">No completed reviews yet.</p>
                    ) : (
                        completedReviews.map(review => (
                            <div key={review.id} className="p-6 border border-lumex-border rounded-lg bg-lumex-bg-deep flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-lumex-sub">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lumex-text text-lg leading-snug">{review.title}</h3>
                                    <div className="text-sm mt-2 flex gap-4">
                                        <span>Journal: {review.journal}</span>
                                        <span>ID: {review.id}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 text-sm text-right">
                                    <p className="font-bold text-lumex-text mb-1">Recommendation:</p>
                                    <p className="italic text-lumex-muted">{review.decision}</p>
                                    <p className="mt-2 text-xs text-lumex-sub">Completed: {review.completedOn ? new Date(review.completedOn).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </Container>
    );
};
