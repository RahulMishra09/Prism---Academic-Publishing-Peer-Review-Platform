import { useCallback } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import type { ArticleSummary } from '../../../entities/article/model/types';

const STORAGE_KEY = 'lumex_recently_viewed';
const MAX_ITEMS = 8;

/**
 * Hook to manage recently viewed articles.
 * Uses shared useLocalStorage for state persistence across tabs.
 */
export const useRecentlyViewed = () => {
    const [recentArticles, setRecentArticles] = useLocalStorage<ArticleSummary[]>(STORAGE_KEY, []);

    /**
     * Track a new article view.
     * Moves the article to the top of the list and enforces MAX_ITEMS limit.
     */
    const trackView = useCallback((article: ArticleSummary) => {
        if (!article.doi) return;

        setRecentArticles(prev => {
            // Remove the article if it already exists to move it to the top
            const filtered = prev.filter(item => item.doi !== article.doi);

            // Construct the new list, keeping only necessary fields for UI
            const summary: ArticleSummary = {
                id: article.id,
                doi: article.doi,
                title: article.title,
                authors: article.authors,
                publishedDate: article.publishedDate,
                articleType: article.articleType,
                accessLevel: article.accessLevel,
                journalTitle: article.journalTitle,
                journalSlug: article.journalSlug,
                metrics: article.metrics,
            };

            return [summary, ...filtered].slice(0, MAX_ITEMS);
        });
    }, [setRecentArticles]);

    /**
     * Clear all browsing history.
     */
    const clearHistory = useCallback(() => {
        setRecentArticles([]);
    }, [setRecentArticles]);

    return {
        recentArticles,
        trackView,
        clearHistory,
    };
};
