import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'oa' | 'outline' | 'journal';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: 'bg-lumex-bg-light text-lumex-text',
        oa: 'bg-lumex-oa-gold text-white font-bold',
        journal: 'bg-lumex-blue text-white font-bold',
        outline: 'border border-lumex-border text-lumex-text',
    };

    return (
        <div
            className={clsx(
                'inline-flex items-center justify-center rounded-sm px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
