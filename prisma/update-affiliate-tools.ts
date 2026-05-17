import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating featured tools order...\n');

  // Find and update Speak AI
  const speakAI = await prisma.tool.findFirst({
    where: { 
      OR: [
        { name: { contains: 'Speak AI', mode: 'insensitive' } },
        { slug: { contains: 'speak', mode: 'insensitive' } }
      ]
    }
  });

  if (speakAI) {
    await prisma.tool.update({
      where: { id: speakAI.id },
      data: {
        isFeatured: true,
        websiteUrl: 'https://speakai.co/?via=ting',
        affiliateUrl: 'https://speakai.co/?via=ting',
        rating: 4.8,
        pricingType: 'SUBSCRIPTION',
        priceMonthly: 24,
        pros: '["Auto meeting recording and transcription","AI summaries and action items","Support for podcasts and customer calls","G2 rating 4.9/5"]',
        cons: '["Requires subscription for full features","Limited free tier","Some advanced features need higher plans"]',
        createdAt: new Date('2099-12-31'),
      }
    });
    console.log(`✓ Updated: ${speakAI.name} -> Featured, Affiliate link set, positioned at top`);
  } else {
    console.log('⚠ Speak AI not found in database');
  }

  // Find and update Robofy
  const robofy = await prisma.tool.findFirst({
    where: { 
      OR: [
        { name: { contains: 'Robofy', mode: 'insensitive' } },
        { slug: { contains: 'robofy', mode: 'insensitive' } }
      ]
    }
  });

  if (robofy) {
    await prisma.tool.update({
      where: { id: robofy.id },
      data: {
        isFeatured: true,
        websiteUrl: 'https://www.robofy.ai/?ref=ting',
        affiliateUrl: 'https://www.robofy.ai/?ref=ting',
        rating: 4.7,
        pricingType: 'SUBSCRIPTION',
        priceMonthly: 19,
        pros: '["No coding required","Drag-and-drop builder","24/7 automated customer service","Easy website integration"]',
        cons: '["Monthly subscription required","Limited customization on lower plans","May need setup time for complex use cases"]',
        createdAt: new Date('2099-12-30'), // Second furthest = shows second
      }
    });
    console.log(`✓ Updated: ${robofy.name} -> Featured, Affiliate link set, positioned at top`);
  } else {
    console.log('⚠ Robofy not found in database');
  }

  console.log('\n✅ Done! Speak AI and Robofy are now featured and at the top.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
