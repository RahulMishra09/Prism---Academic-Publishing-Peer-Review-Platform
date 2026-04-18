import React from 'react';
import { clsx } from 'clsx';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'blue' | 'violet' | 'teal' | 'amber' | 'slate';
    removable?: boolean;
    onRemove?: () => void;
}

export function Tag({ className, variant = 'default', removable, onRemove, children, ...props }: TagProps) {
    const variants: Record<NonNullable<TagProps['variant']>, string> = {
        default: 'bg-lumex-tag-bg text-lumex-tag-text hover:bg-lumex-border',
        blue:    'bg-lumex-blue/8 text-lumex-blue hover:bg-lumex-blue/15',
        violet:  'bg-prism-violet-soft text-prism-violet hover:bg-prism-violet/15',
        teal:    'bg-prism-teal-soft text-prism-teal hover:bg-prism-teal/15',
        amber:   'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400',
        slate:   'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onRemove?.(); }}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current"
                    aria-label="Remove"
                >
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </span>
    );
}
