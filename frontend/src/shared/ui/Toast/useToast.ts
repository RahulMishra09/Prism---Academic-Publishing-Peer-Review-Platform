import { useState, useEffect } from 'react';

export type ToastVariant = 'default' | 'destructive';

export interface ToastData {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
}

// Singleton state to manage toasts globally
let listeners: Array<(toasts: ToastData[]) => void> = [];
let toasts: ToastData[] = [];

const notify = () => {
    listeners.forEach((l) => l([...toasts]));
};

/**
 * Trigger a toast notification from anywhere in the app.
 */
export const toast = ({ title, description, variant = 'default' }: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };

    // Keep only the last 5 toasts
    toasts = [newToast, ...toasts].slice(0, 5);
    notify();

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        toasts = toasts.filter((t) => t.id !== id);
        notify();
    }, 5000);

    return id;
};

/**
 * Hook to access active toasts and the toast trigger.
 */
export const useToast = () => {
    const [activeToasts, setActiveToasts] = useState<ToastData[]>(toasts);

    useEffect(() => {
        listeners.push(setActiveToasts);
        return () => {
            listeners = listeners.filter((l) => l !== setActiveToasts);
        };
    }, []);

    return {
        toasts: activeToasts,
        toast,
        dismiss: (id: string) => {
            toasts = toasts.filter((t) => t.id !== id);
            notify();
        },
    };
};
