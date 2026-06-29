import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './base';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                // Don't retry on 4xx client errors (except 408/429)
                if (error instanceof ApiError) {
                    if (error.status === 429) return failureCount < 3; // retry rate-limited with backoff
                    if (error.status >= 400 && error.status < 500) return false;
                }
                return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnReconnect: true,
        },
    },
});
