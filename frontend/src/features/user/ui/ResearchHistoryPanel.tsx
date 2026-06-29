import React from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../../article/hooks/useRecentlyViewed';
import { ArticleCard } from '../../../entities/article/ui/ArticleCard';
import { Button } from '../../../shared/ui';
import { useReadingHistory } from '../api/useUserDashboard';

export const ResearchHistoryPanel: React.FC = () => {
    const { recentArticles, clearHistory } = useRecentlyViewed();
    const { data: backendHistory, isLoading } = useReadingHistory();

    // Use backend data if available, otherwise fall back to localStorage
    const hasBackendData = backendHistory && backendHistory.items.length > 0;

    if (isLoading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
            </div>
        );
    }

    if (hasBackendData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-lumex-border pb-4">
                    <p className="text-sm text-gray-600">
                        Showing your last {backendHistory.items.length} viewed articles.
                    </p>
                </div>
                <div className="divide-y divide-lumex-border">
                    {backendHistory.items.map((item) => (
                        <div key={item.id} className="py-4">
                            <Link to={`/article/${encodeURIComponent(item.doi)}`} className="block group">
                                <h3 className="text-sm font-bold text-lumex-text group-hover:text-lumex-blue transition-colors leading-snug mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-lumex-muted">{item.authors}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-lumex-sub">
                                    <span>{item.journalTitle}</span>
                                    <span>Viewed {new Date(item.viewedAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Fall back to localStorage-based history
    if (recentArticles.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 flex justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-lumex-text mb-2">No research history yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Articles you view while signed in will appear here for easy access.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-lumex-border pb-4">
                <p className="text-sm text-gray-600">
                    Showing your last {recentArticles.length} viewed articles.
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-700 border-red-100 hover:bg-red-50 font-bold"
                >
                    Clear History
                </Button>
            </div>
            <div className="divide-y divide-lumex-border">
                {recentArticles.map((article) => (
                    <ArticleCard key={article.doi} article={article} />
                ))}
            </div>
        </div>
    );
};
