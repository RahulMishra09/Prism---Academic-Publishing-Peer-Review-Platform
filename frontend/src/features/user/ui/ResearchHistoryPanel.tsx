import React from 'react';
import { useRecentlyViewed } from '../../article/hooks/useRecentlyViewed';
import { ArticleCard } from '../../../entities/article/ui/ArticleCard';
import { Button } from '../../../shared/ui';

export const ResearchHistoryPanel: React.FC = () => {
    const { recentArticles, clearHistory } = useRecentlyViewed();

    if (recentArticles.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 flex justify-center text-lumex-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-lumex-text mb-2">No research history yet</h3>
                <p className="text-lumex-muted max-w-sm mx-auto">
                    Articles you view while signed in will appear here for easy access.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-lumex-border pb-4">
                <p className="text-sm text-lumex-muted">
                    Showing your last {recentArticles.length} viewed articles.
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="text-lumex-red hover:text-lumex-red border-red-100 hover:bg-lumex-red/5 font-bold"
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
