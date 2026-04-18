import React, { useState } from 'react';

import type { UserAlert } from '../api/useUserDashboard';

export interface AlertsPanelProps {
    initialAlerts?: UserAlert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ initialAlerts = [] }) => {
    const [alerts, setAlerts] = useState<UserAlert[]>(initialAlerts);

    const toggleActive = (id: string) =>
        setAlerts(prev => prev.map(a => (a.id === id ? { ...a, active: !a.active } : a)));

    const removeAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

    if (alerts.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-4 opacity-40"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p className="font-medium">No alerts set up</p>
                <p className="text-sm mt-1">
                    Subscribe to journals or topics to get email notifications
                </p>
            </div>
        );
    }

    return (
        <div>
            <ul className="divide-y divide-lumex-border">
                {alerts.map(alert => (
                    <li key={alert.id} className="py-4 flex items-center gap-4 group">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${alert.type === 'journal' ? 'bg-lumex-blue' : 'bg-emerald-600'
                                }`}
                        >
                            {alert.type === 'journal' ? 'J' : 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-lumex-text truncate">
                                {alert.label}
                            </p>
                            <p className="text-xs text-gray-400 capitalize mt-0.5">
                                {alert.type} · {alert.frequency}
                            </p>
                        </div>
                        {/* Toggle */}
                        <button
                            onClick={() => toggleActive(alert.id)}
                            className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${alert.active ? 'bg-lumex-blue' : 'bg-gray-200'
                                }`}
                            aria-label={`${alert.active ? 'Disable' : 'Enable'} alert`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-lumex-background rounded-full shadow transition-transform ${alert.active ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                        <button
                            onClick={() => removeAlert(alert.id)}
                            className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Remove alert"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </li>
                ))}
            </ul>
            <button className="mt-4 text-sm text-lumex-blue hover:underline font-bold flex items-center gap-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add new alert
            </button>
        </div>
    );
};
