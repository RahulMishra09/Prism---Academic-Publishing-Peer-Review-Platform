import { prisma } from "../../config/prisma.js";
import { Resend } from "resend";
import { env } from "../../config/env.js";
import type { ContactInput } from "./contact.schema.js";

const resend = new Resend(env.RESEND_API_KEY);

export const submitContact = async (input: ContactInput) => {
  // Persist message and generate ticket ID
  const record = await prisma.contactMessage.create({
    data: { ...input },
    select: { ticketId: true, createdAt: true },
  });

  // Fire-and-forget: notify support team and send confirmation to sender
  Promise.all([
    resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.EMAIL_FROM, // support inbox
      subject: `[Support] ${input.subject} — Ticket ${record.ticketId}`,
      html: `
        <h3>New Contact Message — Ticket #${record.ticketId}</h3>
        <p><strong>From:</strong> ${input.firstName} ${input.lastName} &lt;${input.email}&gt;</p>
        <p><strong>Subject:</strong> ${input.subject}</p>
        <hr/>
        <p>${input.message.replace(/\n/g, "<br/>")}</p>
      `,
    }),
    resend.emails.send({
      from: env.EMAIL_FROM,
      to: input.email,
      subject: `We received your message — Ticket #${record.ticketId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Thank you for contacting us</h2>
          <p>Hi ${input.firstName},</p>
          <p>We have received your message and will respond within 2 business days.</p>
          <p><strong>Your ticket ID:</strong> ${record.ticketId}</p>
          <p style="color:#6b7280; font-size:12px;">Please reference this ID in any follow-up correspondence.</p>
        </div>
      `,
    }),
  ]).catch(() => console.error("Failed to send contact notification emails"));

  return { ticketId: record.ticketId, accepted: true };
};

// ── Admin: list / get / update status ────────────────────────
export const listContactMessages = async (page: number, pageSize: number, status?: string) => {
  const where = status ? { status } : {};
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
    prisma.contactMessage.count({ where }),
  ]);
  return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

export const updateContactStatus = async (id: string, status: string) => {
  const msg = await prisma.contactMessage.findUnique({ where: { id }, select: { id: true } });
  if (!msg) { const { AppError } = await import("../../middleware/error.middleware.js"); throw new AppError("Message not found", 404); }
  return prisma.contactMessage.update({ where: { id }, data: { status } });
};
