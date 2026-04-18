import { useCallback } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import type { Article, ArticleSummary } from '../../../entities/article/model/types';

export interface SavedArticleEntry {
    id: string;
    doi: string;
    title: string;
    authors: string;
    journalTitle: string;
    savedAt: string;
}

const STORAGE_KEY = 'lumex_saved_articles';

export function useSavedArticles() {
    const [savedArticles, setSavedArticles] = useLocalStorage<SavedArticleEntry[]>(STORAGE_KEY, []);

    const saveArticle = useCallback((article: Article | ArticleSummary) => {
        setSavedArticles(prev => {
            if (prev.some(a => a.doi === article.doi)) return prev;

            const authorNames = Array.isArray(article.authors)
                ? article.authors.map(a => typeof a === 'string' ? a : a.name).join(', ')
                : '';

            const entry: SavedArticleEntry = {
                id: article.id || `saved-${Date.now()}`,
                doi: article.doi,
                title: article.title,
                authors: authorNames,
                journalTitle: article.journalTitle,
                savedAt: new Date().toISOString(),
            };

            return [entry, ...prev];
        });
    }, [setSavedArticles]);

    const removeArticle = useCallback((doi: string) => {
        setSavedArticles(prev => prev.filter(a => a.doi !== doi));
    }, [setSavedArticles]);

    const isSaved = useCallback((doi: string) => {
        return savedArticles.some(a => a.doi === doi);
    }, [savedArticles]);

    const toggleSave = useCallback((article: Article | ArticleSummary) => {
        if (isSaved(article.doi)) {
            removeArticle(article.doi);
            return false;
        } else {
            saveArticle(article);
            return true;
        }
    }, [isSaved, removeArticle, saveArticle]);

    return {
        savedArticles,
        saveArticle,
        removeArticle,
        isSaved,
        toggleSave,
    };
}
