import { Role } from "../../../generated/prisma/index.js";
import type { CreateCommentInput, ListCommentsQuery } from "./comments.schema.js";
export declare const listComments: (paperId: string, query: ListCommentsQuery) => Promise<{
    comments: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        body: string;
        parentId: string | null;
        author: {
            name: string;
            id: string;
            role: import("../../../generated/prisma/index.js").$Enums.Role;
        };
        replies: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            parentId: string | null;
            author: {
                name: string;
                id: string;
                role: import("../../../generated/prisma/index.js").$Enums.Role;
            };
        }[];
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const createComment: (paperId: string, authorId: string, authorRole: Role, input: CreateCommentInput) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    parentId: string | null;
    author: {
        name: string;
        id: string;
        role: import("../../../generated/prisma/index.js").$Enums.Role;
    };
}>;
export declare const deleteComment: (commentId: string, requesterId: string, requesterRole: Role) => Promise<{
    message: string;
}>;
//# sourceMappingURL=comments.service.d.ts.map