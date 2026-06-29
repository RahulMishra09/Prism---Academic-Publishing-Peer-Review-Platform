import React from 'react';
import { Stack, Link, Badge } from '../../../shared/ui';
import type { BookChapter } from '../model/types';
import { AuthorList } from '../../article/ui/AuthorList';

export interface ChapterCardProps {
    chapter: BookChapter;
    className?: string;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, className }) => {
    return (
        <article
            className={`py-5 border-b border-lumex-border last:border-0 ${className || ''}`}
        >
            <Stack direction="col" gap="sm">
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                        Chapter
                    </Badge>
                </div>

                <h3 className="text-xl font-serif text-lumex-blue font-bold leading-snug">
                    <Link
                        to={`/chapter/${encodeURIComponent(chapter.doi)}`}
                        className="hover:underline"
                    >
                        {chapter.title}
                    </Link>
                </h3>

                <div className="mt-1">
                    <AuthorList authors={chapter.authors} maxVisible={3} className="text-sm" />
                </div>

                <div className="mt-2 text-sm text-lumex-text-secondary border-l-4 border-lumex-border-light pl-3 py-1">
                    <span className="block mb-1 text-xs uppercase tracking-wider font-semibold text-gray-500">
                        From the book:
                    </span>
                    <Link
                        to={`/book/${encodeURIComponent(chapter.bookDoi)}`}
                        className="font-semibold text-lumex-text-main hover:underline"
                    >
                        {chapter.bookTitle}
                    </Link>
                    <div className="mt-1">
                        Published {chapter.publishYear} • pp. {chapter.pages}
                    </div>
                </div>
            </Stack>
        </article>
    );
};
