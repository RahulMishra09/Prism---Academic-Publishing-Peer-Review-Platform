import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

type ContentType = 'news' | 'conferences' | 'books' | 'collections';

interface ContentItem {
    id: string;
    title?: string;
    name?: string;
    slug?: string;
    status?: string;
    isPublished?: boolean;
    createdAt?: string;
    date?: string;
    startDate?: string;
}

const TABS: { key: ContentType; label: string; endpoint: string }[] = [
    { key: 'news', label: 'News', endpoint: '/news/admin/all' },
    { key: 'conferences', label: 'Conferences', endpoint: '/conferences/admin/all' },
    { key: 'books', label: 'Books', endpoint: '/books/admin/all' },
    { key: 'collections', label: 'Collections', endpoint: '/collections/admin/all' },
];

export const ContentManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<ContentType>('news');
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const tab = TABS.find(t => t.key === activeTab)!;

    const { data: items, isLoading } = useQuery({
        queryKey: ['admin', 'content', activeTab],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: ContentItem[] }>(tab.endpoint);
                return res.data;
            } catch {
                return [] as ContentItem[];
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const endpoint = activeTab === 'news' ? `/news/${id}`
                : activeTab === 'conferences' ? `/conferences/${id}`
                : activeTab === 'books' ? `/books/${id}`
                : `/collections/${id}`;
            await fetchClient(endpoint, { method: 'DELETE' });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin', 'content', activeTab] });
            setConfirmDelete(null);
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (data: { id?: string; body: Record<string, string> }) => {
            const isEdit = !!data.id;
            const endpoint = activeTab === 'news' ? (isEdit ? `/news/${data.id}` : '/news')
                : activeTab === 'conferences' ? (isEdit ? `/conferences/${data.id}` : '/conferences')
                : activeTab === 'books' ? (isEdit ? `/books/${data.id}` : '/books')
                : isEdit ? `/collections/${data.id}` : '/collections';
            await fetchClient(endpoint, {
                method: isEdit ? 'PUT' : 'POST',
                body: JSON.stringify(data.body),
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin', 'content', activeTab] });
            setEditingItem(null);
            setShowCreate(false);
        },
    });

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const body: Record<string, string> = {};
        fd.forEach((v, k) => { body[k] = v.toString(); });
        saveMutation.mutate({ id: editingItem?.id, body });
    };

    const contentList = items ?? [];

    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-lumex-text mb-1">Content Management</h1>
            <p className="text-sm text-lumex-muted mb-6">Manage news articles, conferences, books, and collections</p>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-lumex-border mb-6">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => { setActiveTab(t.key); setEditingItem(null); setShowCreate(false); }}
                        className={`px-4 pb-2 text-sm font-bold transition-colors relative ${
                            activeTab === t.key ? 'text-lumex-blue' : 'text-lumex-sub hover:text-lumex-muted'
                        }`}
                    >
                        {t.label}
                        {activeTab === t.key && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lumex-blue" />}
                    </button>
                ))}
            </div>

            {/* Create / Edit form */}
            {(showCreate || editingItem) && (
                <div className="bg-lumex-card border border-lumex-blue/30 rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-lumex-text uppercase">{editingItem ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}</h3>
                        <button onClick={() => { setEditingItem(null); setShowCreate(false); }} className="text-lumex-muted hover:text-lumex-text">&times;</button>
                    </div>
                    <form onSubmit={handleSave} className="space-y-3">
                        <input
                            name="title"
                            defaultValue={editingItem?.title || editingItem?.name || ''}
                            placeholder="Title"
                            required
                            className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue"
                        />
                        {activeTab === 'news' && (
                            <input
                                name="slug"
                                defaultValue={editingItem?.slug || ''}
                                placeholder="Slug (e.g. my-news-article)"
                                className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue"
                            />
                        )}
                        {activeTab === 'conferences' && (
                            <input
                                name="startDate"
                                type="date"
                                defaultValue={editingItem?.startDate?.split('T')[0] || ''}
                                placeholder="Start Date"
                                className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue"
                            />
                        )}
                        {activeTab === 'collections' && (
                            <input
                                name="slug"
                                defaultValue={editingItem?.slug || ''}
                                placeholder="Slug"
                                className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue"
                            />
                        )}
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => { setEditingItem(null); setShowCreate(false); }}>Cancel</Button>
                            <Button type="submit" variant="primary" size="sm" disabled={saveMutation.isPending}>
                                {saveMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Action bar */}
            {!showCreate && !editingItem && (
                <div className="flex justify-end mb-4">
                    <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
                        + Create {activeTab.slice(0, -1)}
                    </Button>
                </div>
            )}

            {/* Table */}
            <div className="bg-lumex-card border border-lumex-border rounded-lg overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-lumex-bg-deep text-lumex-muted text-xs uppercase font-bold border-b border-lumex-border">
                                <tr>
                                    <th className="px-5 py-3">Title</th>
                                    <th className="px-5 py-3">Slug / ID</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-lumex-border">
                                {contentList.map(item => (
                                    <tr key={item.id} className="hover:bg-lumex-card-hover transition-colors">
                                        <td className="px-5 py-3 text-sm font-semibold text-lumex-text">
                                            {item.title || item.name || 'Untitled'}
                                        </td>
                                        <td className="px-5 py-3 text-xs text-lumex-muted font-mono">
                                            {item.slug || item.id.slice(0, 8)}
                                        </td>
                                        <td className="px-5 py-3 text-xs text-lumex-muted">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString()
                                                : item.startDate ? new Date(item.startDate).toLocaleDateString()
                                                : '-'}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>Edit</Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                                                    onClick={() => setConfirmDelete(item.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {contentList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-12 text-center text-sm text-lumex-muted">No {activeTab} found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete confirmation */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setConfirmDelete(null)}>
                    <div className="bg-lumex-card border border-lumex-border rounded-lg p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-lumex-text mb-2">Confirm Delete</h3>
                        <p className="text-sm text-lumex-muted mb-6">This action cannot be undone. Are you sure?</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                            <Button
                                variant="primary"
                                size="sm"
                                className="bg-red-600 border-red-600 hover:bg-red-700"
                                onClick={() => deleteMutation.mutate(confirmDelete)}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
