import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={clsx(
            'flex items-center gap-0 border-b border-lumex-border',
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={clsx(
            'relative px-4 py-2.5 text-sm font-medium text-lumex-muted',
            'transition-colors duration-150',
            'hover:text-lumex-text',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue focus-visible:ring-inset',
            'disabled:pointer-events-none disabled:opacity-40',
            // active underline indicator
            'after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:rounded-t-full after:bg-lumex-blue after:scale-x-0 after:transition-transform after:duration-150',
            'data-[state=active]:text-lumex-blue data-[state=active]:after:scale-x-100',
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={clsx(
            'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumex-blue focus-visible:ring-offset-2',
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
