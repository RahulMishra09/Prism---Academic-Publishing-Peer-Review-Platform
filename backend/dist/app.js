import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import papersRoutes from "./modules/papers/papers.routes.js";
import reviewsRoutes from "./modules/reviews/reviews.routes.js";
import editorRoutes from "./modules/editor/editor.routes.js";
import commentsRoutes from "./modules/comments/comments.routes.js";
import publicRoutes from "./modules/public/public.routes.js";
const app = express();
// ── Global middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
// ── Root & health ──────────────────────────────────────────────────────────
app.get("/", (_, res) => {
    res.json({
        name: "Research Portal API",
        version: "1.0.0",
        docs: "/health",
    });
});
app.get("/health", (_, res) => {
    res.json({ success: true, message: "Server is running" });
});
// ── API routes ─────────────────────────────────────────────────────────────
// Public (unauthenticated) read routes
app.use("/", publicRoutes);
// Authenticated / role-gated routes
app.use("/auth", authRoutes);
app.use("/papers", papersRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/editor", editorRoutes);
app.use("/comments", commentsRoutes);
// app.use("/admin",   adminRoutes);
// ── Global error handler — must stay last ──────────────────────────────────
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map