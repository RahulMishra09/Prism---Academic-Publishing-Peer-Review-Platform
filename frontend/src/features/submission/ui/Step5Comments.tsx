import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button, Stack } from '@shared/ui';

const CommentsSchema = z.object({
    coverLetter: z.string().optional(),
    additionalComments: z.string().optional(),
});

type CommentsData = z.infer<typeof CommentsSchema>;

export const Step5Comments: React.FC = () => {
    const { draft, updateDraft, nextStep, prevStep } = useSubmissionStore();

    const {
        register,
        handleSubmit,
    } = useForm<CommentsData>({
        resolver: zodResolver(CommentsSchema),
        defaultValues: {
            coverLetter: draft.coverLetter || '',
            additionalComments: draft.additionalComments || '',
        },
    });

    const onSubmit = (data: CommentsData) => {
        updateDraft(data);
        nextStep();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 5: Comments
            </h2>
            <p className="text-lumex-muted mb-8">
                Provide a cover letter to the editor and any additional comments relevant to your submission.
                This information will only be visible to the editorial team and will not be published.
            </p>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Stack direction="col" gap="lg" className="mb-8">

                    {/* Cover Letter */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-lumex-text">
                                Cover Letter
                            </label>
                            <Button 
                                type="button"
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-[10px] uppercase font-bold tracking-wider text-lumex-blue border-lumex-blue hover:bg-lumex-blue/10 flex items-center gap-1.5"
                                onClick={() => {
                                    // Simulated AI cover letter generation logic
                                }}
                            >
                                ✨ Draft Cover Letter
                            </Button>
                        </div>
                        <p className="text-xs text-lumex-muted mb-3">
                            Address your cover letter to the Editor-in-Chief. Briefly explain why your manuscript is suitable for this journal,
                            highlight the novelty and significance of your findings, and mention any prior communications with the editorial office.
                        </p>
                        <textarea
                            {...register('coverLetter')}
                            className="w-full h-56 px-4 py-3 border border-lumex-border bg-lumex-bg-light text-lumex-text rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue focus:border-lumex-blue font-sans text-sm leading-relaxed"
                            placeholder={"Dear Editor-in-Chief,\n\nWe are pleased to submit our manuscript entitled \"...\" for consideration for publication in [Journal Name].\n\nThis manuscript presents...\n\nWe believe this work is of interest to the readers of your journal because...\n\nThank you for your consideration.\n\nSincerely,\n[Corresponding Author Name]"}
                        />
                    </div>

                    {/* Additional Comments */}
                    <div>
                        <label className="block text-sm font-bold text-lumex-text mb-2">
                            Additional Comments to the Editor (Optional)
                        </label>
                        <textarea
                            {...register('additionalComments')}
                            className="w-full h-28 px-4 py-3 border border-lumex-border bg-lumex-bg-light text-lumex-text rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue focus:border-lumex-blue text-sm"
                            placeholder="e.g., This is a resubmission of manuscript ID XXXX, or any confidential notes for the editor."
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
