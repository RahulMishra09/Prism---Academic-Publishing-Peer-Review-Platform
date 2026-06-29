import React from 'react';
import { clsx } from 'clsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export type PaginationProps = React.HTMLAttributes<HTMLElement>;

export const Pagination = ({ className, ...props }: PaginationProps) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={clsx('mx-auto flex w-full justify-center', className)}
        {...props}
    />
);
Pagination.displayName = 'Pagination';

export const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul ref={ref} className={clsx('flex flex-row items-center gap-1', className)} {...props} />
));
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
    ({ className, ...props }, ref) => <li ref={ref} className={clsx('', className)} {...props} />
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
    isActive?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
    <a
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
            'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-lumex-bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue disabled:pointer-events-none disabled:opacity-50',
            isActive
                ? 'bg-lumex-blue text-white hover:bg-lumex-blue-dark'
                : 'text-lumex-text cursor-pointer',
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
        className={clsx('gap-1 pr-2.5 w-auto px-3', className)}
        {...props}
    >
        <FaChevronLeft className="h-3 w-3" />
        <span className="hidden sm:block">Previous</span>
    </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        className={clsx('gap-1 pl-2.5 w-auto px-3', className)}
        {...props}
    >
        <span className="hidden sm:block">Next</span>
        <FaChevronRight className="h-3 w-3" />
    </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
        aria-hidden
        className={clsx('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        ...
    </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
