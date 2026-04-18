import React from 'react';
import type { Book } from '../../../entities/book/model/types';
import type { Author } from '../../../entities/article/model/types';
import { Button, Badge } from '../../../shared/ui';

export interface BookHeroProps {
    book: Book;
    chapterCount?: number;
    onBuy?: () => void;
    onCite?: () => void;
}

export const BookHero: React.FC<BookHeroProps> = ({ book, chapterCount, onBuy, onCite }) => {
    const allPersons: Author[] = [...(book.editors || []), ...(book.authors || [])];
    const isEdited = (book.editors || []).length > 0;

    return (
        <div className="bg-lumex-bg-light border-b border-lumex-border pb-10">
            <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-lumex-muted mb-6">
                    <a href="/" className="hover:text-lumex-blue">
                        Home
                    </a>
                    <span className="mx-2">›</span>
                    <a href="/books" className="hover:text-lumex-blue">
                        Books
                    </a>
                    <span className="mx-2">›</span>
                    <span className="text-lumex-text font-medium line-clamp-1">
                        {book.title}
                    </span>
                </nav>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cover */}
                    <div className="shrink-0">
                        {book.coverImageUrl ? (
                            <img
                                src={book.coverImageUrl}
                                alt={`Cover of ${book.title}`}
                                className="w-40 md:w-52 shadow-lg border border-lumex-border rounded"
                            />
                        ) : (
                            <div className="w-40 md:w-52 aspect-[3/4] bg-gradient-to-br from-lumex-blue to-lumex-blue-dark rounded shadow-lg flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-50"
                                >
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                        {/* Book Type Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <Badge
                                variant="outline"
                                className="text-xs font-bold uppercase tracking-wide"
                            >
                                {book.type.replace('-', ' ')}
                            </Badge>
                            {book.edition && (
                                <span className="text-xs text-lumex-muted font-medium">
                                    {book.edition} Edition
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-lumex-text leading-tight mb-3">
                            {book.title}
                        </h1>
                        {book.subtitle && (
                            <h2 className="text-xl font-serif text-lumex-text-secondary mb-5">
                                {book.subtitle}
                            </h2>
                        )}

                        {/* Authors/Editors */}
                        <div className="mb-5 text-sm text-lumex-text leading-relaxed">
                            <span className="font-semibold text-lumex-text">
                                {isEdited ? 'Editors: ' : 'Authors: '}
                            </span>
                            {allPersons.map((p, i) => (
                                <span key={p.id}>
                                    <a
                                        href={`/search?author=${encodeURIComponent(p.name)}`}
                                        className="text-lumex-blue hover:underline font-medium"
                                    >
                                        {p.name}
                                    </a>
                                    {i < allPersons.length - 1 && ', '}
                                </span>
                            ))}
                        </div>

                        {/* Publisher Row */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
                            <div>
                                <span className="text-lumex-muted">Publisher</span>
                                <p className="font-semibold text-lumex-text">{book.publisher}</p>
                            </div>
                            <div>
                                <span className="text-lumex-muted">Year</span>
                                <p className="font-semibold text-lumex-text">
                                    {book.publishYear}
                                </p>
                            </div>
                            <div>
                                <span className="text-lumex-muted">ISBN</span>
                                <p className="font-mono text-lumex-text text-xs mt-0.5">
                                    {book.isbn}
                                </p>
                            </div>
                            {chapterCount !== undefined && (
                                <div>
                                    <span className="text-lumex-muted">Chapters</span>
                                    <p className="font-semibold text-lumex-text">
                                        {chapterCount}
                                    </p>
                                </div>
                            )}
                            <div>
                                <span className="text-lumex-muted">DOI</span>
                                <a
                                    href={`https://doi.org/${book.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lumex-blue hover:underline text-xs block mt-0.5 font-mono break-all"
                                >
                                    {book.doi}
                                </a>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary" onClick={onBuy} className="font-bold">
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
                                    className="mr-2"
                                >
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Buy this book
                            </Button>
                            <Button variant="outline" onClick={onCite} className="font-bold">
                                Cite this book
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
