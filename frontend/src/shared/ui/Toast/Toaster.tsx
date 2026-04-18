import React from 'react';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from './Toast';
import { useToast } from './useToast';

/**
 * Global Toaster component to render active toasts.
 * Place this in the root of your application.
 */
export const Toaster: React.FC = () => {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(({ id, title, description, variant, ...props }) => (
                <Toast key={id} variant={variant} {...props}>
                    <div className="grid gap-1">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && (
                            <ToastDescription>{description}</ToastDescription>
                        )}
                    </div>
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport />
        </ToastProvider>
    );
};
