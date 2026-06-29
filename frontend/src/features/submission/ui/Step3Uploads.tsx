import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button } from '@shared/ui';
import type { SubmissionFile, AuthorInfo } from '@shared/types/submission.types';
import { parsePaperMetadata, type ParsedPaperMetadata, type ParsedAuthor } from '../lib/parsePaperMetadata';

// ── Parse Result Panel ─────────────────────────────────────────────────────────

interface ParseResultPanelProps {
    result: ParsedPaperMetadata;
    isParsing: boolean;
    onAutoFill: () => void;
    onSkip: () => void;
}

const ParseResultPanel: React.FC<ParseResultPanelProps> = ({ result, onAutoFill, onSkip }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mb-8 border-2 border-lumex-blue/30 rounded-xl overflow-hidden bg-gradient-to-br from-lumex-blue/5 to-transparent">
            {/* Header */}
            <div className="px-6 py-4 bg-lumex-blue/10 border-b border-lumex-blue/20 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-lumex-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-blue">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lumex-text text-lg">
                        Manuscript Analyzed Successfully
                    </h3>
                    <p className="text-sm text-lumex-muted mt-1">
                        We extracted metadata from your manuscript. Review the results below.
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Authors" value={result.authors.length} icon="👥" />
                <StatCard label="Emails" value={result.emails.length} icon="📧" />
                <StatCard label="ORCIDs" value={result.orcids.length} icon="🆔" />
                <StatCard label="Keywords" value={result.keywords.length} icon="🏷️" />
            </div>

            {/* Extracted Title */}
            {result.title && (
                <div className="px-6 pb-3">
                    <span className="text-xs font-bold text-lumex-muted uppercase tracking-wider">Detected Title</span>
                    <p className="text-sm text-lumex-text mt-1 font-serif italic line-clamp-2">{result.title}</p>
                </div>
            )}

            {/* Expandable Details */}
            <div className="px-6 pb-4">
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-lumex-blue hover:underline font-bold flex items-center gap-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {expanded ? 'Hide' : 'Preview'} extracted authors
                </button>

                {expanded && (
                    <div className="mt-4 space-y-3">
                        {result.authors.map((author, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-lumex-card border border-lumex-border rounded-lg text-sm"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-6 h-6 rounded-full bg-lumex-blue/10 text-lumex-blue flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                    <span className="font-bold text-lumex-text">
                                        {author.firstName} {author.lastName}
                                    </span>
                                    {author.isCorresponding && (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold dark:bg-amber-900/30 dark:text-amber-400">
                                            Corresponding
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-lumex-muted ml-8">
                                    {author.email && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-lumex-sub">Email:</span>
                                            <span className="text-lumex-text">{author.email}</span>
                                        </div>
                                    )}
                                    {author.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-lumex-sub">Phone:</span>
                                            <span className="text-lumex-text">{author.phone}</span>
                                        </div>
                                    )}
                                    {author.institution && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-lumex-sub">Institution:</span>
                                            <span className="text-lumex-text">{author.institution}</span>
                                        </div>
                                    )}
                                    {author.orcid && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-lumex-sub">ORCID:</span>
                                            <span className="text-lumex-text font-mono">{author.orcid}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {result.keywords.length > 0 && (
                            <div className="pt-2">
                                <span className="text-xs font-bold text-lumex-muted uppercase tracking-wider">Keywords</span>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {result.keywords.map((kw, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-lumex-bg-deep text-lumex-text text-xs rounded-full border border-lumex-border">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {result.authors.length > 0 && (
                <div className="px-6 py-4 bg-lumex-bg-deep/50 border-t border-lumex-border flex flex-col sm:flex-row items-center gap-3">
                    <Button
                        type="button"
                        variant="primary"
                        className="font-bold shadow-md w-full sm:w-auto"
                        onClick={onAutoFill}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        Auto-fill {result.authors.length} Author{result.authors.length > 1 ? 's' : ''}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="font-bold w-full sm:w-auto"
                        onClick={onSkip}
                    >
                        Skip — I'll enter manually
                    </Button>
                    <p className="text-xs text-lumex-muted sm:ml-auto">
                        You can always edit the auto-filled data in Step 2.
                    </p>
                </div>
            )}
        </div>
    );
};

const StatCard: React.FC<{ label: string; value: number; icon: string }> = ({ label, value, icon }) => (
    <div className="bg-lumex-card border border-lumex-border rounded-lg p-3 text-center">
        <span className="text-lg">{icon}</span>
        <p className="text-2xl font-bold text-lumex-text mt-1">{value}</p>
        <p className="text-xs text-lumex-muted font-medium">{label}</p>
    </div>
);

// ── Main Step3Uploads Component ────────────────────────────────────────────────

export const Step3Uploads: React.FC = () => {
    const { draft, updateDraft, addFiles, removeFile, setParsedAuthors, setParsedMetadata, nextStep, prevStep } = useSubmissionStore();
    const [localError, setLocalError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parseResult, setParseResult] = useState<ParsedPaperMetadata | null>(null);
    const [parseError, setParseError] = useState<string | null>(null);
    const [parseDismissed, setParseDismissed] = useState(false);

    const triggerParse = useCallback(async (file: File) => {
        setIsParsing(true);
        setParseError(null);
        setParseResult(null);
        setParseDismissed(false);

        try {
            const result = await parsePaperMetadata(file);
            setParseResult(result);
        } catch (err: any) {
            setParseError(err?.message || 'Failed to analyze manuscript. You can still enter author details manually.');
        } finally {
            setIsParsing(false);
        }
    }, []);

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

        // Auto-trigger parsing on first manuscript upload
        const isFirstManuscript =
            !draft.uploadedFiles?.some((f: SubmissionFile) => f.type === 'manuscript') &&
            newFiles[0]?.type === 'manuscript';

        if (isFirstManuscript && acceptedFiles[0]) {
            void triggerParse(acceptedFiles[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft.uploadedFiles, addFiles, triggerParse]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected: (rejectedFiles) => {
            const reasons: string[] = [];
            for (const rejected of rejectedFiles) {
                for (const err of rejected.errors) {
                    if (err.code === 'file-too-large') {
                        reasons.push(`"${rejected.file.name}" exceeds the 50 MB size limit.`);
                    } else if (err.code === 'file-invalid-type') {
                        reasons.push(`"${rejected.file.name}" is not a supported file type. Only PDF, DOCX, DOC, JPEG, PNG, and TIFF files are accepted.`);
                    }
                }
            }
            setLocalError(reasons.join(' '));
        },
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxSize: 50 * 1024 * 1024 // 50MB
    });

    const handleTypeChange = (id: string, newType: string) => {
        const updatedFiles = (draft.uploadedFiles || []).map((f: SubmissionFile) =>
            f.id === id ? { ...f, type: newType as SubmissionFile['type'] } : f
        );
        updateDraft({ uploadedFiles: updatedFiles });

        // If user just set a file to manuscript, trigger parsing
        if (newType === 'manuscript' && !parseResult && !isParsing) {
            const file = updatedFiles.find((f: SubmissionFile) => f.id === id);
            if (file?.file) {
                void triggerParse(file.file);
            }
        }
    };

    const handleAutoFill = () => {
        if (!parseResult) return;

        // Convert ParsedAuthors to AuthorInfo
        const authorInfos: AuthorInfo[] = parseResult.authors.map((pa: ParsedAuthor) => ({
            id: crypto.randomUUID(),
            firstName: pa.firstName,
            lastName: pa.lastName,
            email: pa.email,
            phone: pa.phone,
            institution: pa.institution,
            department: pa.department,
            city: pa.city,
            country: pa.country,
            orcid: pa.orcid,
            isCorresponding: pa.isCorresponding,
            autoParsed: true,
        }));

        setParsedAuthors(authorInfos);

        // Also set title, abstract, keywords if found
        if (parseResult.title || parseResult.abstract || parseResult.keywords.length > 0) {
            setParsedMetadata({
                title: parseResult.title,
                abstract: parseResult.abstract,
                keywords: parseResult.keywords,
            });
        }

        setParseDismissed(true);
    };

    const handleSkip = () => {
        setParseDismissed(true);
    };

    const handleReParse = (fileId: string) => {
        const file = (draft.uploadedFiles || []).find((f: SubmissionFile) => f.id === fileId);
        if (file?.file) {
            void triggerParse(file.file);
        }
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
                Step 2: Attach Files
            </h2>
            <p className="text-lumex-text-secondary mb-8">
                Upload your manuscript, figures, tables, and supplementary materials.
                Your manuscript will be automatically analyzed to extract author and metadata information.
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

            {/* Parsing Spinner */}
            {isParsing && (
                <div className="mb-8 p-6 border-2 border-lumex-blue/20 rounded-xl bg-lumex-blue/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-lumex-blue border-t-transparent animate-spin flex-shrink-0" />
                    <div>
                        <p className="font-bold text-lumex-text">Analyzing manuscript…</p>
                        <p className="text-sm text-lumex-muted">Extracting author names, emails, affiliations, and more.</p>
                    </div>
                </div>
            )}

            {/* Parse Error */}
            {parseError && (
                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                        <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">Could not auto-parse manuscript</p>
                        <p className="text-sm text-amber-700 dark:text-amber-400">{parseError}</p>
                    </div>
                </div>
            )}

            {/* Parse Result */}
            {parseResult && !parseDismissed && !isParsing && (
                <ParseResultPanel
                    result={parseResult}
                    isParsing={isParsing}
                    onAutoFill={handleAutoFill}
                    onSkip={handleSkip}
                />
            )}

            {/* Auto-fill success confirmation */}
            {parseDismissed && parseResult && parseResult.authors.length > 0 && (
                <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Author data has been processed. You can review and edit in <strong>Step 2: Authors</strong>.
                    </p>
                </div>
            )}

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
                                                className="bg-lumex-bg-light text-lumex-text border-lumex-border rounded text-sm focus:ring-lumex-blue focus:border-lumex-blue w-full"
                                            >
                                                <option value="manuscript">Main Manuscript</option>
                                                <option value="figure">Figure</option>
                                                <option value="table">Table</option>
                                                <option value="cover_letter">Cover Letter</option>
                                                <option value="supplementary">Supplementary Material</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {file.type === 'manuscript' && !isParsing && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReParse(file.id)}
                                                        className="text-lumex-blue hover:text-lumex-blue-dark p-1 transition-colors"
                                                        title="Re-analyze manuscript"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="23 4 23 10 17 10" />
                                                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Remove file"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {localError && (
                <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
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
