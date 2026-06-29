import { z } from "zod";

export const createSubmissionSchema = z.object({
  title:       z.string().min(5).max(500).trim(),
  abstract:    z.string().min(50).max(5000).trim().optional(),
  keywords:    z.array(z.string().trim()).max(20).optional().default([]),
  journalSlug: z.string().optional(),
  coverLetter: z.string().max(3000).trim().optional(),
});

export const updateSubmissionSchema = z.object({
  title:       z.string().min(5).max(500).trim().optional(),
  abstract:    z.string().min(50).max(5000).trim().optional(),
  keywords:    z.array(z.string().trim()).max(20).optional(),
  coverLetter: z.string().max(3000).trim().optional(),
  journalSlug: z.string().optional(),
});

export const addCoAuthorSchema = z.object({
  firstName:   z.string().min(1).max(100).trim(),
  lastName:    z.string().min(1).max(100).trim(),
  email:       z.string().check(z.email()).toLowerCase().trim(),
  affiliation: z.string().max(200).trim().optional(),
  order:       z.number().int().min(1).default(1),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
export type AddCoAuthorInput      = z.infer<typeof addCoAuthorSchema>;
