import { useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './shared/api/queryClient';
import { Toaster } from './shared/ui';
import { useAuthStore } from './app/store/useAuthStore';
import { useThemeStore } from './entities/theme/model/useThemeStore';

import { router } from './app/router/routes';
import React from 'react';

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => { window.location.href = '/'; }}
                                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition-colors"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function App() {
    const checkInstitutionalAccess = useAuthStore(state => state.checkInstitutionalAccess);
    const verifyAuth = useAuthStore(state => state.verifyAuth);

    useEffect(() => {
        // Validate persisted token against the backend on app startup
        void verifyAuth();
        // Ping the backend on initial load to resolve IP-based entitlements
        void checkInstitutionalAccess();
    }, [verifyAuth, checkInstitutionalAccess]);

    const theme = useThemeStore(state => state.theme);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <Toaster />
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;

