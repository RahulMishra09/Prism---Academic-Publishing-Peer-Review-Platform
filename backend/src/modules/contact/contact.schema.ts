import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName:  z.string().min(1).max(100).trim(),
  email:     z.string().check(z.email()).toLowerCase().trim(),
  subject:   z.string().min(3).max(200).trim(),
  message:   z.string().min(10).max(5000).trim(),
});

export type ContactInput = z.infer<typeof contactSchema>;
