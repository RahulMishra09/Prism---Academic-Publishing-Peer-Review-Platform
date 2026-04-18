import type { Article } from '../../entities/article/model/types';

/** Determine if the user can view the full text of an article. */
export function canViewFullText(article: Article, isAuthenticated = false): boolean {
    switch (article.accessLevel) {
        case 'open_access':
        case 'free_to_read':
            return true;
        case 'subscribed':
            return isAuthenticated;
        case 'requires_purchase':
            return false;
        default:
            return false;
    }
}

/** Get a human-readable access level label. */
export function getAccessLabel(accessLevel: Article['accessLevel']): string {
    const labels: Record<Article['accessLevel'], string> = {
        open_access: 'Open Access',
        free_to_read: 'Free to Read',
        subscribed: 'Subscriber Access',
        requires_purchase: 'Purchase Required',
    };
    return labels[accessLevel] ?? 'Unknown';
}

/** Get the badge color for an access level. */
export function getAccessBadgeColor(accessLevel: Article['accessLevel']): string {
    const colors: Record<Article['accessLevel'], string> = {
        open_access: 'bg-lumex-oa-gold text-white',
        free_to_read: 'bg-green-500 text-white',
        subscribed: 'bg-lumex-blue text-white',
        requires_purchase: 'bg-gray-400 text-white',
    };
    return colors[accessLevel] ?? 'bg-gray-200 text-gray-700';
}

/** Check if an article is open access. */
export function isOpenAccess(article: Article): boolean {
    return article.accessLevel === 'open_access';
}
