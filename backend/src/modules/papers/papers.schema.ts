import { z } from "zod";

//  Create Paper 
// Used when an AUTHOR drafts a new paper.
export const createPaperSchema = z.object({
  title: z
    .string()
    .min(5,   "Title must be at least 5 characters")
    .max(300, "Title must be at most 300 characters")
    .trim(),

  abstract: z
    .string()
    .min(50,   "Abstract must be at least 50 characters")
    .max(5000, "Abstract must be at most 5 000 characters")
    .trim(),

  domain: z
    .string()
    .min(2,  "Domain must be at least 2 characters")
    .max(100, "Domain must be at most 100 characters")
    .trim(),

  keywords: z
    .array(z.string().min(1).max(50).trim())
    .min(1, "At least one keyword is required")
    .max(20, "At most 20 keywords are allowed"),
});

//  Update Paper 
// All fields optional only changed fields need to be sent.
// Only allowed while paper is still in DRAFT status.
export const updatePaperSchema = createPaperSchema.partial();

//  Reject Paper 
// Body expected when an EDITOR rejects a paper.
export const rejectPaperSchema = z.object({
  rejectionReason: z
    .string()
    .min(10,   "Rejection reason must be at least 10 characters")
    .max(2000, "Rejection reason must be at most 2 000 characters")
    .trim(),
});

//  List / Filter Papers 
// Query-string parameters for GET /papers
export const listPapersSchema = z.object({
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

//  Inferred TypeScript types 
export type CreatePaperInput = z.infer<typeof createPaperSchema>;
export type UpdatePaperInput = z.infer<typeof updatePaperSchema>;
export type RejectPaperInput = z.infer<typeof rejectPaperSchema>;
export type ListPapersQuery  = z.infer<typeof listPapersSchema>;
