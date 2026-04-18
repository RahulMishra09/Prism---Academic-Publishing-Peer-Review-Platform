import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TwoColumnLayout } from '../../../app/layouts';
import { Container, Skeleton } from '../../../shared/ui';
import { BookHero, ChapterList } from '../../../features/book';
import { BookSidebar } from '../../../widgets/book-sidebar';
import type { Book, BookChapter } from '../../../entities/book/model/types';

import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';

const fetchBook = async (isbn: string): Promise<{ book: Book; chapters: BookChapter[] }> => {
    const bookRes = await fetchWithFallback<{ books?: Book[]; data?: Book[] }>(
        `/books/${isbn}`,
        '/mock-data/books.json'
    );
    const bookList = ('books' in bookRes ? bookRes.books : bookRes.data) || [];
    const book = bookList.find((b: Book) => b.isbn === isbn) || bookList[0];

    if (!book) throw new Error('Book not found');

    const chaptersRes = await fetchWithFallback<{ chapters?: BookChapter[]; data?: BookChapter[] }>(
        `/books/${isbn}/chapters`,
        '/mock-data/chapters.json'
    );
    const allChapters = ('chapters' in chaptersRes ? chaptersRes.chapters : chaptersRes.data) || [];
    const chapters = allChapters.filter((c: BookChapter) => c.bookDoi === book.doi);

    return { book, chapters };
};

type BookTab = 'overview' | 'chapters' | 'references';

export const BookPage: React.FC = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const [activeTab, setActiveTab] = useState<BookTab>('overview');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['book', isbn],
        queryFn: () => fetchBook(isbn!),
        enabled: !!isbn,
    });

    if (!isbn) return <Navigate to="/" replace />;

    if (isLoading) {
        return (
            <Container className="py-12">
                <div className="flex gap-8">
                    <Skeleton className="w-48 h-64 shrink-0" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-2/3" />
                    </div>
                </div>
            </Container>
        );
    }

    if (isError || !data) {
        return (
            <Container className="py-16 text-center">
                <h1 className="text-3xl font-serif text-lumex-blue mb-4">Book Not Found</h1>
                <p className="text-lumex-muted mb-8">
                    The book with ISBN <code>{isbn}</code> could not be found.
                </p>
                <Link to="/search" className="text-lumex-blue hover:underline font-bold">
                    ← Back to Search
                </Link>
            </Container>
        );
    }

    const { book, chapters } = data;

    const tabs: { id: BookTab; label: string; count?: number }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'chapters', label: 'Chapters', count: chapters.length },
        { id: 'references', label: 'About this book' },
    ];

    return (
        <>
            {/* Book Hero */}
            <BookHero
                book={book}
                chapterCount={chapters.length}
                onBuy={() => alert('Redirect to purchase')}
                onCite={() => alert('Open citation modal')}
            />

            {/* Tab Bar */}
            <div className="border-b border-lumex-border bg-white sticky top-0 z-30 shadow-sm">
                <Container>
                    <nav className="flex gap-0 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-lumex-blue text-lumex-blue'
                                        : 'border-transparent text-lumex-muted hover:text-lumex-text hover:border-lumex-border'
                                    }`}
                            >
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-lumex-bg-deep text-lumex-muted rounded text-xs font-normal">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </Container>
            </div>

            {/* Content */}
            <TwoColumnLayout
                main={
                    <div className="py-8">
                        {activeTab === 'overview' && (
                            <div className="prose prose-lumex max-w-none">
                                <h2 className="text-2xl font-serif font-bold text-lumex-blue mb-4">
                                    About this book
                                </h2>
                                <p className="text-lumex-muted italic">
                                    Book description and abstract content will appear here once
                                    available from the backend.
                                </p>
                            </div>
                        )}

                        {activeTab === 'chapters' && (
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-lumex-blue mb-6">
                                    Table of Contents
                                </h2>
                                <ChapterList chapters={chapters} bookIsbn={book.isbn} />
                            </div>
                        )}

                        {activeTab === 'references' && (
                            <div className="prose prose-lumex max-w-none space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-lumex-blue mb-4">
                                    About this book
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white border border-lumex-border rounded-lg p-5">
                                        <h3 className="font-bold text-lumex-text mb-3 text-sm uppercase tracking-wider">
                                            Bibliographic Information
                                        </h3>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-lumex-muted">DOI</dt>
                                                <dd className="font-mono text-xs">{book.doi}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-lumex-muted">ISBN (eBook)</dt>
                                                <dd className="font-mono text-xs">{book.isbn}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-lumex-muted">Publisher</dt>
                                                <dd>{book.publisher}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-lumex-muted">Copyright</dt>
                                                <dd>{book.publishYear}</dd>
                                            </div>
                                            {book.edition && (
                                                <div className="flex justify-between">
                                                    <dt className="text-lumex-muted">Edition</dt>
                                                    <dd>{book.edition}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
                sidebar={<BookSidebar book={book} />}
            />
        </>
    );
};
