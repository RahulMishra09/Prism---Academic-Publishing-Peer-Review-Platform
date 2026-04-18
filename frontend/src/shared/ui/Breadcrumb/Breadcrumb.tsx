import React from 'react';
import { clsx } from 'clsx';
import { FaChevronRight } from 'react-icons/fa';

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
            'flex flex-wrap items-center gap-1.5 break-words text-sm text-lumex-muted sm:gap-2.5 list-none',
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
    <li ref={ref} className={clsx('inline-flex items-center gap-1.5', className)} {...props} />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
    <a
        ref={ref}
        className={clsx(
            'transition-colors hover:text-lumex-text hover:underline cursor-pointer',
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
        className={clsx('font-normal text-lumex-text', className)}
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
        className={clsx('[&>svg]:h-3 [&>svg]:w-3 opacity-50', className)}
        {...props}
    >
        {children ?? <FaChevronRight />}
    </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
