import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import { EditorAnalytics } from '../../../features/editor/ui/EditorAnalytics';
import { getEditorPapers, approvePaper, rejectPaper } from '../../../features/editor/api/editorApi';
import type { EditorPaper } from '../../../features/editor/api/editorApi';

type FilterStatus = 'all' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

const STATUS_CLASSES: Record<string, string> = {
    SUBMITTED: 'bg-lumex-blue/10 text-lumex-blue',
    APPROVED: 'bg-lumex-open-bg text-lumex-open-text',
    REJECTED: 'bg-lumex-red/10 text-lumex-red',
    DRAFT: 'bg-lumex-bg-deep text-lumex-muted',
};

export const EditorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'submissions' | 'analytics'>('submissions');
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [papers, setPapers] = useState<EditorPaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadPapers = async (status?: FilterStatus) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getEditorPapers(
                status && status !== 'all' ? { status } : {}
            );
            setPapers(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load papers');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadPapers(filter);
    }, [filter]);

    const handleApprove = async (paperId: string) => {
        setActionLoading(paperId);
        try {
            await approvePaper(paperId);
            await loadPapers(filter);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to approve paper');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (paperId: string) => {
        const reason = window.prompt('Rejection reason (min 10 characters):');
        if (!reason || reason.trim().length < 10) return;
        setActionLoading(paperId);
        try {
            await rejectPaper(paperId, reason.trim());
            await loadPapers(filter);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to reject paper');
        } finally {
            setActionLoading(null);
        }
    };

    const counts = {
        submitted: papers.filter(p => p.status === 'SUBMITTED').length,
        approved: papers.filter(p => p.status === 'APPROVED').length,
        rejected: papers.filter(p => p.status === 'REJECTED').length,
    };

    return (
        <Container className="py-12 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-lumex-text">Editorial Control Center</h1>
                    <div className="flex gap-6 mt-4 border-b border-lumex-border">
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'submissions' ? 'text-lumex-blue' : 'text-lumex-sub hover:text-lumex-muted'}`}
                        >
                            Manuscript Management
                            {activeTab === 'submissions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lumex-blue" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'analytics' ? 'text-lumex-blue' : 'text-lumex-sub hover:text-lumex-muted'}`}
                        >
                            Journal Analytics
                            {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lumex-blue" />}
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Download Report</Button>
                </div>
            </div>

            {activeTab === 'submissions' ? (
                <>
                    {/* Stats row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Submitted</p>
                            <p className="text-3xl font-bold text-lumex-blue">{counts.submitted}</p>
                        </div>
                        <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Approved</p>
                            <p className="text-3xl font-bold text-lumex-open-text">{counts.approved}</p>
                        </div>
                        <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Rejected</p>
                            <p className="text-3xl font-bold text-lumex-red">{counts.rejected}</p>
                        </div>
                    </div>

                    <div className="bg-lumex-bg-white border border-lumex-border rounded-xl overflow-hidden shadow-sm">
                        {/* Filter tabs */}
                        <div className="p-4 border-b border-lumex-border bg-lumex-bg/40 flex gap-4">
                            {(['all', 'SUBMITTED', 'APPROVED', 'REJECTED'] as FilterStatus[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-sm font-bold transition-colors ${filter === f ? 'text-lumex-blue' : 'text-lumex-muted hover:text-lumex-text'}`}
                                >
                                    {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-16">
                                <Spinner size="lg" />
                            </div>
                        ) : error ? (
                            <p className="p-8 text-center text-lumex-red">{error}</p>
                        ) : papers.length === 0 ? (
                            <p className="p-8 text-center text-lumex-muted italic">No papers found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-lumex-bg text-lumex-muted text-xs uppercase font-bold border-b border-lumex-border">
                                        <tr>
                                            <th className="px-6 py-4">Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Domain</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-lumex-border">
                                        {papers.map(paper => (
                                            <tr key={paper.id} className="hover:bg-lumex-bg/40 transition-colors">
                                                <td className="px-6 py-4 max-w-xs">
                                                    <div className="text-sm font-bold text-lumex-text line-clamp-2">{paper.title}</div>
                                                    <div className="text-[10px] text-lumex-sub mt-0.5">
                                                        {new Date(paper.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-lumex-muted">
                                                    {paper.author?.name ?? '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-lumex-muted">{paper.domain}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${STATUS_CLASSES[paper.status] ?? 'bg-lumex-bg-deep text-lumex-muted'}`}>
                                                        {paper.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {paper.status === 'SUBMITTED' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="primary"
                                                                    disabled={actionLoading === paper.id}
                                                                    onClick={() => void handleApprove(paper.id)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={actionLoading === paper.id}
                                                                    onClick={() => void handleReject(paper.id)}
                                                                    className="text-lumex-red hover:border-lumex-red/30"
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => void navigate(`/editor/decision/${paper.id}`)}
                                                        >
                                                            View
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <EditorAnalytics />
            )}
        </Container>
    );
};
