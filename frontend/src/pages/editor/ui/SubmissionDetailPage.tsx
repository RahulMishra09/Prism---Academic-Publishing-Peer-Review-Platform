import React, { useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

const PdfViewer = lazy(() => import('../../../shared/ui/PdfViewer/PdfViewer').then(m => ({ default: m.PdfViewer })));

interface SubmissionDetail {
    id: string;
    title: string;
    abstract?: string;
    status: string;
    manuscriptType?: string;
    keywords?: string[];
    createdAt?: string;
    submittedAt?: string;
    submittedBy?: { firstName?: string; lastName?: string; name?: string };
    reviewers?: Array<{ id: string; name?: string; firstName?: string; lastName?: string; status?: string }>;
    coAuthors?: Array<{ firstName: string; lastName: string; email: string; affiliation?: string }>;
    journal?: { title: string; slug: string };
    files?: Array<{ id: string; fileName: string; fileType: string; mimeType: string; fileSize: number }>;
}

interface ReviewerAssignment {
    id: string;
    status: string;
    assignedAt?: string;
    respondedAt?: string;
    completedAt?: string;
    dueDate?: string;
    reviewer?: { id: string; name?: string; firstName?: string; lastName?: string; email?: string };
}

export const SubmissionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: submission, isLoading } = useQuery({
        queryKey: ['submissions', id],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: SubmissionDetail }>(`/submissions/${id}`);
                return res.data;
            } catch {
                return null;
            }
        },
        enabled: !!id,
    });

    const { data: reviewerAssignments } = useQuery({
        queryKey: ['submissionReviewers', id],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: ReviewerAssignment[] }>(`/submissions/${id}/reviewers`);
                return res.data;
            } catch {
                return [] as ReviewerAssignment[];
            }
        },
        enabled: !!id,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDownloadFile = async (fileId: string, fileName: string) => {
        try {
            const res = await fetchClient<{ data: { url: string } }>(`/submissions/${id}/files/${fileId}/download`);
            window.open(res.data.url, '_blank');
        } catch {
            alert(`Failed to download ${fileName}`);
        }
    };

    const handlePreviewFile = async (fileId: string, mimeType: string) => {
        if (mimeType !== 'application/pdf') { return; }
        try {
            const res = await fetchClient<{ data: { url: string } }>(`/submissions/${id}/files/${fileId}/download`);
            setPreviewUrl(res.data.url);
        } catch { /* silent */ }
    };

    if (isLoading) {
        return (
            <Container className="py-12 max-w-4xl">
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lumex-blue" />
                </div>
            </Container>
        );
    }

    const sub = submission || {
        id: id || '',
        title: 'Unknown Manuscript',
        status: 'unknown',
        abstract: 'No details available. The submission may not exist or you may not have permission to view it.',
    };

    const authorName = sub.submittedBy
        ? `${sub.submittedBy.firstName || ''} ${sub.submittedBy.lastName || sub.submittedBy.name || ''}`.trim()
        : 'Unknown Author';
    const displayStatus = sub.status?.toLowerCase().replace(/_/g, '-') || 'unknown';
    const dateStr = sub.submittedAt || sub.createdAt || '';

    const getStatusBadge = (status: string) => {
        if (status.includes('accept') || status === 'published') return 'bg-green-500/15 text-green-500 border border-green-500/20';
        if (status.includes('reject')) return 'bg-red-500/15 text-red-500 border border-red-500/20';
        if (status.includes('review')) return 'bg-lumex-blue/10 text-lumex-blue border border-lumex-blue/20';
        if (status.includes('decision')) return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
        return 'bg-lumex-bg-deep text-lumex-muted';
    };

    return (
        <Container className="py-12 max-w-4xl">
            <div className="flex items-center gap-2 text-lumex-blue mb-6">
                <button onClick={() => void navigate('/editor')} className="text-sm font-bold hover:underline">
                    ← Back to Dashboard
                </button>
            </div>

            <div className="bg-lumex-card border border-lumex-border rounded-xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-lumex-border">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-bold text-lumex-muted">{sub.id}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusBadge(displayStatus)}`}>
                                {displayStatus.replace(/-/g, ' ')}
                            </span>
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-lumex-text mb-2">
                            {sub.title}
                        </h1>
                        <p className="text-sm text-lumex-muted">
                            Submitted by <span className="font-semibold text-lumex-text">{authorName}</span>
                            {dateStr && <> on {new Date(dateStr).toLocaleDateString()}</>}
                        </p>
                        {sub.journal && (
                            <p className="text-xs text-lumex-sub mt-1">Journal: {sub.journal.title}</p>
                        )}
                    </div>
                    {displayStatus === 'awaiting-decision' && (
                        <Button
                            variant="primary"
                            className="bg-orange-600 border-orange-600 hover:bg-orange-700 whitespace-nowrap"
                            onClick={() => void navigate(`/editor/decision/${sub.id}`)}
                        >
                            Make Decision
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    {sub.manuscriptType && (
                        <div>
                            <h3 className="text-xs font-bold uppercase text-lumex-sub tracking-wider mb-2">Manuscript Type</h3>
                            <p className="text-lumex-text text-sm font-semibold">{sub.manuscriptType}</p>
                        </div>
                    )}

                    {sub.abstract && (
                        <div>
                            <h3 className="text-xs font-bold uppercase text-lumex-sub tracking-wider mb-2">Abstract</h3>
                            <p className="text-sm text-lumex-text-secondary leading-relaxed whitespace-pre-line">
                                {sub.abstract}
                            </p>
                        </div>
                    )}

                    {sub.keywords && sub.keywords.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase text-lumex-sub tracking-wider mb-2">Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {sub.keywords.map((kw, i) => (
                                    <span key={i} className="text-xs bg-lumex-bg-deep border border-lumex-border px-2.5 py-1 rounded-full text-lumex-text">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {sub.coAuthors && sub.coAuthors.length > 0 && (
                        <div className="pt-6 border-t border-lumex-border">
                            <h3 className="text-xs font-bold uppercase text-lumex-sub tracking-wider mb-3">Co-Authors</h3>
                            <div className="space-y-2">
                                {sub.coAuthors.map((ca, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-lumex-text">
                                        <div className="w-7 h-7 rounded-full bg-lumex-blue/20 text-lumex-blue flex items-center justify-center font-bold text-xs">
                                            {ca.firstName.charAt(0)}{ca.lastName.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-semibold">{ca.firstName} {ca.lastName}</span>
                                            {ca.affiliation && <span className="text-lumex-muted ml-2">({ca.affiliation})</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Review Progress */}
                    {reviewerAssignments && reviewerAssignments.length > 0 && (
                        <div className="pt-6 border-t border-lumex-border">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold uppercase text-lumex-sub tracking-wider">Review Progress</h3>
                                {(() => {
                                    const completed = reviewerAssignments.filter(r => r.status === 'COMPLETED').length;
                                    const total = reviewerAssignments.length;
                                    return (
                                        <span className="text-sm font-bold text-lumex-text">
                                            {completed}/{total} reviews completed
                                        </span>
                                    );
                                })()}
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-lumex-bg-deep rounded-full h-2 mb-4">
                                <div
                                    className="bg-lumex-blue h-2 rounded-full transition-all"
                                    style={{ width: `${(reviewerAssignments.filter(r => r.status === 'COMPLETED').length / reviewerAssignments.length) * 100}%` }}
                                />
                            </div>
                            <div className="space-y-2">
                                {reviewerAssignments.map((rev) => {
                                    const revName = rev.reviewer?.name || `${rev.reviewer?.firstName || ''} ${rev.reviewer?.lastName || ''}`.trim() || 'Reviewer';
                                    const statusColor = rev.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : rev.status === 'ACCEPTED' ? 'bg-blue-100 text-lumex-blue' : rev.status === 'DECLINED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-800';
                                    return (
                                        <div key={rev.id} className="flex items-center justify-between bg-lumex-bg-deep border border-lumex-border rounded-lg px-4 py-2.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-lumex-blue/20 text-lumex-blue flex items-center justify-center font-bold text-xs">
                                                    {revName.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-lumex-text">{revName}</span>
                                                    {rev.dueDate && (
                                                        <span className="text-xs text-lumex-muted ml-2">Due: {new Date(rev.dueDate).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                                                {rev.status.toLowerCase()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Manuscript Files */}
                    {sub.files && sub.files.length > 0 && (
                        <div className="pt-6 border-t border-lumex-border">
                            <h3 className="text-xs font-bold uppercase text-lumex-sub tracking-wider mb-3">Manuscript Files</h3>
                            <div className="space-y-2">
                                {sub.files.map(file => (
                                    <div key={file.id} className="flex items-center justify-between bg-lumex-bg-deep border border-lumex-border rounded px-3 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lumex-text font-medium truncate">{file.fileName}</span>
                                            <span className="text-[10px] uppercase font-bold text-lumex-sub bg-lumex-card px-1.5 py-0.5 rounded">{file.fileType}</span>
                                            <span className="text-xs text-lumex-muted">{(file.fileSize / 1024).toFixed(0)} KB</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {file.mimeType === 'application/pdf' && (
                                                <button onClick={() => void handlePreviewFile(file.id, file.mimeType)} className="text-lumex-blue hover:underline text-xs font-bold">
                                                    Preview
                                                </button>
                                            )}
                                            <button onClick={() => void handleDownloadFile(file.id, file.fileName)} className="text-lumex-blue hover:underline text-xs font-bold">
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* PDF Preview */}
                            {previewUrl && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-bold text-lumex-text">File Preview</h4>
                                        <button onClick={() => setPreviewUrl(null)} className="text-xs text-lumex-muted hover:text-lumex-text">&times; Close preview</button>
                                    </div>
                                    <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" /></div>}>
                                        <PdfViewer url={previewUrl} />
                                    </Suspense>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};
