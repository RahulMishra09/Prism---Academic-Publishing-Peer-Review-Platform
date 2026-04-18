import React from 'react';
import { clsx } from 'clsx';

export const Breadcrumb = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ className, ...props }, ref) => (
        <nav ref={ref} aria-label="breadcrumb" className={className} {...props} />
    )
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
    HTMLOListElement,
    React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={clsx(
            'flex flex-wrap items-center gap-1 text-xs text-lumex-muted list-none',
            className
        )}
        {...props}
    />
));
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<
    HTMLLIElement,
    React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={clsx('inline-flex items-center gap-1', className)} {...props} />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
    <a
        ref={ref}
        className={clsx(
            'cursor-pointer transition-colors duration-150 hover:text-lumex-text',
            className
        )}
        {...props}
    />
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={clsx('font-medium text-lumex-text', className)}
        {...props}
    />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLLIElement>) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={clsx('text-lumex-sub', className)}
        {...props}
    >
        {children ?? (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        )}
    </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
