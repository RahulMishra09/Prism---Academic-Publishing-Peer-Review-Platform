import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button } from '@shared/ui';
import type { SubmissionFile } from '@shared/types/submission.types';

export const Step3Uploads: React.FC = () => {
    const { draft, updateDraft, addFiles, removeFile, nextStep, prevStep } = useSubmissionStore();
    const [localError, setLocalError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setLocalError(null);

        const newFiles = acceptedFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            size: file.size,
            // Default to supplementary if not first file, else manuscript
            type: draft.uploadedFiles && draft.uploadedFiles.length > 0
                ? 'supplementary'
                : 'manuscript' as const
        }));

        addFiles(newFiles as NonNullable<typeof draft.uploadedFiles>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft.uploadedFiles, addFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/tiff': ['.tif', '.tiff']
        },
        maxSize: 50 * 1024 * 1024 // 50MB
    });

    const handleTypeChange = (id: string, newType: string) => {
        const updatedFiles = (draft.uploadedFiles || []).map((f: SubmissionFile) =>
            f.id === id ? { ...f, type: newType as SubmissionFile['type'] } : f
        );
        updateDraft({ uploadedFiles: updatedFiles });
    };

    const handleNext = () => {
        const hasManuscript = (draft.uploadedFiles || []).some((f: SubmissionFile) => f.type === 'manuscript');
        if (!hasManuscript) {
            setLocalError('You must upload at least one file and designate it as the "Main Manuscript".');
            return;
        }
        setLocalError(null);
        nextStep();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 3: File Uploads
            </h2>
            <p className="text-lumex-text-secondary mb-8">
                Upload your manuscript, figures, tables, and supplementary materials.
                Supported formats: PDF, DOCX, JPG, PNG, TIFF. Maximum file size: 50MB.
            </p>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors mb-8 ${isDragActive ? 'border-lumex-blue bg-lumex-bg-deep' : 'border-lumex-border hover:border-lumex-blue hover:bg-lumex-bg-deep'}`}
            >
                <input {...getInputProps()} />
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-lumex-sub mb-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-lg font-bold text-lumex-text mb-2">
                    {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
                </p>
                <p className="text-sm text-lumex-text-secondary">
                    You can upload multiple files at once
                </p>
            </div>

            {draft.uploadedFiles && draft.uploadedFiles.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4 text-lumex-text">Uploaded Files</h3>
                    <div className="border border-lumex-border rounded-md overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-lumex-bg-deep text-lumex-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">File Name</th>
                                    <th className="px-4 py-3 font-semibold">Size</th>
                                    <th className="px-4 py-3 font-semibold">File Type</th>
                                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-lumex-border">
                                {draft.uploadedFiles.map((file: SubmissionFile) => (
                                    <tr key={file.id} className="hover:bg-lumex-card transition-colors">
                                        <td className="px-4 py-3 font-medium text-lumex-text max-w-[200px] truncate" title={file.name}>
                                            {file.name}
                                        </td>
                                        <td className="px-4 py-3 text-lumex-text-secondary">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={file.type}
                                                onChange={(e) => handleTypeChange(file.id, e.target.value)}
                                                className="bg-lumex-bg-white border-lumex-border rounded text-sm focus:ring-lumex-blue focus:border-lumex-blue w-full"
                                            >
                                                <option value="manuscript">Main Manuscript</option>
                                                <option value="figure">Figure</option>
                                                <option value="table">Table</option>
                                                <option value="cover_letter">Cover Letter</option>
                                                <option value="supplementary">Supplementary Material</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="text-lumex-red hover:text-lumex-red p-1"
                                                title="Remove file"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {localError && (
                <div className="p-4 mb-6 bg-lumex-red/5 text-lumex-red border border-lumex-red/20 rounded-md">
                    {localError}
                </div>
            )}

            <div className="flex justify-between pt-6 border-t border-lumex-border">
                <Button type="button" variant="outline" size="lg" onClick={prevStep}>
                    Back
                </Button>
                <Button type="button" variant="primary" size="lg" onClick={handleNext}>
                    Save and Continue
                </Button>
            </div>
        </div>
    );
};
