import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";

// The services under test
// Note: we import AFTER the mock is set up via setup.ts
let registerUser: typeof import("./auth.service.js").registerUser;
let loginUser: typeof import("./auth.service.js").loginUser;
let refreshAccessToken: typeof import("./auth.service.js").refreshAccessToken;

beforeEach(async () => {
  vi.clearAllMocks();
  // Dynamic import ensures mocks are applied first
  const mod = await import("./auth.service.js");
  registerUser    = mod.registerUser;
  loginUser       = mod.loginUser;
  refreshAccessToken = mod.refreshAccessToken;
});

// ── Mocked helpers ──────────────────────────────────────────────────────────

vi.mock("../../utils/hash.js", () => ({
  hashPassword:    vi.fn().mockResolvedValue("$hashed"),
  comparePassword: vi.fn().mockResolvedValue(true),
}));

vi.mock("../emails/email.service.js", () => ({
  sendWelcomeEmail:             vi.fn(),
  sendSubmissionConfirmation:   vi.fn(),
  sendDecisionEmail:            vi.fn(),
  sendReviewerAssignedEmail:    vi.fn(),
  sendReviewSubmittedEmail:     vi.fn(),
}));

vi.mock("../admin/admin.service.js", () => ({
  createAuditLog: vi.fn(),
}));

// ── registerUser ────────────────────────────────────────────────────────────

describe("registerUser", () => {
  it("creates a user and returns tokens", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "u1", name: "Alice", email: "alice@test.com", role: "READER",
      createdAt: new Date(),
    } as never);
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const result = await registerUser({ name: "Alice", email: "alice@test.com", password: "pass123" });

    expect(result.user.email).toBe("alice@test.com");
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it("throws 409 when email is already registered", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as never);

    await expect(
      registerUser({ name: "Bob", email: "bob@test.com", password: "pass123" }),
    ).rejects.toThrow(AppError);
  });
});

// ── loginUser ───────────────────────────────────────────────────────────────

describe("loginUser", () => {
  it("returns tokens on valid credentials", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u1", name: "Alice", email: "alice@test.com", role: "AUTHOR", isBanned: false, password: "$hashed",
    } as never);
    vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never);
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);

    const { comparePassword } = await import("../../utils/hash.js");
    vi.mocked(comparePassword).mockResolvedValue(true);

    const result = await loginUser({ email: "alice@test.com", password: "pass123" });
    expect(result.user.role).toBe("AUTHOR");
    expect(result.accessToken).toBeTruthy();
  });

  it("throws 401 when user not found", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await expect(loginUser({ email: "ghost@test.com", password: "x" })).rejects.toThrow(AppError);
  });

  it("throws 403 when user is banned", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u1", name: "Bob", email: "bob@test.com", role: "READER", isBanned: true, password: "$hashed",
    } as never);
    await expect(loginUser({ email: "bob@test.com", password: "pass" })).rejects.toThrow(AppError);
  });

  it("throws 401 on wrong password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u1", name: "Alice", email: "alice@test.com", role: "AUTHOR", isBanned: false, password: "$hashed",
    } as never);
    const { comparePassword } = await import("../../utils/hash.js");
    vi.mocked(comparePassword).mockResolvedValue(false);
    await expect(loginUser({ email: "alice@test.com", password: "wrong" })).rejects.toThrow(AppError);
  });
});

// ── refreshAccessToken ───────────────────────────────────────────────────────

describe("refreshAccessToken", () => {
  it("throws 401 for an invalid JWT string", async () => {
    await expect(refreshAccessToken("invalid-token")).rejects.toThrow(AppError);
  });
});
