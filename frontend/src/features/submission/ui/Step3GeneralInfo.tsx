import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button, Input, Stack } from '@shared/ui';

const SUBJECT_AREAS = [
    'Biological Sciences',
    'Biomedical Sciences',
    'Chemistry',
    'Computer Science',
    'Earth & Environmental Sciences',
    'Economics & Business',
    'Education',
    'Engineering',
    'Humanities & Social Sciences',
    'Law',
    'Materials Science',
    'Mathematics',
    'Medicine & Public Health',
    'Pharmacy',
    'Physics & Astronomy',
    'Psychology',
    'Statistics',
];

const GeneralInfoSchema = z.object({
    subjectArea: z.string().min(1, 'Please select a subject area'),
    keywords: z.array(z.string()).min(3, 'Provide at least 3 keywords').max(10, 'Maximum 10 keywords allowed'),
    classification: z.string().optional(),
});

type GeneralInfoData = z.infer<typeof GeneralInfoSchema>;

export const Step3GeneralInfo: React.FC = () => {
    const { draft, updateDraft, nextStep, prevStep } = useSubmissionStore();
    const [keywordInput, setKeywordInput] = React.useState(draft.keywords?.join(', ') || '');

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<GeneralInfoData>({
        resolver: zodResolver(GeneralInfoSchema),
        defaultValues: {
            subjectArea: draft.subjectArea || '',
            keywords: draft.keywords || [],
            classification: draft.classification || '',
        },
    });

    const onSubmit = (data: GeneralInfoData) => {
        updateDraft(data);
        nextStep();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 3: General Information
            </h2>
            <p className="text-lumex-muted mb-8">
                Provide the subject area and classification details for your manuscript to help us assign the most appropriate editors and reviewers.
            </p>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Stack direction="col" gap="lg" className="mb-8">

                    {/* Subject Area */}
                    <div>
                        <label className="block text-sm font-bold text-lumex-text mb-2">
                            Subject Area *
                        </label>
                        <select
                            {...register('subjectArea')}
                            className={`w-full px-3 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-light text-lumex-text ${errors.subjectArea ? 'border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                        >
                            <option value="">Select a subject area...</option>
                            {SUBJECT_AREAS.map((area) => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                        {errors.subjectArea && (
                            <p className="text-red-600 text-sm mt-1">{errors.subjectArea.message}</p>
                        )}
                        <p className="text-xs text-lumex-sub mt-1">
                            Select the primary subject area that best matches your manuscript.
                        </p>
                    </div>

                    {/* Classification / Sub-discipline */}
                    <div>
                        <label className="block text-sm font-bold text-lumex-text mb-2">
                            Classification / Sub-discipline (Optional)
                        </label>
                        <Input
                            {...register('classification')}
                            placeholder="e.g., Machine Learning, Organic Chemistry, Cardiology"
                            className="w-full"
                        />
                        <p className="text-xs text-lumex-sub mt-1">
                            Specify a more detailed sub-discipline to help with reviewer matching.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-lumex-text">
                                Keywords *
                            </label>
                            <Button 
                                type="button"
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-[10px] uppercase font-bold tracking-wider text-lumex-blue border-lumex-blue hover:bg-lumex-blue/10 flex items-center gap-1.5"
                                onClick={() => setKeywordInput('climate change, adaptation, machine learning, sustainability')}
                            >
                                ✨ AI Extract
                            </Button>
                        </div>
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
