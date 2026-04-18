import React from 'react';

interface StatusStep {
    label: string;
    status: 'completed' | 'current' | 'upcoming';
    date?: string;
}

interface StatusTimelineProps {
    currentStatus: string;
    submittedAt: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, submittedAt }) => {
    // Logic to map currentStatus string to timeline steps
    const getSteps = (): StatusStep[] => {
        const allSteps = [
            { label: 'Submitted', key: 'Submitted' },
            { label: 'Editor Assigned', key: 'Editor Assigned' },
            { label: 'Under Review', key: 'Under Review' },
            { label: 'Decision Pending', key: 'Decision Pending' },
            { label: 'Revision Required', key: 'Revision Required' },
            { label: 'Accepted', key: 'Accepted' },
            { label: 'Gallery Proof', key: 'Proofing' },
            { label: 'Published', key: 'Published' }
        ];

        let currentIndex = allSteps.findIndex(s => s.key === currentStatus);
        if (currentIndex === -1) currentIndex = 0; // Default

        return allSteps.map((s, idx) => {
            let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
            if (idx < currentIndex) status = 'completed';
            else if (idx === currentIndex) status = 'current';

            return {
                label: s.label,
                status,
                date: idx === 0 ? new Date(submittedAt).toLocaleDateString() : undefined
            };
        }).slice(0, Math.max(currentIndex + 2, 4)); // Show current + next, min 4
    };

    const steps = getSteps();

    return (
        <div className="mt-6 py-4">
            <div className="relative flex justify-between">
                {/* Connector Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-0" />
                <div
                    className="absolute top-4 left-0 h-0.5 bg-lumex-blue transition-all duration-500 -z-0"
                    style={{ width: `${(steps.filter(s => s.status === 'completed' || s.status === 'current').length - 1) / (steps.length - 1) * 100}%` }}
                />
                {steps.map((step, idx) => {
                    let circleClass = 'bg-white border-gray-200 text-gray-300';
                    if (step.status === 'completed') {
                        circleClass = 'bg-lumex-blue border-lumex-blue text-white';
                    } else if (step.status === 'current') {
                        circleClass = 'bg-white border-lumex-blue text-lumex-blue ring-4 ring-blue-50';
                    }

                    return (
                    <div key={step.label} className="relative z-10 flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${circleClass}`}>
                            {step.status === 'completed' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                                <span className="text-[10px] font-bold">{idx + 1}</span>
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <p className={`text-[10px] font-bold uppercase tracking-tight ${step.status === 'upcoming' ? 'text-gray-400' : 'text-lumex-text'
                                }`}>
                                {step.label}
                            </p>
                            {step.date && <p className="text-[9px] text-gray-400 mt-0.5">{step.date}</p>}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
};
