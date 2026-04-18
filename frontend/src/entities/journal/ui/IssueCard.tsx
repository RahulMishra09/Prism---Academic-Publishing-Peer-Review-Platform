import React from 'react';
import { Link } from '../../../shared/ui';
import type { JournalIssue } from '../model/types';

export interface IssueCardProps {
    issue: JournalIssue;
    journalTitle: string;
    className?: string;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, journalTitle, className }) => {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const displayDate = issue.month
        ? `${monthNames[issue.month - 1]} ${issue.year}`
        : `Year ${issue.year}`;

    return (
        <div
            className={`p-4 bg-lumex-bg-deep border-l-4 border-lumex-blue flex justify-between items-center ${className || ''}`}
        >
            <div>
                <h4 className="font-bold text-lumex-text-main text-lg mb-1">
                    <Link
                        to={`/journal/${issue.journalSlug}/volume/${issue.volume}/issue/${issue.issue}`}
                        className="hover:underline"
                    >
                        {journalTitle} - Volume {issue.volume}, Issue {issue.issue}
                    </Link>
                </h4>
                <div className="text-sm text-lumex-text-secondary">
                    <span className="font-semibold">{displayDate}</span> • Contains{' '}
                    {issue.articleCount} Articles
                </div>
            </div>
            {/* Possibly an icon or arrow */}
            <span className="text-lumex-blue text-xl leading-none font-bold" aria-hidden="true">
                &rsaquo;
            </span>
        </div>
    );
};
