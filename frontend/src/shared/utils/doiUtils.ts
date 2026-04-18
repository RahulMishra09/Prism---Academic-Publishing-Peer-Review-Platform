/** Format a DOI for display (without the resolver URL prefix). */
export function formatDoi(doi: string): string {
    return doi.startsWith('https://doi.org/') ? doi.slice('https://doi.org/'.length) : doi;
}

/** Convert a DOI to its canonical resolver URL. */
export function doiToUrl(doi: string): string {
    const clean = formatDoi(doi);
    return `https://doi.org/${clean}`;
}

/** Parse the registrant prefix (e.g. "10.1007") from a DOI. */
export function parseDoi(doi: string): { prefix: string; suffix: string } | null {
    const clean = formatDoi(doi);
    const match = clean.match(/^(10\.\d{4,9})\/(.+)$/);
    if (!match) return null;
    return { prefix: match[1], suffix: match[2] };
}

/** Check whether a string looks like a valid DOI. */
export function isValidDoi(doi: string): boolean {
    return /^(https?:\/\/doi\.org\/)?10\.\d{4,9}\/.+/.test(doi.trim());
}

/** Build an article page URL from a DOI (URL-encoded). */
export function doiToArticleUrl(doi: string): string {
    return `/article/${encodeURIComponent(formatDoi(doi))}`;
}
