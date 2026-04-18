import React from 'react';
import { clsx } from 'clsx';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
    size?: 'xs' | 'sm' | 'md' | 'lg';
    label?: string;
}

const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
};

export function Spinner({ className, size = 'md', label = 'Loading…', ...props }: SpinnerProps) {
    return (
        <svg
            className={clsx('animate-spin text-lumex-blue', sizes[size], className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label={label}
            role="status"
            {...props}
        >
            <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
            />
            <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}
