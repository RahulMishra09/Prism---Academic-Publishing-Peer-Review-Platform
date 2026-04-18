import { fetchClient } from '../../../shared/api/base';

export interface CreatePaperPayload {
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
}

export interface PaperRecord {
    id: string;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

/** POST /papers — creates a new DRAFT paper */
export async function createPaper(payload: CreatePaperPayload): Promise<PaperRecord> {
    const res = await fetchClient<ApiEnvelope<PaperRecord>>('/papers', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return res.data;
}

/** POST /papers/:id/submit — moves DRAFT → SUBMITTED */
export async function submitPaper(paperId: string): Promise<PaperRecord> {
    const res = await fetchClient<ApiEnvelope<PaperRecord>>(`/papers/${paperId}/submit`, {
        method: 'POST',
    });
    return res.data;
}

/** GET /papers/my — list author's own papers */
export async function getMyPapers(): Promise<PaperRecord[]> {
    const res = await fetchClient<ApiEnvelope<PaperRecord[]>>('/papers/my');
    return res.data;
}
