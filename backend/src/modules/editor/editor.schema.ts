import { z } from "zod";

// Assign Reviewer
// Body for POST /editor/papers/:paperId/assign-reviewer
export const assignReviewerSchema = z.object({
  reviewerId: z
    .string()
    .min(1, "reviewerId is required")
    .trim(),
});

// List Papers Query
// Query params for GET /editor/papers
export const editorListPapersSchema = z.object({
  status: z
    .enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"])
    .optional(),

  domain: z
    .string()
    .max(100)
    .trim()
    .optional(),

  page: z
    .string()
    .regex(/^\d+$/, "page must be a positive integer")
    .transform(Number)
    .pipe(z.number().int().min(1))
    .optional()
    .default(1),

  limit: z
    .string()
    .regex(/^\d+$/, "limit must be a positive integer")
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default(20),
});

// Inferred TypeScript types
export type AssignReviewerInput   = z.infer<typeof assignReviewerSchema>;
export type EditorListPapersQuery = z.infer<typeof editorListPapersSchema>;
