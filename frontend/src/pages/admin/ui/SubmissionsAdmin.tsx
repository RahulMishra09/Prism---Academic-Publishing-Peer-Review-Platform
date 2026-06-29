import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

interface Submission {
    id: string;
    title: string;
    status: string;
    createdAt?: string;
    submittedAt?: string;
    submittedBy?: { name?: string; firstName?: string; lastName?: string };
    journal?: { title: string };
}

const STATUSES = ['', 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DECISION', 'ACCEPTED', 'REJECTED', 'REVISION_REQUIRED', 'WITHDRAWN'] as const;

export const SubmissionsAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    const params = new URLSearchParams({ page: String(page), pageSize: '20' });
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'submissions', page, statusFilter, search],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Submission[] }>(`/submissions?${params}`);
                return res.data;
            } catch {
                return [] as Submission[];
            }
        },
    });

    const submissions = data ?? [];

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('accept') || s === 'published') return 'bg-green-500/15 text-green-500 border-green-500/20';
        if (s.includes('reject')) return 'bg-red-500/15 text-red-500 border-red-500/20';
        if (s.includes('review')) return 'bg-lumex-blue/10 text-lumex-blue border-lumex-blue/20';
        if (s.includes('decision') || s.includes('revision')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        if (s === 'withdrawn') return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        return 'bg-lumex-bg-deep text-lumex-muted border-lumex-border';
    };

    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-lumex-text mb-1">All Submissions</h1>
            <p className="text-sm text-lumex-muted mb-6">View and manage all manuscript submissions across the platform</p>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-lumex-border rounded-lg bg-lumex-card outline-none focus:border-lumex-blue w-64"
                />
                <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-lumex-border rounded-lg bg-lumex-card outline-none focus:border-lumex-blue"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.filter(Boolean).map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-lumex-card border border-lumex-border rounded-lg overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-lumex-bg-deep text-lumex-muted text-xs uppercase font-bold border-b border-lumex-border">
                                <tr>
                                    <th className="px-5 py-3">ID</th>
                                    <th className="px-5 py-3">Title</th>
                                    <th className="px-5 py-3">Author</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-lumex-border">
                                {submissions.map(sub => {
                                    const author = sub.submittedBy
                                        ? `${sub.submittedBy.firstName || ''} ${sub.submittedBy.lastName || sub.submittedBy.name || ''}`.trim()
                                        : 'Unknown';
                                    const dateStr = sub.submittedAt || sub.createdAt || '';
                                    return (
                                        <tr key={sub.id} className="hover:bg-lumex-card-hover transition-colors">
                                            <td className="px-5 py-3 text-xs font-mono text-lumex-muted">{sub.id.slice(0, 8)}</td>
                                            <td className="px-5 py-3">
                                                <p className="text-sm font-semibold text-lumex-text line-clamp-1">{sub.title}</p>
                                                {sub.journal && <p className="text-xs text-lumex-sub">{sub.journal.title}</p>}
                                            </td>
                                            <td className="px-5 py-3 text-sm text-lumex-muted">{author}</td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(sub.status)}`}>
                                                    {sub.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-xs text-lumex-muted">
                                                {dateStr ? new Date(dateStr).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <Button size="sm" variant="outline" onClick={() => void navigate(`/editor/submission/${sub.id}`)}>
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {submissions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-sm text-lumex-muted">No submissions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {submissions.length >= 20 && (
                <div className="flex justify-end gap-2 mt-4">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                    <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
            )}
        </div>
    );
};
