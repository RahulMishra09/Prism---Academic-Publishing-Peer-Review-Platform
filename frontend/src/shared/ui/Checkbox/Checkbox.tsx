import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { FaCheck } from 'react-icons/fa';
import { clsx } from 'clsx';

export const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={clsx(
            'peer h-4 w-4 shrink-0 rounded-sm border border-lumex-border bg-lumex-bg-white ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-lumex-blue data-[state=checked]:border-lumex-blue data-[state=checked]:text-white',
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={clsx('flex items-center justify-center text-current')}
        >
            <FaCheck className="h-2.5 w-2.5" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
