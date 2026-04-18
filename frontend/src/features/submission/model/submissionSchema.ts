import { z } from 'zod';

export const Step1Schema = z.object({
    manuscriptType: z.string().min(1, 'Please select a manuscript type'),
});

export const AuthorSchema = z.object({
    id: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    institution: z.string().min(1, 'Institution is required'),
    department: z.string().min(1, 'Department is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    orcid: z
        .string()
        .regex(/^(\d{4}-){3}\d{3}[\dX]$/, 'Must be a valid ORCID (e.g., 0000-0002-1825-0097)')
        .optional()
        .or(z.literal('')),
    isCorresponding: z.boolean(),
});

export const Step2Schema = z.object({
    authors: z
        .array(AuthorSchema)
        .min(1, 'At least one author is required')
        .refine(
            authors => authors.some(a => a.isCorresponding),
            'At least one author must be marked as the corresponding author'
        ),
});

export const Step3Schema = z.object({
    uploadedFiles: z
        .array(
            z.object({
                id: z.string(),
                type: z.enum(['manuscript', 'figure', 'table', 'supplementary', 'cover_letter']),
                name: z.string(),
                size: z.number(),
                file: z.any(),
            })
        )
        .refine(
            files => files.some(f => f.type === 'manuscript'),
            'A main manuscript document is required'
        ),
});

export const Step4Schema = z.object({
    title: z.string().min(10, 'Title must be at least 10 characters').max(250, 'Title is too long'),
    abstract: z
        .string()
        .min(50, 'Abstract must be at least 50 characters')
        .max(3000, 'Abstract is too long'),
    keywords: z.array(z.string()).min(3, 'Provide at least 3 keywords').max(10, 'Maximum 10 keywords allowed'),
    coverLetter: z.string().optional(),
    competingInterests: z.string().min(1, 'Competing interests statement is required'),
    fundingStatement: z.string().min(1, 'Funding statement is required'),
    dataAvailability: z.string().min(1, 'Data availability statement is required'),
    ethicsApproval: z.string().optional(),
});

export const ReviewerSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    institution: z.string().min(1, 'Institution is required'),
    reason: z.string().min(1, 'Please provide a reason for suggestion'),
});

export const Step5Schema = z.object({
    suggestedReviewers: z.array(ReviewerSchema).min(2, 'Please suggest at least 2 reviewers'),
    opposedReviewers: z.string().optional(),
});

export const Step6Schema = z.object({
    agreedToTerms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms and conditions',
    }),
});

export const FullSubmissionSchema = z.object({
    journalSlug: z.string(),
    ...Step1Schema.shape,
    ...Step2Schema.shape,
    ...Step3Schema.shape,
    ...Step4Schema.shape,
    ...Step5Schema.shape,
    ...Step6Schema.shape,
});

export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type Step3Data = z.infer<typeof Step3Schema>;
export type Step4Data = z.infer<typeof Step4Schema>;
export type Step5Data = z.infer<typeof Step5Schema>;
export type Step6Data = z.infer<typeof Step6Schema>;
export type FullSubmissionData = z.infer<typeof FullSubmissionSchema>;
