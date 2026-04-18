import React, { useState } from 'react';
import type { Article } from '../../../entities/article/model/types';
import * as Dialog from '@radix-ui/react-dialog';
import { useToast } from '../../../shared/ui/Toast/useToast';

export interface CitationToolsProps {
    article: Article;
    isOpen: boolean;
    onClose: () => void;
}

type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'BibTeX' | 'RIS';

const generateAPA = (article: Article): string => {
    const authors = article.authors.map(a => `${a.lastName}, ${a.firstName.charAt(0)}.`).join(', ');
    const year = new Date(article.publishedDate).getFullYear();
    return `${authors} (${year}). ${article.title}. *${article.journalTitle}*${article.volume ? `, *${article.volume}*` : ''}${article.issue ? `(${article.issue})` : ''}${article.pages ? `, ${article.pages}` : ''}. https://doi.org/${article.doi}`;
};

const generateMLA = (article: Article): string => {
    let authors = '';
    if (article.authors.length === 1) {
        authors = `${article.authors[0].lastName}, ${article.authors[0].firstName}`;
    } else if (article.authors.length === 2) {
        authors = `${article.authors[0].lastName}, ${article.authors[0].firstName}, and ${article.authors[1].firstName} ${article.authors[1].lastName}`;
    } else if (article.authors.length > 2) {
        authors = `${article.authors[0].lastName}, ${article.authors[0].firstName}, et al.`;
    }
    const year = new Date(article.publishedDate).getFullYear();
    return `${authors}. "${article.title}." *${article.journalTitle}*, vol. ${article.volume || 'n/a'}, no. ${article.issue || 'n/a'}, ${year}, pp. ${article.pages || 'n/a'}. DOI:${article.doi}.`;
};

const generateBibTeX = (article: Article): string => {
    const key = `${article.authors[0]?.lastName?.toLowerCase() || 'author'}${new Date(article.publishedDate).getFullYear()}${article.title.split(' ')[0].toLowerCase()}`;
    const authors = article.authors.map(a => `${a.lastName}, ${a.firstName}`).join(' and ');
    return `@article{${key},
  author    = {${authors}},
  title     = {${article.title}},
  journal   = {${article.journalTitle}},
  year      = {${new Date(article.publishedDate).getFullYear()}},
  volume    = {${article.volume || ''}},
  number    = {${article.issue || ''}},
  pages     = {${article.pages || ''}},
  doi       = {${article.doi}},
  issn      = {${article.journalISSN}},
}`;
};

const generateRIS = (article: Article): string => {
    const lines = [
        'TY  - JOUR',
        ...article.authors.map(a => `AU  - ${a.lastName}, ${a.firstName}`),
        `TI  - ${article.title}`,
        `JO  - ${article.journalTitle}`,
        `VL  - ${article.volume || ''}`,
        `IS  - ${article.issue || ''}`,
        `SP  - ${article.pages?.split('-')[0] || ''}`,
        `EP  - ${article.pages?.split('-')[1] || ''}`,
        `PY  - ${new Date(article.publishedDate).getFullYear()}`,
        `DO  - ${article.doi}`,
        `SN  - ${article.journalISSN}`,
        'ER  -',
    ];
    return lines.join('\n');
};

export const CitationTools: React.FC<CitationToolsProps> = ({ article, isOpen, onClose }) => {
    const [activeFormat, setActiveFormat] = useState<CitationFormat>('APA');
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const getCitation = (): string => {
        switch (activeFormat) {
            case 'APA':
                return generateAPA(article);
            case 'MLA':
                return generateMLA(article);
            case 'BibTeX':
                return generateBibTeX(article);
            case 'RIS':
                return generateRIS(article);
            default:
                return generateAPA(article);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getCitation());
            setCopied(true);
            toast({
                title: 'Citation Copied',
                description: `${activeFormat} citation copied to clipboard.`,
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (_err) {
            toast({
                title: 'Copy Failed',
                description: 'Could not copy citation to clipboard.',
                variant: 'destructive',
            });
        }
    };

    const handleDownload = (format: 'ris' | 'bib') => {
        const content = format === 'ris' ? generateRIS(article) : generateBibTeX(article);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `citation-${article.doi.replace('/', '_')}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
            title: 'Download Started',
            description: `Your citation file (${format.toUpperCase()}) is being downloaded.`,
        });
    };

    const formats: CitationFormat[] = ['APA', 'MLA', 'Chicago', 'BibTeX', 'RIS'];

    return (
        <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-lumex-card border border-lumex-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <Dialog.Title className="text-2xl font-serif font-bold text-lumex-text">
                                Cite this article
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button
                                    className="p-2 hover:bg-lumex-bg-deep rounded transition-colors text-lumex-muted hover:text-lumex-text"
                                    aria-label="Close"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* Format Tabs */}
                        <div className="flex gap-1 mb-4 border-b border-lumex-border overflow-x-auto">
                            {formats.map(fmt => (
                                <button
                                    key={fmt}
                                    onClick={() => setActiveFormat(fmt)}
                                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeFormat === fmt
                                            ? 'border-lumex-blue text-lumex-blue'
                                            : 'border-transparent text-lumex-muted hover:text-lumex-text'
                                        }`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>

                        {/* Citation Text */}
                        <div className="bg-lumex-bg-deep border border-lumex-border rounded p-4 mb-4 font-mono text-sm whitespace-pre-wrap leading-relaxed text-lumex-text transition-colors">
                            {getCitation()}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => void handleCopy()}
                                className="flex items-center gap-2 px-4 py-2 bg-lumex-blue text-white rounded font-bold text-sm hover:bg-lumex-blue-dark transition-colors"
                            >
                                {copied ? (
                                    <>
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
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
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
                                        >
                                            <rect
                                                x="9"
                                                y="9"
                                                width="13"
                                                height="13"
                                                rx="2"
                                                ry="2"
                                            />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        Copy Citation
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleDownload('ris')}
                                className="flex items-center gap-2 px-4 py-2 border border-lumex-blue text-lumex-blue rounded font-bold text-sm hover:bg-lumex-blue hover:text-white transition-colors"
                            >
                                Download .ris
                            </button>
                            <button
                                onClick={() => handleDownload('bib')}
                                className="flex items-center gap-2 px-4 py-2 border border-lumex-blue text-lumex-blue rounded font-bold text-sm hover:bg-lumex-blue hover:text-white transition-colors"
                            >
                                Download .bib
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
