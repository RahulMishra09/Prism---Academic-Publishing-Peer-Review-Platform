import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Skeleton, Modal, ModalContent, ModalTitle } from '@shared/ui';
import { useAdminJournalsList, useSetJournalStatus, useDeleteJournal } from '../../../entities/journal/api/journalAdminQueries';
import { useAllSpecialIssues } from '../../../entities/journal/api/journalAdminQueries';
import type { Journal, JournalStatus } from '../../../entities/journal/model/types';

const ACCESS_TYPE_LABELS: Record<string, string> = {
    gold_oa: 'Gold OA',
    hybrid: 'Hybrid',
    subscription: 'Subscription',
    free: 'Free',
};

const ACCESS_TYPE_COLORS: Record<string, string> = {
    gold_oa: 'bg-amber-500/15 text-amber-500 border border-amber-500/30',
    hybrid: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    subscription: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    free: 'bg-green-500/15 text-green-400 border border-green-500/30',
};

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    archived: 'bg-lumex-muted/15 text-lumex-muted border border-lumex-border',
    draft: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
};

export const JournalAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | JournalStatus>('all');
    const [confirmDelete, setConfirmDelete] = useState<Journal | null>(null);

    const { data: journals = [], isLoading } = useAdminJournalsList();
    const { data: specialIssues = [] } = useAllSpecialIssues();
    const setStatus = useSetJournalStatus();
    const deleteJournal = useDeleteJournal();

    const filtered = journals.filter(j => {
        const matchSearch =
            !search ||
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.electronicISSN.includes(search);
        const matchStatus =
            statusFilter === 'all' || (j.status ?? 'active') === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: journals.length,
        openAccess: journals.filter(j => j.accessType === 'gold_oa' || j.openAccess).length,
        specialIssues: specialIssues.length,
        avgIF: journals.length
            ? (journals.reduce((s, j) => s + (j.metrics?.impactFactor ?? 0), 0) / journals.length).toFixed(2)
            : '—',
    };

    const handleArchive = (j: Journal) => {
        void setStatus.mutateAsync({ slug: j.slug, status: 'archived' });
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        await deleteJournal.mutateAsync(confirmDelete.slug);
        setConfirmDelete(null);
    };

    return (
        <div className="w-full px-6 lg:px-10 py-10 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-lumex-text">Journal Administration</h1>
                    <p className="text-lumex-muted text-sm mt-1">Create, manage, and archive journals and special issues.</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => void navigate('/editor/journals/create')}
                >
                    + Create Journal
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Journals', value: stats.total, color: 'text-lumex-text' },
                    { label: 'Open Access', value: stats.openAccess, color: 'text-amber-400' },
                    { label: 'Special Issues', value: stats.specialIssues, color: 'text-lumex-blue' },
                    { label: 'Avg. Impact Factor', value: stats.avgIF, color: 'text-emerald-400' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-lumex-card border border-lumex-border rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">{label}</p>
                        <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search by title or ISSN…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'active', 'draft', 'archived'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors border ${
                                statusFilter === s
                                    ? 'bg-lumex-blue text-white border-lumex-blue'
                                    : 'border-lumex-border text-lumex-muted hover:border-lumex-blue/40'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-lumex-card border border-lumex-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-lumex-bg-deep border-b border-lumex-border">
                            <tr>
                                {['Journal', 'ISSN', 'Access', 'Disciplines', 'IF', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3.5 text-xs font-bold text-lumex-muted uppercase tracking-wider whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lumex-border">
                            {isLoading &&
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        {[1, 2, 3, 4, 5, 6, 7].map(c => (
                                            <td key={c} className="px-5 py-4">
                                                <Skeleton className="h-4 w-24" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            {!isLoading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-lumex-muted">
                                        No journals found.
                                    </td>
                                </tr>
                            )}
                            {!isLoading &&
                                filtered.map(journal => {
                                    const jStatus = (journal.status ?? 'active') as JournalStatus;
                                    const siCount = specialIssues.filter(si => si.journalSlug === journal.slug).length;
                                    return (
                                        <tr key={journal.id} className="hover:bg-lumex-bg-deep/50 transition-colors">
                                            {/* Journal Title */}
                                            <td className="px-5 py-4 min-w-[200px]">
                                                <div className="flex items-center gap-3">
                                                    {journal.coverImageUrl ? (
                                                        <img
                                                            src={journal.coverImageUrl}
                                                            alt={journal.title}
                                                            className="w-9 h-12 object-cover rounded border border-lumex-border flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-12 rounded border border-lumex-border bg-lumex-bg-deep flex items-center justify-center flex-shrink-0">
                                                            <span className="text-lumex-muted text-[10px]">J</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Link
                                                            to={`/journal/${journal.slug}`}
                                                            className="text-sm font-semibold text-lumex-text hover:text-lumex-blue transition-colors line-clamp-2"
                                                            target="_blank"
                                                        >
                                                            {journal.title}
                                                        </Link>
                                                        {siCount > 0 && (
                                                            <span className="text-[10px] text-lumex-blue mt-0.5 block">
                                                                {siCount} special issue{siCount > 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* ISSN */}
                                            <td className="px-5 py-4 text-xs text-lumex-muted font-mono whitespace-nowrap">
                                                {journal.electronicISSN}
                                            </td>
                                            {/* Access Type */}
                                            <td className="px-5 py-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ACCESS_TYPE_COLORS[journal.accessType] ?? ''}`}>
                                                    {ACCESS_TYPE_LABELS[journal.accessType] ?? journal.accessType}
                                                </span>
                                            </td>
                                            {/* Disciplines */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className="inline-block max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap rounded-sm bg-lumex-bg-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lumex-text"
                                                        title={Array.isArray(journal.discipline) ? journal.discipline[0] : journal.discipline}
                                                    >
                                                        {Array.isArray(journal.discipline) ? journal.discipline[0] : journal.discipline}
                                                    </span>
                                                    {Array.isArray(journal.discipline) && journal.discipline.length > 1 && (
                                                        <span className="text-[10px] text-lumex-muted whitespace-nowrap flex-shrink-0" title={journal.discipline.slice(1).join(', ')}>
                                                            +{journal.discipline.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            {/* Impact Factor */}
                                            <td className="px-5 py-4 text-sm font-bold text-lumex-text whitespace-nowrap">
                                                {journal.metrics?.impactFactor?.toFixed(2) ?? '—'}
                                            </td>
                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[jStatus]}`}>
                                                    {jStatus}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => void navigate(`/editor/journals/${journal.slug}/edit`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => void navigate(`/editor/journals/${journal.slug}/special-issues`)}
                                                    >
                                                        Special Issues
                                                    </Button>
                                                    {jStatus !== 'archived' ? (
                                                        <button
                                                            onClick={() => handleArchive(journal)}
                                                            className="text-[11px] font-semibold text-lumex-muted hover:text-orange-400 transition-colors px-1.5 py-1"
                                                        >
                                                            Archive
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => void setStatus.mutateAsync({ slug: journal.slug, status: 'active' })}
                                                            className="text-[11px] font-semibold text-lumex-muted hover:text-emerald-400 transition-colors px-1.5 py-1"
                                                        >
                                                            Restore
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setConfirmDelete(journal)}
                                                        className="text-[11px] font-semibold text-lumex-muted hover:text-red-400 transition-colors px-1.5 py-1"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {confirmDelete && (
                <Modal open onOpenChange={open => { if (!open) setConfirmDelete(null); }}>
                    <ModalContent>
                        <ModalTitle>Delete Journal</ModalTitle>
                        <div className="space-y-4 mt-4">
                            <p className="text-lumex-muted text-sm">
                                Are you sure you want to permanently delete{' '}
                                <span className="font-bold text-lumex-text">{confirmDelete.title}</span>?
                                This will also remove all associated special issues. This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    className="bg-red-600 border-red-600 hover:bg-red-700"
                                    onClick={() => void handleDelete()}
                                    disabled={deleteJournal.isPending}
                                >
                                    {deleteJournal.isPending ? 'Deleting…' : 'Delete Permanently'}
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};
