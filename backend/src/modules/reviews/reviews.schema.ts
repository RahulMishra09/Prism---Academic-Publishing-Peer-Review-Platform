import { z } from "zod";

// Submit Review 
// A REVIEWER submits their review for a paper they were assigned to.
export const createReviewSchema = z.object({
  strengths: z
    .string()
    .min(20,   "Strengths must be at least 20 characters")
    .max(3000, "Strengths must be at most 3 000 characters")
    .trim(),

  weaknesses: z
    .string()
    .min(20,   "Weaknesses must be at least 20 characters")
    .max(3000, "Weaknesses must be at most 3 000 characters")
    .trim(),

  score: z
    .number()
    .int("Score must be an integer")
    .min(1,  "Score must be at least 1")
    .max(10, "Score must be at most 10"),

  recommendation: z.enum(
    ["ACCEPT", "MINOR_REVISION", "MAJOR_REVISION", "REJECT"],
    { error: "recommendation must be ACCEPT | MINOR_REVISION | MAJOR_REVISION | REJECT" }
  ),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
