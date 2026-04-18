import React from 'react';

export interface WizardStepperProps {
    currentStep: number;
}

const STEPS = [
    { number: 1, title: 'Type' },
    { number: 2, title: 'Authors' },
    { number: 3, title: 'Files' },
    { number: 4, title: 'Metadata' },
    { number: 5, title: 'Reviewers' },
    { number: 6, title: 'Finalize' },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep }) => {
    return (
        <div className="w-full py-6">
            <div className="relative mx-auto flex max-w-3xl items-center justify-between">

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
                                className={[
                                    'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300',
                                    isCompleted ? 'border-lumex-blue bg-lumex-blue text-white shadow-sm shadow-lumex-blue/25' : '',
                                    isActive ? 'border-lumex-blue bg-lumex-bg-white text-lumex-blue ring-4 ring-lumex-blue/15' : '',
                                    isUpcoming ? 'border-lumex-border bg-lumex-bg-deep text-lumex-sub' : '',
                                ].join(' ')}
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
                                className={[
                                    'absolute top-11 hidden whitespace-nowrap text-[0.72rem] font-semibold sm:block',
                                    isActive ? 'text-lumex-blue' : 'text-lumex-muted',
                                ].join(' ')}
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
