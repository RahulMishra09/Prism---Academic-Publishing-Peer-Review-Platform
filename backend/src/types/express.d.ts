import { Role } from "../../generated/prisma/index.js";

// Extend Express Request globally so req.user is typed everywhere
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
      };
    }
  }
}

export {};
