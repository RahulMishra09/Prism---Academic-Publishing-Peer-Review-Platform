import { z } from "zod";
import { Role } from "../../../generated/prisma/index.js";

export const changeRoleSchema = z.object({
  role: z.enum(Object.values(Role) as [string, ...string[]]),
});

export const listUsersSchema = z.object({
  page:     z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  search:   z.string().optional(),
  role:     z.enum(Object.values(Role) as [string, ...string[]]).optional(),
});

export const listAuditLogsSchema = z.object({
  page:     z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  actorId:  z.string().optional(),
  action:   z.string().optional(),
  targetId: z.string().optional(),
});

export type ChangeRoleInput    = z.infer<typeof changeRoleSchema>;
export type ListUsersInput     = z.infer<typeof listUsersSchema>;
export type ListAuditLogsInput = z.infer<typeof listAuditLogsSchema>;
