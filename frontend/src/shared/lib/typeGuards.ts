/**
 * Type guard utilities for runtime type narrowing.
 * Use these instead of `as any` casts for type-safe property checks.
 */

/** Check if a value is a non-null object (not null, not an array). */
export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard: checks if an unknown value is an object with a specific key.
 * Useful for discriminating API responses from fallback JSON shapes.
 *
 * @example
 * const res = await fetchWithFallback<ApiResponse<T>>(endpoint, jsonPath);
 * if (hasKey(res, 'articles')) {
 *   // res is narrowed to { articles: unknown, ... }
 *   const articles = res.articles as Article[];
 * }
 */
export function hasKey<K extends string>(
    value: unknown,
    key: K
): value is Record<K, unknown> {
    return isRecord(value) && key in value;
}
