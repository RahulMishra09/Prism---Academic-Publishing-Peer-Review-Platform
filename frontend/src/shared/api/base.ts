import type { ApiError as ApiErrorType } from '../types/api.types';
import { toast } from '../ui/Toast/useToast';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/** Custom error class for API errors — extends Error so `instanceof` checks work correctly. */
export class ApiError extends Error implements ApiErrorType {
    status: number;
    code: string;
    details?: Record<string, string[]>;

    constructor(data: ApiErrorType) {
        super(data.message);
        this.name = 'ApiError';
        this.status = data.status;
        this.code = data.code;
        this.details = data.details;
    }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;

        const data = await res.json() as { data: { accessToken: string; refreshToken?: string } };
        localStorage.setItem('mock_token', data.data.accessToken);
        if (data.data.refreshToken) localStorage.setItem('refresh_token', data.data.refreshToken);
        return true;
    } catch {
        return false;
    }
}

export async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Network offline check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new ApiError({
            status: 0,
            code: 'NETWORK_OFFLINE',
            message: 'You appear to be offline. Please check your internet connection.',
        });
    }

    const defaultHeaders: Record<string, string> = {};
    if (!(options?.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    // Attach access token
    const token = localStorage.getItem('mock_token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 30s request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            signal: options.signal || controller.signal,
        });
    } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof DOMException && err.name === 'AbortError') {
            const timeoutErr = new ApiError({
                status: 0,
                code: 'REQUEST_TIMEOUT',
                message: 'The request timed out. Please try again.',
            });
            handleGlobalError(timeoutErr);
            throw timeoutErr;
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }

    // Auto-refresh on 401 (skip for auth endpoints to avoid loops)
    if (response.status === 401 && !endpoint.startsWith('/auth/')) {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = tryRefreshToken().finally(() => { isRefreshing = false; });
        }

        const refreshed = await refreshPromise;
        if (refreshed) {
            // Retry the original request with the new token
            const newToken = localStorage.getItem('mock_token');
            const retryHeaders: Record<string, string> = { ...defaultHeaders };
            if (newToken) retryHeaders['Authorization'] = `Bearer ${newToken}`;

            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: { ...retryHeaders, ...options.headers },
            });

            if (!retryResponse.ok) {
                const errorData = await retryResponse.json().catch(() => ({})) as Record<string, string | string[] | undefined>;
                const apiErr = new ApiError({
                    status: retryResponse.status,
                    code: String(errorData.code || 'UNKNOWN_ERROR'),
                    message: String(errorData.error || errorData.message || 'An error occurred during the request'),
                    details: errorData.details as Record<string, string[]> | undefined,
                });
                handleGlobalError(apiErr);
                throw apiErr;
            }
            return retryResponse.json() as Promise<T>;
        }

        // Refresh failed — clear auth and redirect to login
        localStorage.removeItem('mock_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as Record<string, string | string[] | undefined>;
        const apiErr = new ApiError({
            status: response.status,
            code: String(errorData.code || 'UNKNOWN_ERROR'),
            message: String(errorData.error || errorData.message || 'An error occurred during the request'),
            details: errorData.details as Record<string, string[]> | undefined,
        });
        handleGlobalError(apiErr);
        throw apiErr;
    }

    return response.json() as Promise<T>;
}

/** Global error side-effects (toasts, redirects) — the error is still thrown for callers to handle. */
function handleGlobalError(err: ApiError) {
    if (err.status === 429) {
        toast({
            title: 'Too many requests',
            description: 'Please slow down and try again in a moment.',
            variant: 'destructive',
        });
    } else if (err.status === 0 && err.code === 'REQUEST_TIMEOUT') {
        toast({
            title: 'Request timed out',
            description: 'The server took too long to respond. Please try again.',
            variant: 'destructive',
        });
    } else if (err.status === 0 && err.code === 'NETWORK_OFFLINE') {
        toast({
            title: 'You are offline',
            description: 'Please check your internet connection and try again.',
            variant: 'destructive',
        });
    } else if (err.status >= 500) {
        toast({
            title: 'Server error',
            description: 'Something went wrong on our end. Please try again later.',
            variant: 'destructive',
        });
    }
}
