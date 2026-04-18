import React from 'react';
import { Stack, Tag } from '../../../shared/ui';

export interface KeywordListProps {
    keywords: string[];
    maxVisible?: number;
    className?: string;
}

export const KeywordList: React.FC<KeywordListProps> = ({
    keywords,
    maxVisible = keywords.length,
    className,
}) => {
    if (!keywords || keywords.length === 0) return null;

    const visibleKeywords = keywords.slice(0, maxVisible);
    const hiddenCount = keywords.length - visibleKeywords.length;

    return (
        <Stack direction="row" gap="sm" className={`flex-wrap ${className || ''}`}>
            {visibleKeywords.map((keyword) => (
                <Tag key={keyword}>{keyword}</Tag>
            ))}
            {hiddenCount > 0 && (
                <Tag className="text-lumex-muted font-semibold">
                    +{hiddenCount} more
                </Tag>
            )}
        </Stack>
    );
};
