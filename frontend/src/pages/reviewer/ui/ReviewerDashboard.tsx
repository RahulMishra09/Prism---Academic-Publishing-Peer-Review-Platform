import React, { useState } from 'react';
import { Container, Button, Spinner } from '@shared/ui';
import { useUserDashboard } from '../../../features/user';

type Tab = 'invitations' | 'pending' | 'completed';

const MOCK_INVITATIONS = [
    {
        id: 'INV-7721',
        title: 'Machine Learning Approaches in Climate Modeling',
        journal: 'Journal of Environmental Science',
        invitedOn: '2026-03-01',
        deadline: '2026-03-15',
    },
];

const TabButton = ({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        onClick={onClick}
        className={[
            'relative whitespace-nowrap px-3 py-3 text-[0.82rem] font-semibold transition-colors',
            'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-t-full after:transition-all',
            active
                ? 'text-lumex-blue after:bg-lumex-blue'
                : 'text-lumex-muted after:bg-transparent hover:text-lumex-text',
        ].join(' ')}
    >
        {children}
    </button>
);

export const ReviewerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('invitations');
    const { data: dashboardData, isLoading, isError } = useUserDashboard();

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError || !dashboardData) {
        return (
            <div className="p-12 text-center font-semibold text-lumex-red">
                Failed to load reviewer data.
            </div>
        );
    }

    const invitations = MOCK_INVITATIONS;
    const pendingReviews = dashboardData.reviews.pending;
    const completedReviews = dashboardData.reviews.completed;

    return (
        <Container className="min-h-screen py-10">
            <div className="mb-8">
                <p className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-lumex-blue">
                    Reviewer
                </p>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-lumex-text">
                    Reviewer Workspace
                </h1>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-lumex-border">
                <nav className="flex gap-1">
                    <TabButton active={activeTab === 'invitations'} onClick={() => setActiveTab('invitations')}>
                        Invitations{' '}
                        <span className="ml-1.5 rounded-md bg-lumex-bg-deep px-1.5 py-0.5 text-xs font-normal text-lumex-muted">
                            {invitations.length}
                        </span>
                    </TabButton>
                    <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                        Active Reviews{' '}
                        <span className="ml-1.5 rounded-md bg-lumex-bg-deep px-1.5 py-0.5 text-xs font-normal text-lumex-muted">
                            {pendingReviews.length}
                        </span>
                    </TabButton>
                    <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                        History{' '}
                        <span className="ml-1.5 rounded-md bg-lumex-bg-deep px-1.5 py-0.5 text-xs font-normal text-lumex-muted">
                            {completedReviews.length}
                        </span>
                    </TabButton>
                </nav>
            </div>

            {/* Invitations Tab */}
            {activeTab === 'invitations' && (
                <div className="space-y-5">
                    {invitations.length === 0 ? (
                        <p className="italic text-lumex-muted">No new invitations today.</p>
                    ) : (
                        invitations.map(inv => (
                            <div
                                key={inv.id}
                                className="flex flex-col gap-6 rounded-xl border-l-4 border-lumex-blue bg-lumex-blue/[0.04] p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-2.5">
                                        <span className="rounded bg-lumex-blue px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-white">
                                            New Invitation
                                        </span>
                                        <span className="text-xs italic text-lumex-muted">
                                            Sent: {new Date(inv.invitedOn).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="mb-1 text-lg font-bold leading-snug text-lumex-text">
                                        {inv.title}
                                    </h3>
                                    <p className="mb-3 text-sm text-lumex-muted">{inv.journal}</p>
                                    <div className="flex flex-wrap gap-5 text-xs font-semibold text-lumex-muted">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            Response due: {new Date(inv.deadline).toLocaleDateString()}
                                        </span>
                                        <span>~8,500 words</span>
                                    </div>
                                </div>
                                <div className="flex w-full shrink-0 flex-col gap-2 md:w-auto">
                                    <Button variant="primary" className="w-full justify-center">
                                        Accept Invitation
                                    </Button>
                                    <Button variant="outline" className="w-full justify-center text-lumex-red hover:border-lumex-red/30 hover:bg-lumex-red/5">
                                        Decline
                                    </Button>
                                    <button className="mt-0.5 text-xs font-semibold text-lumex-blue hover:underline">
                                        View Abstract
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Active Reviews Tab */}
            {activeTab === 'pending' && (
                <div className="space-y-5">
                    {pendingReviews.length === 0 ? (
                        <p className="italic text-lumex-muted">No pending reviews at this time.</p>
                    ) : (
                        pendingReviews.map(review => (
                            <div
                                key={review.id}
                                className="flex flex-col gap-6 rounded-xl border border-lumex-border bg-lumex-bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="rounded bg-lumex-red/10 px-2 py-0.5 text-xs font-bold uppercase text-lumex-red">
                                            {review.status}
                                        </span>
                                        <span className="text-sm text-lumex-muted">
                                            Due: {review.deadline ? new Date(review.deadline).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <h3 className="mb-1 text-lg font-bold leading-snug text-lumex-text">
                                        {review.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-lumex-muted">
                                        <span>Journal: {review.journal}</span>
                                        <span>
                                            Invited:{' '}
                                            {review.invitedOn
                                                ? new Date(review.invitedOn).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                        <span className="text-xs text-lumex-sub">ID: {review.id}</span>
                                    </div>
                                </div>
                                <div className="flex w-full shrink-0 flex-col gap-2 md:w-auto">
                                    <Button variant="primary" className="w-full justify-center">
                                        Submit Review
                                    </Button>
                                    <Button variant="outline" className="w-full justify-center">
                                        View Manuscript
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'completed' && (
                <div className="space-y-4">
                    {completedReviews.map(review => (
                        <div
                            key={review.id}
                            className="flex flex-col gap-4 rounded-xl border border-lumex-border bg-lumex-bg-deep/40 p-5 md:flex-row md:items-center md:justify-between"
                        >
                            <div className="flex-1">
                                <h3 className="mb-1 font-semibold leading-snug text-lumex-text">
                                    {review.title}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-lumex-muted">
                                    <span>Journal: {review.journal}</span>
                                    <span className="text-xs text-lumex-sub">ID: {review.id}</span>
                                </div>
                            </div>
                            <div className="shrink-0 text-right text-sm">
                                <p className="mb-0.5 font-semibold text-lumex-text">Recommendation:</p>
                                <p className="italic text-lumex-muted">{review.decision}</p>
                                <p className="mt-1.5 text-xs text-lumex-sub">
                                    Completed:{' '}
                                    {review.completedOn
                                        ? new Date(review.completedOn).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
};
