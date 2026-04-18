import React, { useEffect } from 'react';
import type { ArticleFigure } from '../../../entities/article/model/types';
import * as Dialog from '@radix-ui/react-dialog';

export interface FigureViewerProps {
    figure: ArticleFigure | null;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export const FigureViewer: React.FC<FigureViewerProps> = ({
    figure,
    isOpen,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
}) => {
    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
            if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, hasNext, hasPrev, onNext, onPrev]);

    if (!figure) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity" />
                <Dialog.Content className="fixed inset-0 z-50 flex flex-col pointer-events-none">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between p-4 bg-black/60 text-white pointer-events-auto shrink-0">
                        <Dialog.Title className="text-lg font-bold">
                            Figure {figure.number}: {figure.caption.substring(0, 100)}
                            {figure.caption.length > 100 ? '...' : ''}
                        </Dialog.Title>

                        <div className="flex gap-4 items-center">
                            {figure.highResUrl && (
                                <a
                                    href={figure.highResUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-lumex-blue hover:text-white transition-colors flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded"
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
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    High-Res
                                </a>
                            )}
                            <Dialog.Close asChild>
                                <button
                                    className="p-2 hover:bg-white/20 rounded transition-colors"
                                    aria-label="Close"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
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
                    </div>

                    {/* Image Canvas */}
                    <div className="flex-1 overflow-auto flex items-center justify-center p-4 lg:p-12 relative pointer-events-auto">
                        {/* Nav Buttons */}
                        {hasPrev && (
                            <button
                                onClick={onPrev}
                                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-10"
                                aria-label="Previous Figure"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                        )}

                        <img
                            src={figure.highResUrl || figure.url}
                            alt={figure.alt}
                            className="max-w-full max-h-[85vh] object-contain shadow-2xl bg-white"
                        />

                        {hasNext && (
                            <button
                                onClick={onNext}
                                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-10"
                                aria-label="Next Figure"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Footer Caption */}
                    <div className="bg-lumex-bg-light p-6 border-t border-lumex-border pointer-events-auto shrink-0 max-h-48 overflow-y-auto">
                        <p className="text-lumex-text leading-relaxed">
                            <strong className="text-lumex-blue mr-2">
                                Fig. {figure.number}
                            </strong>
                            {figure.caption}
                        </p>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
