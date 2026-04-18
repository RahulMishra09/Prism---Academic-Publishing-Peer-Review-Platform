import "./config/env.js";
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
