import { prisma } from '../src/config/prisma.js';

async function main() {
  console.log('Starting data fill script...');

  // 1. Fill Journals
  const journals = await prisma.journal.findMany();
  for (const journal of journals) {
    const updateData: any = {};
    if (!journal.description) updateData.description = `A peer-reviewed journal in the field of ${journal.discipline}.`;
    if (!journal.impactFactor) updateData.impactFactor = parseFloat((Math.random() * 10 + 1).toFixed(3));
    if (!journal.coverImageUrl) updateData.coverImageUrl = `https://source.unsplash.com/random/400x600/?science,${journal.discipline.replace(/\s+/g, '')}`;
    if (!journal.publisherName) updateData.publisherName = 'Lumex Publishing Group';
    if (!journal.eIssn) updateData.eIssn = `1234-${Math.floor(Math.random() * 9000 + 1000)}`;

    if (Object.keys(updateData).length > 0) {
      await prisma.journal.update({
        where: { id: journal.id },
        data: updateData,
      });
    }
  }
  console.log(`Updated ${journals.length} journals.`);

  // 2. Fill Articles
  const articles = await prisma.article.findMany({
    include: { metrics: true }
  });
  for (const article of articles) {
    const updateData: any = {};
    if (!article.pdfUrl) updateData.pdfUrl = `/pdfs/${article.doi.replace(/\//g, '-')}.pdf`;
    if (!article.htmlUrl) updateData.htmlUrl = `/html/${article.doi.replace(/\//g, '-')}.html`;
    if (!article.publishedAt && article.isPublished) updateData.publishedAt = new Date();
    
    // Add dummy view/download metrics if they are 0
    if (article.viewCount === 0) updateData.viewCount = Math.floor(Math.random() * 10000 + 500);
    if (article.downloadCount === 0) updateData.downloadCount = Math.floor(Math.random() * 5000 + 100);
    if (article.citationCount === 0) updateData.citationCount = Math.floor(Math.random() * 500 + 10);

    if (Object.keys(updateData).length > 0) {
      await prisma.article.update({
        where: { id: article.id },
        data: updateData,
      });
    }

    // Ensure metrics exist
    if (!article.metrics) {
      await prisma.articleMetrics.create({
        data: {
          articleId: article.id,
          views: updateData.viewCount || article.viewCount || Math.floor(Math.random() * 10000),
          downloads: updateData.downloadCount || article.downloadCount || Math.floor(Math.random() * 5000),
          citations: updateData.citationCount || article.citationCount || Math.floor(Math.random() * 500),
          shares: Math.floor(Math.random() * 100),
          altmetricScore: Math.floor(Math.random() * 200),
        }
      });
    }
  }
  console.log(`Updated ${articles.length} articles.`);

  // 3. Fill Users
  const users = await prisma.user.findMany();
  for (const user of users) {
    const updateData: any = {};
    if (!user.affiliation) updateData.affiliation = `Lumex University`;
    if (!user.orcid) updateData.orcid = `0000-000${Math.floor(Math.random() * 9)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }
  }
  console.log(`Updated ${users.length} users.`);

  // 4. Fill Authors (ArticleAuthor)
  const authors = await prisma.articleAuthor.findMany();
  for (const author of authors) {
    const updateData: any = {};
    if (!author.email) updateData.email = `${author.firstName.toLowerCase()}.${author.lastName.toLowerCase()}@example.com`;
    if (!author.orcid) updateData.orcid = `0000-000${Math.floor(Math.random() * 9)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;

    if (Object.keys(updateData).length > 0) {
      await prisma.articleAuthor.update({
        where: { id: author.id },
        data: updateData,
      });
    }
  }
  console.log(`Updated ${authors.length} article authors.`);

  console.log('Database fill complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
