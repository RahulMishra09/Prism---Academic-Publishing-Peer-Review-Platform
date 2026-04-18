import React, { useState } from 'react';
import { Container, Button } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import { ReviewerAssigner } from '../../../features/editor/ui/ReviewerAssigner';
import { EditorAnalytics } from '../../../features/editor/ui/EditorAnalytics';

export const EditorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'submissions' | 'analytics'>('submissions');
    const [filter, setFilter] = useState<'all' | 'unassigned' | 'under-review' | 'awaiting-decision'>('all');
    const [assigningSubmission, setAssigningSubmission] = useState<{ id: string, title: string } | null>(null);

    // Mock submissions for the editor
    const submissions = [
        { id: 'SUB-1024', title: 'Quantum Computing in Healthcare: A Systematic Review', author: 'Dr. Alice Smith', status: 'unassigned', submittedOn: '2026-03-05' },
        { id: 'SUB-1025', title: 'Impact of Urban Heat Islands on Local Biodiversity', author: 'Prof. Robert Jones', status: 'under-review', submittedOn: '2026-03-02', reviewers: ['Dr. Sarah L.', 'Prof. Mike T.'] },
        { id: 'SUB-1026', title: 'Novel Synthesis of Graphene-based Nanocomposites', author: 'Elena Rodriguez', status: 'awaiting-decision', submittedOn: '2026-02-28', reviewers: ['Dr. James W.', 'Dr. Kim P.'] },
    ];

    const filteredSubmissions = submissions.filter(s => filter === 'all' || s.status === filter);

    const getStatusClass = (status: string) => {
        if (status === 'unassigned') return 'bg-lumex-bg-deep text-lumex-muted';
        if (status === 'under-review') return 'bg-blue-50 text-lumex-blue border border-blue-100';
        return 'bg-orange-50 text-orange-600 border border-orange-100';
    };

    return (
        <Container className="py-12 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-lumex-text">Editorial Control Center</h1>
                    <div className="flex gap-6 mt-4 border-b border-gray-100">
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
                    <Button variant="outline" size="sm">Download Monthly Report</Button>
                    <Button variant="primary" size="sm">Journal Settings</Button>
                </div>
            </div>

            {activeTab === 'submissions' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">New Submissions</p>
                            <p className="text-3xl font-bold text-lumex-text">12</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Under Review</p>
                            <p className="text-3xl font-bold text-lumex-blue">45</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Awaiting Decision</p>
                            <p className="text-3xl font-bold text-orange-600">8</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-lumex-border shadow-sm">
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">Avg. Decision Time</p>
                            <p className="text-3xl font-bold text-green-600">22d</p>
                        </div>
                    </div>

                    <div className="bg-white border border-lumex-border rounded-lg overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-lumex-border bg-lumex-bg-deep/40 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`text-sm font-bold ${filter === 'all' ? 'text-lumex-blue' : 'text-lumex-muted'}`}
                                >
                                    All Submissions
                                </button>
                                <button
                                    onClick={() => setFilter('unassigned')}
                                    className={`text-sm font-bold ${filter === 'unassigned' ? 'text-lumex-blue' : 'text-lumex-muted'}`}
                                >
                                    Unassigned
                                </button>
                                <button
                                    onClick={() => setFilter('under-review')}
                                    className={`text-sm font-bold ${filter === 'under-review' ? 'text-lumex-blue' : 'text-lumex-muted'}`}
                                >
                                    Under Review
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white text-lumex-muted text-xs uppercase font-bold border-b border-lumex-border">
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
                                        <tr key={sub.id} className="hover:bg-lumex-bg-deep/40/50">
                                            <td className="px-6 py-4 text-sm font-medium text-lumex-text">{sub.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-lumex-text mb-0.5">{sub.title}</div>
                                                <div className="text-[10px] text-lumex-sub">Submitted: {new Date(sub.submittedOn).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-lumex-text-secondary">{sub.author}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getStatusClass(sub.status)}`}>
                                                    {sub.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {sub.status === 'unassigned' && (
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() => setAssigningSubmission({ id: sub.id, title: sub.title })}
                                                        >
                                                            Assign Reviewers
                                                        </Button>
                                                    )}
                                                    {sub.status === 'awaiting-decision' && (
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            className="bg-orange-600 border-orange-600 hover:bg-orange-700"
                                                            onClick={() => void navigate(`/editor/decision/${sub.id}`)}
                                                        >
                                                            Make Decision
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="outline">View Detail</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <EditorAnalytics />
            )}

            {assigningSubmission && (
                <ReviewerAssigner
                    manuscriptId={assigningSubmission.id}
                    manuscriptTitle={assigningSubmission.title}
                    onClose={() => setAssigningSubmission(null)}
                    onAssign={(ids) => {
                        alert(`Assigned ${ids.length} reviewers to ${assigningSubmission.id}`);
                        setAssigningSubmission(null);
                    }}
                />
            )}
        </Container>
    );
};
