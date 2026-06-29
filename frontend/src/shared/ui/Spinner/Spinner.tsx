import React from 'react';
import { clsx } from 'clsx';
import { FaSpinner } from 'react-icons/fa';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
    size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <FaSpinner
            className={clsx('animate-spin text-lumex-blue', sizes[size], className)}
            {...props}
        />
    );
}
