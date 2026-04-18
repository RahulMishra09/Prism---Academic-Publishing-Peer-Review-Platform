import { useSyncExternalStore } from 'react';

/** Returns true when the given media query matches. */
export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (callback) => {
            const mq = window.matchMedia(query);
            mq.addEventListener('change', callback);
            return () => mq.removeEventListener('change', callback);
        },
        () => window.matchMedia(query).matches,
        () => false // Server-side fallback
    );
}

/** Convenience hook for common Lumex breakpoints. */
export function useBreakpoint() {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 991px)');
    const isDesktop = useMediaQuery('(min-width: 992px)');
    const isWide = useMediaQuery('(min-width: 1200px)');
    return { isMobile, isTablet, isDesktop, isWide };
}
