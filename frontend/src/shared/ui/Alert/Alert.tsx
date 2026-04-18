import React from 'react';
import { clsx } from 'clsx';
import {
    FaInfoCircle,
    FaExclamationTriangle,
    FaCheckCircle,
    FaExclamationCircle,
} from 'react-icons/fa';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
}

const icons = {
    info: FaInfoCircle,
    success: FaCheckCircle,
    warning: FaExclamationTriangle,
    error: FaExclamationCircle,
};

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
    const Icon = icons[variant];

    const variants = {
        info: 'bg-lumex-bg-light border-lumex-blue text-lumex-text',
        success: 'bg-green-50 border-green-500 text-green-800',
        warning: 'bg-yellow-50 border-lumex-oa-gold text-yellow-800',
        error: 'bg-red-50 border-lumex-red text-lumex-red-dark',
    };

    const iconColors = {
        info: 'text-lumex-blue',
        success: 'text-green-500',
        warning: 'text-lumex-oa-gold',
        error: 'text-lumex-red',
    };

    return (
        <div
            className={clsx(
                'relative w-full rounded-md border-l-4 p-4',
                variants[variant],
                className
            )}
            {...props}
        >
            <div className="flex gap-3">
                <Icon className={clsx('h-5 w-5 mt-0.5 shrink-0', iconColors[variant])} />
                <div>
                    {title && (
                        <h5 className="mb-1 font-semibold leading-none tracking-tight">{title}</h5>
                    )}
                    <div className="text-sm opacity-90">{children}</div>
                </div>
            </div>
        </div>
    );
}
