import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { clsx } from 'clsx';

export interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'violet' | 'teal' | 'amber';
    showValue?: boolean;
    label?: string;
}

const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' };
const colors  = {
    blue:   'bg-lumex-blue',
    violet: 'bg-prism-violet',
    teal:   'bg-prism-teal',
    amber:  'bg-lumex-oa-gold',
};

export const ProgressBar = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressBarProps
>(({ className, value, size = 'md', color = 'blue', showValue = false, label, ...props }, ref) => (
    <div className="w-full space-y-1">
        {(label || showValue) && (
            <div className="flex items-center justify-between">
                {label && <span className="text-xs font-medium text-lumex-muted">{label}</span>}
                {showValue && (
                    <span className="text-xs font-semibold text-lumex-text tabular-nums">
                        {value ?? 0}%
                    </span>
                )}
            </div>
        )}
        <ProgressPrimitive.Root
            ref={ref}
            className={clsx(
                'relative w-full overflow-hidden rounded-full bg-lumex-border',
                heights[size],
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={clsx('h-full transition-all duration-500 ease-out rounded-full', colors[color])}
                style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    </div>
));
ProgressBar.displayName = 'ProgressBar';
