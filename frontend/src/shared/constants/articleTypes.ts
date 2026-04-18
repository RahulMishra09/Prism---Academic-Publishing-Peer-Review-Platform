export const ARTICLE_TYPES = [
    { value: 'research-article', label: 'Research Article' },
    { value: 'review-article', label: 'Review Article' },
    { value: 'letter', label: 'Letter' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'comment', label: 'Comment' },
    { value: 'case-report', label: 'Case Report' },
    { value: 'short-communication', label: 'Short Communication' },
    { value: 'book-review', label: 'Book Review' },
    { value: 'correction', label: 'Correction' },
    { value: 'retraction', label: 'Retraction' },
    { value: 'conference-paper', label: 'Conference Paper' },
    { value: 'preprint', label: 'Preprint' },
] as const;

export type ArticleTypeValue = (typeof ARTICLE_TYPES)[number]['value'];
