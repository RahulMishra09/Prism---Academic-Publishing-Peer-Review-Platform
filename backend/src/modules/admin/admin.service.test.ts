import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";

let changeUserRole:   typeof import("./admin.service.js").changeUserRole;
let banUser:          typeof import("./admin.service.js").banUser;
let unbanUser:        typeof import("./admin.service.js").unbanUser;
let getPlatformStats: typeof import("./admin.service.js").getPlatformStats;
let createAuditLog:   typeof import("./admin.service.js").createAuditLog;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod  = await import("./admin.service.js");
  changeUserRole   = mod.changeUserRole;
  banUser          = mod.banUser;
  unbanUser        = mod.unbanUser;
  getPlatformStats = mod.getPlatformStats;
  createAuditLog   = mod.createAuditLog;
});

describe("createAuditLog", () => {
  it("writes a log without throwing", async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
    await expect(createAuditLog({ action: "LOGIN" as never })).resolves.toBeUndefined();
  });

  it("swallows errors silently", async () => {
    vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error("DB down"));
    await expect(createAuditLog({ action: "LOGIN" as never })).resolves.toBeUndefined();
  });
});

describe("changeUserRole", () => {
  it("updates the role and logs the action", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1", role: "READER" } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({ id: "u1", name: "A", email: "a@b.com", role: "AUTHOR" } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await changeUserRole("u1", "AUTHOR" as never, "admin1");
    expect(result.role).toBe("AUTHOR");
  });

  it("throws 404 when user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await expect(changeUserRole("u1", "AUTHOR" as never, "admin1")).rejects.toThrow(AppError);
  });
});

describe("banUser", () => {
  it("bans a user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({ id: "u1", name: "A", email: "a@b.com", isBanned: true } as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await banUser("u1", "admin1");
    expect(result.isBanned).toBe(true);
  });

  it("throws 400 when trying to ban yourself", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "admin1" } as never);
    await expect(banUser("admin1", "admin1")).rejects.toThrow(AppError);
  });
});

describe("getPlatformStats", () => {
  it("returns aggregated stats", async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(10);
    vi.mocked(prisma.paper.count).mockResolvedValue(5);
    vi.mocked(prisma.review.count).mockResolvedValue(3);
    vi.mocked(prisma.reviewerAssignment.count).mockResolvedValue(1);
    vi.mocked(prisma.paper.groupBy).mockResolvedValue([
      { status: "APPROVED", _count: { id: 2 } },
    ] as never);

    const stats = await getPlatformStats();
    expect(stats.totalUsers).toBe(10);
    expect(stats.totalPapers).toBe(5);
    expect(stats.totalReviews).toBe(3);
  });
});
