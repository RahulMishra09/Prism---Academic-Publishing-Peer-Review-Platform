import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isBanned: boolean;
    createdAt: string;
    _count: { papers: number; reviews: number; comments: number };
}

interface UsersResponse {
    users: AdminUser[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
}

const ROLES = ['', 'READER', 'AUTHOR', 'REVIEWER', 'EDITOR', 'ADMIN'] as const;

export const UserManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [bannedFilter, setBannedFilter] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'ban' | 'unban' | 'delete' | 'role'; userId: string; role?: string } | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkAction, setBulkAction] = useState<{ type: 'role' | 'ban'; role?: string } | null>(null);

    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (bannedFilter === 'true') params.set('isBanned', 'true');
    if (bannedFilter === 'false') params.set('isBanned', 'false');

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'users', page, search, roleFilter, bannedFilter],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: UsersResponse }>(`/admin/users?${params}`);
                return res.data;
            } catch {
                return { users: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } } as UsersResponse;
            }
        },
    });

    const { data: userDetail } = useQuery({
        queryKey: ['admin', 'user', selectedUser?.id],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: AdminUser }>(`/admin/users/${selectedUser!.id}`);
                return res.data;
            } catch {
                return null;
            }
        },
        enabled: !!selectedUser,
    });

    const invalidateAll = () => {
        void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        void queryClient.invalidateQueries({ queryKey: ['admin', 'user'] });
    };

    const changeRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            await fetchClient(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
        },
        onSuccess: () => { invalidateAll(); setConfirmAction(null); },
    });

    const banMutation = useMutation({
        mutationFn: async (userId: string) => {
            await fetchClient(`/admin/users/${userId}/ban`, { method: 'PATCH' });
        },
        onSuccess: () => { invalidateAll(); setConfirmAction(null); },
    });

    const unbanMutation = useMutation({
        mutationFn: async (userId: string) => {
            await fetchClient(`/admin/users/${userId}/unban`, { method: 'PATCH' });
        },
        onSuccess: () => { invalidateAll(); setConfirmAction(null); },
    });

    const deleteMutation = useMutation({
        mutationFn: async (userId: string) => {
            await fetchClient(`/admin/users/${userId}`, { method: 'DELETE' });
        },
        onSuccess: () => { invalidateAll(); setConfirmAction(null); setSelectedUser(null); },
    });

    // Bulk operations — executed sequentially
    const [bulkProcessing, setBulkProcessing] = useState(false);
    const executeBulk = async () => {
        if (!bulkAction || selectedIds.size === 0) return;
        setBulkProcessing(true);
        try {
            for (const uid of selectedIds) {
                if (bulkAction.type === 'role' && bulkAction.role) {
                    await fetchClient(`/admin/users/${uid}/role`, { method: 'PATCH', body: JSON.stringify({ role: bulkAction.role }) });
                } else if (bulkAction.type === 'ban') {
                    await fetchClient(`/admin/users/${uid}/ban`, { method: 'PATCH' });
                }
            }
        } catch { /* some may fail due to guards — that's ok */ }
        setBulkProcessing(false);
        setBulkAction(null);
        setSelectedIds(new Set());
        invalidateAll();
    };

    const users = data?.users ?? [];
    const pagination = data?.pagination ?? { total: 0, page: 1, limit: 20, totalPages: 0 };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === users.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(users.map(u => u.id)));
        }
    };

    const getRoleBadge = (role: string) => {
        const map: Record<string, string> = {
            ADMIN: 'bg-red-500/15 text-red-500 border-red-500/20',
            EDITOR: 'bg-sky-500/15 text-sky-500 border-sky-500/20',
            REVIEWER: 'bg-teal-500/15 text-teal-500 border-teal-500/20',
            AUTHOR: 'bg-purple-500/15 text-purple-500 border-purple-500/20',
            READER: 'bg-lumex-bg-deep text-lumex-muted border-lumex-border',
        };
        return map[role] ?? map.READER;
    };

    const handleConfirm = () => {
        if (!confirmAction) return;
        if (confirmAction.type === 'ban') banMutation.mutate(confirmAction.userId);
        else if (confirmAction.type === 'unban') unbanMutation.mutate(confirmAction.userId);
        else if (confirmAction.type === 'delete') deleteMutation.mutate(confirmAction.userId);
        else if (confirmAction.type === 'role' && confirmAction.role) changeRoleMutation.mutate({ userId: confirmAction.userId, role: confirmAction.role });
    };

    const isMutating = banMutation.isPending || unbanMutation.isPending || changeRoleMutation.isPending || deleteMutation.isPending;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-lumex-text">User Management</h1>
                    <p className="text-sm text-lumex-muted">{pagination.total} total users</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-lumex-border rounded-lg bg-lumex-card outline-none focus:border-lumex-blue w-64"
                />
                <select
                    value={roleFilter}
                    onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-lumex-border rounded-lg bg-lumex-card outline-none focus:border-lumex-blue"
                >
                    <option value="">All Roles</option>
                    {ROLES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select
                    value={bannedFilter}
                    onChange={e => { setBannedFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 text-sm border border-lumex-border rounded-lg bg-lumex-card outline-none focus:border-lumex-blue"
                >
                    <option value="">All Status</option>
                    <option value="false">Active</option>
                    <option value="true">Banned</option>
                </select>
            </div>

            {/* Bulk actions bar */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-lumex-blue/10 border border-lumex-blue/30 rounded-lg">
                    <span className="text-sm font-bold text-lumex-blue">{selectedIds.size} selected</span>
                    <div className="flex items-center gap-2 ml-auto">
                        <select
                            onChange={e => {
                                const v = e.target.value;
                                if (v === 'ban') setBulkAction({ type: 'ban' });
                                else if (v) setBulkAction({ type: 'role', role: v });
                                else setBulkAction(null);
                            }}
                            className="px-2 py-1 text-sm border border-lumex-border rounded bg-white"
                            defaultValue=""
                        >
                            <option value="">Bulk action...</option>
                            <option value="ban">Ban selected</option>
                            <optgroup label="Change role to">
                                {ROLES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
                            </optgroup>
                        </select>
                        <Button size="sm" variant="primary" disabled={!bulkAction || bulkProcessing} onClick={() => void executeBulk()}>
                            {bulkProcessing ? 'Processing...' : 'Apply'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())}>Clear</Button>
                    </div>
                </div>
            )}

            {/* User detail panel */}
            {selectedUser && userDetail && (
                <div className="bg-lumex-card border border-lumex-blue/30 rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-lumex-text">{userDetail.name}</h3>
                            <p className="text-sm text-lumex-muted">{userDetail.email}</p>
                            <div className="flex gap-4 mt-3 text-xs text-lumex-muted">
                                <span>Papers: <strong className="text-lumex-text">{userDetail._count.papers}</strong></span>
                                <span>Reviews: <strong className="text-lumex-text">{userDetail._count.reviews}</strong></span>
                                <span>Comments: <strong className="text-lumex-text">{userDetail._count.comments}</strong></span>
                                <span>Joined: <strong className="text-lumex-text">{new Date(userDetail.createdAt).toLocaleDateString()}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <label className="text-xs font-bold text-lumex-muted">Change Role:</label>
                                <select
                                    defaultValue={userDetail.role}
                                    onChange={e => setConfirmAction({ type: 'role', userId: userDetail.id, role: e.target.value })}
                                    className="px-2 py-1 text-sm border border-lumex-border rounded bg-lumex-bg-deep"
                                >
                                    {ROLES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                {!userDetail.isBanned ? (
                                    <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                                        onClick={() => setConfirmAction({ type: 'ban', userId: userDetail.id })}>
                                        Ban User
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="outline" className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                                        onClick={() => setConfirmAction({ type: 'unban', userId: userDetail.id })}>
                                        Unban User
                                    </Button>
                                )}
                                <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                                    onClick={() => setConfirmAction({ type: 'delete', userId: userDetail.id })}>
                                    Delete User
                                </Button>
                            </div>
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="text-lumex-muted hover:text-lumex-text text-lg">&times;</button>
                    </div>
                </div>
            )}

            {/* Users table */}
            <div className="bg-lumex-card border border-lumex-border rounded-lg overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-lumex-bg-deep text-lumex-muted text-xs uppercase font-bold border-b border-lumex-border">
                                    <tr>
                                        <th className="px-3 py-3 w-10">
                                            <input
                                                type="checkbox"
                                                checked={users.length > 0 && selectedIds.size === users.length}
                                                onChange={toggleAll}
                                                className="h-4 w-4 rounded border-lumex-border"
                                            />
                                        </th>
                                        <th className="px-5 py-3">User</th>
                                        <th className="px-5 py-3">Role</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Activity</th>
                                        <th className="px-5 py-3">Joined</th>
                                        <th className="px-5 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-lumex-border">
                                    {users.map(user => (
                                        <tr key={user.id} className={`hover:bg-lumex-card-hover transition-colors ${selectedIds.has(user.id) ? 'bg-lumex-blue/5' : ''}`}>
                                            <td className="px-3 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(user.id)}
                                                    onChange={() => toggleSelect(user.id)}
                                                    className="h-4 w-4 rounded border-lumex-border"
                                                />
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-lumex-blue/20 text-lumex-blue flex items-center justify-center font-bold text-xs">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-lumex-text">{user.name}</p>
                                                        <p className="text-xs text-lumex-muted">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                {user.isBanned ? (
                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 border border-red-500/20">Banned</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/20">Active</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-xs text-lumex-muted">
                                                {user._count.papers}p / {user._count.reviews}r / {user._count.comments}c
                                            </td>
                                            <td className="px-5 py-3 text-xs text-lumex-muted">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-12 text-center text-sm text-lumex-muted">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-lumex-border bg-lumex-bg-deep">
                                <p className="text-xs text-lumex-muted">
                                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
                                </p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                                    <Button size="sm" variant="outline" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Confirmation modal */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setConfirmAction(null)}>
                    <div className="bg-lumex-card border border-lumex-border rounded-lg p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-lumex-text mb-2">Confirm Action</h3>
                        <p className="text-sm text-lumex-muted mb-6">
                            {confirmAction.type === 'ban' && 'Are you sure you want to ban this user? They will not be able to log in.'}
                            {confirmAction.type === 'unban' && 'Are you sure you want to unban this user?'}
                            {confirmAction.type === 'delete' && 'Are you sure you want to delete this user? This action cannot be undone.'}
                            {confirmAction.type === 'role' && `Change this user's role to ${confirmAction.role}?`}
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" size="sm" onClick={() => setConfirmAction(null)}>Cancel</Button>
                            <Button
                                variant="primary"
                                size="sm"
                                className={confirmAction.type === 'ban' || confirmAction.type === 'delete' ? 'bg-red-600 border-red-600 hover:bg-red-700' : ''}
                                onClick={handleConfirm}
                                disabled={isMutating}
                            >
                                {isMutating ? 'Processing...' : 'Confirm'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
