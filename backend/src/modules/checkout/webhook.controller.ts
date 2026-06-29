import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { env } from "../../config/env.js";
import { completeOrder } from "./checkout.service.js";

// ── verifySignature ───────────────────────────────────────────
// Supports two common formats:
//   Stripe-style:  Stripe-Signature: t=...,v1=<hex>
//   Generic HMAC:  X-Webhook-Signature: <hex>
function verifySignature(rawBody: Buffer, headers: Request["headers"]): boolean {
  const secret = env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return true; // no secret configured → skip verification (dev mode)

  const stripeSig = headers["stripe-signature"] as string | undefined;
  if (stripeSig) {
    // Parse t= and v1= from "t=1700000000,v1=abc123..."
    const parts = Object.fromEntries(stripeSig.split(",").map(p => p.split("=")));
    const timestamp = parts["t"];
    const v1        = parts["v1"];
    if (!timestamp || !v1) return false;

    const payload  = `${timestamp}.${rawBody.toString("utf8")}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    try {
      const v1Buffer = Buffer.from(v1, "hex");
      const expectedBuffer = Buffer.from(expected, "hex");
      if (v1Buffer.length !== expectedBuffer.length) return false;
      return crypto.timingSafeEqual(v1Buffer, expectedBuffer);
    } catch {
      return false;
    }
  }

  const generic = headers["x-webhook-signature"] as string | undefined;
  if (generic) {
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    try {
      return crypto.timingSafeEqual(Buffer.from(generic, "hex"), Buffer.from(expected, "hex"));
    } catch {
      return false;
    }
  }

  return false;
}

// ── POST /api/checkout/webhook ────────────────────────────────
// Must be registered BEFORE express.json() so the raw body is available.
export const paymentWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawBody = req.body as Buffer;

    if (!verifySignature(rawBody, req.headers)) {
      res.status(400).json({ code: "INVALID_SIGNATURE", message: "Webhook signature verification failed" });
      return;
    }

    let event: { type: string; data: Record<string, unknown> };
    try {
      event = JSON.parse(rawBody.toString("utf8")) as typeof event;
    } catch {
      res.status(400).json({ code: "INVALID_PAYLOAD", message: "Could not parse webhook body as JSON" });
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
      case "charge.succeeded":
      case "order.completed": {
        const data       = event.data as { orderId?: string; userId?: string; receiptUrl?: string; metadata?: Record<string, string> };
        const orderId    = data.orderId    ?? data.metadata?.["orderId"];
        const userId     = data.userId     ?? data.metadata?.["userId"];
        const receiptUrl = data.receiptUrl ?? data.metadata?.["receiptUrl"];

        if (!orderId || !userId) {
          res.status(422).json({ code: "MISSING_FIELDS", message: "orderId and userId are required in webhook payload" });
          return;
        }

        await completeOrder(userId, orderId, receiptUrl);
        break;
      }

      default:
        // Unhandled event type — acknowledge without error
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};
