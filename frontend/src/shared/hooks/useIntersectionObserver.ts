import { useState, useEffect, useRef } from 'react';

interface IntersectionOptions extends IntersectionObserverInit {
    triggerOnce?: boolean;
}

/** Observe an element's intersection with the viewport. */
export function useIntersectionObserver<T extends Element>(
    options: IntersectionOptions = {}
): [React.RefObject<T>, boolean] {
    const { triggerOnce = false, ...rest } = options;
    const ref = useRef<T>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (triggerOnce && entry.isIntersecting) {
                observer.unobserve(node);
            }
        }, rest);

        observer.observe(node);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerOnce, rest.threshold, rest.root, rest.rootMargin]);

    return [ref, isIntersecting];
}
