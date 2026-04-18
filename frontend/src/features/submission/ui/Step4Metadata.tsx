import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Step4Schema, type Step4Data } from '@features/submission/model/submissionSchema';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button, Input, Stack } from '@shared/ui';

export const Step4Metadata: React.FC = () => {
    const { draft, updateDraft, nextStep, prevStep } = useSubmissionStore();
    const [keywordInput, setKeywordInput] = React.useState(draft.keywords?.join(', ') || '');

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<Step4Data>({
        resolver: zodResolver(Step4Schema),
        defaultValues: {
            title: draft.title || '',
            abstract: draft.abstract || '',
            keywords: draft.keywords || [],
            competingInterests: draft.competingInterests || '',
            fundingStatement: draft.fundingStatement || '',
            dataAvailability: draft.dataAvailability || '',
            ethicsApproval: draft.ethicsApproval || '',
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const abstractText = watch('abstract') || '';

    const onSubmit = (data: Step4Data) => {
        updateDraft(data);
        nextStep();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 4: Manuscript Metadata & Disclosures
            </h2>
            <p className="text-lumex-muted mb-8">
                Provide the essential metadata and professional disclosures for your submission. This information is required for all Lumex publications.
            </p>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Stack direction="col" gap="lg" className="mb-8">
                    <div>
                        <label className="block text-sm font-bold text-lumex-text mb-2">
                            Manuscript Title *
                        </label>
                        <Input
                            {...register('title')}
                            className="w-full"
                            placeholder="Enter the full title of your manuscript"
                            error={errors.title?.message}
                        />
                        <p className="text-xs text-lumex-sub mt-1">Capitalize only the first word and proper nouns.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-lumex-text mb-2">
                            Abstract *
                        </label>
                        <textarea
                            {...register('abstract')}
                            className={`w-full h-48 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-white text-lumex-text ${errors.abstract ? 'border-red-500 focus:border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                            placeholder="Paste your abstract here..."
                        />
                        {errors.abstract ? (
                            <p className="text-lumex-red text-sm mt-1">{errors.abstract.message}</p>
                        ) : (
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-lumex-sub">Do not include citations in the abstract.</p>
                                <p className={`text-xs font-bold ${abstractText.length < 50 ? 'text-orange-500' : 'text-lumex-sub'}`}>
                                    {abstractText.length} / 3000 characters
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-lumex-text mb-2">
                            Keywords *
                        </label>
                        <Controller
                            control={control}
                            name="keywords"
                            render={({ field }) => (
                                <Input
                                    placeholder="Comma separated keywords (e.g. climate change, policy, adaptation)"
                                    className="w-full"
                                    error={errors.keywords?.message}
                                    value={keywordInput}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setKeywordInput(val);
                                        field.onChange(val.split(',').map(s => s.trim()).filter(Boolean));
                                    }}
                                    onBlur={() => {
                                        setKeywordInput(field.value.join(', '));
                                    }}
                                />
                            )}
                        />
                        <p className="text-xs text-lumex-sub mt-1">Provide 3 to 10 keywords separated by commas.</p>
                    </div>

                    <div className="pt-6 border-t border-lumex-border">
                        <h3 className="text-lg font-serif font-bold text-lumex-text mb-4">Declarations & Disclosures</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">
                                    Competing Interests *
                                </label>
                                <textarea
                                    {...register('competingInterests')}
                                    className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-white text-lumex-text ${errors.competingInterests ? 'border-red-500 focus:border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                                    placeholder="Declare any potential competing interests, or state 'The authors declare no competing interests'."
                                />
                                {errors.competingInterests && (
                                    <p className="text-lumex-red text-sm mt-1">{errors.competingInterests.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">
                                    Funding Statement *
                                </label>
                                <textarea
                                    {...register('fundingStatement')}
                                    className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-white text-lumex-text ${errors.fundingStatement ? 'border-red-500 focus:border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                                    placeholder="Specify financial support received for the research."
                                />
                                {errors.fundingStatement && (
                                    <p className="text-lumex-red text-sm mt-1">{errors.fundingStatement.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">
                                    Data Availability *
                                </label>
                                <textarea
                                    {...register('dataAvailability')}
                                    className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-white text-lumex-text ${errors.dataAvailability ? 'border-red-500 focus:border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                                    placeholder="Describe how the underlying data can be accessed."
                                />
                                {errors.dataAvailability && (
                                    <p className="text-lumex-red text-sm mt-1">{errors.dataAvailability.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">
                                    Ethics Approval (if applicable)
                                </label>
                                <textarea
                                    {...register('ethicsApproval')}
                                    className="w-full h-24 px-3 py-2 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue focus:border-lumex-blue"
                                    placeholder="Provide details of ethical approval for research involving humans or animals."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-lumex-border">
                        <label className="block text-sm font-bold text-lumex-text mb-2">
                            Cover Letter (Optional)
                        </label>
                        <textarea
                            {...register('coverLetter')}
                            className="w-full h-32 px-3 py-2 border border-lumex-border bg-lumex-bg-white text-lumex-text rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue focus:border-lumex-blue"
                            placeholder="Address your cover letter to the Editor-in-Chief..."
                        />
                    </div>
                </Stack>

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
