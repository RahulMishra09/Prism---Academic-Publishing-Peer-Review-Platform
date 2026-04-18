/**
 * Format a publication date string for display.
 * Accepts ISO date strings or year-only strings.
 */
export function formatPublicationDate(dateStr: string | undefined | null): string {
    if (!dateStr) return '';
    // Year-only
    if (/^\d{4}$/.test(dateStr)) return dateStr;
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

/** Format a date as short month + year (e.g. "Jan 2024"). */
export function formatMonthYear(dateStr: string | undefined | null): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

/** Return relative time string (e.g. "3 days ago"). */
export function relativeDate(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

/** Extract the year from a date string. */
export function extractYear(dateStr: string | undefined | null): string {
    if (!dateStr) return '';
    if (/^\d{4}$/.test(dateStr)) return dateStr;
    try {
        return String(new Date(dateStr).getFullYear());
    } catch {
        return dateStr;
    }
}
