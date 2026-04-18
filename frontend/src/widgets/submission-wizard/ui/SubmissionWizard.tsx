import React from 'react';
import { useSubmissionStore } from '../../../features/submission/model/useSubmissionStore';
import { Step1ArticleType } from '../../../features/submission/ui/Step1ArticleType';
import { Step2Authors } from '../../../features/submission/ui/Step2Authors';
import { Step3Uploads } from '../../../features/submission/ui/Step3Uploads';
import { Step4Metadata } from '../../../features/submission/ui/Step4Metadata';
import { Step5SuggestedReviewers } from '../../../features/submission/ui/Step5SuggestedReviewers';
import { Step5Review as Step6Review } from '../../../features/submission/ui/Step5Review';
import { WizardStepper } from './WizardStepper';

export const SubmissionWizard: React.FC = () => {
    const { currentStep } = useSubmissionStore();

    // Map current step number to actual components
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1ArticleType />;
            case 2:
                return <Step2Authors />;
            case 3:
                return <Step3Uploads />;
            case 4:
                return <Step4Metadata />;
            case 5:
                return <Step5SuggestedReviewers />;
            case 6:
                return <Step6Review />;
            default:
                return <Step1ArticleType />;
        }
    };

    return (
        <div className="w-full">
            <WizardStepper currentStep={currentStep} />

            <div className="mt-8 min-h-[500px] rounded-xl border border-lumex-border bg-lumex-bg-white p-6 shadow-sm sm:p-10">
                {renderStep()}
            </div>
        </div>
    );
};
