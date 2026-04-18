import React from 'react';
import { clsx } from 'clsx';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
}

export function Container({ className, as: Component = 'div', ...props }: ContainerProps) {
    return (
        <Component
            className={clsx('mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8', className)}
            {...props}
        />
    );
}
