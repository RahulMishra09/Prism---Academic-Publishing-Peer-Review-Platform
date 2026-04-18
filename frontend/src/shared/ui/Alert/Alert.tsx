import React from 'react';
import { clsx } from 'clsx';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
}

const icons = {
    info: (
        <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    success: (
        <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    warning: (
        <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    error: (
        <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const styles = {
    info:    'bg-blue-50 border-lumex-blue text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    success: 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 border-amber-400 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700',
    error:   'bg-red-50 border-lumex-red text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
};

const iconColors = {
    info:    'text-lumex-blue',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error:   'text-lumex-red',
};

export function Alert({ className, variant = 'info', title, dismissible, onDismiss, children, ...props }: AlertProps) {
    return (
        <div
            role="alert"
            className={clsx(
                'relative w-full rounded-lg border-l-[3px] px-4 py-3',
                styles[variant],
                className
            )}
            {...props}
        >
            <div className="flex gap-3">
                <span className={iconColors[variant]}>{icons[variant]}</span>
                <div className="flex-1 min-w-0">
                    {title && (
                        <p className="mb-0.5 text-sm font-semibold leading-tight">{title}</p>
                    )}
                    <div className="text-sm leading-relaxed opacity-90">{children}</div>
                </div>
                {dismissible && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-current transition-opacity"
                        aria-label="Dismiss"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
