/**
 * OpenAPI 3.1 specification generated via @asteasolutions/zod-to-openapi.
 * Served at GET /api-docs (Swagger UI) and GET /api-docs.json (raw JSON).
 */
import { OpenApiGeneratorV31, OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { env } from "./env.js";

// Idempotent — safe to call multiple times
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// ── Shared schemas ──────────────────────────────────────────────────────────

const UserSchema = registry.register(
  "User",
  z.object({
    id:        z.string().openapi({ example: "cuid123" }),
    name:      z.string().openapi({ example: "Alice Smith" }),
    email:     z.string().email().openapi({ example: "alice@example.com" }),
    role:      z.enum(["READER", "AUTHOR", "REVIEWER", "EDITOR", "ADMIN"]),
    createdAt: z.string().datetime(),
  }),
);

const PaperSchema = registry.register(
  "Paper",
  z.object({
    id:             z.string(),
    title:          z.string(),
    abstract:       z.string(),
    domain:         z.string(),
    keywords:       z.array(z.string()),
    status:         z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable(),
    fileUrl:        z.string().nullable(),
    fileName:       z.string().nullable(),
    createdAt:      z.string().datetime(),
    updatedAt:      z.string().datetime(),
    approvedAt:     z.string().datetime().nullable(),
    author:         z.object({ id: z.string(), name: z.string(), email: z.string() }),
  }),
);

const TokensSchema = registry.register(
  "Tokens",
  z.object({
    accessToken:  z.string().openapi({ description: "JWT access token (15 min)" }),
    refreshToken: z.string().openapi({ description: "Opaque refresh token (7 days)" }),
  }),
);

const AuditLogSchema = registry.register(
  "AuditLog",
  z.object({
    id:         z.string(),
    action:     z.string(),
    actorId:    z.string().nullable(),
    targetId:   z.string().nullable(),
    targetType: z.string().nullable(),
    meta:       z.record(z.string(), z.unknown()).nullable(),
    ip:         z.string().nullable(),
    createdAt:  z.string().datetime(),
  }),
);

// ── Security scheme ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(registry as any).registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Access token obtained from POST /auth/login",
});

// ── Auth ─────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "post", path: "/auth/register",
  tags: ["Auth"],
  summary: "Create a new account",
  request: { body: { content: { "application/json": { schema: z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) }) } } } },
  responses: {
    201: { description: "Account created", content: { "application/json": { schema: z.object({ success: z.boolean(), data: z.object({ user: UserSchema, accessToken: z.string(), refreshToken: z.string() }) }) } } },
    409: { description: "Email already registered" },
  },
});

registry.registerPath({
  method: "post", path: "/auth/login",
  tags: ["Auth"],
  summary: "Authenticate and receive token pair",
  request: { body: { content: { "application/json": { schema: z.object({ email: z.string().email(), password: z.string() }) } } } },
  responses: {
    200: { description: "Login successful", content: { "application/json": { schema: z.object({ success: z.boolean(), data: z.object({ user: UserSchema, accessToken: z.string(), refreshToken: z.string() }) }) } } },
    401: { description: "Invalid credentials" },
  },
});

registry.registerPath({
  method: "post", path: "/auth/refresh",
  tags: ["Auth"],
  summary: "Rotate refresh token — returns new access + refresh tokens",
  request: { body: { content: { "application/json": { schema: z.object({ refreshToken: z.string() }) } } } },
  responses: {
    200: { description: "Tokens refreshed", content: { "application/json": { schema: z.object({ success: z.boolean(), data: TokensSchema }) } } },
    401: { description: "Invalid or expired refresh token" },
  },
});

registry.registerPath({
  method: "post", path: "/auth/logout",
  tags: ["Auth"],
  summary: "Revoke refresh token",
  security: [{ BearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: z.object({ refreshToken: z.string() }) } } } },
  responses: { 200: { description: "Logged out" } },
});

// ── Papers ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "get", path: "/papers",
  tags: ["Papers"],
  summary: "List papers (role-filtered)",
  security: [{ BearerAuth: [] }],
  responses: { 200: { description: "Papers list", content: { "application/json": { schema: z.object({ success: z.boolean(), data: z.object({ papers: z.array(PaperSchema) }) }) } } } },
});

registry.registerPath({
  method: "post", path: "/papers",
  tags: ["Papers"],
  summary: "Create a paper draft (AUTHOR)",
  security: [{ BearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: z.object({ title: z.string(), abstract: z.string(), domain: z.string(), keywords: z.array(z.string()) }) } } } },
  responses: { 201: { description: "Draft created" } },
});

registry.registerPath({
  method: "post", path: "/papers/{id}/submit",
  tags: ["Papers"],
  summary: "Submit paper for review",
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Paper submitted" } },
});

registry.registerPath({
  method: "post", path: "/papers/{id}/approve",
  tags: ["Papers"],
  summary: "Approve paper (EDITOR / ADMIN)",
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Paper approved" } },
});

registry.registerPath({
  method: "post", path: "/papers/{id}/reject",
  tags: ["Papers"],
  summary: "Reject paper (EDITOR / ADMIN)",
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }), body: { content: { "application/json": { schema: z.object({ rejectionReason: z.string() }) } } } },
  responses: { 200: { description: "Paper rejected" } },
});

// ── Public / Articles ────────────────────────────────────────────────────────

registry.registerPath({
  method: "get", path: "/articles",
  tags: ["Public"],
  summary: "List approved articles with full-text search",
  request: { query: z.object({ query: z.string().optional(), page: z.coerce.number().optional(), pageSize: z.coerce.number().optional() }) },
  responses: { 200: { description: "Articles list" } },
});

registry.registerPath({
  method: "get", path: "/articles/{id}",
  tags: ["Public"],
  summary: "Get a single article by ID or DOI",
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Article detail" }, 404: { description: "Not found" } },
});

// ── Uploads ──────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "post", path: "/uploads/papers/{paperId}",
  tags: ["Uploads"],
  summary: "Upload PDF or DOCX to a paper (AUTHOR)",
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ paperId: z.string() }), body: { content: { "multipart/form-data": { schema: z.object({ file: z.instanceof(File) }) } } } },
  responses: { 201: { description: "File uploaded" }, 400: { description: "Invalid file type" } },
});

registry.registerPath({
  method: "get", path: "/uploads/papers/{paperId}/download",
  tags: ["Uploads"],
  summary: "Download paper file (role-gated)",
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ paperId: z.string() }) },
  responses: { 200: { description: "File stream" }, 403: { description: "Access denied" } },
});

// ── Admin ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "get", path: "/admin/users",
  tags: ["Admin"],
  summary: "List all users (ADMIN)",
  security: [{ BearerAuth: [] }],
  request: { query: z.object({ page: z.coerce.number().optional(), pageSize: z.coerce.number().optional(), search: z.string().optional(), role: z.string().optional() }) },
  responses: { 200: { description: "Users list" } },
});

registry.registerPath({
  method: "patch", path: "/admin/users/{userId}/role",
  tags: ["Admin"],
  summary: "Change a user's role (ADMIN)",
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ userId: z.string() }), body: { content: { "application/json": { schema: z.object({ role: z.string() }) } } } },
  responses: { 200: { description: "Role updated" } },
});

registry.registerPath({
  method: "post", path: "/admin/users/{userId}/ban",
  tags: ["Admin"],
  summary: "Ban a user (ADMIN)",
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ userId: z.string() }) },
  responses: { 200: { description: "User banned" } },
});

registry.registerPath({
  method: "get", path: "/admin/audit-logs",
  tags: ["Admin"],
  summary: "Get audit logs (ADMIN)",
  security: [{ BearerAuth: [] }],
  request: { query: z.object({ page: z.coerce.number().optional(), action: z.string().optional(), actorId: z.string().optional() }) },
  responses: { 200: { description: "Audit logs list", content: { "application/json": { schema: z.object({ success: z.boolean(), data: z.object({ logs: z.array(AuditLogSchema) }) }) } } } },
});

registry.registerPath({
  method: "get", path: "/admin/stats",
  tags: ["Admin"],
  summary: "Platform statistics (ADMIN)",
  security: [{ BearerAuth: [] }],
  responses: { 200: { description: "Platform stats" } },
});

// ── Generate ──────────────────────────────────────────────────────────────────

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Prism Research Portal API",
      version: "2.0.0",
      description: "Academic publishing and peer-review platform — full REST API reference.",
      contact: { name: "Prism Team", url: env.FRONTEND_URL },
    },
    servers: [
      { url: `http://localhost:${env.PORT}`, description: "Local development" },
    ],
  });
}
