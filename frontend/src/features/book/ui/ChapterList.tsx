import React, { useState } from 'react';
import type { BookChapter } from '../../../entities/book/model/types';

export interface ChapterListProps {
    chapters: BookChapter[];
    bookIsbn: string;
    className?: string;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, className }) => {
    const [search, setSearch] = useState('');

    const filtered = chapters.filter(
        ch =>
            ch.title.toLowerCase().includes(search.toLowerCase()) ||
            ch.authors.some(a => a.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className={className}>
            {/* Search */}
            <div className="relative mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search chapters…"
                    className="w-full pl-10 pr-4 py-2.5 border border-lumex-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue transition"
                />
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-lumex-muted"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </div>

            {/* Chapter count */}
            <p className="text-sm text-lumex-muted mb-4">
                {filtered.length === chapters.length
                    ? `${chapters.length} chapter${chapters.length !== 1 ? 's' : ''}`
                    : `${filtered.length} of ${chapters.length} chapters`}
            </p>

            {/* List */}
            {filtered.length === 0 ? (
                <p className="text-center text-lumex-muted py-12 italic">
                    No chapters match your search.
                </p>
            ) : (
                <ol className="space-y-0 border border-lumex-border rounded overflow-hidden divide-y divide-lumex-border">
                    {filtered.map((chapter, idx) => (
                        <li
                            key={chapter.id}
                            className="flex items-start gap-4 p-4 bg-white hover:bg-lumex-bg-light transition-colors group"
                        >
                            <span className="text-lg font-bold text-lumex-muted shrink-0 w-8 text-right mt-0.5">
                                {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <a
                                    href={`/chapter/${encodeURIComponent(chapter.doi)}`}
                                    className="text-lumex-blue font-bold hover:underline leading-snug group-hover:text-lumex-blue-dark line-clamp-2"
                                >
                                    {chapter.title}
                                </a>
                                <p className="text-sm text-lumex-muted mt-1">
                                    {chapter.authors.map(a => a.name).join(', ')}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-lumex-muted">
                                    {chapter.pages && <span>Pages {chapter.pages}</span>}
                                    <a
                                        href={`https://doi.org/${chapter.doi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lumex-blue/70 hover:underline font-mono"
                                    >
                                        {chapter.doi}
                                    </a>
                                </div>
                            </div>
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
                                className="text-lumex-muted group-hover:text-lumex-blue transition-colors shrink-0 mt-1"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};
