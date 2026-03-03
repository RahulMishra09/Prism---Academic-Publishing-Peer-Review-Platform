import type { AssignReviewerInput, EditorListPapersQuery } from "./editor.schema.js";
export declare const listAllPapers: (query: EditorListPapersQuery) => Promise<{
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
        _count: {
            assignments: number;
            reviews: number;
        };
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getPaperDetail: (paperId: string) => Promise<{
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
    assignments: {
        id: string;
        status: import("../../../generated/prisma/index.js").$Enums.AssignmentStatus;
        assignedAt: Date;
        review: {
            id: string;
            createdAt: Date;
            score: number;
            recommendation: string;
        } | null;
        reviewer: {
            name: string;
            email: string;
            id: string;
        };
    }[];
    reviews: {
        id: string;
        createdAt: Date;
        strengths: string;
        weaknesses: string;
        score: number;
        recommendation: string;
        reviewer: {
            name: string;
            email: string;
            id: string;
        };
    }[];
    _count: {
        assignments: number;
        reviews: number;
    };
}>;
export declare const assignReviewer: (paperId: string, input: AssignReviewerInput) => Promise<{
    id: string;
    paper: {
        id: string;
        title: string;
        domain: string;
        status: import("../../../generated/prisma/index.js").$Enums.PaperStatus;
    };
    status: import("../../../generated/prisma/index.js").$Enums.AssignmentStatus;
    assignedAt: Date;
    reviewer: {
        name: string;
        email: string;
        id: string;
    };
}>;
export declare const removeReviewer: (paperId: string, reviewerId: string) => Promise<{
    message: string;
}>;
export declare const listAssignments: (paperId: string) => Promise<{
    id: string;
    status: import("../../../generated/prisma/index.js").$Enums.AssignmentStatus;
    assignedAt: Date;
    review: {
        id: string;
        createdAt: Date;
        score: number;
        recommendation: string;
    } | null;
    reviewer: {
        name: string;
        email: string;
        id: string;
    };
}[]>;
//# sourceMappingURL=editor.service.d.ts.map