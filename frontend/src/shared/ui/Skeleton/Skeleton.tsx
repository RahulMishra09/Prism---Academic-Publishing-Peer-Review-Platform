import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'rect' | 'circle';
    lines?: number;
}

export function Skeleton({ className, variant = 'rect', lines = 1, ...props }: SkeletonProps) {
    if (variant === 'text' && lines > 1) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            'skeleton rounded',
                            i === lines - 1 ? 'w-3/4' : 'w-full',
                            'h-4',
                            className
                        )}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={clsx(
                'skeleton',
                variant === 'circle' ? 'rounded-full' : 'rounded-lg',
                variant === 'text' && 'h-4 w-full rounded',
                className
            )}
            {...props}
        />
    );
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={clsx('rounded-card border border-lumex-border bg-lumex-card p-4 space-y-3', className)}>
            <div className="skeleton h-40 w-full rounded-lg" />
            <Skeleton variant="text" className="h-5 w-3/4" />
            <Skeleton variant="text" lines={2} />
            <div className="flex gap-2 pt-1">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-20 rounded-full" />
            </div>
        </div>
    );
}

export function SkeletonArticleRow({ className }: { className?: string }) {
    return (
        <div className={clsx('flex gap-4 py-4 border-b border-lumex-border', className)}>
            <div className="skeleton h-16 w-16 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="h-4 w-1/4" />
                <Skeleton variant="text" className="h-5 w-3/4" />
                <Skeleton variant="text" className="h-3.5 w-1/2" />
            </div>
        </div>
    );
}
