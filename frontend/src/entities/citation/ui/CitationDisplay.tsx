import React, { useState } from 'react';
import { Button, Stack, Link } from '../../../shared/ui';
import type { Article } from '../../article/model/types';

export interface CitationDisplayProps {
    article: Article;
    className?: string;
}

type CitationStyle = 'RIS' | 'ENW' | 'BIB';

export const CitationDisplay: React.FC<CitationDisplayProps> = ({ article, className }) => {
    const [downloadFormat, setDownloadFormat] = useState<CitationStyle>('RIS');

    // Simple string formatter for display
    const authorString =
        article.authors
            .slice(0, 3)
            .map(a => a.lastName)
            .join(', ') + (article.authors.length > 3 ? ' et al.' : '');

    const citationText = `${authorString} ${article.title}. ${article.journalTitle} ${article.volume ? article.volume : ''}, ${article.pages ? article.pages : ''} (${new Date(article.publishedDate).getFullYear()}). https://doi.org/${article.doi}`;

    const handleDownload = () => {
        // Fake download interaction
        alert(`Downloading citation for ${article.doi} in ${downloadFormat} format.`);
    };

    return (
        <div
            className={`p-5 bg-gray-50 border border-lumex-border rounded-sm ${className || ''}`}
        >
            <h3 className="font-bold text-lg mb-3 font-serif">Cite this article</h3>

            <div className="p-3 bg-white border border-gray-200 text-sm font-sans mb-4 select-all selection:bg-lumex-blue selection:text-white line-clamp-4">
                {citationText}
            </div>

            <Stack direction="row" gap="md" className="items-center flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-700">Download citation:</span>
                    {(['RIS', 'ENW', 'BIB'] as CitationStyle[]).map(format => (
                        <button
                            key={format}
                            onClick={() => setDownloadFormat(format)}
                            className={`px-2 py-1 border text-xs font-semibold ${downloadFormat === format ? 'bg-lumex-blue text-white border-lumex-blue' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'} transition-colors`}
                        >
                            .{format.toLowerCase()}
                        </button>
                    ))}
                </div>
                <Button variant="outline" size="sm" onClick={handleDownload} className="ml-auto">
                    Download
                </Button>
            </Stack>

            <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-center text-gray-500">
                <Link to="https://citationstyles.org/" external className="hover:underline">
                    View standard formatting rules
                </Link>
            </div>
        </div>
    );
};
