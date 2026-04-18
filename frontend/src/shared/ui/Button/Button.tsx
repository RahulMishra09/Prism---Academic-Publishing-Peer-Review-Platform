import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            loading = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const base =
            'inline-flex items-center justify-center gap-2 font-medium rounded-lg cursor-pointer select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary:
                'bg-lumex-blue text-white hover:bg-lumex-blue-dark shadow-sm hover:shadow-md active:scale-[0.98]',
            secondary:
                'bg-lumex-bg-deep text-lumex-text hover:bg-lumex-border border border-lumex-border active:scale-[0.98]',
            outline:
                'border border-lumex-border bg-transparent hover:bg-lumex-bg-deep text-lumex-text hover:border-lumex-border-hover active:scale-[0.98]',
            ghost:
                'bg-transparent hover:bg-lumex-bg-deep text-lumex-text active:scale-[0.98]',
            danger:
                'bg-lumex-red text-white hover:bg-lumex-red-dark shadow-sm hover:shadow-md active:scale-[0.98]',
            link:
                'bg-transparent text-lumex-blue hover:underline underline-offset-4 p-0 h-auto shadow-none',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-9 px-4 text-sm',
            lg: 'h-11 px-6 text-sm',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={clsx(
                    base,
                    variants[variant],
                    variant !== 'link' && sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            >
                {loading && (
                    <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export { Button };
