import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthorSchema } from '@features/submission/model/submissionSchema';
import { useSubmissionStore } from '@features/submission/model/useSubmissionStore';
import { Button, Input, Stack } from '@shared/ui';

const ManuscriptDataSchema = z.object({
    title: z.string().min(10, 'Title must be at least 10 characters').max(250, 'Title is too long'),
    abstract: z
        .string()
        .min(50, 'Abstract must be at least 50 characters')
        .max(3000, 'Abstract is too long'),
    authors: z
        .array(AuthorSchema)
        .min(1, 'At least one author is required')
        .refine(
            authors => authors.some(a => a.isCorresponding),
            'At least one author must be marked as the corresponding author'
        ),
    competingInterests: z.string().min(1, 'Competing interests statement is required'),
    fundingStatement: z.string().min(1, 'Funding statement is required'),
    dataAvailability: z.string().min(1, 'Data availability statement is required'),
    ethicsApproval: z.string().optional(),
});

type ManuscriptDataData = z.infer<typeof ManuscriptDataSchema>;

export const Step6ManuscriptData: React.FC = () => {
    const { draft, updateDraft, nextStep, prevStep } = useSubmissionStore();

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ManuscriptDataData>({
        resolver: zodResolver(ManuscriptDataSchema),
        defaultValues: {
            title: draft.title || '',
            abstract: draft.abstract || '',
            authors: draft.authors && draft.authors.length > 0
                ? draft.authors
                : [{ id: crypto.randomUUID(), firstName: '', lastName: '', email: '', institution: '', department: '', city: '', country: '', isCorresponding: true }],
            competingInterests: draft.competingInterests || '',
            fundingStatement: draft.fundingStatement || '',
            dataAvailability: draft.dataAvailability || '',
            ethicsApproval: draft.ethicsApproval || '',
        },
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'authors',
    });

    const abstractText = watch('abstract') || '';

    const onSubmit = (data: ManuscriptDataData) => {
        updateDraft({
            title: data.title,
            abstract: data.abstract,
            authors: data.authors,
            competingInterests: data.competingInterests,
            fundingStatement: data.fundingStatement,
            dataAvailability: data.dataAvailability,
            ethicsApproval: data.ethicsApproval,
        });
        nextStep();
    };

    const hasAutoParsed = fields.some((f) => f.autoParsed);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-lumex-text font-bold mb-2">
                Step 6: Manuscript Data
            </h2>
            <p className="text-lumex-muted mb-8">
                Confirm or edit the manuscript details below. {hasAutoParsed && (
                    <span className="text-lumex-blue font-medium">Some fields have been auto-filled from your uploaded manuscript.</span>
                )}
            </p>

            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Stack direction="col" gap="lg" className="mb-8">

                    {/* ── Title & Abstract ──────────────────────────── */}
                    <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg p-6">
                        <h3 className="text-lg font-serif font-bold text-lumex-text mb-5 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-blue"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            Title & Abstract
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-lumex-text">
                                        Manuscript Title *
                                    </label>
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 text-[10px] uppercase font-bold tracking-wider text-lumex-blue border-lumex-blue hover:bg-lumex-blue/10 flex items-center gap-1.5"
                                        onClick={() => {}}
                                    >
                                        ✨ Suggest Alternatives
                                    </Button>
                                </div>
                                <Input
                                    {...register('title')}
                                    className="w-full"
                                    placeholder="Enter the full title of your manuscript"
                                    error={errors.title?.message}
                                />
                                <p className="text-xs text-lumex-sub mt-1">Capitalize only the first word and proper nouns.</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-lumex-text">
                                        Abstract *
                                    </label>
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 text-[10px] uppercase font-bold tracking-wider text-lumex-blue border-lumex-blue hover:bg-lumex-blue/10 flex items-center gap-1.5"
                                        onClick={() => {}}
                                    >
                                        ✨ Generate from Manuscript
                                    </Button>
                                </div>
                                <textarea
                                    {...register('abstract')}
                                    className={`w-full h-48 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-light text-lumex-text text-sm ${errors.abstract ? 'border-red-500 focus:border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                                    placeholder="Paste your abstract here..."
                                />
                                {errors.abstract ? (
                                    <p className="text-red-600 text-sm mt-1">{errors.abstract.message}</p>
                                ) : (
                                    <div className="flex justify-between mt-1">
                                        <p className="text-xs text-lumex-sub">Do not include citations in the abstract.</p>
                                        <p className={`text-xs font-bold ${abstractText.length < 50 ? 'text-orange-500' : 'text-lumex-sub'}`}>
                                            {abstractText.length} / 3000 characters
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Authors ───────────────────────────────────── */}
                    <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg p-6">
                        <h3 className="text-lg font-serif font-bold text-lumex-text mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-blue"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            Authors & Affiliations
                        </h3>
                        <p className="text-lumex-muted text-sm mb-5">
                            Confirm the correct sequence and details of all co-authors. At least one must be the corresponding author.
                        </p>

                        <Stack direction="col" gap="md" className="mb-4">
                            {fields.map((item, index) => (
                                <div key={item.id} className="p-5 bg-lumex-card border border-lumex-border rounded-md relative group">
                                    <div className="absolute top-3 right-3 flex items-center gap-3">
                                        {/* Order Controls */}
                                        <div className="flex bg-lumex-bg-light border border-lumex-border rounded shadow-sm">
                                            <button
                                                type="button"
                                                disabled={index === 0}
                                                onClick={() => move(index, index - 1)}
                                                className="p-1 hover:bg-lumex-bg-deep disabled:opacity-30 border-r border-lumex-border"
                                                title="Move Up"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={index === fields.length - 1}
                                                onClick={() => move(index, index + 1)}
                                                className="p-1 hover:bg-lumex-bg-deep disabled:opacity-30"
                                                title="Move Down"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                            </button>
                                        </div>

                                        <span className="text-xs font-bold text-lumex-muted uppercase tracking-wider">
                                            Author {index + 1}
                                        </span>
                                        {item.autoParsed && (
                                            <span className="px-2 py-0.5 bg-lumex-blue/10 text-lumex-blue rounded-full text-[10px] font-bold border border-lumex-blue/20">
                                                Auto-parsed
                                            </span>
                                        )}
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-lumex-muted hover:text-red-500 transition-colors"
                                                aria-label={`Remove Author ${index + 1}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        )}
                                    </div>

                                    <input type="hidden" {...register(`authors.${index}.id` as const)} defaultValue={item.id} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">First Name *</label>
                                            <Input {...register(`authors.${index}.firstName` as const)} className="w-full" error={errors.authors?.[index]?.firstName?.message} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">Last Name *</label>
                                            <Input {...register(`authors.${index}.lastName` as const)} className="w-full" error={errors.authors?.[index]?.lastName?.message} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">Email Address *</label>
                                            <Input type="email" {...register(`authors.${index}.email` as const)} className="w-full" error={errors.authors?.[index]?.email?.message} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">Phone (Optional)</label>
                                            <Input type="tel" {...register(`authors.${index}.phone` as const)} placeholder="+1 (555) 123-4567" className="w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">ORCID iD (Optional)</label>
                                            <Input {...register(`authors.${index}.orcid` as const)} placeholder="0000-0000-0000-0000" className="w-full" error={errors.authors?.[index]?.orcid?.message} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">Institution/University *</label>
                                            <Input {...register(`authors.${index}.institution` as const)} className="w-full" error={errors.authors?.[index]?.institution?.message} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">Department *</label>
                                            <Input {...register(`authors.${index}.department` as const)} className="w-full" error={errors.authors?.[index]?.department?.message} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">City *</label>
                                            <Input {...register(`authors.${index}.city` as const)} className="w-full" error={errors.authors?.[index]?.city?.message} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-lumex-text mb-1">Country *</label>
                                            <Input {...register(`authors.${index}.country` as const)} className="w-full" error={errors.authors?.[index]?.country?.message} />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-lumex-text font-bold">
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

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ id: crypto.randomUUID(), firstName: '', lastName: '', email: '', institution: '', department: '', city: '', country: '', isCorresponding: false })}
                            className="w-full py-4 border-dashed border-2 hover:bg-lumex-card flex items-center justify-center gap-2 text-lumex-blue"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Another Author
                        </Button>

                        {errors.authors?.root && (
                            <div className="p-4 mt-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                                {errors.authors.root.message}
                            </div>
                        )}
                    </div>

                    {/* ── Declarations & Disclosures ────────────────── */}
                    <div className="bg-lumex-bg-deep border border-lumex-border rounded-lg p-6">
                        <h3 className="text-lg font-serif font-bold text-lumex-text mb-5 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-blue"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Declarations & Disclosures
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">Competing Interests *</label>
                                <textarea
                                    {...register('competingInterests')}
                                    className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-light text-lumex-text text-sm ${errors.competingInterests ? 'border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                                    placeholder="Declare any potential competing interests, or state 'The authors declare no competing interests'."
                                />
                                {errors.competingInterests && <p className="text-red-600 text-sm mt-1">{errors.competingInterests.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">Funding Statement *</label>
                                <textarea
                                    {...register('fundingStatement')}
                                    className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-light text-lumex-text text-sm ${errors.fundingStatement ? 'border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                                    placeholder="Specify financial support received for the research."
                                />
                                {errors.fundingStatement && <p className="text-red-600 text-sm mt-1">{errors.fundingStatement.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">Data Availability *</label>
                                <textarea
                                    {...register('dataAvailability')}
                                    className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue bg-lumex-bg-light text-lumex-text text-sm ${errors.dataAvailability ? 'border-red-500' : 'border-lumex-border focus:border-lumex-blue'}`}
                                    placeholder="Describe how the underlying data can be accessed."
                                />
                                {errors.dataAvailability && <p className="text-red-600 text-sm mt-1">{errors.dataAvailability.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-lumex-text mb-2">Ethics Approval (if applicable)</label>
                                <textarea
                                    {...register('ethicsApproval')}
                                    className="w-full h-24 px-3 py-2 border border-lumex-border bg-lumex-bg-light text-lumex-text rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-lumex-blue focus:border-lumex-blue text-sm"
                                    placeholder="Provide details of ethical approval for research involving humans or animals."
                                />
                            </div>
                        </div>
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
