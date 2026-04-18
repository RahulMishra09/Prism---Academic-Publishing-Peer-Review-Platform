import React from 'react';
import { clsx } from 'clsx';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'col';
    gap?: 'sm' | 'md' | 'lg' | 'none';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between';
}

export function Stack({
    className,
    direction = 'col',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    ...props
}: StackProps) {
    const gapStyles = {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
    };

    const alignStyles = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
    };

    const justifyStyles = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
    };

    return (
        <div
            className={clsx(
                'flex',
                direction === 'col' ? 'flex-col' : 'flex-row',
                gapStyles[gap],
                alignStyles[align],
                justifyStyles[justify],
                className
            )}
            {...props}
        />
    );
}
