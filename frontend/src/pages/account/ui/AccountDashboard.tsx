import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SavedArticlesPanel, AlertsPanel, SubmissionsPanel, OrdersPanel, ResearchHistoryPanel, useUserDashboard } from '../../../features/user';
import { useAuthStore } from '../../../app/store/useAuthStore';
import { fetchClient, ApiError } from '../../../shared/api/base';

type DashTab = 'saved' | 'history' | 'alerts' | 'submissions' | 'orders' | 'profile';

export const AccountDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<DashTab>('saved');
    const [profileForm, setProfileForm] = useState<Record<string, string>>({});
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');

    const queryClient = useQueryClient();
    const { data: dashboardData, isLoading, isError } = useUserDashboard();
    const authUser = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);

    // Password change state
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState('');

    // Avatar state
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const handleProfileSave = async () => {
        setProfileSaving(true);
        setProfileMsg('');
        try {
            await fetchClient('/users/me', {
                method: 'PUT',
                body: JSON.stringify({
                    firstName: profileForm.firstName,
                    lastName: profileForm.lastName,
                    affiliation: profileForm.institution,
                }),
            });
            setProfileMsg('Profile updated successfully');
            void queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
        } catch {
            setProfileMsg('Failed to update profile');
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordMsg('');
        if (passwordForm.newPassword.length < 6) { setPasswordMsg('New password must be at least 6 characters.'); return; }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordMsg('Passwords do not match.'); return; }

        setPasswordSaving(true);
        try {
            await fetchClient('/users/me/password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
            });
            setPasswordMsg('Password changed successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordMsg(err instanceof ApiError ? err.message : 'Failed to change password');
        } finally {
            setPasswordSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const token = localStorage.getItem('mock_token');
            const res = await fetch('/api/users/me/avatar', {
                method: 'PUT',
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: formData,
            });
            if (res.ok) {
                void queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
            }
        } catch { /* silent */ } finally {
            setAvatarUploading(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    if (isLoading) return (
        <div className="bg-lumex-bg min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Profile header skeleton */}
                <div className="bg-lumex-card border border-lumex-border rounded-xl p-6 mb-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-lumex-bg-deep animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-6 w-48 bg-lumex-bg-deep rounded animate-pulse" />
                        <div className="h-4 w-32 bg-lumex-bg-deep rounded animate-pulse" />
                    </div>
                </div>
                {/* Tabs skeleton */}
                <div className="flex gap-4 mb-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-10 w-28 bg-lumex-bg-deep rounded animate-pulse" />)}
                </div>
                {/* Content skeleton */}
                <div className="bg-lumex-card border border-lumex-border rounded-xl p-6 space-y-4">
                    <div className="h-5 w-40 bg-lumex-bg-deep rounded animate-pulse" />
                    {[1,2,3].map(i => <div key={i} className="h-16 w-full bg-lumex-bg-deep rounded animate-pulse" />)}
                </div>
            </div>
        </div>
    );
    if (isError || !dashboardData) return <div className="p-12 text-center text-red-500 font-bold">Failed to load dashboard data.</div>;

    const user = dashboardData.profile;

    // Initialize profile form from dashboard data
    if (!profileForm.firstName && user) {
        const nameParts = user.name?.split(' ') || [];
        profileForm.firstName = user.firstName || nameParts[0] || '';
        profileForm.lastName = user.lastName || nameParts.slice(1).join(' ') || '';
        profileForm.email = user.email || '';
        profileForm.institution = user.institution || '';
    }

    const displayName = authUser?.firstName || user.name?.split(' ')[0] || 'User';

    const tabs: { id: DashTab; label: string; icon: React.ReactNode }[] = [
        {
            id: 'saved',
            label: 'Saved Articles',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },
        {
            id: 'history',
            label: 'Research History',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            Welcome back, {displayName}
                        </h1>
                        <p className="text-lumex-muted mt-1">
                            {user.email}{user.institution ? ` · ${user.institution}` : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => logout()}
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
                                    <AlertsPanel />
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
                                <div className="space-y-10">
                                    {/* Avatar */}
                                    <div>
                                        <h2 className="text-lg font-bold text-lumex-text mb-4">Profile Picture</h2>
                                        <div className="flex items-center gap-5">
                                            <div className="w-20 h-20 rounded-full bg-lumex-bg-deep border border-lumex-border flex items-center justify-center overflow-hidden">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-lumex-muted">
                                                        {(user.firstName || user.name?.charAt(0) || 'U').charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => void handleAvatarUpload(e)} />
                                                <button onClick={() => avatarInputRef.current?.click()} disabled={avatarUploading} className="px-4 py-2 text-sm font-bold border border-lumex-border rounded hover:bg-lumex-bg-deep transition-colors disabled:opacity-60">
                                                    {avatarUploading ? 'Uploading...' : 'Change Photo'}
                                                </button>
                                                <p className="text-xs text-lumex-muted mt-1">JPEG, PNG, WebP, or GIF. Max 5MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div>
                                        <h2 className="text-lg font-bold text-lumex-text mb-4">Profile Settings</h2>
                                        <div className="space-y-5">
                                            {[
                                                { label: 'First name', key: 'firstName' },
                                                { label: 'Last name', key: 'lastName' },
                                                { label: 'Email', key: 'email', disabled: true },
                                                { label: 'Institution', key: 'institution' },
                                            ].map(({ label, key, disabled }) => (
                                                <div key={key}>
                                                    <label className="block text-sm font-semibold text-lumex-text mb-1">{label}</label>
                                                    <input
                                                        type="text"
                                                        value={profileForm[key] || ''}
                                                        disabled={disabled}
                                                        onChange={e => setProfileForm(prev => ({ ...prev, [key]: e.target.value }))}
                                                        className="w-full px-4 py-2.5 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue disabled:opacity-60 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                            ))}
                                            {profileMsg && (
                                                <p className={`text-sm ${profileMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{profileMsg}</p>
                                            )}
                                            <button onClick={handleProfileSave} disabled={profileSaving} className="px-6 py-2.5 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors disabled:opacity-60">
                                                {profileSaving ? 'Saving...' : 'Save changes'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Change Password */}
                                    <div>
                                        <h2 className="text-lg font-bold text-lumex-text mb-4">Change Password</h2>
                                        <div className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-semibold text-lumex-text mb-1">Current Password</label>
                                                <input type="password" autoComplete="current-password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} className="w-full px-4 py-2.5 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-lumex-text mb-1">New Password</label>
                                                <input type="password" autoComplete="new-password" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="At least 6 characters" className="w-full px-4 py-2.5 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-lumex-text mb-1">Confirm New Password</label>
                                                <input type="password" autoComplete="new-password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} className="w-full px-4 py-2.5 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue" />
                                            </div>
                                            {passwordMsg && (
                                                <p className={`text-sm ${passwordMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{passwordMsg}</p>
                                            )}
                                            <button onClick={() => void handlePasswordChange()} disabled={passwordSaving} className="px-6 py-2.5 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors disabled:opacity-60">
                                                {passwordSaving ? 'Changing...' : 'Change Password'}
                                            </button>
                                        </div>
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
