import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient, ApiError } from '../../../shared/api/base';
import type { User } from '../../../shared/types/user.types';
import type { ApiResponse } from '../../../shared/types/api.types';

export const userKeys = {
    all: ['user'] as const,
    me: () => [...userKeys.all, 'me'] as const,
};

export function useAuth() {
    return useQuery({
        queryKey: userKeys.me(),
        queryFn: async () => {
            try {
                const res = await fetchClient<ApiResponse<User>>('/auth/me');
                return res.data;
            } catch (error: unknown) {
                if (error instanceof ApiError && error.status === 401) return null;
                throw error;
            }
        },
        retry: false, // Don't retry auth checks constantly if 401
        staleTime: Infinity, // Trust local cache until explicit logout/mutation
    });
}

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: { email?: string; password?: string }) => {
            const res = await fetchClient<ApiResponse<{ user: User; accessToken: string }>>(
                '/auth/login',
                {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                }
            );
            return res.data;
        },
        onSuccess: data => {
            localStorage.setItem('mock_token', data.accessToken);
            // Manually seed the global cache ensuring immediate UI updates removing auth spinner delay
            queryClient.setQueryData(userKeys.me(), data.user);
        },
    });
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await fetchClient('/auth/logout', { method: 'POST' });
        },
        onSuccess: () => {
            localStorage.removeItem('mock_token');
            // Clear cache universally rendering users back to strictly public gates
            queryClient.setQueryData(userKeys.me(), null);
        },
    });
}
