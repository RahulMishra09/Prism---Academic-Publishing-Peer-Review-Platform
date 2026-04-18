import { z } from "zod";
export declare const createReviewSchema: z.ZodObject<{
    strengths: z.ZodString;
    weaknesses: z.ZodString;
    score: z.ZodNumber;
    recommendation: z.ZodEnum<{
        ACCEPT: "ACCEPT";
        MINOR_REVISION: "MINOR_REVISION";
        MAJOR_REVISION: "MAJOR_REVISION";
        REJECT: "REJECT";
    }>;
}, z.core.$strip>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
//# sourceMappingURL=reviews.schema.d.ts.map