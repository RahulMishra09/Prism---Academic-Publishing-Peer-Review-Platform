import { Role } from "../../generated/prisma/index.js";

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

// Ensure route params are always plain strings (overrides Express 5 `string | string[]`)
declare module "express-serve-static-core" {
  interface ParamsDictionary {
    [key: string]: string;
  }
}

export {};
