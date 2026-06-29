import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Wraps content in a branded card layout. */
function layout(headerColor: string, headerText: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f3f4f6}
  .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .hdr{background:${headerColor};color:#fff;padding:24px 32px}
  .hdr h1{margin:0;font-size:20px;font-weight:700}
  .body{padding:32px}
  .btn{display:inline-block;background:${headerColor};color:#fff!important;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600;margin-top:20px}
  .box{background:#f9fafb;border-left:4px solid ${headerColor};padding:16px 20px;margin:20px 0;border-radius:0 6px 6px 0}
  .ftr{padding:24px 32px;font-size:12px;color:#9ca3af;text-align:center;border-top:1px solid #f3f4f6}
  p{margin:0 0 12px}
  strong{color:#111}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr"><h1>${headerText}</h1></div>
  <div class="body">${bodyHtml}</div>
  <div class="ftr">This is an automated message from Lumex Research Portal. Please do not reply.</div>
</div>
</body>
</html>`;
}

/** Fire-and-forget email — logs on failure, never throws. */
async function send(to: string, subject: string, html: string): Promise<void> {
  try {
    await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
  } catch (err) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, err);
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const sendWelcomeEmail = (to: string, name: string): Promise<void> =>
  send(
    to,
    "Welcome to Lumex Research Portal",
    layout(
      "#2563eb",
      "Welcome to Lumex!",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Thank you for creating your account on the Lumex Research Portal. You can now:</p>
       <ul>
         <li>Browse and read published research articles</li>
         <li>Submit your own papers for peer review</li>
         <li>Set up personalised alerts for new publications</li>
         <li>Track your submission status in real time</li>
       </ul>
       <a href="${env.APP_URL}/dashboard" class="btn">Go to your Dashboard</a>`
    )
  );

export const sendPasswordResetEmail = (to: string, name: string, resetUrl: string): Promise<void> =>
  send(
    to,
    "Reset your Lumex password",
    layout(
      "#7c3aed",
      "Password Reset Request",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>We received a request to reset the password for your account. Click the button below to choose a new password:</p>
       <a href="${resetUrl}" class="btn">Reset Password</a>
       <div class="box"><p>This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your password will not change.</p></div>`
    )
  );

// ─── Legacy paper workflow ────────────────────────────────────────────────────

export const sendPaperSubmittedEmail = (data: {
  to: string; authorName: string; paperTitle: string; paperUrl: string;
}): Promise<void> =>
  send(
    data.to,
    "Paper Submitted for Review",
    layout(
      "#2563eb",
      "Paper Submitted Successfully",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>Your paper <strong>"${data.paperTitle}"</strong> has been successfully submitted for review.</p>
       <p>Our editorial team will assign reviewers shortly. You'll receive updates as your paper progresses.</p>
       <a href="${data.paperUrl}" class="btn">View Your Paper</a>`
    )
  );

export const sendPaperApprovedEmail = (data: {
  to: string; authorName: string; paperTitle: string; paperUrl: string; approvedAt: Date;
}): Promise<void> =>
  send(
    data.to,
    "Congratulations! Your Paper Has Been Approved",
    layout(
      "#10b981",
      "Paper Approved!",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>We are delighted to inform you that your paper <strong>"${data.paperTitle}"</strong> has been <strong>approved for publication</strong>.</p>
       <p>Your paper is now publicly accessible on the platform.</p>
       <div class="box"><p><strong>Approved on:</strong> ${new Date(data.approvedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p></div>
       <a href="${data.paperUrl}" class="btn">View Published Paper</a>`
    )
  );

export const sendPaperRejectedEmail = (data: {
  to: string; authorName: string; paperTitle: string; rejectionReason: string;
}): Promise<void> =>
  send(
    data.to,
    "Paper Submission Decision",
    layout(
      "#dc2626",
      "Paper Submission Decision",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>Thank you for submitting <strong>"${data.paperTitle}"</strong>. After careful review, we regret to inform you that it has not been accepted for publication at this time.</p>
       <div class="box"><strong>Editor's Feedback:</strong><p>${data.rejectionReason}</p></div>
       <p>We encourage you to consider the feedback and resubmit after making revisions.</p>`
    )
  );

export const sendReviewerAssignedEmail = (data: {
  to: string; reviewerName: string; paperTitle: string; paperAbstract: string; reviewUrl: string;
}): Promise<void> =>
  send(
    data.to,
    "New Paper Assigned for Review",
    layout(
      "#7c3aed",
      "New Review Assignment",
      `<p>Hi <strong>${data.reviewerName}</strong>,</p>
       <p>You have been assigned to review a new paper submission:</p>
       <div class="box">
         <strong>${data.paperTitle}</strong>
         <p style="color:#6b7280;margin-top:8px">${data.paperAbstract.substring(0, 300)}${data.paperAbstract.length > 300 ? "…" : ""}</p>
       </div>
       <p>Please log in to access the full paper and submit your review.</p>
       <a href="${data.reviewUrl}" class="btn">Start Review</a>`
    )
  );

export const sendReviewSubmittedEmail = (data: {
  to: string; authorName: string; paperTitle: string; score: number; recommendation: string; reviewsUrl: string;
}): Promise<void> =>
  send(
    data.to,
    "New Review Received for Your Paper",
    layout(
      "#0891b2",
      "New Review Submitted",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>A reviewer has submitted their assessment for <strong>"${data.paperTitle}"</strong>.</p>
       <div class="box">
         <p><strong>Score:</strong> ${data.score} / 10</p>
         <p style="margin:0"><strong>Recommendation:</strong> ${data.recommendation}</p>
       </div>
       <p>Reviewer identities are kept anonymous to ensure unbiased feedback.</p>
       <a href="${data.reviewsUrl}" class="btn">View Reviews</a>`
    )
  );

export const sendNewCommentEmail = (data: {
  to: string; recipientName: string; commenterName: string;
  paperTitle: string; commentBody: string; paperUrl: string;
}): Promise<void> =>
  send(
    data.to,
    `New Comment on "${data.paperTitle}"`,
    layout(
      "#ea580c",
      "New Comment",
      `<p>Hi <strong>${data.recipientName}</strong>,</p>
       <p><strong>${data.commenterName}</strong> commented on <strong>"${data.paperTitle}"</strong>:</p>
       <div class="box"><p>${data.commentBody.substring(0, 500)}${data.commentBody.length > 500 ? "…" : ""}</p></div>
       <a href="${data.paperUrl}" class="btn">View Comment</a>`
    )
  );

// ─── Submission workflow (new Submission model) ───────────────────────────────

export const sendSubmissionReceivedEmail = (data: {
  to: string; authorName: string; submissionTitle: string; submissionId: string;
}): Promise<void> =>
  send(
    data.to,
    "Submission Received — Lumex Research Portal",
    layout(
      "#2563eb",
      "Submission Received",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>We have received your manuscript submission <strong>"${data.submissionTitle}"</strong> and it is now under initial editorial assessment.</p>
       <div class="box"><p><strong>Reference ID:</strong> ${data.submissionId}</p><p style="margin:0">Please keep this ID for your records.</p></div>
       <p>You will be notified by email as your submission progresses through the review process.</p>
       <a href="${env.APP_URL}/submissions/${data.submissionId}" class="btn">Track Your Submission</a>`
    )
  );

export const sendSubmissionRevisionRequiredEmail = (data: {
  to: string; authorName: string; submissionTitle: string; submissionId: string; notes?: string;
}): Promise<void> =>
  send(
    data.to,
    "Revision Required for Your Submission",
    layout(
      "#f59e0b",
      "Revision Required",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>The editors have reviewed your submission <strong>"${data.submissionTitle}"</strong> and are requesting revisions before a final decision can be made.</p>
       ${data.notes ? `<div class="box"><strong>Editor's Notes:</strong><p>${data.notes}</p></div>` : ""}
       <p>Please log in to upload your revised manuscript and respond to the editorial feedback.</p>
       <a href="${env.APP_URL}/submissions/${data.submissionId}" class="btn">Submit Revision</a>`
    )
  );

export const sendSubmissionAcceptedEmail = (data: {
  to: string; authorName: string; submissionTitle: string; submissionId: string; journalTitle?: string;
}): Promise<void> =>
  send(
    data.to,
    "Congratulations — Your Submission Has Been Accepted!",
    layout(
      "#10b981",
      "Submission Accepted!",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>We are thrilled to inform you that your manuscript <strong>"${data.submissionTitle}"</strong> has been <strong>accepted for publication</strong>${data.journalTitle ? ` in <em>${data.journalTitle}</em>` : ""}.</p>
       <p>Our production team will be in touch shortly with the next steps, including proof review and publication scheduling. If open-access publication applies, you will also receive an APC invoice.</p>
       <a href="${env.APP_URL}/submissions/${data.submissionId}" class="btn">View Submission</a>`
    )
  );

export const sendSubmissionRejectedEmail = (data: {
  to: string; authorName: string; submissionTitle: string; submissionId: string; reason?: string;
}): Promise<void> =>
  send(
    data.to,
    "Decision on Your Submission — Lumex Research Portal",
    layout(
      "#dc2626",
      "Submission Decision",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>After thorough review, the editorial board has decided not to accept your manuscript <strong>"${data.submissionTitle}"</strong> for publication at this time.</p>
       ${data.reason ? `<div class="box"><strong>Editorial Feedback:</strong><p>${data.reason}</p></div>` : ""}
       <p>We appreciate the effort you put into this submission and encourage you to consider the feedback for future submissions.</p>
       <a href="${env.APP_URL}/submissions/${data.submissionId}" class="btn">View Submission</a>`
    )
  );

export const sendSubmissionUnderReviewEmail = (data: {
  to: string; authorName: string; submissionTitle: string; submissionId: string;
}): Promise<void> =>
  send(
    data.to,
    "Your Submission Is Now Under Review",
    layout(
      "#7c3aed",
      "Under Review",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>Great news — your manuscript <strong>"${data.submissionTitle}"</strong> has passed initial editorial screening and is now <strong>under peer review</strong>.</p>
       <div class="box"><p>Our editors have assigned qualified reviewers to assess your work. This process typically takes 4–8 weeks. We will notify you as soon as a decision is reached.</p></div>
       <a href="${env.APP_URL}/submissions/${data.submissionId}" class="btn">Track Your Submission</a>`
    )
  );

export const sendSubmissionWithdrawnEmail = (data: {
  to: string; authorName: string; submissionTitle: string; submissionId: string;
}): Promise<void> =>
  send(
    data.to,
    "Submission Withdrawn — Lumex Research Portal",
    layout(
      "#6b7280",
      "Submission Withdrawn",
      `<p>Hi <strong>${data.authorName}</strong>,</p>
       <p>This is a confirmation that your submission <strong>"${data.submissionTitle}"</strong> has been successfully withdrawn.</p>
       <div class="box"><p><strong>Reference ID:</strong> ${data.submissionId}</p><p style="margin:0">No further action is required.</p></div>
       <p>If you wish to resubmit in the future, you are welcome to create a new submission at any time.</p>
       <a href="${env.APP_URL}/submit" class="btn">Start a New Submission</a>`
    )
  );

// ─── Order / Payment ──────────────────────────────────────────────────────────

export const sendOrderConfirmationEmail = (data: {
  to: string; userName: string; orderId: string;
  itemTitle: string; amount: number; currency: string;
}): Promise<void> =>
  send(
    data.to,
    "Order Confirmation — Lumex Research Portal",
    layout(
      "#0891b2",
      "Order Received",
      `<p>Hi <strong>${data.userName}</strong>,</p>
       <p>Thank you for your order. Here is a summary:</p>
       <div class="box">
         <p><strong>Item:</strong> ${data.itemTitle}</p>
         <p><strong>Order ID:</strong> ${data.orderId}</p>
         <p style="margin:0"><strong>Amount:</strong> ${data.currency} ${data.amount.toFixed(2)}</p>
       </div>
       <p>Your order is currently <strong>pending payment</strong>. Once payment is confirmed you will receive a receipt and gain immediate access.</p>
       <a href="${env.APP_URL}/orders/${data.orderId}" class="btn">View Order</a>`
    )
  );

export const sendApcConfirmationEmail = (data: {
  to: string; userName: string; orderId: string;
  submissionTitle: string; amount: number; currency: string;
}): Promise<void> =>
  send(
    data.to,
    "Article Processing Charge Invoice — Lumex Research Portal",
    layout(
      "#7c3aed",
      "APC Invoice Created",
      `<p>Hi <strong>${data.userName}</strong>,</p>
       <p>An Article Processing Charge (APC) has been raised for your accepted manuscript <strong>"${data.submissionTitle}"</strong>.</p>
       <div class="box">
         <p><strong>Invoice / Order ID:</strong> ${data.orderId}</p>
         <p style="margin:0"><strong>Amount Due:</strong> ${data.currency} ${data.amount.toFixed(2)}</p>
       </div>
       <p>Please complete payment to proceed with open-access publication. Once confirmed, your article will be scheduled for final production.</p>
       <a href="${env.APP_URL}/orders/${data.orderId}" class="btn">Pay APC</a>`
    )
  );

export const sendOrderReceiptEmail = (data: {
  to: string; userName: string; orderId: string;
  itemTitle: string; amount: number; currency: string; receiptUrl?: string;
}): Promise<void> =>
  send(
    data.to,
    "Payment Confirmed — Lumex Research Portal",
    layout(
      "#10b981",
      "Payment Confirmed",
      `<p>Hi <strong>${data.userName}</strong>,</p>
       <p>Your payment has been successfully processed. Thank you!</p>
       <div class="box">
         <p><strong>Item:</strong> ${data.itemTitle}</p>
         <p><strong>Order ID:</strong> ${data.orderId}</p>
         <p style="margin:0"><strong>Amount Paid:</strong> ${data.currency} ${data.amount.toFixed(2)}</p>
       </div>
       ${data.receiptUrl ? `<p><a href="${data.receiptUrl}">Download Receipt (PDF)</a></p>` : ""}
       <a href="${env.APP_URL}/dashboard" class="btn">Go to Dashboard</a>`
    )
  );

// ─── Alert digest ─────────────────────────────────────────────────────────────

export const sendAlertDigestEmail = (data: {
  to: string; userName: string;
  articles: Array<{ title: string; doi: string; discipline: string; journalTitle?: string | null }>;
}): Promise<void> =>
  send(
    data.to,
    `${data.articles.length} New Article${data.articles.length > 1 ? "s" : ""} Matching Your Alerts`,
    layout(
      "#2563eb",
      "New Articles Matching Your Alerts",
      `<p>Hi <strong>${data.userName}</strong>,</p>
       <p>We found <strong>${data.articles.length}</strong> new article${data.articles.length > 1 ? "s" : ""} that match your saved alerts:</p>
       ${data.articles
         .map(
           (a) => `
         <div class="box">
           <p style="margin:0 0 4px"><strong><a href="${env.APP_URL}/articles/${encodeURIComponent(a.doi)}" style="color:inherit">${a.title}</a></strong></p>
           <p style="margin:0;color:#6b7280;font-size:13px">${a.discipline}${a.journalTitle ? ` · ${a.journalTitle}` : ""}</p>
         </div>`
         )
         .join("")}
       <a href="${env.APP_URL}/alerts" class="btn">Manage Alerts</a>`
    )
  );


// ─── Reviewer invitation ──────────────────────────────────────────────────────

export const sendVerificationEmail = (to: string, name: string, verifyUrl: string): Promise<void> =>
  send(
    to,
    "Verify your email — Lumex Research Portal",
    layout(
      "#2563eb",
      "Verify Your Email",
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Thank you for registering. Please click the button below to verify your email address:</p>
       <a href="${verifyUrl}" class="btn">Verify Email</a>
       <div class="box"><p>This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.</p></div>`
    )
  );

export const sendReviewerInvitationEmail = (data: {
  to: string; reviewerName: string;
  submissionTitle: string; submissionId: string; dueDate?: string;
}): Promise<void> =>
  send(
    data.to,
    `Invitation to Review: ${data.submissionTitle}`,
    layout(
      "#0891b2",
      "You Have Been Invited to Review a Submission",
      `<p>Dear <strong>${data.reviewerName}</strong>,</p>
       <p>You have been invited to review the following submission:</p>
       <div class="box">
         <p style="margin:0 0 4px"><strong>${data.submissionTitle}</strong></p>
         ${data.dueDate ? `<p style="margin:4px 0 0;color:#6b7280;font-size:13px">Due: ${data.dueDate}</p>` : ""}
       </div>
       <p>Please log in to accept or decline this invitation.</p>
       <a href="${env.APP_URL}/reviewer/submissions/${data.submissionId}" class="btn">View Submission</a>`
    )
  );
