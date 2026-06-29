import React from 'react';
import { useSubmissionStore } from '../../../features/submission/model/useSubmissionStore';
import { Step1ArticleType } from '../../../features/submission/ui/Step1ArticleType';
import { Step3Uploads } from '../../../features/submission/ui/Step3Uploads';
import { Step3GeneralInfo } from '../../../features/submission/ui/Step3GeneralInfo';
import { Step5SuggestedReviewers } from '../../../features/submission/ui/Step5SuggestedReviewers';
import { Step5Comments } from '../../../features/submission/ui/Step5Comments';
import { Step6ManuscriptData } from '../../../features/submission/ui/Step6ManuscriptData';
import { Step5Review as Step7Review } from '../../../features/submission/ui/Step5Review';
import { WizardStepper } from './WizardStepper';
import { Button } from '../../../shared/ui';

// ── Draft Recovery Prompt ──────────────────────────────────────────────────────

const STEP_LABELS: Record<number, string> = {
    1: 'Article Type',
    2: 'Attach Files',
    3: 'General Information',
    4: 'Review Preferences',
    5: 'Comments',
    6: 'Manuscript Data',
    7: 'Review & Submit',
};

const DraftRecoveryPrompt: React.FC = () => {
    const { resumeDraft, startFresh } = useSubmissionStore();

    // Read saved step from localStorage for display
    let savedStep = 1;
    let savedTitle = '';
    let savedType = '';
    try {
        const raw = localStorage.getItem('lumex-submission-draft');
        if (raw) {
            const parsed = JSON.parse(raw);
            savedStep = parsed.currentStep || 1;
            savedTitle = parsed.draft?.title || '';
            savedType = parsed.draft?.manuscriptType || '';
        }
    } catch { /* ignore */ }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-lumex-card border border-lumex-border rounded-xl overflow-hidden shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-lumex-blue/10 to-lumex-blue/5 px-8 py-6 border-b border-lumex-border">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-lumex-blue/15 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-blue">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-bold text-lumex-text">
                                Saved Draft Found
                            </h2>
                            <p className="text-sm text-lumex-muted mt-1">
                                You have an unfinished submission. Would you like to continue where you left off?
                            </p>
                        </div>
                    </div>
                </div>

                {/* Draft Details */}
                <div className="px-8 py-6">
                    <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg p-5 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-lumex-muted font-medium block mb-1">Last Step</span>
                                <span className="text-lumex-text font-bold">
                                    Step {savedStep}: {STEP_LABELS[savedStep] || 'Unknown'}
                                </span>
                            </div>
                            {savedType && (
                                <div>
                                    <span className="text-lumex-muted font-medium block mb-1">Article Type</span>
                                    <span className="text-lumex-text font-bold">{savedType}</span>
                                </div>
                            )}
                            {savedTitle && (
                                <div className="col-span-2">
                                    <span className="text-lumex-muted font-medium block mb-1">Title</span>
                                    <span className="text-lumex-text font-bold line-clamp-2">{savedTitle}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-1.5 mb-6">
                        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                            <div
                                key={s}
                                className={`h-2 flex-1 rounded-full transition-colors ${
                                    s < savedStep
                                        ? 'bg-lumex-blue'
                                        : s === savedStep
                                            ? 'bg-lumex-blue/50'
                                            : 'bg-lumex-border'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            className="flex-1 font-bold shadow-md"
                            onClick={resumeDraft}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            Resume Draft
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="flex-1 font-bold"
                            onClick={startFresh}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Start New Submission
                        </Button>
                    </div>

                    <p className="text-xs text-lumex-muted text-center mt-4">
                        Starting a new submission will permanently discard the saved draft.
                    </p>
                </div>
            </div>
        </div>
    );
};

// ── Save Draft Banner ──────────────────────────────────────────────────────────

const SaveDraftBanner: React.FC = () => {
    const { saveDraft, currentStep } = useSubmissionStore();
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        saveDraft();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    // Don't show on the final step (submission step)
    if (currentStep >= 7) return null;

    return (
        <div className="mt-4 flex items-center justify-end">
            <button
                type="button"
                onClick={handleSave}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    saved
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-lumex-bg-deep text-lumex-muted hover:text-lumex-text hover:bg-lumex-card border border-lumex-border hover:border-lumex-blue/40'
                }`}
            >
                {saved ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Draft Saved
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Save as Draft
                    </>
                )}
            </button>
        </div>
    );
};

// ── Main Wizard ────────────────────────────────────────────────────────────────

export const SubmissionWizard: React.FC = () => {
    const { currentStep, draftResolved, hasSavedDraft } = useSubmissionStore();

    // Show recovery prompt if there's a saved draft the user hasn't resolved
    if (!draftResolved && hasSavedDraft) {
        return <DraftRecoveryPrompt />;
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1ArticleType />;
            case 2:
                return <Step3Uploads />;
            case 3:
                return <Step3GeneralInfo />;
            case 4:
                return <Step5SuggestedReviewers />;
            case 5:
                return <Step5Comments />;
            case 6:
                return <Step6ManuscriptData />;
            case 7:
                return <Step7Review />;
            default:
                return <Step1ArticleType />;
        }
    };

    return (
        <div className="w-full">
            <WizardStepper currentStep={currentStep} />

            <div className="mt-8 bg-lumex-card p-6 sm:p-10 shadow-sm border border-lumex-border rounded-lg min-h-[500px]">
                {renderStep()}
            </div>

            <SaveDraftBanner />
        </div>
    );
};
