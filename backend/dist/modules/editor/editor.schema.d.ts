import { z } from "zod";
export declare const assignReviewerSchema: z.ZodObject<{
    reviewerId: z.ZodString;
}, z.core.$strip>;
export declare const editorListPapersSchema: z.ZodObject<{
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
export type AssignReviewerInput = z.infer<typeof assignReviewerSchema>;
export type EditorListPapersQuery = z.infer<typeof editorListPapersSchema>;
//# sourceMappingURL=editor.schema.d.ts.map