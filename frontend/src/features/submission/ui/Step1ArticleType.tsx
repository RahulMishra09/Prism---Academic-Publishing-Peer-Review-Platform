import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step1Schema, type Step1Data } from '@features/submission/model/submissionSchema';
import type { SubmissionDraft } from '@shared/types/submission.types';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button, Stack } from '@shared/ui';

const MANUSCRIPT_TYPES = [
    { id: 'Research Article', label: 'Research Article', description: 'Original research presenting novel findings and discoveries.' },
    { id: 'Review Article', label: 'Review Article', description: 'Comprehensive summary of research on a certain topic.' },
    { id: 'Brief Communication', label: 'Brief Communication', description: 'Short, decisive reports of high general interest.' },
    { id: 'Case Report', label: 'Case Report', description: 'Detailed report of the symptoms, signs, diagnosis, and treatment of an individual patient.' },
    { id: 'Editorial', label: 'Editorial', description: 'Opinion piece written by the senior editorial staff or publisher.' },
    { id: 'Letter to Editor', label: 'Letter to Editor', description: 'Short communication commenting on articles recently published.' },
];

export const Step1ArticleType: React.FC = () => {
    const { draft, updateDraft, nextStep } = useSubmissionStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Step1Data>({
        resolver: zodResolver(Step1Schema),
        defaultValues: {
            manuscriptType: draft.manuscriptType || '',
        },
    });

    const onSubmit = (data: Step1Data) => {
        updateDraft(data as Partial<SubmissionDraft>);
        nextStep();
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 1: Manuscript Type
            </h2>
            <p className="text-lumex-text-secondary mb-8">
                Please select the type of manuscript you are submitting from the options below.
            </p>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Stack direction="col" gap="md" className="mb-8">
                    {MANUSCRIPT_TYPES.map((type) => (
                        <label
                            key={type.id}
                            className="flex items-start p-4 border border-lumex-border rounded-md cursor-pointer hover:border-lumex-blue transition-colors focus-within:ring-2 focus-within:ring-lumex-blue focus-within:ring-offset-2"
                        >
                            <div className="flex-shrink-0 mt-0.5 mr-4">
                                <input
                                    type="radio"
                                    value={type.id}
                                    {...register('manuscriptType')}
                                    className="h-4 w-4 text-lumex-blue border-lumex-border focus:ring-lumex-blue"
                                />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-lumex-text leading-none mb-1">
                                    {type.label}
                                </h3>
                                <p className="text-sm text-lumex-muted">
                                    {type.description}
                                </p>
                            </div>
                        </label>
                    ))}
                </Stack>

                {errors.manuscriptType && (
                    <p className="text-lumex-red text-sm mb-4 font-medium">
                        {errors.manuscriptType.message}
                    </p>
                )}

                <div className="flex justify-end pt-6 border-t border-lumex-border">
                    <Button type="submit" variant="primary" size="lg">
                        Save and Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};
