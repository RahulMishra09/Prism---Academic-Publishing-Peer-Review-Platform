import { z } from "zod";

// Create Comment
// Body for POST /comments/papers/:paperId
export const createCommentSchema = z.object({
  body: z
    .string()
    .min(1,    "Comment cannot be empty")
    .max(2000, "Comment must be at most 2000 characters")
    .trim(),

  parentId: z
    .string()
    .min(1)
    .trim()
    .optional(),
});

// List Comments Query
// Query params for GET /comments/papers/:paperId
export const listCommentsSchema = z.object({
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
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ListCommentsQuery  = z.infer<typeof listCommentsSchema>;
