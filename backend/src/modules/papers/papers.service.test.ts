import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";

vi.mock("../emails/email.service.js", () => ({
  sendSubmissionConfirmation: vi.fn(),
  sendDecisionEmail:          vi.fn(),
}));

vi.mock("../admin/admin.service.js", () => ({
  createAuditLog: vi.fn(),
}));

let createPaper:   typeof import("./papers.service.js").createPaper;
let submitPaper:   typeof import("./papers.service.js").submitPaper;
let approvePaper:  typeof import("./papers.service.js").approvePaper;
let rejectPaper:   typeof import("./papers.service.js").rejectPaper;
let getPaperById:  typeof import("./papers.service.js").getPaperById;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod  = await import("./papers.service.js");
  createPaper  = mod.createPaper;
  submitPaper  = mod.submitPaper;
  approvePaper = mod.approvePaper;
  rejectPaper  = mod.rejectPaper;
  getPaperById = mod.getPaperById;
});

const basePaper = {
  id: "p1", title: "T", abstract: "A", domain: "CS", keywords: ["k"],
  status: "DRAFT", rejectionReason: null, createdAt: new Date(), updatedAt: new Date(),
  approvedAt: null, submittedBy: "u1",
  author: { id: "u1", name: "Alice", email: "alice@test.com" },
};

describe("createPaper", () => {
  it("creates a draft paper", async () => {
    vi.mocked(prisma.paper.create).mockResolvedValue(basePaper as never);
    const result = await createPaper("u1", { title: "T", abstract: "A", domain: "CS", keywords: ["k"] });
    expect(result.status).toBe("DRAFT");
    expect(prisma.paper.create).toHaveBeenCalledOnce();
  });
});

describe("submitPaper", () => {
  it("transitions DRAFT → SUBMITTED", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValueOnce({ id: "p1", submittedBy: "u1", status: "DRAFT" } as never);
    vi.mocked(prisma.paper.update).mockResolvedValue({ ...basePaper, status: "SUBMITTED" } as never);

    const result = await submitPaper("p1", "u1");
    expect(result.status).toBe("SUBMITTED");
  });

  it("throws 404 when paper not found", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValue(null);
    await expect(submitPaper("p1", "u1")).rejects.toThrow(AppError);
  });

  it("throws 403 when not the author", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValue({ id: "p1", submittedBy: "other", status: "DRAFT" } as never);
    await expect(submitPaper("p1", "u1")).rejects.toThrow(AppError);
  });

  it("throws 400 when paper is not DRAFT", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValue({ id: "p1", submittedBy: "u1", status: "SUBMITTED" } as never);
    await expect(submitPaper("p1", "u1")).rejects.toThrow(AppError);
  });
});

describe("approvePaper", () => {
  it("throws 400 when no reviews exist", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValue({ id: "p1", status: "SUBMITTED" } as never);
    vi.mocked(prisma.review.count).mockResolvedValue(0);
    await expect(approvePaper("p1")).rejects.toThrow(AppError);
  });

  it("approves when at least one review exists", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValue({ id: "p1", status: "SUBMITTED" } as never);
    vi.mocked(prisma.review.count).mockResolvedValue(1);
    vi.mocked(prisma.paper.update).mockResolvedValue({ ...basePaper, status: "APPROVED", approvedAt: new Date() } as never);

    const result = await approvePaper("p1");
    expect(result.status).toBe("APPROVED");
  });
});

describe("rejectPaper", () => {
  it("rejects with a reason", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValue({ id: "p1", status: "SUBMITTED" } as never);
    vi.mocked(prisma.paper.update).mockResolvedValue({ ...basePaper, status: "REJECTED", rejectionReason: "out of scope" } as never);

    const result = await rejectPaper("p1", { rejectionReason: "out of scope" });
    expect(result.status).toBe("REJECTED");
  });
});

describe("getPaperById", () => {
  it("throws 404 when paper not found", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValueOnce(null);
    await expect(getPaperById("p1", "u1", "READER" as never)).rejects.toThrow(AppError);
  });

  it("throws 404 for READER when paper not APPROVED", async () => {
    vi.mocked(prisma.paper.findUnique).mockResolvedValueOnce({ id: "p1", status: "SUBMITTED", submittedBy: "u2" } as never);
    await expect(getPaperById("p1", "u1", "READER" as never)).rejects.toThrow(AppError);
  });
});
