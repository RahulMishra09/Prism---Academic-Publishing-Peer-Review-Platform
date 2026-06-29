import { z } from "zod";

// Change Role
// Body for PATCH /admin/users/:id/role
export const changeRoleSchema = z.object({
  role: z.enum(["READER", "AUTHOR", "REVIEWER", "EDITOR", "ADMIN"], {
    error: "role must be one of: READER, AUTHOR, REVIEWER, EDITOR, ADMIN",
  }),
});

// List Users Query
// Query params for GET /admin/users
export const listUsersSchema = z.object({
  role: z
    .enum(["READER", "AUTHOR", "REVIEWER", "EDITOR", "ADMIN"])
    .optional(),

  isBanned: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),

  search: z
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
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type ListUsersQuery  = z.infer<typeof listUsersSchema>;
