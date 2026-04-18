import React from 'react';
import type { Book } from '../../../entities/book/model/types';

export interface BookSidebarProps {
    book: Book;
    className?: string;
}

export const BookSidebar: React.FC<BookSidebarProps> = ({ book, className }) => {
    return (
        <aside className={`space-y-6 ${className || ''}`}>
            {/* Quick Info */}
            <div className="bg-lumex-bg-white border border-lumex-border rounded-lg p-4 text-sm space-y-3">
                <h4 className="text-xs font-bold text-lumex-muted uppercase tracking-wider">
                    Book Info
                </h4>

                <div>
                    <p className="text-xs text-lumex-sub">Publisher</p>
                    <p className="font-semibold text-lumex-text">{book.publisher}</p>
                </div>
                <div>
                    <p className="text-xs text-lumex-sub">Published</p>
                    <p className="font-semibold text-lumex-text">{book.publishYear}</p>
                </div>
                {book.edition && (
                    <div>
                        <p className="text-xs text-lumex-sub">Edition</p>
                        <p className="font-semibold text-lumex-text">{book.edition}</p>
                    </div>
                )}
                <div>
                    <p className="text-xs text-lumex-sub mb-0.5">ISBN</p>
                    <p className="font-mono text-xs text-lumex-text">{book.isbn}</p>
                </div>
                <div>
                    <p className="text-xs text-lumex-sub mb-0.5">DOI</p>
                    <a
                        href={`https://doi.org/${book.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-lumex-blue hover:underline break-all"
                    >
                        {book.doi}
                    </a>
                </div>
            </div>

            {/* Copyright & Access */}
            <div className="bg-lumex-bg-white border border-lumex-border rounded-lg p-4 text-sm">
                <h4 className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-3">
                    Access Options
                </h4>
                <div className="space-y-2 text-lumex-muted text-xs leading-relaxed">
                    <p>✓ Individual chapter purchase available</p>
                    <p>✓ eBook available for institutions</p>
                    <p>✓ MyCopy softcover for personal use</p>
                </div>
                <button className="mt-4 w-full py-2 px-4 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors">
                    Buy this book
                </button>
            </div>

            {/* Editors */}
            {book.editors && book.editors.length > 0 && (
                <div className="bg-lumex-bg-white border border-lumex-border rounded-lg p-4 text-sm">
                    <h4 className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-3">
                        Editor{book.editors.length > 1 ? 's' : ''}
                    </h4>
                    <ul className="space-y-2">
                        {book.editors.map(ed => (
                            <li key={ed.id}>
                                <a
                                    href={`/search?author=${encodeURIComponent(ed.name)}`}
                                    className="text-lumex-blue hover:underline font-medium text-sm"
                                >
                                    {ed.name}
                                </a>
                                {ed.affiliations?.[0] && (
                                    <p className="text-xs text-lumex-sub mt-0.5">
                                        {ed.affiliations[0].name}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Series/Related placeholder */}
            <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg p-4 text-sm text-center text-lumex-sub italic">
                Related books will appear here
            </div>
        </aside>
    );
};
