const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('========== 直接更新数据库 ==========\n');

  // 1. 添加 Speak AI
  console.log('添加 Speak AI...');
  await prisma.tool.create({
    data: {
      name: 'Speak AI',
      slug: 'speak-ai',
      description: 'AI meeting assistant and transcription software. Record, transcribe, and analyze meetings, podcasts, and customer calls.',
      logoUrl: 'https://speakai.co/favicon.ico',
      websiteUrl: 'https://speakai.co/?via=ting',
      affiliateUrl: 'https://speakai.co/?via=ting',
      category: 'Productivity',
      rating: 4.5,
      pricingType: 'FREEMIUM',
      tags: JSON.stringify(['AI transcription', 'Meeting assistant', '90-day cookie', '30% commission']),
      pros: JSON.stringify(['30% recurring commissions', '90-day cookie window', 'G2 rating 4.9']),
      cons: JSON.stringify(['12 months commission only', '$50 minimum payout']),
      isFeatured: true,
    },
  });
  console.log('✓ Speak AI 已添加到数据库\n');

  // 2. 添加 Robofy
  console.log('添加 Robofy...');
  await prisma.tool.create({
    data: {
      name: 'Robofy',
      slug: 'robofy',
      description: 'AI chatbot builder for businesses. Create custom chatbots for marketing, customer support, and lead generation.',
      logoUrl: 'https://www.robofy.ai/favicon.ico',
      websiteUrl: 'https://www.robofy.ai/?ref=ting',
      affiliateUrl: 'https://www.robofy.ai/?ref=ting',
      category: 'Marketing',
      rating: 4.3,
      pricingType: 'PAID',
      tags: JSON.stringify(['AI chatbot', '40% commission', 'Instant approval', 'Weekly payouts']),
      pros: JSON.stringify(['40% commission', 'Instant approval', 'Weekly payouts via PayPal']),
      cons: JSON.stringify(['30-day cookie window', 'Smaller brand recognition']),
      isFeatured: true,
    },
  });
  console.log('✓ Robofy 已添加到数据库\n');

  // 3. 更新已有工具的推广链接
  console.log('更新已有工具的推广链接...');

  const updates = [
    { slug: 'claude-opus-4-7', url: 'https://claude.ai/?ref=aigcroom' },
    { slug: 'cursor-ide', url: 'https://cursor.sh/?ref=aigcroom' },
    { slug: 'github-copilot-2026', url: 'https://github.com/features/copilot?ref=aigcroom' },
    { slug: 'gemini-3-1-pro', url: 'https://gemini.google.com/?ref=aigcroom' },
    { slug: 'chatgpt', url: 'https://chat.openai.com/?ref=aigcroom' },
    { slug: 'midjourney', url: 'https://www.midjourney.com/?ref=aigcroom' },
    { slug: 'claude', url: 'https://claude.ai/?ref=aigcroom' },
  ];

  for (const { slug, url } of updates) {
    try {
      await prisma.tool.update({
        where: { slug },
        data: { affiliateUrl: url },
      });
      console.log(`✓ 更新 ${slug}`);
    } catch (e) {
      console.log(`✗ 跳过 ${slug} (不存在)`);
    }
  }

  console.log('\n========== 数据库更新完成 ==========\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
