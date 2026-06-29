import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../../shared/api/base';

interface AdminStats {
    totalUsers: number;
    totalArticles: number;
    totalSubmissions: number;
    totalRevenue: number;
    totalJournals?: number;
    totalBooks?: number;
    recentUsers?: number;
    pendingSubmissions?: number;
}

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: AdminStats }>('/admin/stats');
                return res.data;
            } catch {
                return null;
            }
        },
    });

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers ?? 0, color: 'text-lumex-blue', link: '/admin/users' },
        { label: 'Total Articles', value: stats?.totalArticles ?? 0, color: 'text-green-500', link: '/admin/content' },
        { label: 'Submissions', value: stats?.totalSubmissions ?? 0, color: 'text-orange-500', link: '/admin/submissions' },
        { label: 'Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, color: 'text-purple-500', link: null },
    ];

    const quickActions = [
        { label: 'Manage Users', desc: 'View, edit roles, ban/unban users', to: '/admin/users' },
        { label: 'All Submissions', desc: 'Review and manage all submissions', to: '/admin/submissions' },
        { label: 'Content Management', desc: 'News, books, conferences, collections', to: '/admin/content' },
        { label: 'Contact Messages', desc: 'View and respond to messages', to: '/admin/messages' },
        { label: 'Site Settings', desc: 'Configure site and homepage', to: '/admin/settings' },
        { label: 'Editor Dashboard', desc: 'Manuscript & journal management', to: '/editor' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-lumex-text mb-1">Admin Dashboard</h1>
            <p className="text-sm text-lumex-muted mb-8">Platform overview and quick actions</p>

            {/* Stats cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-lumex-card border border-lumex-border rounded-lg p-6 animate-pulse">
                            <div className="h-3 w-20 bg-lumex-bg-deep rounded mb-3" />
                            <div className="h-8 w-16 bg-lumex-bg-deep rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {statCards.map(card => (
                        <button
                            key={card.label}
                            onClick={() => card.link && void navigate(card.link)}
                            className={`bg-lumex-card border border-lumex-border rounded-lg p-6 text-left shadow-sm hover:border-lumex-blue/30 transition-colors ${card.link ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-1">{card.label}</p>
                            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Quick actions */}
            <h2 className="text-sm font-bold text-lumex-text uppercase tracking-wider mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map(action => (
                    <button
                        key={action.label}
                        onClick={() => void navigate(action.to)}
                        className="flex flex-col items-start p-5 rounded-lg border border-lumex-border bg-lumex-card hover:border-lumex-blue/40 hover:bg-lumex-blue/5 transition-colors text-left shadow-sm"
                    >
                        <span className="text-sm font-bold text-lumex-text mb-1">{action.label}</span>
                        <span className="text-xs text-lumex-muted">{action.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
