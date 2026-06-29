import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Skeleton, Badge } from '../../../shared/ui';
import { useQuery } from '@tanstack/react-query';
import { FaBookOpen } from 'react-icons/fa';

interface Book {
    id: string;
    title: string;
    authors: string[];
    isbn: string;
    publishedYear: number;
    coverImageUrl: string;
    type: string;
    discipline: string;
    price: string;
    description: string;
}

export const FeaturedBooks: React.FC = () => {
    const { data: books, isLoading } = useQuery<Book[]>({
        queryKey: ['featured-books'],
        queryFn: async () => {
            const res = await fetch('/mock-data/books.json');
            if (!res.ok) throw new Error('Failed to fetch books');
            return await res.json() as Book[];
        }
    });

    if (isLoading) {
        return (
            <section className="py-16 bg-lumex-bg">
                <Container>
                    <Skeleton className="h-8 w-64 mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
                    </div>
                </Container>
            </section>
        );
    }

    if (!books || books.length === 0) return null;

    return (
        <section className="py-20 bg-lumex-bg border-y border-lumex-border/50">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-2 text-lumex-blue">
                            <FaBookOpen className="text-xl" />
                            <span className="text-sm font-bold uppercase tracking-wider">Monographs & Reference</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-lumex-text">Featured Books</h2>
                        <p className="text-lumex-muted mt-2 max-w-2xl">Discover comprehensive academic texts, monographs, and conference proceedings from leading researchers.</p>
                    </div>
                    <Link to="/search?type=book" className="text-lumex-blue font-semibold hover:underline text-sm flex-shrink-0">
                        Browse all books →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
                    {books.map(book => (
                        <div key={book.id} className="group flex flex-col">
                            {/* 3D Book Cover Effect */}
                            <div className="relative aspect-[2/3] mb-4 perspective-1000">
                                <Link to={`/book/${encodeURIComponent(book.isbn)}`} className="block w-full h-full transform-gpu transition-all duration-300 group-hover:-rotate-y-12 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-2xl shadow-lg shadow-black/10 rounded-r-md rounded-l-sm overflow-hidden border-l-4 border-black/20 origin-left">
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent w-4 z-10 mix-blend-multiply" />
                                    <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                                </Link>
                                <div className="absolute top-2 right-2 z-20 shadow-sm">
                                    <Badge variant="default" className="text-[9px] bg-white/90 backdrop-blur-sm text-slate-900 px-1.5 py-0.5 border-none shadow-sm font-bold">{book.type}</Badge>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <h3 className="font-serif font-bold text-lumex-text text-sm leading-snug mb-1.5 group-hover:text-lumex-blue transition-colors line-clamp-2">
                                    <Link to={`/book/${encodeURIComponent(book.isbn)}`}>{book.title}</Link>
                                </h3>
                                <p className="text-xs text-lumex-muted line-clamp-1 mb-2">
                                    {book.authors?.map((a: any) => `${a.firstName} ${a.lastName}`).join(', ')}
                                </p>
                                <div className="mt-auto">
                                    <p className="text-[10px] font-semibold text-lumex-blue uppercase tracking-wider mb-1">{book.discipline}</p>
                                    <p className="text-sm font-bold text-lumex-text">{book.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
