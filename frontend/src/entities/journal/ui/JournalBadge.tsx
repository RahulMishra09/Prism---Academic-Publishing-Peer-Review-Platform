import React from 'react';
import { Badge, type BadgeProps } from '../../../shared/ui';
import type { JournalAccessType } from '../model/types';

export interface JournalBadgeProps {
    type?: 'access' | 'quartile';
    accessType?: JournalAccessType;
    quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    className?: string;
}

export const JournalBadge: React.FC<JournalBadgeProps> = ({
    type = 'access',
    accessType,
    quartile,
    className,
}) => {
    if (type === 'access' && accessType) {
        let variant: BadgeProps['variant'] = 'default';
        let label = '';

        switch (accessType) {
            case 'gold_oa':
                variant = 'oa';
                label = 'Open Access';
                break;
            case 'hybrid':
                variant = 'journal';
                label = 'Hybrid (Open Choice)';
                break;
            case 'free':
                variant = 'default';
                label = 'Free Access';
                break;
            case 'subscription':
                variant = 'outline';
                label = 'Subscription';
                break;
            default:
                return null;
        }

        return (
            <Badge variant={variant} className={className}>
                {label}
            </Badge>
        );
    }

    if (type === 'quartile' && quartile) {
        const isHighTier = quartile === 'Q1';
        return (
            <Badge
                variant={isHighTier ? 'journal' : 'outline'}
                className={className}
                title={`Journal Rank: ${quartile}`}
            >
                {quartile}
            </Badge>
        );
    }

    return null;
};
