import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../app/store/useAuthStore';
import { getComments, postComment, deleteComment } from '../api/commentsApi';
import type { Comment } from '../api/commentsApi';

interface ArticleCommentsProps {
    paperId: string;
}

function CommentItem({
    comment,
    onReply,
    onDelete,
    currentUserId,
}: {
    comment: Comment;
    onReply: (parentId: string) => void;
    onDelete: (id: string) => void;
    currentUserId?: string;
}) {
    return (
        <div className="py-4 border-b border-lumex-border last:border-0">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="h-7 w-7 rounded-full bg-lumex-blue/10 flex items-center justify-center text-xs font-bold text-lumex-blue">
                    {comment.author.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-lumex-text">{comment.author.name}</span>
                <span className="text-xs text-lumex-muted">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-lumex-text leading-relaxed mb-2 ml-9">{comment.text}</p>
            <div className="ml-9 flex gap-4">
                <button
                    onClick={() => onReply(comment.id)}
                    className="text-xs font-semibold text-lumex-muted hover:text-lumex-blue transition-colors cursor-pointer"
                >
                    Reply
                </button>
                {currentUserId === comment.author.id && (
                    <button
                        onClick={() => onDelete(comment.id)}
                        className="text-xs font-semibold text-lumex-muted hover:text-lumex-red transition-colors cursor-pointer"
                    >
                        Delete
                    </button>
                )}
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-9 mt-3 pl-4 border-l-2 border-lumex-border space-y-3">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onDelete={onDelete}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export const ArticleComments: React.FC<ArticleCommentsProps> = ({ paperId }) => {
    const { user, isAuthenticated } = useAuthStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadComments = async () => {
        try {
            const data = await getComments(paperId);
            setComments(data.data);
        } catch {
            // article may not be in the backend — show empty gracefully
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { void loadComments(); }, [paperId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setIsPosting(true);
        setError(null);
        try {
            await postComment(paperId, text.trim(), replyTo ?? undefined);
            setText('');
            setReplyTo(null);
            await loadComments();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post comment');
        } finally {
            setIsPosting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await deleteComment(commentId);
            await loadComments();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete');
        }
    };

    return (
        <section className="mt-10">
            <h3 className="font-serif text-xl font-bold text-lumex-text mb-6 pb-3 border-b border-lumex-border">
                Discussion ({comments.length})
            </h3>

            {/* Comment list */}
            {isLoading ? (
                <p className="text-sm text-lumex-muted">Loading comments…</p>
            ) : comments.length === 0 ? (
                <p className="text-sm text-lumex-muted italic mb-6">Be the first to comment on this article.</p>
            ) : (
                <div className="mb-8">
                    {comments.map(c => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            onReply={setReplyTo}
                            onDelete={(id) => void handleDelete(id)}
                            currentUserId={user?.id}
                        />
                    ))}
                </div>
            )}

            {/* Post form */}
            {isAuthenticated ? (
                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
                    {replyTo && (
                        <div className="flex items-center gap-2 text-xs text-lumex-muted">
                            <span>Replying to a comment</span>
                            <button
                                type="button"
                                onClick={() => setReplyTo(null)}
                                className="text-lumex-blue hover:underline cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Add a comment…"
                        rows={3}
                        className="w-full px-4 py-3 border border-lumex-border rounded-lg text-sm bg-lumex-bg-white focus:outline-none focus:ring-2 focus:ring-lumex-blue/20 focus:border-lumex-blue transition resize-none"
                    />
                    {error && <p className="text-xs text-lumex-red">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isPosting || !text.trim()}
                            className="px-5 py-2 bg-lumex-blue text-white text-sm font-bold rounded-lg hover:bg-lumex-blue-dark transition disabled:opacity-50 cursor-pointer"
                        >
                            {isPosting ? 'Posting…' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-sm text-lumex-muted">
                    <a href="/login" className="text-lumex-blue hover:underline font-semibold">Sign in</a> to join the discussion.
                </p>
            )}
        </section>
    );
};
