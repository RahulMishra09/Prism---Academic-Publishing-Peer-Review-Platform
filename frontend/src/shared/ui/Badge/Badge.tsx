import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
        | 'default'
        | 'oa'
        | 'peer-reviewed'
        | 'subscription'
        | 'journal'
        | 'article-type'
        | 'outline'
        | 'success'
        | 'warning'
        | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
        default:
            'bg-lumex-bg-deep text-lumex-text border border-lumex-border',
        oa:
            'bg-prism-teal-soft text-prism-teal border border-prism-teal/20',
        'peer-reviewed':
            'bg-prism-violet-soft text-prism-violet border border-prism-violet/20',
        subscription:
            'bg-lumex-sub-bg text-lumex-sub-text border border-lumex-blue/20',
        journal:
            'bg-lumex-blue text-white border border-transparent',
        'article-type':
            'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        outline:
            'bg-transparent text-lumex-text border border-lumex-border',
        success:
            'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
        warning:
            'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
        danger:
            'bg-red-50 text-lumex-red border border-red-200 dark:bg-red-900/20 dark:border-red-800',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
