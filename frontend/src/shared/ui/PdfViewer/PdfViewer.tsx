import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    url?: string;
    file?: File;
    className?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, file, className }) => {
    const source = file || url;
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadError, setLoadError] = useState(false);

    if (loadError) {
        return (
            <div className={`border border-lumex-border rounded-lg p-8 text-center ${className || ''}`}>
                <p className="text-lumex-muted text-sm">Unable to preview this file.</p>
                {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-lumex-blue hover:underline text-sm font-bold mt-2 inline-block">
                        Open in new tab
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className={`border border-lumex-border rounded-lg overflow-hidden bg-gray-100 ${className || ''}`}>
            <Document
                file={source}
                onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                onLoadError={() => setLoadError(true)}
                loading={
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
                    </div>
                }
            >
                <Page pageNumber={currentPage} width={700} />
            </Document>
            {numPages > 0 && (
                <div className="flex items-center justify-center gap-4 py-3 bg-white border-t border-lumex-border">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="px-3 py-1 text-sm border border-lumex-border rounded hover:bg-lumex-bg-deep disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-lumex-muted">
                        Page {currentPage} of {numPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                        disabled={currentPage >= numPages}
                        className="px-3 py-1 text-sm border border-lumex-border rounded hover:bg-lumex-bg-deep disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
