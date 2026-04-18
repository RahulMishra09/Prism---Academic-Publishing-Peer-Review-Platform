import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step5Schema, type Step5Data } from '@features/submission/model/submissionSchema';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button, Input, Stack } from '@shared/ui';

export const Step5SuggestedReviewers: React.FC = () => {
    const { draft, updateDraft, nextStep, prevStep } = useSubmissionStore();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Step5Data>({
        resolver: zodResolver(Step5Schema),
        defaultValues: {
            suggestedReviewers: draft.suggestedReviewers && draft.suggestedReviewers.length > 0
                ? draft.suggestedReviewers
                : [
                    { id: crypto.randomUUID(), name: '', email: '', institution: '', reason: '' },
                    { id: crypto.randomUUID(), name: '', email: '', institution: '', reason: '' }
                ],
            opposedReviewers: draft.opposedReviewers || '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'suggestedReviewers',
    });

    const onSubmit = (data: Step5Data) => {
        updateDraft(data);
        nextStep();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 5: Suggested Reviewers
            </h2>
            <p className="text-lumex-muted mb-8">
                Please suggest at least 2 independent reviewers who are experts in your field. You may also list researchers you would prefer not to review your work.
            </p>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <div className="mb-8">
                    <h3 className="text-lg font-serif font-bold text-lumex-text mb-4">Suggested Reviewers *</h3>
                    <Stack direction="col" gap="md">
                        {fields.map((item, index) => (
                            <div key={item.id} className="p-6 bg-lumex-bg-deep border border-lumex-border rounded-md relative">
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    <span className="text-xs font-bold text-lumex-muted uppercase tracking-wider">
                                        Reviewer {index + 1}
                                    </span>
                                    {fields.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-lumex-muted hover:text-lumex-red transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-lumex-text mb-1">Full Name *</label>
                                        <Input
                                            {...register(`suggestedReviewers.${index}.name` as const)}
                                            className="w-full"
                                            error={errors.suggestedReviewers?.[index]?.name?.message}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-lumex-text mb-1">Email Address *</label>
                                        <Input
                                            type="email"
                                            {...register(`suggestedReviewers.${index}.email` as const)}
                                            className="w-full"
                                            error={errors.suggestedReviewers?.[index]?.email?.message}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-lumex-text mb-1">Institution/Affiliation *</label>
                                    <Input
                                        {...register(`suggestedReviewers.${index}.institution` as const)}
                                        className="w-full"
                                        error={errors.suggestedReviewers?.[index]?.institution?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">Reason for Suggestion *</label>
                                    <Input
                                        {...register(`suggestedReviewers.${index}.reason` as const)}
                                        placeholder="e.g., expertise in longitudinal data analysis"
                                        className="w-full"
                                        error={errors.suggestedReviewers?.[index]?.reason?.message}
                                    />
                                </div>
                            </div>
                        ))}
                    </Stack>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ id: crypto.randomUUID(), name: '', email: '', institution: '', reason: '' })}
                            className="bg-lumex-bg-white"
                        >
                            + Add Another Reviewer
                        </Button>
                    </div>
                </div>

                <div className="pt-6 border-t border-lumex-border mb-8">
                    <h3 className="text-lg font-serif font-bold text-lumex-text mb-4">Opposed Reviewers (Optional)</h3>
                    <p className="text-sm text-lumex-muted mb-4">
                        Please list any researchers you'd prefer not to review this manuscript. You do not need to provide a reason.
                    </p>
                    <textarea
                        {...register('opposedReviewers')}
                        className="w-full h-24 px-3 py-2 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue"
                        placeholder="Name, Institution"
                    />
                </div>

                <div className="flex justify-between pt-6 border-t border-lumex-border">
                    <Button type="button" variant="outline" size="lg" onClick={prevStep}>
                        Back
                    </Button>
                    <Button type="submit" variant="primary" size="lg">
                        Save and Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};
