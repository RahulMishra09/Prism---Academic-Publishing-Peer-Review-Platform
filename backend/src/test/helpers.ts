/**
 * Shared test helpers — mock data factories and token generators.
 */
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

export function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id:        "user-1",
    name:      "Alice Smith",
    email:     "alice@example.com",
    password:  "$2b$10$hashedpassword",
    role:      "AUTHOR",
    isBanned:  false,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    ...overrides,
  };
}

export function makePaper(overrides: Record<string, unknown> = {}) {
  return {
    id:             "paper-1",
    title:          "Test Paper",
    abstract:       "A test abstract",
    domain:         "Computer Science",
    keywords:       ["AI", "ML"],
    status:         "DRAFT",
    rejectionReason: null,
    aiSummary:      null,
    embedding:      [],
    reviewAISuggestion: null,
    fileUrl:        null,
    fileKey:        null,
    fileName:       null,
    fileMimeType:   null,
    fileSizeBytes:  null,
    createdAt:      new Date("2025-01-01"),
    updatedAt:      new Date("2025-01-01"),
    approvedAt:     null,
    submittedBy:    "user-1",
    author:         { id: "user-1", name: "Alice Smith", email: "alice@example.com" },
    ...overrides,
  };
}

export function makeAccessToken(userId = "user-1", role = "AUTHOR") {
  return signAccessToken({ userId, role });
}

export function makeAdminToken() {
  return signAccessToken({ userId: "admin-1", role: "ADMIN" });
}

export function makeRefreshToken(userId = "user-1", role = "AUTHOR") {
  return signRefreshToken({ userId, role });
}
