import React from 'react';
import { clsx } from 'clsx';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';

export interface LinkProps extends RouterLinkProps {
    variant?: 'default' | 'muted' | 'button';
    external?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, variant = 'default', external, children, to, ...props }, ref) => {
        const variants = {
            default: 'text-lumex-blue hover:underline transition-colors',
            muted: 'text-lumex-muted hover:text-lumex-text transition-colors',
            button: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue bg-lumex-blue text-white hover:bg-lumex-blue-dark h-10 px-4 py-2',
        };

        if (external) {
            return (
                <a
                    ref={ref}
                    href={to as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(variants[variant], className)}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                >
                    {children}
                </a>
            );
        }

        return (
            <RouterLink ref={ref} to={to} className={clsx(variants[variant], className)} {...props}>
                {children}
            </RouterLink>
        );
    }
);
Link.displayName = 'Link';
