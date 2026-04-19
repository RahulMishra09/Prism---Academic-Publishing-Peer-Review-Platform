import "./config/env.js";
// Must run before any Zod schemas are created so zod-to-openapi can instrument them
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
extendZodWithOpenApi(z);
import app from "./app.js";
import { ensureDevAuthUser } from "./config/devAuth.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await ensureDevAuthUser();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
