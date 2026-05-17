import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting today\'s reviews and solutions...\n');

  // Delete all reviews added today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deletedReviews = await prisma.review.deleteMany({
    where: {
      createdAt: {
        gte: today
      }
    }
  });

  const deletedSolutions = await prisma.solution.deleteMany({
    where: {
      createdAt: {
        gte: today
      }
    }
  });

  console.log(`Deleted ${deletedReviews.count} reviews`);
  console.log(`Deleted ${deletedSolutions.count} solutions`);
  console.log('\n✅ Done! Ready for new content.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
