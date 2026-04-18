/** Build the URL for an article page. */
export function articleUrl(doi: string): string {
    return `/article/${encodeURIComponent(doi)}`;
}

/** Build the URL for a journal home page. */
export function journalUrl(slug: string): string {
    return `/journal/${slug}`;
}

/** Build the URL for a book page. */
export function bookUrl(isbn: string): string {
    return `/book/${isbn}`;
}

/** Build the URL for a chapter page. */
export function chapterUrl(doi: string): string {
    return `/chapter/${encodeURIComponent(doi)}`;
}

/** Build the URL for an author page. */
export function authorUrl(authorId: string): string {
    return `/author/${authorId}`;
}

/** Build the URL for a search results page. */
export function searchUrl(query: string, extra?: Record<string, string>): string {
    const params = new URLSearchParams({ query, ...extra });
    return `/search?${params.toString()}`;
}

/** Build the URL for a discipline/subject area page. */
export function disciplineUrl(slug: string): string {
    return `/discipline/${slug}`;
}

/** Ensure a URL is absolute (adds https:// if missing). */
export function ensureAbsoluteUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
}
