import { fetchClient } from '../../../shared/api/base';

export interface EditorPaper {
    id: string;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        email: string;
    };
    assignments?: Array<{
        id: string;
        status: string;
        reviewer: { id: string; name: string; email: string };
    }>;
    reviews?: Array<{
        id: string;
        recommendation: string;
        score: number;
        createdAt: string;
    }>;
}

interface PaginatedPapers {
    data: EditorPaper[];
    totalCount: number;
    page: number;
    limit: number;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

/** GET /editor/papers */
export async function getEditorPapers(params?: {
    status?: string;
    domain?: string;
    page?: number;
    limit?: number;
}): Promise<PaginatedPapers> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.domain) query.set('domain', params.domain);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    const res = await fetchClient<ApiEnvelope<PaginatedPapers>>(`/editor/papers${qs ? `?${qs}` : ''}`);
    return res.data;
}

/** GET /editor/papers/:paperId */
export async function getEditorPaper(paperId: string): Promise<EditorPaper> {
    const res = await fetchClient<ApiEnvelope<EditorPaper>>(`/editor/papers/${paperId}`);
    return res.data;
}

/** POST /editor/papers/:paperId/assign-reviewer */
export async function assignReviewer(paperId: string, reviewerId: string): Promise<void> {
    await fetchClient(`/editor/papers/${paperId}/assign-reviewer`, {
        method: 'POST',
        body: JSON.stringify({ reviewerId }),
    });
}

/** DELETE /editor/papers/:paperId/assignments/:reviewerId */
export async function unassignReviewer(paperId: string, reviewerId: string): Promise<void> {
    await fetchClient(`/editor/papers/${paperId}/assignments/${reviewerId}`, {
        method: 'DELETE',
    });
}

/** POST /papers/:id/approve */
export async function approvePaper(paperId: string): Promise<void> {
    await fetchClient(`/papers/${paperId}/approve`, { method: 'POST' });
}

/** POST /papers/:id/reject */
export async function rejectPaper(paperId: string, rejectionReason: string): Promise<void> {
    await fetchClient(`/papers/${paperId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ rejectionReason }),
    });
}
