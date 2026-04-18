import React from 'react';
import type { SavedArticle } from '../api/useUserDashboard';

export interface SavedArticlesPanelProps {
    articles?: SavedArticle[];
    onRemove?: (doi: string) => void;
}

export const SavedArticlesPanel: React.FC<SavedArticlesPanelProps> = ({
    articles = [],
    onRemove,
}) => {
    if (articles.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-4 opacity-40"
                >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <p className="font-medium">No saved articles yet</p>
                <p className="text-sm mt-1">Articles you save while browsing will appear here</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-lumex-border">
            {articles.map(article => (
                <li key={article.id} className="py-4 flex gap-4 group">
                    <div className="flex-1 min-w-0">
                        <a
                            href={`/article/${encodeURIComponent(article.doi)}`}
                            className="text-lumex-blue font-bold hover:underline line-clamp-2 leading-snug"
                        >
                            {article.title}
                        </a>
                        <p className="text-sm text-gray-500 mt-1">{article.authors}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            <em>{article.journalTitle}</em>
                            <span>·</span>
                            <span>
                                Saved{' '}
                                {new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }).format(new Date(article.savedAt))}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onRemove?.(article.doi)}
                        className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove saved article"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                        </svg>
                    </button>
                </li>
            ))}
        </ul>
    );
};
