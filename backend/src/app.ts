import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { generateOpenApiDocument } from "./config/openapi.js";
import authRoutes    from "./modules/auth/auth.routes.js";
import papersRoutes  from "./modules/papers/papers.routes.js";
import reviewsRoutes from "./modules/reviews/reviews.routes.js";
import editorRoutes  from "./modules/editor/editor.routes.js";
import commentsRoutes from "./modules/comments/comments.routes.js";
import publicRoutes  from "./modules/public/public.routes.js";
import adminRoutes   from "./modules/admin/admin.routes.js";
import uploadsRoutes from "./modules/uploads/uploads.routes.js";

const app = express();

// ── Global middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));
app.use(express.json());

// ── Global rate limiter ────────────────────────────────────────────────────
app.use(apiLimiter);

// ── Root & health ──────────────────────────────────────────────────────────
app.get("/", (_, res) => {
  res.json({ name: "Prism Research Portal API", version: "2.0.0", docs: "/api-docs" });
});

app.get("/health", (_, res) => {
  res.json({ success: true, message: "Server is running" });
});

// ── Swagger / OpenAPI docs ─────────────────────────────────────────────────
let openApiDoc: ReturnType<typeof generateOpenApiDocument> | null = null;
try {
  openApiDoc = generateOpenApiDocument();
} catch (e) {
  console.warn("[OpenAPI] Failed to generate docs:", (e as Error).message);
}
if (openApiDoc) {
  app.get("/api-docs.json", (_req, res) => res.json(openApiDoc));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDoc, {
    customSiteTitle: "Prism API Docs",
    swaggerOptions: { persistAuthorization: true },
  }));
}

// ── API routes ─────────────────────────────────────────────────────────────
// Public (unauthenticated) read routes — placed first to avoid auth overhead
app.use("/",         publicRoutes);

// Auth
app.use("/auth",     authRoutes);

// Authenticated / role-gated routes
app.use("/papers",   papersRoutes);
app.use("/reviews",  reviewsRoutes);
app.use("/editor",   editorRoutes);
app.use("/comments", commentsRoutes);
app.use("/uploads",  uploadsRoutes);
app.use("/admin",    adminRoutes);

// ── Global error handler — must stay last ──────────────────────────────────
app.use(errorHandler);

export default app;
