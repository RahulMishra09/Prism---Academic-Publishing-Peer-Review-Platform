import { prisma } from './src/config/prisma.js';

async function main() {
  const assignments = await prisma.submissionReviewer.findMany({
    include: {
      reviewer: { select: { id: true, name: true, email: true, role: true } },
      submission: { select: { id: true, title: true, status: true } }
    }
  });
  console.log("Reviewer Assignments:");
  console.log(JSON.stringify(assignments, null, 2));

  const submissions = await prisma.submission.findMany({
    select: { id: true, title: true, status: true, submittedBy: true }
  });
  console.log("\nAll Submissions:");
  console.log(JSON.stringify(submissions, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
