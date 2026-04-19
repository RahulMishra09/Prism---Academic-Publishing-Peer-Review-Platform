import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

// ─── Transporter ─────────────────────────────────────────────────────────────

function createTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    // No SMTP configured — use Ethereal (test account, captures emails at ethereal.email)
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: "ethereal@test.com", pass: "ethereal" },
    });
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

const transporter = createTransporter();

// ─── Base send ───────────────────────────────────────────────────────────────

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendMail(opts: SendMailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: `Prism Research Portal <${env.EMAIL_FROM}>`,
      ...opts,
    });
  } catch (err) {
    console.error("[Email] Failed to send:", opts.subject, err);
    // Never crash the app because email failed
  }
}

// ─── Shared layout ───────────────────────────────────────────────────────────

function layout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; background: #f5f5f5; color: #1a1a2e; }
    .wrap { max-width: 580px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: #1e3a8a; padding: 28px 32px; }
    .header h1 { margin: 0; color: #fff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p  { margin: 4px 0 0; color: rgba(255,255,255,0.7); font-size: 13px; }
    .body { padding: 28px 32px; }
    .body p { margin: 0 0 16px; line-height: 1.6; font-size: 15px; }
    .cta { display: inline-block; margin-top: 8px; padding: 12px 24px; background: #1e3a8a; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; }
    .meta { background: #f8faff; border-radius: 8px; padding: 14px 18px; margin: 16px 0; font-size: 13px; line-height: 1.7; color: #555; }
    .meta strong { color: #1a1a2e; }
    .footer { padding: 16px 32px; border-top: 1px solid #e8eaf0; font-size: 12px; color: #aaa; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Prism</h1>
      <p>Academic Publishing &amp; Peer Review</p>
    </div>
    <div class="body">${body}</div>
    <div class="footer">You received this email because you have an account on Prism. &copy; ${new Date().getFullYear()} Prism Research Portal.</div>
  </div>
</body>
</html>`;
}

// ─── Typed email senders ─────────────────────────────────────────────────────

export const sendWelcomeEmail = (to: string, name: string) =>
  sendMail({
    to,
    subject: "Welcome to Prism — Academic Publishing Platform",
    html: layout(
      "Welcome to Prism",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Welcome to Prism! Your account has been created successfully. You can now browse peer-reviewed research, submit manuscripts, and collaborate with the global scientific community.</p>
       <a href="${env.FRONTEND_URL}" class="cta">Visit Prism →</a>`,
    ),
  });

export const sendSubmissionConfirmation = (to: string, name: string, paperTitle: string) =>
  sendMail({
    to,
    subject: `Submission received: "${paperTitle}"`,
    html: layout(
      "Submission Received",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Your manuscript has been received and is now under editorial review.</p>
       <div class="meta"><strong>Title:</strong> ${paperTitle}<br /><strong>Status:</strong> Under Review</div>
       <p>You will be notified by email once reviewers have been assigned and when a final decision is made.</p>
       <a href="${env.FRONTEND_URL}/account" class="cta">View Submission →</a>`,
    ),
  });

export const sendReviewerAssignedEmail = (
  to: string,
  reviewerName: string,
  paperTitle: string,
  paperId: string,
) =>
  sendMail({
    to,
    subject: `New review assignment: "${paperTitle}"`,
    html: layout(
      "New Review Assignment",
      `<p>Hi <strong>${reviewerName}</strong>,</p>
       <p>You have been assigned to review a manuscript. Please complete your review within the requested timeframe.</p>
       <div class="meta"><strong>Manuscript:</strong> ${paperTitle}</div>
       <p>Log in to access the full manuscript and submit your review.</p>
       <a href="${env.FRONTEND_URL}/reviewer" class="cta">Start Review →</a>`,
    ),
  });

export const sendReviewSubmittedEmail = (
  to: string,
  editorName: string,
  paperTitle: string,
  reviewerName: string,
) =>
  sendMail({
    to,
    subject: `Review submitted for "${paperTitle}"`,
    html: layout(
      "Review Submitted",
      `<p>Hi <strong>${editorName}</strong>,</p>
       <p>A reviewer has submitted their review for a manuscript under your management.</p>
       <div class="meta">
         <strong>Manuscript:</strong> ${paperTitle}<br />
         <strong>Reviewer:</strong> ${reviewerName}
       </div>
       <a href="${env.FRONTEND_URL}/editor" class="cta">View Review →</a>`,
    ),
  });

export const sendDecisionEmail = (
  to: string,
  authorName: string,
  paperTitle: string,
  decision: "APPROVED" | "REJECTED",
  reason?: string,
) => {
  const isAccepted = decision === "APPROVED";
  return sendMail({
    to,
    subject: `Decision on "${paperTitle}": ${isAccepted ? "Accepted" : "Not Accepted"}`,
    html: layout(
      `Manuscript Decision — ${isAccepted ? "Accepted" : "Not Accepted"}`,
      `<p>Hi <strong>${authorName}</strong>,</p>
       <p>We have reached a decision regarding your manuscript.</p>
       <div class="meta">
         <strong>Title:</strong> ${paperTitle}<br />
         <strong>Decision:</strong> ${isAccepted ? "✓ Accepted for publication" : "✗ Not accepted"}
         ${reason ? `<br /><strong>Editorial note:</strong> ${reason}` : ""}
       </div>
       ${isAccepted
         ? "<p>Congratulations! Your manuscript will be published on Prism. You will receive further instructions regarding publication details.</p>"
         : "<p>Thank you for submitting your work to Prism. We encourage you to revise and consider resubmitting in the future.</p>"}
       <a href="${env.FRONTEND_URL}/account" class="cta">View Manuscript →</a>`,
    ),
  });
};
