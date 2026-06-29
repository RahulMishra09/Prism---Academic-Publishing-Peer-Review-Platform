import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";
import {
  sendOrderConfirmationEmail,
  sendApcConfirmationEmail,
  sendOrderReceiptEmail,
} from "../../utils/email.js";

// ── checkoutArticle ──────────────────────────────────────────
// In a real system this would integrate Stripe / PayPal.
// For now we create a PENDING order and return a payment intent stub.
export const checkoutArticle = async (userId: string, doi: string) => {
  const [article, user] = await Promise.all([
    prisma.article.findUnique({
      where: { doi: decodeURIComponent(doi), isPublished: true },
      select: { doi: true, title: true, accessType: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
  ]);

  if (!article) throw new AppError("Article not found", 404);
  if (!user) throw new AppError("User not found", 404);
  if (article.accessType === "OPEN_ACCESS" || article.accessType === "FREE") {
    throw new AppError("This article is freely available — no purchase required", 422);
  }

  // Check if user already has a completed order for this article
  const existing = await prisma.order.findFirst({
    where: { userId, itemRef: doi, status: "COMPLETED", itemType: "ARTICLE" },
  });
  if (existing) throw new AppError("You already have access to this article", 409);

  const order = await prisma.order.create({
    data: {
      userId,
      amount:   29.99,
      currency: "USD",
      status:   "PENDING",
      itemType: "ARTICLE",
      itemRef:  doi,
    },
  });

  void sendOrderConfirmationEmail({
    to:        user.email,
    userName:  user.name,
    orderId:   order.id,
    itemTitle: article.title,
    amount:    order.amount,
    currency:  order.currency,
  });

  // TODO: replace stub with real payment provider integration
  return {
    orderId:        order.id,
    amount:         order.amount,
    currency:       order.currency,
    paymentIntentId: `pi_stub_${order.id}`,
    clientSecret:   `cs_stub_${order.id}`,
  };
};

// ── checkoutApc ──────────────────────────────────────────────
export const checkoutApc = async (userId: string, submissionId: string) => {
  const [submission, user] = await Promise.all([
    prisma.submission.findFirst({
      where: { id: submissionId, submittedBy: userId, status: "ACCEPTED" },
      select: { id: true, title: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
  ]);

  if (!submission) throw new AppError("Accepted submission not found", 404);
  if (!user) throw new AppError("User not found", 404);

  const existing = await prisma.order.findFirst({
    where: { userId, itemRef: submissionId, status: "COMPLETED", itemType: "APC" },
  });
  if (existing) throw new AppError("APC has already been paid for this submission", 409);

  const order = await prisma.order.create({
    data: {
      userId,
      amount:   1500,
      currency: "USD",
      status:   "PENDING",
      itemType: "APC",
      itemRef:  submissionId,
    },
  });

  void sendApcConfirmationEmail({
    to:              user.email,
    userName:        user.name,
    orderId:         order.id,
    submissionTitle: submission.title,
    amount:          order.amount,
    currency:        order.currency,
  });

  return {
    orderId:        order.id,
    amount:         order.amount,
    currency:       order.currency,
    paymentIntentId: `pi_stub_${order.id}`,
    clientSecret:   `cs_stub_${order.id}`,
  };
};

// ── completeOrder ─────────────────────────────────────────────
// Called by a payment-provider webhook to mark payment successful.
export const completeOrder = async (userId: string, orderId: string, receiptUrl?: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId, status: "PENDING" },
  });
  if (!order) throw new AppError("Pending order not found", 404);

  const [updated, user] = await Promise.all([
    prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED", receiptUrl: receiptUrl ?? null },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
  ]);

  if (user) {
    // Resolve a readable item title for the email
    let itemTitle = order.itemRef;
    if (order.itemType === "ARTICLE") {
      const article = await prisma.article.findUnique({
        where: { doi: order.itemRef },
        select: { title: true },
      });
      if (article) itemTitle = article.title;
    } else if (order.itemType === "APC") {
      const submission = await prisma.submission.findUnique({
        where: { id: order.itemRef },
        select: { title: true },
      });
      if (submission) itemTitle = submission.title;
    }

    void sendOrderReceiptEmail({
      to:         user.email,
      userName:   user.name,
      orderId:    updated.id,
      itemTitle,
      amount:     updated.amount,
      currency:   updated.currency,
      receiptUrl: updated.receiptUrl ?? undefined,
    });
  }

  return { orderId: updated.id, status: updated.status };
};

// ── getOrderReceipt ──────────────────────────────────────────
export const getOrderReceipt = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });
  if (!order) throw new AppError("Order not found", 404);

  return {
    orderId:    order.id,
    amount:     order.amount,
    currency:   order.currency,
    status:     order.status,
    itemType:   order.itemType,
    itemRef:    order.itemRef,
    createdAt:  order.createdAt,
    receiptUrl: order.receiptUrl ?? null,
  };
};
