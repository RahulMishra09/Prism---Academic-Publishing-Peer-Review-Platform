import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  getBookByIsbn, listBooks, getChaptersByIsbn, getChapterByDoi,
  listAllBooks, createBook, updateBook, deleteBook,
  createChapter, updateChapter, deleteChapter,
} from "./books.service.js";
import { sendSuccess, fieldErrors } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const paginationSchema = z.object({
  page:       z.coerce.number().int().min(1).default(1),
  pageSize:   z.coerce.number().int().min(1).max(1000).default(20),
  discipline: z.string().optional(),
});

const bookCreateSchema = z.object({
  isbn:          z.string().min(10).max(20),
  title:         z.string().min(2).max(500),
  description:   z.string().optional(),
  publisher:     z.string().max(300).optional(),
  publishedAt:   z.string().optional(),
  coverImageUrl: z.string().optional(),
  discipline:    z.string().max(200).optional(),
  doi:           z.string().optional(),
  edition:       z.string().max(50).optional(),
  language:      z.string().max(10).optional(),
  isOpenAccess:  z.boolean().optional(),
});

const bookUpdateSchema = bookCreateSchema
  .extend({ publishedAt: z.string().nullable().optional(), isActive: z.boolean().optional() })
  .partial();

const chapterCreateSchema = z.object({
  doi:       z.string().min(3).max(500),
  title:     z.string().min(2).max(500),
  abstract:  z.string().optional(),
  order:     z.coerce.number().int().min(0),
  pdfUrl:    z.string().optional(),
  pageStart: z.coerce.number().int().optional(),
  pageEnd:   z.coerce.number().int().optional(),
});

const chapterUpdateSchema = chapterCreateSchema
  .extend({ pdfUrl: z.string().nullable().optional(), pageStart: z.coerce.number().int().nullable().optional(), pageEnd: z.coerce.number().int().nullable().optional() })
  .partial();

// ── Public ────────────────────────────────────────────────────
export const listBooksHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await listBooks(parsed.data.page, parsed.data.pageSize, parsed.data.discipline);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const getBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await getBookByIsbn(param(req.params["isbn"]));
    sendSuccess(res, { statusCode: 200, message: "Book retrieved", data: book });
  } catch (err) { next(err); }
};

export const getChapters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chapters = await getChaptersByIsbn(param(req.params["isbn"]));
    sendSuccess(res, { statusCode: 200, message: "Chapters retrieved", data: chapters });
  } catch (err) { next(err); }
};

export const getChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chapter = await getChapterByDoi(param(req.params["doi"]));
    sendSuccess(res, { statusCode: 200, message: "Chapter retrieved", data: chapter });
  } catch (err) { next(err); }
};

// ── Admin: Books ──────────────────────────────────────────────
export const adminListBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid query" }); return; }
    const result = await listAllBooks(parsed.data.page, parsed.data.pageSize);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const createBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = bookCreateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const book = await createBook(parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Book created", data: book });
  } catch (err) { next(err); }
};

export const updateBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = bookUpdateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const book = await updateBook(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Book updated", data: book });
  } catch (err) { next(err); }
};

export const deleteBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteBook(param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Book deleted", data: null });
  } catch (err) { next(err); }
};

// ── Admin: Chapters ───────────────────────────────────────────
export const createChapterHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = chapterCreateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const chapter = await createChapter(param(req.params["id"]), parsed.data);
    sendSuccess(res, { statusCode: 201, message: "Chapter created", data: chapter });
  } catch (err) { next(err); }
};

export const updateChapterHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = chapterUpdateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors(parsed.error) }); return; }
    const chapter = await updateChapter(param(req.params["chapterId"]), parsed.data);
    sendSuccess(res, { statusCode: 200, message: "Chapter updated", data: chapter });
  } catch (err) { next(err); }
};

export const deleteChapterHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteChapter(param(req.params["chapterId"]));
    sendSuccess(res, { statusCode: 200, message: "Chapter deleted", data: null });
  } catch (err) { next(err); }
};
