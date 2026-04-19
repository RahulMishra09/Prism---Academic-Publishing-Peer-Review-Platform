import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test/setup.ts"],
    env: {
      DATABASE_URL:        "postgresql://test:test@localhost:5432/test",
      UPLOADS_DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      JWT_SECRET:          "test-access-secret-for-vitest",
      JWT_REFRESH_SECRET:  "test-refresh-secret-for-vitest",
      NODE_ENV:            "test",
      PORT:                "8080",
      FRONTEND_URL:        "http://localhost:5173",
      EMAIL_FROM:          "test@prism.io",
      SMTP_HOST:           "",
      SMTP_PORT:           "587",
      SMTP_USER:           "",
      SMTP_PASS:           "",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/test/**", "src/**/*.d.ts"],
    },
  },
});
