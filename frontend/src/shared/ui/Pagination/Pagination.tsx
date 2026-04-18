import React from 'react';
import { clsx } from 'clsx';

export type PaginationProps = React.HTMLAttributes<HTMLElement>;

export const Pagination = ({ className, ...props }: PaginationProps) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={clsx('flex w-full items-center justify-center', className)}
        {...props}
    />
);
Pagination.displayName = 'Pagination';

export const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul ref={ref} className={clsx('flex items-center gap-1', className)} {...props} />
));
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={clsx('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
    isActive?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
    <a
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
            'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm font-medium',
            'transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue focus-visible:ring-offset-1',
            isActive
                ? 'bg-lumex-blue text-white shadow-sm'
                : 'text-lumex-muted hover:bg-lumex-bg-deep hover:text-lumex-text',
            className
        )}
        {...props}
    />
);
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        className={clsx('w-auto gap-1.5 px-3', className)}
        {...props}
    >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:block text-sm">Prev</span>
    </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        className={clsx('w-auto gap-1.5 px-3', className)}
        {...props}
    >
        <span className="hidden sm:block text-sm">Next</span>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
        aria-hidden
        className={clsx(
            'flex h-8 w-8 items-center justify-center text-lumex-sub text-sm',
            className
        )}
        {...props}
    >
        &hellip;
    </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
