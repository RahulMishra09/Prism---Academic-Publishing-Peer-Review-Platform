import { Request, Response, NextFunction } from "express";
/**
 * Create a new paper in DRAFT status.
 * Role: AUTHOR
 */
export declare const create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Returns all papers owned by the authenticated author.
 * Role: AUTHOR
 */
export declare const getMine: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Paginated list of papers with optional status / domain filters.
 * Visibility is enforced per role inside the service.
 * Role: ALL authenticated users
 */
export declare const list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Returns full paper detail including reviews and assignments.
 * Role: ALL authenticated users (visibility enforced in service)
 */
export declare const getOne: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update a paper's content (DRAFT only).
 * Role: AUTHOR (own papers only)
 */
export declare const update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Submit a paper for review: DRAFT ï¿½ SUBMITTED.
 * Role: AUTHOR (own papers only)
 */
export declare const submit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Approve a submitted paper: SUBMITTED ï¿½ APPROVED.
 * Role: EDITOR
 */
export declare const approve: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Reject a submitted paper: SUBMITTED ï¿½ REJECTED.
 * Role: EDITOR
 */
export declare const reject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=papers.controller.d.ts.map