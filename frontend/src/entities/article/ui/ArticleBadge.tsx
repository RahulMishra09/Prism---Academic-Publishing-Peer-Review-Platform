import React from 'react';
import { Badge, type BadgeProps } from '../../../shared/ui';
import type { AccessLevel, ArticleType } from '../model/types';

export interface ArticleBadgeProps {
    type?: 'access' | 'article-type';
    accessLevel?: AccessLevel;
    articleType?: ArticleType;
    className?: string;
}

export const ArticleBadge: React.FC<ArticleBadgeProps> = ({
    type = 'access',
    accessLevel,
    articleType,
    className,
}) => {
    if (type === 'access' && accessLevel) {
        let variant: BadgeProps['variant'] = 'default';
        let label = '';

        switch (accessLevel) {
            case 'open_access':
                variant = 'oa'; // Gold badge for OA
                label = 'Open Access';
                break;
            case 'free_to_read':
                variant = 'default';
                label = 'Free Access';
                break;
            case 'subscribed':
                variant = 'outline';
                label = 'Subscribed';
                break;
            default:
                return null; // hide for requires_purchase typically, or show different badge
        }

        return (
            <Badge variant={variant} className={className}>
                {label}
            </Badge>
        );
    }

    if (type === 'article-type' && articleType) {
        // Convert e.g. "research-article" to "Research Article"
        const label = articleType
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return (
            <Badge variant="outline" className={className}>
                {label}
            </Badge>
        );
    }

    return null;
};
