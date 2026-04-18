import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary: 'bg-lumex-blue text-white hover:bg-lumex-blue-dark',
            secondary: 'bg-lumex-bg-light text-lumex-text hover:bg-lumex-border',
            outline:
                'border border-lumex-border bg-transparent hover:bg-lumex-bg-light text-lumex-text',
            ghost: 'bg-transparent hover:bg-lumex-bg-light text-lumex-text',
            link: 'bg-transparent text-lumex-blue hover:underline underline-offset-4',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 py-2 text-base',
            lg: 'h-12 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                disabled={disabled}
                className={clsx(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
