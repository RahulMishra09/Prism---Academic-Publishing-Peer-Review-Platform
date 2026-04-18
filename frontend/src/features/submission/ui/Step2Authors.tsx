import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step2Schema, type Step2Data } from '@features/submission/model/submissionSchema';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button, Input, Stack } from '@shared/ui';

export const Step2Authors: React.FC = () => {
    const { draft, updateDraft, nextStep, prevStep } = useSubmissionStore();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Step2Data>({
        resolver: zodResolver(Step2Schema),
        defaultValues: {
            authors: draft.authors && draft.authors.length > 0
                ? draft.authors
                // Default to at least one empty author slot
                : [{ id: crypto.randomUUID(), firstName: '', lastName: '', email: '', institution: '', isCorresponding: true }],
        },
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'authors',
    });

    const onSubmit = (data: Step2Data) => {
        updateDraft({ authors: data.authors });
        nextStep();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 2: Authors & Affiliations
            </h2>
            <p className="text-lumex-muted mb-8">
                List all authors in the exact order they should appear on the published article. You must designate at least one corresponding author.
            </p>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Stack direction="col" gap="lg" className="mb-8">
                    {fields.map((item, index) => (
                        <div key={item.id} className="p-6 bg-lumex-bg-deep border border-lumex-border rounded-md relative group">
                            <div className="absolute top-4 right-4 flex items-center gap-3">
                                {/* Order Controls */}
                                <div className="flex bg-lumex-bg-white border border-lumex-border rounded shadow-sm">
                                    <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() => move(index, index - 1)}
                                        className="p-1 hover:bg-lumex-card disabled:opacity-30 disabled:hover:bg-transparent border-r border-lumex-border"
                                        title="Move Up"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                                    </button>
                                    <button
                                        type="button"
                                        disabled={index === fields.length - 1}
                                        onClick={() => move(index, index + 1)}
                                        className="p-1 hover:bg-lumex-card disabled:opacity-30 disabled:hover:bg-transparent"
                                        title="Move Down"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                    </button>
                                </div>

                                <span className="text-xs font-bold text-lumex-muted uppercase tracking-wider">
                                    Author {index + 1}
                                </span>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label={`Remove Author ${index + 1}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <input type="hidden" {...register(`authors.${index}.id` as const)} defaultValue={item.id} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">First Name *</label>
                                    <Input
                                        {...register(`authors.${index}.firstName` as const)}
                                        className="w-full"
                                        error={errors.authors?.[index]?.firstName?.message}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">Last Name *</label>
                                    <Input
                                        {...register(`authors.${index}.lastName` as const)}
                                        className="w-full"
                                        error={errors.authors?.[index]?.lastName?.message}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">Email Address *</label>
                                    <Input
                                        type="email"
                                        {...register(`authors.${index}.email` as const)}
                                        className="w-full"
                                        error={errors.authors?.[index]?.email?.message}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">ORCID iD (Optional)</label>
                                    <Input
                                        {...register(`authors.${index}.orcid` as const)}
                                        placeholder="0000-0000-0000-0000"
                                        className="w-full"
                                        error={errors.authors?.[index]?.orcid?.message}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">Institution/University *</label>
                                    <Input
                                        {...register(`authors.${index}.institution` as const)}
                                        className="w-full"
                                        error={errors.authors?.[index]?.institution?.message}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">Department *</label>
                                    <Input
                                        {...register(`authors.${index}.department` as const)}
                                        className="w-full"
                                        error={errors.authors?.[index]?.department?.message}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">City *</label>
                                    <Input
                                        {...register(`authors.${index}.city` as const)}
                                        className="w-full"
                                        error={errors.authors?.[index]?.city?.message}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">Country *</label>
                                    <Input
                                        {...register(`authors.${index}.country` as const)}
                                        className="w-full"
                                        error={errors.authors?.[index]?.country?.message}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-lumex-text font-bold">
                                    <input
                                        type="checkbox"
                                        {...register(`authors.${index}.isCorresponding` as const)}
                                        className="rounded border-gray-300 text-lumex-blue focus:ring-lumex-blue w-4 h-4 cursor-pointer"
                                    />
                                    Designate as corresponding author
                                </label>
                            </div>
                        </div>
                    ))}
                </Stack>

                <div className="mb-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ id: crypto.randomUUID(), firstName: '', lastName: '', email: '', institution: '', department: '', city: '', country: '', isCorresponding: false })}
                        className="w-full py-4 border-dashed border-2 hover:bg-lumex-card flex items-center justify-center gap-2 text-lumex-blue"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Another Author
                    </Button>
                </div>

                {errors.authors?.root && (
                    <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {errors.authors.root.message}
                    </div>
                )}

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
