import { z } from "zod";
export declare const createPaperSchema: z.ZodObject<{
    title: z.ZodString;
    abstract: z.ZodString;
    domain: z.ZodString;
    keywords: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const updatePaperSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    abstract: z.ZodOptional<z.ZodString>;
    domain: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const rejectPaperSchema: z.ZodObject<{
    rejectionReason: z.ZodString;
}, z.core.$strip>;
export declare const listPapersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        SUBMITTED: "SUBMITTED";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>>;
    domain: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>>>;
}, z.core.$strip>;
export type CreatePaperInput = z.infer<typeof createPaperSchema>;
export type UpdatePaperInput = z.infer<typeof updatePaperSchema>;
export type RejectPaperInput = z.infer<typeof rejectPaperSchema>;
export type ListPapersQuery = z.infer<typeof listPapersSchema>;
//# sourceMappingURL=papers.schema.d.ts.map