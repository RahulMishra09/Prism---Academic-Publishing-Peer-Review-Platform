import { useState, useCallback, useRef, useEffect } from 'react';

interface ClipboardState {
    copied: boolean;
    copy: (text: string) => Promise<void>;
    error: string | null;
}

/** Copy text to clipboard. `copied` resets after 2s. */
export function useCopyToClipboard(): ClipboardState {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setError(null);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Copy failed');
            setCopied(false);
        }
    }, []);

    return { copied, copy, error };
}
