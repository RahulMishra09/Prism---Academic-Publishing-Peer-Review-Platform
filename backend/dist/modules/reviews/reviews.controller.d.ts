import { Request, Response, NextFunction } from "express";
/**
 * Lists all papers assigned to the authenticated reviewer,
 * with submission status for each.
 * Role: REVIEWER
 */
export declare const listMyAssignments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Submit a review for an assigned paper.
 * Role: REVIEWER
 */
export declare const submit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Lists all reviews submitted by the authenticated reviewer.
 * Role: REVIEWER
 */
export declare const listMyReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Returns all reviews for a specific paper.
 * Reviewer identity is hidden from the paper's author.
 * Role: AUTHOR (own papers) | REVIEWER (own review) | EDITOR | ADMIN
 */
export declare const listForPaper: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=reviews.controller.d.ts.map