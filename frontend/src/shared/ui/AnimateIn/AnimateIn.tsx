import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface AnimateInProps {
    children: React.ReactNode;
    /** Extra classes forwarded to the wrapper div */
    className?: string;
    /** Delay in ms before the transition starts (for stagger effects) */
    delay?: number;
    /** How far down the element starts — defaults to translate-y-4 (16px) */
    distance?: 'sm' | 'md' | 'lg';
    /** Intersection threshold — defaults to 0.1 */
    threshold?: number;
}

const DISTANCE = {
    sm: 'translate-y-2',
    md: 'translate-y-4',
    lg: 'translate-y-8',
};

/**
 * Minimal scroll-triggered fade-up wrapper.
 * Respects prefers-reduced-motion via Tailwind's motion-reduce utilities.
 */
export const AnimateIn: React.FC<AnimateInProps> = ({
    children,
    className = '',
    delay = 0,
    distance = 'md',
    threshold = 0.1,
}) => {
    const [ref, inView] = useIntersectionObserver<HTMLDivElement>({
        threshold,
        triggerOnce: true,
    });

    return (
        <div
            ref={ref}
            className={[
                className,
                'transition-[opacity,transform] duration-700 ease-out',
                'motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0',
                inView
                    ? 'opacity-100 translate-y-0'
                    : `opacity-0 ${DISTANCE[distance]}`,
            ].join(' ')}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
};
