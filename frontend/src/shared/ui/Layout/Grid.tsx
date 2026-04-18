import React from 'react';
import { clsx } from 'clsx';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4 | 6 | 12;
    gap?: 'sm' | 'md' | 'lg' | 'none';
}

export function Grid({ className, cols = 1, gap = 'md', ...props }: GridProps) {
    const colStyles = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6',
        12: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
    };

    const gapStyles = {
        none: 'gap-0',
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
    };

    return <div className={clsx('grid', colStyles[cols], gapStyles[gap], className)} {...props} />;
}
