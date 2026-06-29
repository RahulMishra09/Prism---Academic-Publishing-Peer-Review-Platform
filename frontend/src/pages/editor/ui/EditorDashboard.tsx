import React, { useState } from 'react';
import { Container, Button } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReviewerAssigner } from '../../../features/editor/ui/ReviewerAssigner';
import { EditorAnalytics } from '../../../features/editor/ui/EditorAnalytics';
import { useAuthStore } from '../../../app/store/useAuthStore';
import { fetchClient } from '../../../shared/api/base';
import {
    canAssignReviewers,
    canMakeDecision,
    canViewAnalytics,
    canManageJournal,
    getRoleLabel,
} from '../../../shared/lib/roles';


export const EditorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userRole = useAuthStore(state => state.user?.role);
    const userName = useAuthStore(state => state.user?.firstName);

    const showAnalytics = canViewAnalytics(userRole);
    const showAssign = canAssignReviewers(userRole);
    const showDecision = canMakeDecision(userRole);
    const showManage = canManageJournal(userRole);

    const [activeTab, setActiveTab] = useState<'submissions' | 'analytics' | 'journal-admin'>('submissions');

    const [filter, setFilter] = useState<'all' | 'submitted' | 'under-review' | 'awaiting-decision'>('all');
    const [assigningSubmission, setAssigningSubmission] = useState<{ id: string, title: string } | null>(null);

    interface EditorSubmission {
        id: string;
        title: string;
        author?: string | { id?: string; name?: string; email?: string; firstName?: string; lastName?: string };
        submittedBy?: { name?: string; firstName?: string; lastName?: string };
        status: string;
        submittedOn?: string;
        createdAt?: string;
        reviewers?: (string | { id?: string; name?: string })[];
    }

    const { data: submissionsData, isLoading } = useQuery({
        queryKey: ['editor', 'submissions', filter],
        queryFn: async () => {
            try {
                const params = new URLSearchParams({ page: '1', pageSize: '50' });
                if (filter !== 'all') params.append('status', filter.toUpperCase().replace('-', '_'));
                const res = await fetchClient<{ data: EditorSubmission[] }>(`/submissions?${params}`);
                return res.data;
            } catch {
                return [] as EditorSubmission[];
            }
        },
    });

    const resolveAuthorName = (s: EditorSubmission): string => {
        if (s.author) {
            if (typeof s.author === 'string') return s.author;
            if (typeof s.author === 'object') return s.author.name || `${s.author.firstName || ''} ${s.author.lastName || ''}`.trim() || 'Unknown';
        }
        if (s.submittedBy) {
            return `${s.submittedBy.firstName || ''} ${s.submittedBy.lastName || s.submittedBy.name || ''}`.trim() || 'Unknown';
        }
        return 'Unknown';
    };

    const submissions = (submissionsData ?? []).map(s => ({
        id: s.id,
        title: s.title,
        author: resolveAuthorName(s),
        status: s.status?.toLowerCase().replace('_', '-') || 'unknown',
        submittedOn: s.submittedOn || s.createdAt || '',
        reviewers: (s.reviewers || []).map(r => typeof r === 'string' ? r : r.name || 'Unknown'),
    }));

    const filteredSubmissions = submissions.filter(s => filter === 'all' || s.status === filter);

    const getStatusClass = (status: string) => {
        if (status === 'submitted') return 'bg-lumex-bg-deep text-lumex-muted';
        if (status === 'under-review') return 'bg-lumex-blue/10 text-lumex-blue border border-lumex-blue/20';
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
    };

    const roleBadgeColor: Record<string, string> = {
        'chief-editor': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        'associate-editor': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
        editor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
        admin: 'bg-red-500/15 text-red-400 border-red-500/30',
    };

    if (isLoading) return (
        <Container className="py-12 min-h-screen">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-9 w-72 bg-lumex-bg-deep rounded animate-pulse" />
                    <div className="h-10 w-36 bg-lumex-bg-deep rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                    {[1,2,3,4].map(i => <div key={i} className="h-10 w-32 bg-lumex-bg-deep rounded animate-pulse" />)}
                </div>
                <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="bg-lumex-card border border-lumex-border rounded-xl p-5 flex justify-between items-center">
                            <div className="space-y-2 flex-1">
                                <div className="h-5 w-3/4 bg-lumex-bg-deep rounded animate-pulse" />
                                <div className="h-4 w-1/3 bg-lumex-bg-deep rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-24 bg-lumex-bg-deep rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );

    return (
        <Container className="py-12 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-serif font-bold text-lumex-text">Editorial Control Center</h1>
                        {userRole && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${roleBadgeColor[userRole] ?? 'bg-lumex-bg-deep text-lumex-muted'}`}>
                                {getRoleLabel(userRole)}
                            </span>
                        )}
                    </div>
                    {userName && (
                        <p className="text-sm text-lumex-muted mb-3">
                            Welcome, {userName}
                        </p>
                    )}
                    <div className="flex gap-6 border-b border-lumex-border">
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'submissions' ? 'text-lumex-blue' : 'text-lumex-sub hover:text-lumex-muted'}`}
                        >
                            Manuscript Management
                            {activeTab === 'submissions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lumex-blue" />}
                        </button>
                        {showAnalytics && (
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'analytics' ? 'text-lumex-blue' : 'text-lumex-sub hover:text-lumex-muted'}`}
                            >
                                Journal Analytics
                                {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lumex-blue" />}
                            </button>
                        )}
                        {showManage && (
                            <button
                                onClick={() => setActiveTab('journal-admin')}
                                className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'journal-admin' ? 'text-lumex-blue' : 'text-lumex-sub hover:text-lumex-muted'}`}
                            >
                                Journal Admin
                                {activeTab === 'journal-admin' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lumex-blue" />}
                            </button>
                        )}
                    </div>
                </div>
                {showManage && (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Download Monthly Report</Button>
                        <Button variant="primary" size="sm" onClick={() => void navigate('/editor/journals')}>Journal Settings</Button>
                    </div>
                )}
            </div>

            {activeTab === 'submissions' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-lumex-card p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">New Submissions</p>
                            <p className="text-3xl font-bold text-lumex-text">12</p>
                        </div>
                        <div className="bg-lumex-card p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Under Review</p>
                            <p className="text-3xl font-bold text-lumex-blue">45</p>
                        </div>
                        <div className="bg-lumex-card p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Awaiting Decision</p>
                            <p className="text-3xl font-bold text-orange-500">8</p>
                        </div>
                        <div className="bg-lumex-card p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Avg. Decision Time</p>
                            <p className="text-3xl font-bold text-green-500">22d</p>
                        </div>
                    </div>

                    <div className="bg-lumex-card border border-lumex-border rounded-lg overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-lumex-border bg-lumex-bg-deep flex items-center justify-between">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`text-sm font-bold ${filter === 'all' ? 'text-lumex-blue' : 'text-lumex-sub'}`}
                                >
                                    All Submissions
                                </button>
                                <button
                                    onClick={() => setFilter('submitted')}
                                    className={`text-sm font-bold ${filter === 'submitted' ? 'text-lumex-blue' : 'text-lumex-sub'}`}
                                >
                                    Unassigned
                                </button>
                                <button
                                    onClick={() => setFilter('under-review')}
                                    className={`text-sm font-bold ${filter === 'under-review' ? 'text-lumex-blue' : 'text-lumex-sub'}`}
                                >
                                    Under Review
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-lumex-card text-lumex-muted text-xs uppercase font-bold border-b border-lumex-border">
                                    <tr>
                                        <th className="px-6 py-4">Submission ID</th>
                                        <th className="px-6 py-4">Manuscript Title</th>
                                        <th className="px-6 py-4">Author</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-lumex-border">
                                    {filteredSubmissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-lumex-card-hover transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-lumex-text">{sub.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-lumex-text mb-0.5">{sub.title}</div>
                                                <div className="text-[10px] text-lumex-sub">Submitted: {new Date(sub.submittedOn).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-lumex-muted">{sub.author}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded whitespace-nowrap ${getStatusClass(sub.status)}`}>
                                                    {sub.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {sub.status === 'submitted' && showAssign && (
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() => setAssigningSubmission({ id: sub.id, title: sub.title })}
                                                        >
                                                            Assign Reviewers
                                                        </Button>
                                                    )}
                                                    {sub.status === 'awaiting-decision' && showDecision && (
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            className="bg-orange-600 border-orange-600 hover:bg-orange-700"
                                                            onClick={() => void navigate(`/editor/decision/${sub.id}`)}
                                                        >
                                                            Make Decision
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => void navigate(`/editor/submission/${sub.id}`)}
                                                    >
                                                        View Detail
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : activeTab === 'analytics' ? (
                <EditorAnalytics />
            ) : (
                // Journal Admin quick view
                <div className="space-y-6">
                    <div className="bg-lumex-card border border-lumex-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-lumex-text">Journal Administration</h2>
                                <p className="text-sm text-lumex-muted mt-0.5">Create, edit, archive journals and manage special issues.</p>
                            </div>
                            <Button variant="primary" size="sm" onClick={() => void navigate('/editor/journals')}>
                                Open Journal Admin →
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button onClick={() => void navigate('/editor/journals')} className="flex flex-col items-start p-4 rounded-lg border border-lumex-border hover:border-lumex-blue/50 hover:bg-lumex-blue/5 transition-colors text-left">
                                <span className="text-2xl mb-2">📚</span>
                                <span className="text-sm font-bold text-lumex-text">Manage Journals</span>
                                <span className="text-xs text-lumex-muted">View, edit, archive all journals</span>
                            </button>
                            <button onClick={() => void navigate('/editor/journals/create')} className="flex flex-col items-start p-4 rounded-lg border border-lumex-border hover:border-lumex-blue/50 hover:bg-lumex-blue/5 transition-colors text-left">
                                <span className="text-2xl mb-2">➕</span>
                                <span className="text-sm font-bold text-lumex-text">Create Journal</span>
                                <span className="text-xs text-lumex-muted">Launch a new journal</span>
                            </button>
                            <button onClick={() => void navigate('/editor/journals')} className="flex flex-col items-start p-4 rounded-lg border border-lumex-border hover:border-lumex-blue/50 hover:bg-lumex-blue/5 transition-colors text-left">
                                <span className="text-2xl mb-2">🗓️</span>
                                <span className="text-sm font-bold text-lumex-text">Special Issues</span>
                                <span className="text-xs text-lumex-muted">Manage special editions & CFPs</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {assigningSubmission && (
                <ReviewerAssigner
                    manuscriptId={assigningSubmission.id}
                    manuscriptTitle={assigningSubmission.title}
                    onClose={() => setAssigningSubmission(null)}
                    onAssign={async (ids) => {
                        try {
                            await Promise.all(
                                ids.map(reviewerId =>
                                    fetchClient(`/submissions/${assigningSubmission.id}/reviewers`, {
                                        method: 'POST',
                                        body: JSON.stringify({ reviewerId }),
                                    }).catch((err: any) => {
                                        // Ignore 409 Conflict if reviewer is already assigned
                                        if (err?.status === 409) return;
                                        throw err;
                                    })
                                )
                            );
                            setAssigningSubmission(null);
                            // Refresh the submissions list to show the new status
                            void queryClient.invalidateQueries({ queryKey: ['editor', 'submissions'] });
                        } catch (err) {
                            console.error('Failed to assign reviewers', err);
                            alert('An error occurred while assigning reviewers.');
                        }
                    }}
                />
            )}
        </Container>
    );
};
