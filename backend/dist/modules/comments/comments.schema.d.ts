import { z } from "zod";
export declare const createCommentSchema: z.ZodObject<{
    body: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const listCommentsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>, z.ZodNumber>>>;
}, z.core.$strip>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentsSchema>;
//# sourceMappingURL=comments.schema.d.ts.map