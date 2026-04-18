import { useState, useEffect, useCallback } from 'react';

/** Persist state in localStorage, synced across tabs. */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            setStoredValue(current => {
                const next = value instanceof Function ? value(current) : value;
                window.localStorage.setItem(key, JSON.stringify(next));
                return next;
            });
        } catch {
            // ignore write errors
        }
    }, [key]);

    // Sync across tabs
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue) as T);
                } catch {
                    /* ignore */
                }
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [key]);

    return [storedValue, setValue];
}
