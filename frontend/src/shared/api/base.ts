import type { ApiError as ApiErrorType } from '../types/api.types';

export const API_BASE_URL = '/api';

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

export async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Check for local storage mock token for requests
    const token = localStorage.getItem('mock_token');
    if (token) {
        Object.assign(defaultHeaders, { Authorization: `Bearer ${token}` });
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as Record<string, string | string[] | undefined>;
        throw new ApiError({
            status: response.status,
            code: String(errorData.code || 'UNKNOWN_ERROR'),
            message: String(errorData.error || errorData.message || 'An error occurred during the request'),
            details: errorData.details as Record<string, string[]> | undefined,
        });
    }

    return response.json() as Promise<T>;
}
