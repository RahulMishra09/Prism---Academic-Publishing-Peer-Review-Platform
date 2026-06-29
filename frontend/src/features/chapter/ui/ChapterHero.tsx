import React from 'react';
import type { BookChapter } from '../../../entities/book/model/types';
import type { Author } from '../../../entities/article/model/types';
import { Button, Container, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../../../shared/ui';

export interface ChapterHeroProps {
    chapter: BookChapter;
    onDownloadPdf?: () => void;
    onCite?: () => void;
}

export const ChapterHero: React.FC<ChapterHeroProps> = ({ chapter, onDownloadPdf, onCite }) => {
    return (
        <div className="bg-lumex-bg-light border-b border-lumex-border pb-8">
            <Container className="pt-8">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/book/${encodeURIComponent(chapter.bookDoi)}`} className="line-clamp-1 max-w-[300px] inline-block align-bottom">{chapter.bookTitle}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Chapter</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Book source link */}
                <div className="mb-4 text-sm">
                    <span className="text-gray-500">Chapter in: </span>
                    <a
                        href={`/book/${encodeURIComponent(chapter.bookDoi)}`}
                        className="text-lumex-blue hover:underline font-bold font-serif italic"
                    >
                        {chapter.bookTitle}
                    </a>
                    {chapter.pages && (
                        <span className="text-gray-500 ml-2">· pp. {chapter.pages}</span>
                    )}
                    <span className="text-gray-500 ml-2">· {chapter.publishYear}</span>
                </div>

                {/* Chapter title */}
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-lumex-text leading-tight mb-5">
                    {chapter.title}
                </h1>

                {/* Authors */}
                <div className="mb-6 text-lumex-blue font-medium leading-relaxed">
                    {chapter.authors.map((author: Author, index: number) => (
                        <span key={author.id} className="inline-flex items-center">
                            <a
                                href={`/search?author=${encodeURIComponent(author.name)}`}
                                className="hover:underline"
                            >
                                {author.name}
                            </a>
                            {index < chapter.authors.length - 1 && (
                                <span className="text-lumex-text mx-1">, </span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                    <Button
                        variant="primary"
                        className="font-bold shadow-sm"
                        onClick={onDownloadPdf}
                    >
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
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download PDF
                    </Button>
                    <Button variant="outline" onClick={onCite} className="font-bold">
                        Cite this chapter
                    </Button>
                    <a
                        href={`https://doi.org/${chapter.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-lumex-blue font-mono"
                    >
                        DOI: {chapter.doi}
                    </a>
                </div>
            </Container>
        </div>
    );
};
