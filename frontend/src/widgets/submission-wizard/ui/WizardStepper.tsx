import React from 'react';

export interface WizardStepperProps {
    currentStep: number;
}

const STEPS = [
    { number: 1, title: 'Article Type' },
    { number: 2, title: 'Attach Files' },
    { number: 3, title: 'General Info' },
    { number: 4, title: 'Reviewers' },
    { number: 5, title: 'Comments' },
    { number: 6, title: 'Manuscript Data' },
    { number: 7, title: 'Submit' },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep }) => {
    return (
        <div className="w-full py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between relative">

                {/* Connecting background bar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-lumex-border z-0" />

                {/* Active connecting bar (calculated width based on step) */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-lumex-blue z-0 transition-all duration-300"
                    style={{ width: `${(Math.max((currentStep - 1), 0) / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step) => {
                    const isCompleted = step.number < currentStep;
                    const isActive = step.number === currentStep;
                    const isUpcoming = step.number > currentStep;

                    return (
                        <div key={step.number} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2
                                    ${isCompleted ? 'bg-lumex-blue border-lumex-blue text-white' : ''}
                                    ${isActive ? 'bg-lumex-bg-white border-lumex-blue text-lumex-blue ring-4 ring-lumex-blue/20' : ''}
                                    ${isUpcoming ? 'bg-lumex-bg-deep border-lumex-border text-lumex-sub' : ''}
                                `}
                            >
                                {isCompleted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span
                                className={`
                                    absolute top-12 text-xs font-bold whitespace-nowrap hidden sm:block
                                    ${isActive ? 'text-lumex-blue' : 'text-lumex-muted'}
                                `}
                            >
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
