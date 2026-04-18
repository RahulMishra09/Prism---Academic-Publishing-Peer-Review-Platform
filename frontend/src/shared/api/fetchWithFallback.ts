/**
 * fetchWithFallback
 *
 * Wraps the standard API fetchClient. If the API call fails for any reason
 * (network error, 4xx/5xx, dev mode without a backend), it transparently falls
 * back to fetching data from a local static JSON file in /public/mock-data/.
 *
 * This lets you:
 *  1. Point the query at a real API endpoint — works in production.
 *  2. Develop offline using the JSON files.
 *  3. Edit /public/mock-data/*.json to add/change data without touching code.
 *
 * To disable the fallback and use only real API data, simply pass
 * `fallbackJsonPath: undefined` (or remove it from the call).
 */

import { fetchClient } from './base';

export async function fetchWithFallback<T>(
    /** The real API endpoint, e.g. "/journals?page=1" */
    endpoint: string,
    /** Relative path under /public, e.g. "/mock-data/journals.json" */
    fallbackJsonPath: string,
    options: RequestInit = {}
): Promise<T> {
    try {
        return await fetchClient<T>(endpoint, options);
    } catch (err) {
        console.warn(
            `[Lumex] API call to "${endpoint}" failed. Falling back to "${fallbackJsonPath}".`,
            err
        );
        const res = await fetch(fallbackJsonPath);
        if (!res.ok) {
            throw new Error(
                `Both API and mock fallback failed for "${endpoint}". Status: ${res.status}`
            );
        }
        return res.json() as Promise<T>;
    }
}

/**
 * Convenience wrapper: fetches directly from a JSON file.
 * Use this for homepage data that has no real API counterpart yet.
 */
export async function fetchFromJson<T>(jsonPath: string): Promise<T> {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(`Failed to fetch JSON from "${jsonPath}". Status: ${res.status}`);
    return res.json() as Promise<T>;
}
