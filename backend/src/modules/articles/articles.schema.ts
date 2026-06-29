import { z } from "zod";

export const articleListSchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(20),
  discipline:  z.string().optional(),
  query:       z.string().optional(),
  trending:    z.coerce.boolean().optional(),
  accessType:  z.enum(["OPEN_ACCESS", "SUBSCRIPTION", "FREE"]).optional(),
  articleType: z
    .enum(["RESEARCH_ARTICLE", "REVIEW", "EDITORIAL", "LETTER", "CASE_STUDY", "BOOK_REVIEW", "CORRECTION"])
    .optional(),
  language:    z.string().optional(),
  dateFrom:    z.string().optional(),
  dateTo:      z.string().optional(),
  sortBy:      z.enum(["date-desc", "date-asc", "citations", "views", "downloads", "relevance"]).default("date-desc"),
});

export type ArticleListQuery = z.infer<typeof articleListSchema>;
