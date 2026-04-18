export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    status: number;
    code: string;
    message: string;
    details?: Record<string, string[]>;
}
