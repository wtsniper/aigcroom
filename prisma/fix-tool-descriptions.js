const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('修正工具描述内容...\n');

  // 修正 Robofy - 面向用户的产品介绍
  await prisma.tool.update({
    where: { slug: 'robofy' },
    data: {
      name: 'Robofy',
      slug: 'robofy',
      description: 'Build AI-powered chatbots for your website in minutes. No coding required. Perfect for customer support, lead generation, and sales automation with natural language understanding.',
      websiteUrl: 'https://www.robofy.ai/?ref=ting',
      affiliateUrl: 'https://www.robofy.ai/?ref=ting',
      category: 'Marketing',
      rating: 4.3,
      pricingType: 'FREEMIUM',
      tags: JSON.stringify(['No-code chatbot builder', 'AI customer support', 'Lead generation', 'Easy setup', 'Multi-language']),
      pros: JSON.stringify([
        'No coding required - drag-and-drop builder',
        'Train on your own data for accurate responses',
        '24/7 automated customer support',
        'Easy embed on any website',
        'Free plan available to test',
      ]),
      cons: JSON.stringify([
        'Free plan has limited messages',
        'Advanced features require paid plan',
        'May need setup time for complex workflows',
      ]),
      isFeatured: true,
    },
  });
  console.log('✓ Robofy 描述已修正\n');

  // 修正 Speak AI - 面向用户的产品介绍
  await prisma.tool.update({
    where: { slug: 'speak-ai' },
    data: {
      name: 'Speak AI',
      slug: 'speak-ai',
      description: 'AI meeting assistant that records, transcribes, and analyzes meetings, podcasts, and customer calls. Get searchable transcripts, summaries, and action items automatically.',
      websiteUrl: 'https://speakai.co/?via=ting',
      affiliateUrl: 'https://speakai.co/?via=ting',
      category: 'Productivity',
      rating: 4.5,
      pricingType: 'FREEMIUM',
      tags: JSON.stringify(['AI meeting assistant', 'Auto transcription', 'Meeting summaries', 'Podcast analysis', '90-day free trial']),
      pros: JSON.stringify([
        'Automatic meeting recording and transcription',
        'AI-powered summaries and action items',
        'Supports podcasts and customer calls',
        'Searchable transcript archive',
        'G2 rating 4.9 - trusted by 10,000+ users',
      ]),
      cons: JSON.stringify([
        'Free plan has limited minutes',
        'Primarily English-focused',
        'Advanced analytics require premium plan',
      ]),
      isFeatured: true,
    },
  });
  console.log('✓ Speak AI 描述已修正\n');

  console.log('完成！现在用户看到的是产品介绍，不是佣金信息了。');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
