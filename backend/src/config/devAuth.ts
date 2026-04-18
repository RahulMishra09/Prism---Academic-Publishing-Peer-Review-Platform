import { prisma } from "./prisma.js";
import { env } from "./env.js";
import { hashPassword } from "../utils/hash.js";

export const ensureDevAuthUser = async (): Promise<void> => {
  if (env.NODE_ENV !== "development") {
    return;
  }

  const hashedPassword = await hashPassword(env.DEV_AUTH_PASSWORD);

  await prisma.user.upsert({
    where: { email: env.DEV_AUTH_EMAIL },
    update: {
      name: env.DEV_AUTH_NAME,
      password: hashedPassword,
      role: env.DEV_AUTH_ROLE,
      isBanned: false,
    },
    create: {
      name: env.DEV_AUTH_NAME,
      email: env.DEV_AUTH_EMAIL,
      password: hashedPassword,
      role: env.DEV_AUTH_ROLE,
    },
  });

  console.log(
    `Dev auth user ready: ${env.DEV_AUTH_EMAIL} / ${env.DEV_AUTH_PASSWORD} (${env.DEV_AUTH_ROLE})`,
  );
};
