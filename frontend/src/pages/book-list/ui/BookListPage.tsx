import React from 'react';
import { Container, Skeleton } from '../../../shared/ui';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import type { Book } from '../../../entities/book/model/types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const BookListPage: React.FC = () => {
    const [activeLetter, setActiveLetter] = React.useState('A');

    const { data: books = [], isLoading } = useQuery({
        queryKey: ['all-books'],
        queryFn: async () => {
            const res = await fetch('/mock-data/books.json').then(r => r.json());
            const bookList = Array.isArray(res) ? res : (('books' in res ? res.books : res.data) || []);
            return bookList as Book[];
        },
    });

    const filtered = books.filter(b => b.title.toUpperCase().startsWith(activeLetter) || (activeLetter === 'A' && b.title.startsWith('Q')));

    return (
        <div className="py-10 bg-lumex-bg min-h-[70vh]">
            <Container>
                <h1 className="text-3xl font-serif font-bold text-lumex-text mb-2">
                    Browse Books
                </h1>
                <p className="text-lumex-muted mb-8">
                    Browse our collection of books alphabetically.
                </p>

                {/* A-Z nav */}
                <div className="flex flex-wrap gap-1 mb-8">
                    {ALPHABET.map(letter => (
                        <button
                            key={letter}
                            onClick={() => setActiveLetter(letter)}
                            className={`w-9 h-9 text-sm font-bold rounded transition-colors ${activeLetter === letter
                                ? 'bg-lumex-blue text-white'
                                : 'bg-lumex-card border border-lumex-border text-lumex-text hover:border-lumex-blue hover:text-lumex-blue'
                                }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {isLoading && ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'].map((id) => (
                        <Skeleton key={id} className="aspect-[3/4] w-full rounded-lg" />
                    ))}
                    {!isLoading && filtered.length === 0 && (
                        <p className="col-span-full text-lumex-muted italic py-8 text-center">
                            No books found for "{activeLetter}"
                        </p>
                    )}
                    {!isLoading && filtered.length > 0 && (
                        filtered.map(book => (
                            <Link
                                key={book.id}
                                to={`/book/${encodeURIComponent(book.isbn || book.id)}`}
                                className="bg-lumex-card border border-lumex-border rounded-lg overflow-hidden hover:border-lumex-blue hover:shadow-md transition-all group flex flex-col h-full"
                            >
                                <div className="aspect-[3/4] bg-lumex-bg-deep relative overflow-hidden border-b border-lumex-border">
                                    {book.coverImageUrl ? (
                                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lumex-muted text-sm italic">No cover</div>
                                    )}
                                </div>
                                <div className="p-3 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lumex-text group-hover:text-lumex-blue transition-colors mb-1 text-xs md:text-sm line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-[10px] md:text-xs text-lumex-muted mt-auto">ISBN: {book.isbn}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
};
