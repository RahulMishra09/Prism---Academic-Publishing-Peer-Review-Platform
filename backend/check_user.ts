import { prisma } from './src/config/prisma.js';

async function main() {
  const users = await prisma.user.findMany({
    select: { name: true, email: true, role: true }
  });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
