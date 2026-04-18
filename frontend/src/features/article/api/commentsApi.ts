import { fetchClient } from '../../../shared/api/base';

export interface Comment {
    id: string;
    text: string;
    createdAt: string;
    author: { id: string; name: string };
    replies?: Comment[];
    parentCommentId?: string | null;
}

interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

interface PaginatedComments {
    data: Comment[];
    totalCount: number;
    page: number;
    limit: number;
}

/** GET /comments/papers/:paperId */
export async function getComments(paperId: string, page = 1): Promise<PaginatedComments> {
    const res = await fetchClient<ApiEnvelope<PaginatedComments>>(
        `/comments/papers/${paperId}?page=${page}&limit=20`
    );
    return res.data;
}

/** POST /comments/papers/:paperId */
export async function postComment(paperId: string, text: string, parentCommentId?: string): Promise<Comment> {
    const body: Record<string, string> = { text };
    if (parentCommentId) body.parentCommentId = parentCommentId;
    const res = await fetchClient<ApiEnvelope<Comment>>(`/comments/papers/${paperId}`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return res.data;
}

/** DELETE /comments/:commentId */
export async function deleteComment(commentId: string): Promise<void> {
    await fetchClient(`/comments/${commentId}`, { method: 'DELETE' });
}
