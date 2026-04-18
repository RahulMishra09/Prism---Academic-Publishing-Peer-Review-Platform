import { PaperStatus, Role } from "../../../generated/prisma/index.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import type { CreateCommentInput, ListCommentsQuery } from "./comments.schema.js";

// Shared select for a comment with author and nested replies
const commentSelect = {
  id:        true,
  body:      true,
  createdAt: true,
  updatedAt: true,
  parentId:  true,
  author: {
    select: { id: true, name: true, role: true },
  },
  replies: {
    select: {
      id:        true,
      body:      true,
      createdAt: true,
      updatedAt: true,
      parentId:  true,
      author: {
        select: { id: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

// listComments
// Returns top-level comments (no parentId) for an APPROVED paper,
// with their replies nested inside. Paginated.
export const listComments = async (paperId: string, query: ListCommentsQuery) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // Paper must exist and be APPROVED
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, status: true },
  });

  if (!paper) throw new AppError("Paper not found", 404);

  if (paper.status !== PaperStatus.APPROVED) {
    throw new AppError("Comments are only available on approved papers", 403);
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where:   { paperId, parentId: null },
      select:  commentSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where: { paperId, parentId: null } }),
  ]);

  return {
    comments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// createComment
// Posts a new comment (or reply) on an APPROVED paper.
// Guards:
//   - Paper must be APPROVED
//   - REVIEWER role cannot comment
//   - AUTHOR can only comment on their own papers
//   - If parentId is provided, parent comment must exist and belong to the same paper
export const createComment = async (
  paperId: string,
  authorId: string,
  authorRole: Role,
  input: CreateCommentInput
) => {
  // REVIEWERs use the Review model -- not comments
  if (authorRole === Role.REVIEWER) {
    throw new AppError("Reviewers cannot post comments", 403);
  }

  // Fetch the paper
  const paper = await prisma.paper.findUnique({
    where:  { id: paperId },
    select: { id: true, status: true, submittedBy: true },
  });

  if (!paper) throw new AppError("Paper not found", 404);

  if (paper.status !== PaperStatus.APPROVED) {
    throw new AppError("Comments can only be posted on approved papers", 403);
  }

  // AUTHORS can only comment on their own papers
  if (authorRole === Role.AUTHOR && paper.submittedBy !== authorId) {
    throw new AppError("You can only comment on your own papers", 403);
  }

  // If replying, validate the parent comment
  if (input.parentId) {
    const parent = await prisma.comment.findUnique({
      where:  { id: input.parentId },
      select: { id: true, paperId: true, parentId: true },
    });

    if (!parent) {
      throw new AppError("Parent comment not found", 404);
    }

    if (parent.paperId !== paperId) {
      throw new AppError("Parent comment does not belong to this paper", 422);
    }

    // Enforce one level of nesting -- cannot reply to a reply
    if (parent.parentId !== null) {
      throw new AppError("Replies to replies are not supported", 422);
    }
  }

  const comment = await prisma.comment.create({
    data: {
      body:     input.body,
      paperId,
      authorId,
      parentId: input.parentId ?? null,
    },
    select: {
      id:        true,
      body:      true,
      createdAt: true,
      updatedAt: true,
      parentId:  true,
      author: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  return comment;
};

// deleteComment
// Deletes a comment.
// Guards:
//   - Comment must exist
//   - READER and AUTHOR can only delete their own comments
//   - EDITOR and ADMIN can delete any comment
//   - Deleting a parent also cascades to its replies (handled by DB on-delete if set,
//     otherwise handled here explicitly)
export const deleteComment = async (
  commentId: string,
  requesterId: string,
  requesterRole: Role
) => {
  const comment = await prisma.comment.findUnique({
    where:  { id: commentId },
    select: { id: true, authorId: true },
  });

  if (!comment) throw new AppError("Comment not found", 404);

  // Only owner, EDITOR, or ADMIN can delete
  const isOwner = comment.authorId === requesterId;
  const isPrivileged = requesterRole === Role.EDITOR || requesterRole === Role.ADMIN;

  if (!isOwner && !isPrivileged) {
    throw new AppError("You do not have permission to delete this comment", 403);
  }

  // Delete replies first, then the comment itself
  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { parentId: commentId } }),
    prisma.comment.delete({ where: { id: commentId } }),
  ]);

  return { message: "Comment deleted successfully" };
};
