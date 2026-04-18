import React from 'react';
import { Stack, Link, Image, Badge } from '../../../shared/ui';
import type { Book } from '../model/types';

export interface BookCardProps {
    book: Book;
    className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({ book, className }) => {
    // Prefer authors, fallback to editors
    const primaryContributors =
        book.authors && book.authors.length > 0
            ? { role: 'Author', list: book.authors }
            : { role: 'Editor', list: book.editors };

    const contributorNames = primaryContributors.list
        ?.map(c => c.name || `${c.firstName} ${c.lastName}`)
        .join(', ');

    return (
        <article
            className={`p-4 sm:p-5 bg-white border border-lumex-border hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 ${className || ''}`}
        >
            {book.coverImageUrl ? (
                <div className="flex-shrink-0 w-24 h-36 border border-lumex-border-light bg-lumex-bg flex items-center justify-center">
                    <Image
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-contain"
                    />
                </div>
            ) : (
                <div className="flex-shrink-0 w-24 h-36 border border-lumex-border-light bg-lumex-bg flex items-center justify-center text-xs text-center text-lumex-muted p-2">
                    No Cover Available
                </div>
            )}

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <Stack direction="col" gap="sm">
                    <div className="mb-1">
                        <Badge variant="default" className="text-xs">
                            Book
                        </Badge>
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif font-bold text-lumex-blue leading-snug">
                        <Link
                            to={`/book/${encodeURIComponent(book.doi)}`}
                            className="hover:underline"
                        >
                            {book.title}
                            {book.subtitle && (
                                <span className="block text-base font-normal mt-1">
                                    {book.subtitle}
                                </span>
                            )}
                        </Link>
                    </h3>

                    {contributorNames && (
                        <div className="text-sm text-lumex-text-main mt-1">
                            {contributorNames}{' '}
                            <span className="italic text-lumex-muted text-xs ml-1">
                                ({primaryContributors.role}s)
                            </span>
                        </div>
                    )}

                    <div className="text-sm text-lumex-text-secondary mt-2">
                        Published {book.publishYear} • {book.publisher}
                        {book.edition && ` • ${book.edition} Edition`}
                    </div>
                </Stack>
            </div>
        </article>
    );
};
