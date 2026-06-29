import React, { useState, lazy, Suspense } from 'react';
import { Container } from '@shared/ui';

const PdfViewer = lazy(() => import('../../../shared/ui/PdfViewer/PdfViewer').then(m => ({ default: m.PdfViewer })));

export const PdfTestPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
        }
    };

    return (
        <Container className="py-12 max-w-4xl">
            <h1 className="text-2xl font-serif font-bold text-lumex-text mb-4">PDF Viewer Test</h1>
            <p className="text-sm text-lumex-muted mb-6">Pick any PDF from your computer to test the viewer.</p>

            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-6 block text-sm text-lumex-text file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-lumex-border file:text-sm file:font-bold file:bg-lumex-bg-deep file:text-lumex-text hover:file:bg-lumex-blue hover:file:text-white file:cursor-pointer"
            />

            {file && (
                <div>
                    <p className="text-sm text-lumex-text mb-3 font-semibold">Viewing: {file.name}</p>
                    <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" /></div>}>
                        <PdfViewer file={file} />
                    </Suspense>
                </div>
            )}

            {!file && (
                <div className="border-2 border-dashed border-lumex-border rounded-lg p-12 text-center text-lumex-muted">
                    No PDF selected. Choose a file above to test the viewer.
                </div>
            )}
        </Container>
    );
};
