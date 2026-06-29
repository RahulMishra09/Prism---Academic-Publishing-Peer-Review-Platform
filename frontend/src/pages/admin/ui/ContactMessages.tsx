import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;

export const ContactMessages: React.FC = () => {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { data: messages, isLoading } = useQuery({
        queryKey: ['admin', 'contact'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: ContactMessage[] }>('/contact');
                return res.data;
            } catch {
                return [] as ContactMessage[];
            }
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await fetchClient(`/contact/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin', 'contact'] });
        },
    });

    const allMessages = messages ?? [];
    const filtered = statusFilter ? allMessages.filter(m => m.status === statusFilter) : allMessages;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-red-500/15 text-red-500 border-red-500/20';
            case 'IN_PROGRESS': return 'bg-orange-500/15 text-orange-500 border-orange-500/20';
            case 'RESOLVED': return 'bg-green-500/15 text-green-500 border-green-500/20';
            case 'CLOSED': return 'bg-gray-500/15 text-gray-500 border-gray-500/20';
            default: return 'bg-lumex-bg-deep text-lumex-muted';
        }
    };

    const openCount = allMessages.filter(m => m.status === 'OPEN').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-lumex-text">Contact Messages</h1>
                    <p className="text-sm text-lumex-muted">{allMessages.length} total messages, {openCount} open</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {['', ...STATUS_OPTIONS].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
                            statusFilter === s
                                ? 'bg-lumex-blue text-white border-lumex-blue'
                                : 'bg-lumex-card text-lumex-muted border-lumex-border hover:border-lumex-blue/30'
                        }`}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {/* Messages list */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(msg => (
                        <div key={msg.id} className="bg-lumex-card border border-lumex-border rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-lumex-card-hover transition-colors"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-lumex-blue/20 text-lumex-blue flex items-center justify-center font-bold text-xs shrink-0">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-lumex-text truncate">{msg.subject}</p>
                                        <p className="text-xs text-lumex-muted truncate">{msg.name} &lt;{msg.email}&gt;</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-4">
                                    <span className="text-xs text-lumex-muted">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(msg.status)}`}>
                                        {msg.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-lumex-muted text-xs">{expandedId === msg.id ? '\u25B2' : '\u25BC'}</span>
                                </div>
                            </button>

                            {expandedId === msg.id && (
                                <div className="px-5 pb-5 border-t border-lumex-border bg-lumex-bg-deep">
                                    <div className="pt-4">
                                        <p className="text-sm text-lumex-text whitespace-pre-line mb-4">{msg.message}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-lumex-muted">Update status:</span>
                                            {STATUS_OPTIONS.map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => updateStatusMutation.mutate({ id: msg.id, status })}
                                                    disabled={msg.status === status || updateStatusMutation.isPending}
                                                    className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border transition-colors ${
                                                        msg.status === status
                                                            ? getStatusBadge(status)
                                                            : 'bg-lumex-card text-lumex-muted border-lumex-border hover:border-lumex-blue/30 disabled:opacity-40'
                                                    }`}
                                                >
                                                    {status.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-sm text-lumex-muted">No messages found</div>
                    )}
                </div>
            )}
        </div>
    );
};
