import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Skeleton, Modal, ModalContent, ModalTitle } from '@shared/ui';
import { useSpecialIssues, useDeleteSpecialIssue, useUpdateSpecialIssue } from '../../../entities/journal/api/journalAdminQueries';
import type { SpecialIssue, SpecialIssueStatus } from '../../../entities/journal/model/types';

const STATUS_CONFIG: Record<SpecialIssueStatus, { label: string; color: string; nextStatus?: SpecialIssueStatus; nextLabel?: string }> = {
    'call-for-papers': {
        label: 'Call for Papers',
        color: 'bg-lumex-blue/15 text-lumex-blue border border-lumex-blue/30',
        nextStatus: 'submissions-closed',
        nextLabel: 'Close Submissions',
    },
    'submissions-closed': {
        label: 'Submissions Closed',
        color: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        nextStatus: 'under-review',
        nextLabel: 'Start Review',
    },
    'under-review': {
        label: 'Under Review',
        color: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
        nextStatus: 'published',
        nextLabel: 'Publish',
    },
    published: {
        label: 'Published',
        color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
};

interface SpecialIssueManagerProps {
    journalSlug: string;
    journalTitle: string;
}

export const SpecialIssueManager: React.FC<SpecialIssueManagerProps> = ({ journalSlug, journalTitle }) => {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState<SpecialIssue | null>(null);

    const { data: issues = [], isLoading } = useSpecialIssues(journalSlug);
    const deleteSI = useDeleteSpecialIssue();
    const updateSI = useUpdateSpecialIssue();

    const handleAdvanceStatus = async (si: SpecialIssue) => {
        const config = STATUS_CONFIG[si.status];
        if (!config.nextStatus) return;
        const updates: Partial<SpecialIssue> = { status: config.nextStatus };
        if (config.nextStatus === 'published') updates.publishedDate = new Date().toISOString().split('T')[0];
        await updateSI.mutateAsync({ journalSlug, issueId: si.id, updates });
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        await deleteSI.mutateAsync({ journalSlug, issueId: confirmDelete.id });
        setConfirmDelete(null);
    };

    const grouped = {
        'call-for-papers': issues.filter(si => si.status === 'call-for-papers'),
        'submissions-closed': issues.filter(si => si.status === 'submissions-closed'),
        'under-review': issues.filter(si => si.status === 'under-review'),
        published: issues.filter(si => si.status === 'published'),
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm text-lumex-muted mb-1">
                        <Link to="/editor/journals" className="hover:text-lumex-blue transition-colors">Journal Admin</Link>
                        {' / '}
                        <span className="text-lumex-text">{journalTitle}</span>
                    </p>
                    <h2 className="text-2xl font-serif font-bold text-lumex-text">Special Issues</h2>
                </div>
                <Button
                    variant="primary"
                    onClick={() => void navigate(`/editor/journals/${journalSlug}/special-issues/create`)}
                >
                    + Create Special Issue
                </Button>
            </div>

            {/* Status summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {(Object.keys(STATUS_CONFIG) as SpecialIssueStatus[]).map(status => (
                    <div key={status} className="bg-lumex-card border border-lumex-border rounded-xl p-4">
                        <p className="text-xs text-lumex-muted mb-1.5">
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_CONFIG[status].color}`}>
                                {STATUS_CONFIG[status].label}
                            </span>
                        </p>
                        <p className="text-2xl font-bold text-lumex-text">{grouped[status].length}</p>
                    </div>
                ))}
            </div>

            {/* Issue Cards */}
            {isLoading && (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
                </div>
            )}

            {!isLoading && issues.length === 0 && (
                <div className="bg-lumex-card border border-lumex-border rounded-xl p-12 text-center">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="font-bold text-lumex-text mb-1">No special issues yet</p>
                    <p className="text-sm text-lumex-muted mb-4">Create your first special issue to start collecting thematic research.</p>
                    <Button variant="primary" onClick={() => void navigate(`/editor/journals/${journalSlug}/special-issues/create`)}>
                        Create Special Issue
                    </Button>
                </div>
            )}

            {!isLoading && issues.length > 0 && (
                <div className="space-y-4">
                    {issues.map(si => {
                        const cfg = STATUS_CONFIG[si.status];
                        return (
                            <div
                                key={si.id}
                                className="bg-lumex-card border border-lumex-border rounded-xl p-5 shadow-sm hover:border-lumex-blue/30 transition-colors"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Cover */}
                                    {si.coverImageUrl && (
                                        <img
                                            src={si.coverImageUrl}
                                            alt={si.title}
                                            className="w-full md:w-24 h-24 object-cover rounded-lg border border-lumex-border flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                            {si.issueNumber && (
                                                <span className="text-[10px] text-lumex-muted border border-lumex-border rounded-full px-2 py-0.5">
                                                    Vol. {si.volume} · Issue {si.issueNumber}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-base font-bold text-lumex-text mb-1 line-clamp-2">{si.title}</h3>
                                        <p className="text-xs text-lumex-muted mb-2">
                                            Guest editors:{' '}
                                            {si.guestEditors.map(ge => ge.name).join(', ')}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {si.topics.slice(0, 4).map(t => (
                                                <Badge key={t} variant="default">{t}</Badge>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-lumex-muted">
                                            {si.callForPapersDeadline && si.status === 'call-for-papers' && (
                                                <span>📅 CFP Deadline: {new Date(si.callForPapersDeadline).toLocaleDateString()}</span>
                                            )}
                                            {si.publishedDate && (
                                                <span>✅ Published: {new Date(si.publishedDate).toLocaleDateString()}</span>
                                            )}
                                            <span>📄 {si.articleCount} articles</span>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 justify-start">
                                        <Link
                                            to={`/journal/${journalSlug}/special-issue/${si.id}`}
                                            target="_blank"
                                            className="px-3 py-1.5 rounded-lg border border-lumex-border text-xs font-semibold text-lumex-muted hover:text-lumex-blue hover:border-lumex-blue transition-colors text-center"
                                        >
                                            View Page
                                        </Link>
                                        <button
                                            onClick={() => void navigate(`/editor/journals/${journalSlug}/special-issues/${si.id}/edit`)}
                                            className="px-3 py-1.5 rounded-lg border border-lumex-border text-xs font-semibold text-lumex-muted hover:text-lumex-blue hover:border-lumex-blue transition-colors"
                                        >
                                            Edit
                                        </button>
                                        {cfg.nextStatus && (
                                            <button
                                                onClick={() => void handleAdvanceStatus(si)}
                                                disabled={updateSI.isPending}
                                                className="px-3 py-1.5 rounded-lg bg-lumex-blue/10 border border-lumex-blue/30 text-xs font-semibold text-lumex-blue hover:bg-lumex-blue hover:text-white transition-colors"
                                            >
                                                {cfg.nextLabel}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setConfirmDelete(si)}
                                            className="px-3 py-1.5 rounded-lg border border-lumex-border text-xs font-semibold text-lumex-muted hover:text-red-400 hover:border-red-400/40 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirm Modal */}
            {confirmDelete && (
                <Modal open onOpenChange={open => { if (!open) setConfirmDelete(null); }}>
                    <ModalContent>
                        <ModalTitle>Delete Special Issue</ModalTitle>
                        <div className="space-y-4 mt-4">
                            <p className="text-lumex-muted text-sm">
                                Permanently delete{' '}
                                <span className="font-bold text-lumex-text">{confirmDelete.title}</span>?
                                This cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                                <Button
                                    variant="primary"
                                    className="bg-red-600 border-red-600 hover:bg-red-700"
                                    onClick={() => void handleDelete()}
                                    disabled={deleteSI.isPending}
                                >
                                    {deleteSI.isPending ? 'Deleting…' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};
