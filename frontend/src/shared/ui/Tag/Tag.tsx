import React from 'react';
import { clsx } from 'clsx';

export type TagProps = React.HTMLAttributes<HTMLDivElement>;

export function Tag({ className, ...props }: TagProps) {
    return (
        <div
            className={clsx(
                'inline-flex items-center rounded-full bg-lumex-bg-light px-3 py-1 text-sm font-medium text-lumex-text transition-colors hover:bg-lumex-border cursor-pointer',
                className
            )}
            {...props}
        />
    );
}
