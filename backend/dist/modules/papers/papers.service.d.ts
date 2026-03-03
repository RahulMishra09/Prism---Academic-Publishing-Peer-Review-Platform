import { Role } from "../../../generated/prisma/index.js";
import type { CreatePaperInput, UpdatePaperInput, RejectPaperInput, ListPapersQuery } from "./papers.schema.js";
/**
 * Creates a new paper in DRAFT status for the authenticated author.
 */
export declare const createPaper: (authorId: string, input: CreatePaperInput) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    rejectionReason: string | null;
    approvedAt: Date | null;
    author: {
        name: string;
        email: string;
        id: string;
    };
}>;
/**
 * Returns all papers belonging to the authenticated author,
 * newest first.
 */
export declare const getMyPapers: (authorId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    rejectionReason: string | null;
    approvedAt: Date | null;
    author: {
        name: string;
        email: string;
        id: string;
    };
}[]>;
/**
 * Paginated list of papers.
 *
 * Visibility rules:
 *  - AUTHOR  ’ their own papers only
 *  - REVIEWER ’ SUBMITTED papers only (assigned or unassigned)
 *  - EDITOR / ADMIN ’ all papers, filterable by status / domain
 *  - READER  ’ APPROVED papers only
 */
export declare const listPapers: (requesterId: string, requesterRole: Role, query: ListPapersQuery) => Promise<{
    papers: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        abstract: string;
        domain: string;
        keywords: string[];
        status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
        rejectionReason: string | null;
        approvedAt: Date | null;
        author: {
            name: string;
            email: string;
            id: string;
        };
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
/**
 * Returns a single paper with its reviews and reviewer assignments.
 *
 * Visibility:
 *  - AUTHOR   ’ own papers only
 *  - READER   ’ APPROVED papers only
 *  - REVIEWER ’ SUBMITTED papers only
 *  - EDITOR / ADMIN ’ any paper
 */
export declare const getPaperById: (paperId: string, requesterId: string, requesterRole: Role) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    rejectionReason: string | null;
    approvedAt: Date | null;
    author: {
        name: string;
        email: string;
        id: string;
    };
} | null>;
/**
 * Updates a paper's content. Only the owning author may do this,
 * and only while the paper is in DRAFT status.
 */
export declare const updatePaper: (paperId: string, authorId: string, input: UpdatePaperInput) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    rejectionReason: string | null;
    approvedAt: Date | null;
    author: {
        name: string;
        email: string;
        id: string;
    };
}>;
/**
 * Transitions a paper from DRAFT ’ SUBMITTED.
 * Only the owning author may submit, and only from DRAFT status.
 */
export declare const submitPaper: (paperId: string, authorId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    rejectionReason: string | null;
    approvedAt: Date | null;
    author: {
        name: string;
        email: string;
        id: string;
    };
}>;
/**
 * Transitions a paper from SUBMITTED ’ APPROVED.
 * Only EDITOR / ADMIN may approve.
 * Sets approvedAt timestamp.
 */
export declare const approvePaper: (paperId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    rejectionReason: string | null;
    approvedAt: Date | null;
    author: {
        name: string;
        email: string;
        id: string;
    };
}>;
/**
 * Transitions a paper from SUBMITTED ’ REJECTED.
 * Requires a rejection reason.
 * Only EDITOR / ADMIN may reject.
 */
export declare const rejectPaper: (paperId: string, input: RejectPaperInput) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    abstract: string;
    domain: string;
    keywords: string[];
    status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    rejectionReason: string | null;
    approvedAt: Date | null;
    author: {
        name: string;
        email: string;
        id: string;
    };
}>;
//# sourceMappingURL=papers.service.d.ts.map