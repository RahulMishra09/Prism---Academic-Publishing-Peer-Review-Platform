import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SavedArticlesPanel, AlertsPanel, SubmissionsPanel, OrdersPanel, ResearchHistoryPanel, useUserDashboard } from '../../../features/user';
import { useSavedArticles } from '../../../features/article';

type DashTab = 'saved' | 'history' | 'alerts' | 'submissions' | 'orders' | 'profile';

export const AccountDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<DashTab>('saved');

    const queryClient = useQueryClient();
    const { removeArticle } = useSavedArticles();
    const { data: dashboardData, isLoading, isError } = useUserDashboard();

    const handleRemove = (doi: string) => {
        removeArticle(doi);
        void queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
    };

    if (isLoading) return (
        <div className="bg-lumex-bg min-h-screen py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumex-blue" />
        </div>
    );
    if (isError || !dashboardData) return <div className="p-12 text-center text-red-500 font-bold">Failed to load dashboard data.</div>;

    const user = dashboardData.profile;

    const tabs: { id: DashTab; label: string; icon: React.ReactNode }[] = [
        {
            id: 'saved',
            label: 'Saved Articles',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },
        {
            id: 'history',
            label: 'Research History',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            id: 'alerts',
            label: 'My Alerts',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            ),
        },
        {
            id: 'submissions',
            label: 'Submissions',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            ),
        },
        {
            id: 'orders',
            label: 'Orders & Receipts',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
            ),
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-lumex-bg min-h-screen py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-lumex-text">
                            Welcome back, {user.name.split(' ')[0]}
                        </h1>
                        <p className="text-lumex-muted mt-1">
                            {user.email} · {user.institution}
                        </p>
                    </div>
                    <button
                        onClick={() => {/* logout logic if needed here */ }}
                        className="text-sm text-lumex-red hover:underline font-medium"
                    >
                        Sign out
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* Left Nav */}
                    <aside className="hidden md:block w-52 shrink-0">
                        <nav className="bg-lumex-card border border-lumex-border rounded-lg overflow-hidden">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors text-left ${activeTab === tab.id
                                        ? 'bg-lumex-blue text-white'
                                        : 'text-lumex-muted hover:bg-lumex-bg-deep'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Mobile nav */}
                    <div className="md:hidden flex gap-1 mb-4 overflow-x-auto w-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-bold rounded whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab.id
                                    ? 'bg-lumex-blue text-white'
                                    : 'bg-lumex-card border border-lumex-border text-lumex-muted'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Panel */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-lumex-card border border-lumex-border rounded-lg p-6 min-h-[400px]">
                            {activeTab === 'saved' && (
                                <>
                                    <h2 className="text-lg font-bold text-lumex-text mb-4">
                                        Saved Articles
                                    </h2>
                                    <SavedArticlesPanel
                                        articles={dashboardData.savedArticles}
                                        onRemove={handleRemove}
                                    />
                                </>
                            )}

                            {activeTab === 'history' && (
                                <>
                                    <h2 className="text-lg font-bold text-lumex-text mb-4">
                                        Research History
                                    </h2>
                                    <ResearchHistoryPanel />
                                </>
                            )}

                            {activeTab === 'alerts' && (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-lumex-text">
                                            My Alerts
                                        </h2>
                                        <span className="text-xs text-lumex-sub">
                                            Email notifications only
                                        </span>
                                    </div>
                                    <AlertsPanel initialAlerts={dashboardData.alerts} />
                                </>
                            )}

                            {activeTab === 'submissions' && (
                                <>
                                    <h2 className="text-lg font-bold text-lumex-text mb-4">
                                        Manuscript Submissions
                                    </h2>
                                    <SubmissionsPanel pastSubmissions={dashboardData.submissions} />
                                </>
                            )}

                            {activeTab === 'orders' && (
                                <>
                                    <h2 className="text-lg font-bold text-lumex-text mb-4">
                                        Orders & Receipts
                                    </h2>
                                    <OrdersPanel />
                                </>
                            )}

                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-lg font-bold text-lumex-text mb-6">
                                        Profile Settings
                                    </h2>
                                    <div className="space-y-5">
                                        {[
                                            { label: 'First name', value: 'Jane' },
                                            { label: 'Last name', value: 'Doe' },
                                            { label: 'Email', value: user.email },
                                            { label: 'Institution', value: user.institution },
                                        ].map(({ label, value }) => (
                                            <div key={label}>
                                                <label className="block text-sm font-semibold text-lumex-text mb-1">
                                                    {label}
                                                </label>
                                                <input
                                                    type="text"
                                                    defaultValue={value}
                                                    className="w-full px-4 py-2.5 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue"
                                                />
                                            </div>
                                        ))}
                                        <button className="px-6 py-2.5 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors">
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
