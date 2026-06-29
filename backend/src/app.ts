import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware.js";
import {
  globalLimiter,
  searchLimiter,
  contactLimiter,
} from "./middleware/ratelimit.middleware.js";
import { optionalAuthenticate } from "./middleware/auth.middleware.js";

// ── Existing modules ──────────────────────────────────────────
import authRoutes     from "./modules/auth/auth.routes.js";
import papersRoutes   from "./modules/papers/papers.routes.js";
import reviewsRoutes  from "./modules/reviews/reviews.routes.js";
import editorRoutes   from "./modules/editor/editor.routes.js";
import commentsRoutes from "./modules/comments/comments.routes.js";
import adminRoutes    from "./modules/admin/admin.routes.js";

// ── New modules ───────────────────────────────────────────────
import articlesRoutes     from "./modules/articles/articles.routes.js";
import journalsRoutes     from "./modules/journals/journals.routes.js";
import collectionsRoutes  from "./modules/collections/collections.routes.js";
import booksRoutes        from "./modules/books/books.routes.js";
import chaptersRoutes     from "./modules/books/chapters.routes.js";
import homepageRoutes     from "./modules/homepage/homepage.routes.js";
import siteConfigRoutes   from "./modules/site-config/siteConfig.routes.js";
import newsRoutes         from "./modules/news/news.routes.js";
import careersRoutes      from "./modules/careers/careers.routes.js";
import searchRoutes       from "./modules/search/search.routes.js";
import conferencesRoutes  from "./modules/conferences/conferences.routes.js";
import contactRoutes      from "./modules/contact/contact.routes.js";
import usersRoutes        from "./modules/users/users.routes.js";
import submissionsRoutes  from "./modules/submissions/submissions.routes.js";
import checkoutRoutes     from "./modules/checkout/checkout.routes.js";
import { paymentWebhook } from "./modules/checkout/webhook.controller.js";
import feedsRoutes        from "./modules/feeds/feeds.routes.js";
import authorsRoutes      from "./modules/authors/authors.routes.js";
import aiRoutes           from "./modules/ai/ai.routes.js";
import { sitemap, robotsTxt } from "./modules/sitemap/sitemap.controller.js";

const app = express();

// ── Global middleware ─────────────────────────────────────────
app.use(cors({
  origin: env.CORS_ORIGINS === '*' ? '*' : env.CORS_ORIGINS.split(',').map(o => o.trim()),
  credentials: true,
}));
app.use(helmet());
app.use(morgan(process.env["NODE_ENV"] === "production" ? "combined" : "dev"));

// ── Webhook (raw body required for signature verification) ────
app.post("/api/checkout/webhook", express.raw({ type: "application/json" }), paymentWebhook);

app.use(express.json());
app.use(optionalAuthenticate);   // decode JWT (if present) so role-based rate limits work
app.use(globalLimiter);

// ── Health check ──────────────────────────────────────────────
app.get("/health", async (_, res) => {
  const checks: Record<string, { status: string; latency?: number }> = {};

  // Database check
  const dbStart = Date.now();
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    checks.database = { status: "connected", latency: Date.now() - dbStart };
  } catch {
    checks.database = { status: "disconnected", latency: Date.now() - dbStart };
  }

  // Supabase Storage check
  const sbStart = Date.now();
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    const { error } = await supabase.storage.getBucket(env.SUPABASE_BUCKET || "Lumex");
    checks.supabase = { status: error ? "error" : "connected", latency: Date.now() - sbStart };
  } catch {
    checks.supabase = { status: "disconnected", latency: Date.now() - sbStart };
  }

  const allHealthy = Object.values(checks).every(c => c.status === "connected");
  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    message: allHealthy ? "All systems operational" : "Some services are degraded",
    uptime: Math.floor(process.uptime()),
    checks,
  });
});

// ── SEO ───────────────────────────────────────────────────────
app.get("/sitemap.xml", sitemap);
app.get("/robots.txt",  robotsTxt);

// ── API routes (prefixed /api for frontend compatibility) ─────
// Note: existing routes keep their current top-level paths;
// all routes are mounted under `/api` so the frontend `/api` base URL is satisfied.

// Auth & users
app.use("/api/auth",        authRoutes);
app.use("/api/users",       usersRoutes);

// Content modules
app.use("/api/articles",    articlesRoutes);
app.use("/api/journals",    journalsRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/books",       booksRoutes);
app.use("/api/chapters",    chaptersRoutes);
app.use("/api/news",        newsRoutes);
app.use("/api/careers",     careersRoutes);
app.use("/api/conferences", conferencesRoutes);

// Homepage & config
app.use("/api/homepage",    homepageRoutes);
app.use("/api/site-config", siteConfigRoutes);

// Search
app.use("/api/search",      searchLimiter, searchRoutes);

// Contact
app.use("/api/contact",     contactLimiter, contactRoutes);

// Workflow
app.use("/api/submissions", submissionsRoutes);
app.use("/api/checkout",    checkoutRoutes);

// Feeds
app.use("/api/feeds",       feedsRoutes);

// Authors
app.use("/api/authors",     authorsRoutes);

// AI
app.use("/api/ai",          aiRoutes);

// Admin under /api prefix (Lumex-oriented)
app.use("/api/admin",  adminRoutes);

// Legacy / internal routes (existing portal routes, unchanged paths)
app.use("/papers",   papersRoutes);
app.use("/reviews",  reviewsRoutes);
app.use("/editor",   editorRoutes);
app.use("/comments", commentsRoutes);
app.use("/admin",    adminRoutes);

// ── Global error handler — must be last ───────────────────────
app.use(errorHandler);

export default app;
