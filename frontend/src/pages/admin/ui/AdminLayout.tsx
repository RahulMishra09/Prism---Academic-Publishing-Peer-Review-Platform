import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/useAuthStore';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4', end: true },
    { to: '/admin/users', label: 'Users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { to: '/admin/submissions', label: 'Submissions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { to: '/admin/content', label: 'Content', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { to: '/admin/messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { to: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);

    return (
        <div className="flex min-h-[calc(100vh-120px)]">
            {/* Sidebar */}
            <aside className="w-60 bg-lumex-card border-r border-lumex-border flex flex-col shrink-0">
                <div className="p-5 border-b border-lumex-border">
                    <h2 className="text-sm font-bold text-lumex-text uppercase tracking-wider">Admin Panel</h2>
                    {user && (
                        <p className="text-xs text-lumex-muted mt-1 truncate">{user.firstName} {user.lastName}</p>
                    )}
                </div>
                <nav className="flex-1 py-3">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'text-lumex-blue bg-lumex-blue/10 border-r-2 border-lumex-blue'
                                        : 'text-lumex-muted hover:text-lumex-text hover:bg-lumex-bg-deep'
                                }`
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width={18} height={18}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-lumex-border">
                    <button
                        onClick={() => void navigate('/editor')}
                        className="text-xs text-lumex-muted hover:text-lumex-blue transition-colors"
                    >
                        &larr; Back to Editor
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-lumex-bg overflow-y-auto">
                <div className="p-8 max-w-6xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
