import type { Author } from '../../entities/article/model/types';

/** Format author as "Last, First" */
export function formatAuthorFull(author: Author): string {
    return author.firstName ? `${author.lastName}, ${author.firstName}` : author.lastName;
}

/** Format author as "F. Last" (short form) */
export function formatAuthorShort(author: Author): string {
    if (!author.firstName) return author.lastName;
    const initials = author.firstName
        .split(' ')
        .map(n => `${n[0]}.`)
        .join(' ');
    return `${initials} ${author.lastName}`;
}

/** Format a list of authors for display in a citation */
export function formatAuthorList(authors: Author[], maxShow = 6): string {
    if (authors.length === 0) return '';
    if (authors.length === 1) return formatAuthorFull(authors[0]);
    if (authors.length <= maxShow) {
        return authors.map(formatAuthorFull).join(', ');
    }
    return `${authors.slice(0, maxShow).map(formatAuthorFull).join(', ')} et al.`;
}

/** Format author list for APA style ("Last, F. I., & Last, F. I.") */
export function formatAuthorListAPA(authors: Author[]): string {
    if (authors.length === 0) return '';
    const formatted = authors.map(a => {
        const initials = a.firstName
            ? a.firstName
                  .split(' ')
                  .map(n => `${n[0]}.`)
                  .join(' ')
            : '';
        return initials ? `${a.lastName}, ${initials}` : a.lastName;
    });
    if (formatted.length === 1) return formatted[0];
    return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
}
