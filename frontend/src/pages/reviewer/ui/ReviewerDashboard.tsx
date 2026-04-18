import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@shared/ui';
import { getMyAssignments, getMyReviews } from '../../../features/reviewer/api/reviewsApi';
import type { ReviewAssignment, ReviewRecord } from '../../../features/reviewer/api/reviewsApi';

type Tab = 'pending' | 'completed';

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

const RECOMMENDATION_LABELS: Record<string, string> = {
    ACCEPT: 'Accept',
    MINOR_REVISION: 'Minor Revision',
    MAJOR_REVISION: 'Major Revision',
    REJECT: 'Reject',
};

export const ReviewerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('pending');
    const [assignments, setAssignments] = useState<ReviewAssignment[]>([]);
    const [reviews, setReviews] = useState<ReviewRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [assignmentsData, reviewsData] = await Promise.all([
                    getMyAssignments(),
                    getMyReviews(),
                ]);
                setAssignments(assignmentsData);
                setReviews(reviewsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load reviewer data');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center font-semibold text-lumex-red">
                {error}
            </div>
        );
    }

    const pendingAssignments = assignments.filter(a => a.status === 'PENDING' || a.status === 'ACCEPTED');

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
                    <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                        Active Reviews{' '}
                        <span className="ml-1.5 rounded-md bg-lumex-bg-deep px-1.5 py-0.5 text-xs font-normal text-lumex-muted">
                            {pendingAssignments.length}
                        </span>
                    </TabButton>
                    <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                        History{' '}
                        <span className="ml-1.5 rounded-md bg-lumex-bg-deep px-1.5 py-0.5 text-xs font-normal text-lumex-muted">
                            {reviews.length}
                        </span>
                    </TabButton>
                </nav>
            </div>

            {/* Active Reviews Tab */}
            {activeTab === 'pending' && (
                <div className="space-y-5">
                    {pendingAssignments.length === 0 ? (
                        <div className="rounded-xl border border-lumex-border bg-lumex-bg p-12 text-center">
                            <p className="text-lumex-muted italic">No active review assignments at this time.</p>
                        </div>
                    ) : (
                        pendingAssignments.map(assignment => (
                            <div
                                key={assignment.id}
                                className="flex flex-col gap-6 rounded-xl border border-lumex-border bg-lumex-bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="rounded bg-lumex-blue/10 px-2 py-0.5 text-xs font-bold uppercase text-lumex-blue">
                                            {assignment.status}
                                        </span>
                                        {assignment.dueDate && (
                                            <span className="text-sm text-lumex-muted">
                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mb-1 text-lg font-bold leading-snug text-lumex-text">
                                        {assignment.paper.title}
                                    </h3>
                                    <p className="mb-2 line-clamp-2 text-sm text-lumex-muted">
                                        {assignment.paper.abstract}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {assignment.paper.keywords.slice(0, 4).map(kw => (
                                            <span key={kw} className="rounded bg-lumex-bg-deep px-2 py-0.5 text-[0.68rem] font-semibold text-lumex-muted">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex w-full shrink-0 flex-col gap-2 md:w-48">
                                    <Button variant="primary" className="w-full justify-center">
                                        Submit Review
                                    </Button>
                                    <span className="text-center text-xs text-lumex-sub">
                                        Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'completed' && (
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <div className="rounded-xl border border-lumex-border bg-lumex-bg p-12 text-center">
                            <p className="text-lumex-muted italic">No completed reviews yet.</p>
                        </div>
                    ) : (
                        reviews.map(review => (
                            <div
                                key={review.id}
                                className="flex flex-col gap-4 rounded-xl border border-lumex-border bg-lumex-bg p-5 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex-1">
                                    <h3 className="mb-1 font-semibold leading-snug text-lumex-text">
                                        {review.paper.title}
                                    </h3>
                                    <p className="text-sm text-lumex-muted">{review.paper.domain}</p>
                                </div>
                                <div className="shrink-0 text-right text-sm">
                                    <p className="mb-0.5 font-bold text-lumex-text">
                                        {RECOMMENDATION_LABELS[review.recommendation] ?? review.recommendation}
                                    </p>
                                    <p className="text-lumex-muted">Score: {review.score}/10</p>
                                    <p className="mt-1 text-xs text-lumex-sub">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </Container>
    );
};
