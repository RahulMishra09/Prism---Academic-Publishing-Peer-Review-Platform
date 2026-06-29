import { z } from "zod";

export const updateProfileSchema = z.object({
  name:        z.string().min(2).max(100).trim().optional(),
  firstName:   z.string().max(100).optional(),
  lastName:    z.string().max(100).optional(),
  orcid:       z.string().max(50).optional(),
  affiliation: z.string().max(300).optional(),
  avatarUrl:   z.string().optional(),
  bio:         z.string().max(1000).optional(),
});

export const createAlertSchema = z.object({
  type:       z.enum(["NEW_ARTICLE", "JOURNAL_UPDATE", "CONFERENCE"]),
  query:      z.string().optional(),
  journalId:  z.string().optional(),
  discipline: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword:     z.string().min(6, "New password must be at least 6 characters"),
});

export const updateAlertSchema = z.object({
  type:       z.enum(["NEW_ARTICLE", "JOURNAL_UPDATE", "CONFERENCE"]).optional(),
  query:      z.string().optional(),
  journalId:  z.string().optional(),
  discipline: z.string().optional(),
});

export type UpdateProfileInput   = z.infer<typeof updateProfileSchema>;
export type CreateAlertInput     = z.infer<typeof createAlertSchema>;
export type ChangePasswordInput  = z.infer<typeof changePasswordSchema>;
export type UpdateAlertInput     = z.infer<typeof updateAlertSchema>;
