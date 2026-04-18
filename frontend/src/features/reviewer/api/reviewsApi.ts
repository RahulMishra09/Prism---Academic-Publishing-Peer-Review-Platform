import { fetchClient } from '../../../shared/api/base';

export interface ReviewAssignment {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'SUBMITTED';
    assignedAt: string;
    dueDate?: string;
    paper: {
        id: string;
        title: string;
        abstract: string;
        domain: string;
        keywords: string[];
        status: string;
        createdAt: string;
    };
}

export interface ReviewRecord {
    id: string;
    strengths: string;
    weaknesses: string;
    score: number;
    recommendation: 'ACCEPT' | 'MINOR_REVISION' | 'MAJOR_REVISION' | 'REJECT';
    createdAt: string;
    paper: {
        id: string;
        title: string;
        domain: string;
    };
}

export interface SubmitReviewPayload {
    strengths: string;
    weaknesses: string;
    score: number;
    recommendation: 'ACCEPT' | 'MINOR_REVISION' | 'MAJOR_REVISION' | 'REJECT';
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

/** GET /reviews/my-assignments */
export async function getMyAssignments(): Promise<ReviewAssignment[]> {
    const res = await fetchClient<ApiEnvelope<ReviewAssignment[]>>('/reviews/my-assignments');
    return res.data;
}

/** GET /reviews/my-reviews */
export async function getMyReviews(): Promise<ReviewRecord[]> {
    const res = await fetchClient<ApiEnvelope<ReviewRecord[]>>('/reviews/my-reviews');
    return res.data;
}

/** POST /reviews/assignments/:assignmentId */
export async function submitReview(assignmentId: string, payload: SubmitReviewPayload): Promise<ReviewRecord> {
    const res = await fetchClient<ApiEnvelope<ReviewRecord>>(`/reviews/assignments/${assignmentId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return res.data;
}
