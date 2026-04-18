import React from 'react';
import { Stack, Link } from '../../../shared/ui';

export interface ArticleMetaProps {
    doi?: string;
    publishedDate?: string;
    journalTitle?: string;
    journalSlug?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    className?: string;
}

export const ArticleMeta: React.FC<ArticleMetaProps> = ({
    doi,
    publishedDate,
    journalTitle,
    journalSlug,
    volume,
    issue,
    pages,
    className,
}) => {
    const formattedDate = publishedDate
        ? new Date(publishedDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : null;

    return (
        <Stack
            direction="row"
            gap="md"
            className={`flex-wrap text-sm text-lumex-muted ${className || ''}`}
        >
            {journalTitle && (
                <div className="font-semibold text-lumex-text">
                    {journalSlug ? (
                        <Link
                            to={`/journals/${journalSlug}`}
                            className="text-inherit hover:underline"
                        >
                            {journalTitle}
                        </Link>
                    ) : (
                        journalTitle
                    )}
                </div>
            )}

            {formattedDate && (
                <div className="flex items-center">
                    <span className="mr-2 text-lumex-muted hidden sm:inline">•</span>
                    Published: {formattedDate}
                </div>
            )}

            {(volume || issue) && (
                <div className="flex items-center">
                    <span className="mr-2 text-lumex-muted hidden sm:inline">•</span>
                    {volume && `Volume ${volume}`}
                    {issue && `, Issue ${issue}`}
                    {pages && `, pp. ${pages}`}
                </div>
            )}
            {doi && (
                <div className="flex items-center">
                    <span className="mr-2 text-lumex-muted hidden sm:inline">•</span>
                    DOI:{' '}
                    <Link to={`https://doi.org/${doi}`} className="ml-1" external>
                        {doi}
                    </Link>
                </div>
            )}
        </Stack>
    );
};
