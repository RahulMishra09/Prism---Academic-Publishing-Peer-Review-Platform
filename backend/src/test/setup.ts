/**
 * Global test setup.
 *
 * We mock the Prisma client so tests don't hit a real database.
 * Individual test files can override specific methods with vi.mocked().
 */
import { vi } from "vitest";

// Mock Prisma — replace with vi.fn() stubs
vi.mock("../config/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany:   vi.fn(),
      create:     vi.fn(),
      update:     vi.fn(),
      updateMany: vi.fn(),
      count:      vi.fn(),
    },
    paper: {
      findUnique: vi.fn(),
      findMany:   vi.fn(),
      findFirst:  vi.fn(),
      create:     vi.fn(),
      update:     vi.fn(),
      count:      vi.fn(),
      groupBy:    vi.fn(),
    },
    refreshToken: {
      create:     vi.fn(),
      findUnique: vi.fn(),
      update:     vi.fn(),
      updateMany: vi.fn(),
    },
    reviewerAssignment: {
      findUnique: vi.fn(),
      findFirst:  vi.fn(),
      findMany:   vi.fn(),
      create:     vi.fn(),
      update:     vi.fn(),
      delete:     vi.fn(),
      count:      vi.fn(),
    },
    review: {
      findFirst:  vi.fn(),
      findMany:   vi.fn(),
      create:     vi.fn(),
      count:      vi.fn(),
    },
    auditLog: {
      create:     vi.fn(),
      findMany:   vi.fn(),
      count:      vi.fn(),
    },
    comment: {
      findMany:   vi.fn(),
      create:     vi.fn(),
      findUnique: vi.fn(),
      delete:     vi.fn(),
      deleteMany: vi.fn(),
    },
    $queryRaw:   vi.fn(),
  },
}));

// Suppress console.error noise in tests
vi.spyOn(console, "error").mockImplementation(() => undefined);
