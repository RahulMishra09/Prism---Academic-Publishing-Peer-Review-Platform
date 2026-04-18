import { useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './shared/api/queryClient';
import { Toaster } from './shared/ui';
import { useAuthStore } from './app/store/useAuthStore';
import { useThemeStore } from './entities/theme/model/useThemeStore';


import { router } from './app/router/routes';

function App() {
    const checkInstitutionalAccess = useAuthStore(state => state.checkInstitutionalAccess);

    useEffect(() => {
        // Ping the backend on initial load to resolve IP-based entitlements
        void checkInstitutionalAccess();
    }, [checkInstitutionalAccess]);

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
                <Toaster />
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        </QueryClientProvider>
    );
}

export default App;

