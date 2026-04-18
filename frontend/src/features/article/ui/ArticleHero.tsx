import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Badge,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from '../../../shared/ui';
import type { Article, Author, Affiliation } from '../../../entities/article/model/types';

export interface ArticleHeroProps {
    article: Article;
    className?: string;
    onDownloadPdf?: () => void;
    onCite?: () => void;
    onShare?: () => void;
    isSaved?: boolean;
    onToggleSave?: () => void;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({
    article,
    className,
    onDownloadPdf,
    onCite,
    onShare,
    isSaved,
    onToggleSave,
}) => {
    const navigate = useNavigate();
    const [showAllAffiliations, setShowAllAffiliations] = useState(false);

    // Extract unique affiliations across all authors
    const allAffiliations = Array.from(
        new Map(
            article.authors
                .flatMap((a: Author) => a.affiliations)
                .map((aff: Affiliation) => [aff.id, aff])
        ).values()
    ).sort((a: Affiliation, b: Affiliation) => a.id.localeCompare(b.id));

    const visibleAffiliations = showAllAffiliations ? allAffiliations : allAffiliations.slice(0, 3);

    return (
        <div
            className={`bg-lumex-bg-light border-b border-lumex-border pb-8 ${className || ''}`}
        >
            <div className="max-w-4xl pt-8 px-4 sm:px-6 lg:px-8 mx-auto xl:mx-0 xl:ml-[max(0px,calc((100vw-1280px)/2))]">
                {/* Top Metadata Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-medium">
                    <span className="text-lumex-text tracking-wide uppercase">
                        {article.articleType.replace('-', ' ')}
                    </span>
                    <span className="text-lumex-muted">|</span>
                    {article.accessLevel === 'open_access' && (
                        <Badge variant="oa" className="px-2 py-0.5 text-xs font-bold shadow-sm">
                            Open Access
                        </Badge>
                    )}
                    <span className="text-lumex-muted">|</span>
                    <span className="text-lumex-muted">
                        Published:{' '}
                        {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }).format(new Date(article.publishedDate))}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-lumex-text leading-tight mb-6">
                    {article.title}
                </h1>
                {article.subtitle && (
                    <h2 className="text-xl md:text-2xl font-serif text-lumex-text-secondary leading-snug mb-6">
                        {article.subtitle}
                    </h2>
                )}

                {/* Journal Ref */}
                <div className="mb-6">
                    <a
                        href={`/journal/${article.journalSlug}`}
                        className="text-lg font-bold text-lumex-blue hover:underline font-serif italic"
                    >
                        {article.journalTitle}
                    </a>
                    <span className="text-lumex-muted ml-2">
                        {article.volume && `volume ${article.volume}`}
                        {article.issue && `, issue ${article.issue}`}
                        {article.pages && `, pages ${article.pages}`} (
                        {new Date(article.publishedDate).getFullYear()})
                    </span>
                </div>

                {/* Authors List */}
                <div className="mb-6 text-lumex-blue font-medium leading-relaxed">
                    {article.authors.map((author: Author, index: number) => (
                        <span key={author.id} className="inline-flex items-center">
                            <a
                                href={`/search?author=${encodeURIComponent(author.name)}`}
                                className="hover:underline"
                            >
                                {author.name}
                            </a>
                            {author.affiliations.length > 0 && (
                                <sup className="ml-0.5 text-gray-500">
                                    {author.affiliations
                                        .map(
                                            (a: Affiliation) =>
                                                allAffiliations.findIndex(
                                                    (aff: Affiliation) => aff.id === a.id
                                                ) + 1
                                        )
                                        .join(',')}
                                </sup>
                            )}
                            {author.isCorresponding && author.email && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="inline-block relative">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    stroke="none"
                                                    className="ml-1 text-gray-400 inline cursor-help"
                                                >
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline
                                                        points="22,6 12,13 2,6"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                        fill="none"
                                                    />
                                                </svg>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            Corresponding author: {author.email}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {index < article.authors.length - 1 && (
                                <span className="text-lumex-text mx-1">, </span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Affiliations List */}
                {allAffiliations.length > 0 && (
                    <div className="mb-8 text-sm text-gray-600 space-y-1">
                        {visibleAffiliations.map((aff: Affiliation) => (
                            <div key={aff.id} className="flex">
                                <sup className="mr-2 mt-1">
                                    {allAffiliations.findIndex(
                                        (a: Affiliation) => a.id === aff.id
                                    ) + 1}
                                </sup>
                                <span>
                                    {aff.name}
                                    {aff.department && `, ${aff.department}`}
                                    {aff.city && `, ${aff.city}`}
                                    {aff.country && `, ${aff.country}`}
                                </span>
                            </div>
                        ))}
                        {allAffiliations.length > 3 && !showAllAffiliations && (
                            <button
                                onClick={() => setShowAllAffiliations(true)}
                                className="text-lumex-blue hover:underline text-xs font-bold mt-2"
                            >
                                Show all {allAffiliations.length} affiliations
                            </button>
                        )}
                    </div>
                )}

                {/* Article Action Bar */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-lumex-border">
                    <Button
                        variant="primary"
                        className="font-bold shadow-md bg-lumex-accent hover:bg-lumex-accent-dark"
                        onClick={() => void navigate(`/article/${article.id}/read`)}
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
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        Read Full Article
                    </Button>

                    <Button
                        variant="outline"
                        className="font-bold border-lumex-border text-lumex-text hover:bg-lumex-bg-deep transition-all"
                        onClick={onDownloadPdf}
                        disabled={
                            !article.pdfUrl &&
                            article.accessLevel !== 'open_access' &&
                            article.accessLevel !== 'subscribed'
                        }
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
                        Cite this article
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onToggleSave}
                        className={`font-bold transition-colors ${isSaved ? 'text-lumex-blue bg-lumex-blue/5 border-lumex-blue' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={isSaved ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        {isSaved ? 'Saved to Library' : 'Save to Library'}
                    </Button>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="inline-block relative">
                                    <Button
                                        variant="outline"
                                        onClick={onShare}
                                        className="font-bold border-transparent hover:bg-lumex-bg-deep text-lumex-text"
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
                                            <circle cx="18" cy="5" r="3" />
                                            <circle cx="6" cy="12" r="3" />
                                            <circle cx="18" cy="19" r="3" />
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                        </svg>
                                        Share
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Share via Email, Twitter, or LinkedIn
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};
