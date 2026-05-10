import { PrismaClient, PricingType, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化数据库...');

  // 1. 创建示例用户（管理员）
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@aigcroom.com',
      password: null, // 可以通过注册设置，或者留空
      role: 'ADMIN',
    },
  });
  console.log('✅ 创建管理员用户:', adminUser.email);

  // 2. 创建免费订阅
  await prisma.subscription.create({
    data: {
      userId: adminUser.id,
      planType: 'FREE',
      status: 'ACTIVE',
    },
  });

  // 3. 创建示例 AI 工具
  const tools = [
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'AI chatbot developed by OpenAI. Great for writing, coding, analysis, and general Q&A.',
      logoUrl: '🤖',
      websiteUrl: 'https://chat.openai.com',
      affiliateUrl: '',
      category: 'Writing',
      rating: 4.8,
      ratingFeatures: 4.9,
      ratingEase: 4.7,
      ratingValue: 4.6,
      ratingSupport: 4.4,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 20,
      priceYearly: 200,
      tags: ['Writing', 'Coding', 'Analysis', 'General'],
      pros: ['Powerful capabilities', 'Large knowledge base', 'Easy to use'],
      cons: ['Can hallucinate', 'Costly at scale', 'Context limit'],
      isFeatured: true,
    },
    {
      name: 'Claude 3',
      slug: 'claude-3',
      description: 'Anthropic\'s latest AI assistant. Known for long context and safety.',
      logoUrl: '💬',
      websiteUrl: 'https://claude.ai',
      affiliateUrl: '',
      category: 'Writing',
      rating: 4.7,
      ratingFeatures: 4.6,
      ratingEase: 4.8,
      ratingValue: 4.7,
      ratingSupport: 4.5,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 20,
      priceYearly: 180,
      tags: ['Writing', 'Analysis', 'Long Context'],
      pros: ['Long context window', 'More honest responses', 'Good safety'],
      cons: ['Less creative', 'Slower at times', 'Smaller plugin ecosystem'],
      isFeatured: true,
    },
    {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'The leading AI image generation tool via Discord.',
      logoUrl: '🎨',
      websiteUrl: 'https://midjourney.com',
      affiliateUrl: '',
      category: 'Image',
      rating: 4.6,
      ratingFeatures: 4.8,
      ratingEase: 4.2,
      ratingValue: 4.5,
      ratingSupport: 4.1,
      pricingType: PricingType.PAID,
      priceMonthly: 30,
      priceYearly: 288,
      tags: ['Image', 'Art', 'Design'],
      pros: ['Best artistic results', 'Active community', 'Constant improvements'],
      cons: ['Discord-only UI', 'No free tier', 'Steep learning curve'],
      isFeatured: true,
    },
    {
      name: 'GitHub Copilot',
      slug: 'github-copilot',
      description: 'AI pair programmer from GitHub and OpenAI.',
      logoUrl: '💻',
      websiteUrl: 'https://github.com/copilot',
      affiliateUrl: '',
      category: 'Coding',
      rating: 4.4,
      ratingFeatures: 4.5,
      ratingEase: 4.6,
      ratingValue: 4.7,
      ratingSupport: 4.2,
      pricingType: PricingType.PAID,
      priceMonthly: 19,
      priceYearly: 192,
      tags: ['Coding', 'Developer', 'IDE'],
      pros: ['Great IDE integration', 'Speeds up boilerplate', 'Good value'],
      cons: ['Can suggest bugs', 'Limited to coding', 'License concerns'],
      isFeatured: true,
    },
    {
      name: 'Runway',
      slug: 'runway',
      description: 'Professional AI video generation and editing platform.',
      logoUrl: '🎬',
      websiteUrl: 'https://runwayml.com',
      affiliateUrl: '',
      category: 'Video',
      rating: 4.5,
      ratingFeatures: 4.7,
      ratingEase: 4.3,
      ratingValue: 4.2,
      ratingSupport: 4.5,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 28,
      priceYearly: 270,
      tags: ['Video', 'Editing', 'Generative'],
      pros: ['Professional tools', 'Good quality', 'Gen-2 breakthrough'],
      cons: ['Expensive', 'Credits system', 'Slow generation'],
      isFeatured: false,
    },
  ];

  const createdTools = [];
  for (const toolData of tools) {
    const tool = await prisma.tool.create({
      data: toolData,
    });
    createdTools.push(tool);
    console.log('✅ 创建工具:', tool.name);
    
    // 创建价格方案
    await prisma.pricingPlan.createMany({
      data: [
        {
          toolId: tool.id,
          name: 'Free',
          description: 'Basic access with limitations',
          priceMonthly: 0,
          priceYearly: 0,
          features: ['Basic access', 'Limited usage', 'Community support'],
          isPopular: false,
        },
        {
          toolId: tool.id,
          name: 'Pro',
          description: 'Full access with priority support',
          priceMonthly: tool.priceMonthly || 20,
          priceYearly: tool.priceYearly || 200,
          features: ['Full access', 'Priority support', 'Early access'],
          isPopular: true,
        },
      ],
    });
  }

  // 4. 创建示例评测文章
  const reviews = [
    {
      title: 'ChatGPT 4.0 Review - Is It Worth the Upgrade?',
      slug: 'chatgpt-4-review',
      excerpt: 'An in-depth look at GPT-4 capabilities, performance, and if it justifies the cost over GPT-3.5.',
      content: `
# ChatGPT 4.0 Review

## Overview
ChatGPT 4.0 represents a significant leap forward from previous versions...

## Performance
- Better reasoning
- Improved coding
- Multi-modal capabilities

## Conclusion
Highly recommended for professionals.
      `,
      authorId: adminUser.id,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: 'Claude 3 vs GPT-4 - Which Should You Choose?',
      slug: 'claude-3-vs-gpt4',
      excerpt: 'A detailed comparison between Anthropic Claude 3 and OpenAI GPT-4.',
      content: `
# Claude 3 vs GPT-4

## Context Window
Claude 3 has a much larger context window...

## Response Style
Claude tends to be more conservative...

## Conclusion
Choose based on your specific needs!
      `,
      authorId: adminUser.id,
      status: ContentStatus.PUBLISHED,
    },
  ];

  for (const reviewData of reviews) {
    const review = await prisma.review.create({
      data: {
        ...reviewData,
        toolId: createdTools[0].id,
        publishedAt: new Date(),
      },
    });
    console.log('✅ 创建评测:', review.title);
  }

  // 5. 创建行业解决方案
  const solutions = [
    {
      title: 'E-commerce AI Toolkit',
      slug: 'ecommerce',
      description: 'Complete AI solution for e-commerce businesses including product writing, image generation, and customer service.',
      industry: 'E-commerce',
      icon: '🛒',
      toolIds: [createdTools[0].id, createdTools[2].id],
      isFeatured: true,
    },
    {
      title: 'Content Marketing Stack',
      slug: 'content-marketing',
      description: 'Essential AI tools for content creators and marketing teams.',
      industry: 'Marketing',
      icon: '📢',
      toolIds: [createdTools[0].id, createdTools[1].id],
      isFeatured: true,
    },
  ];

  for (const solutionData of solutions) {
    const solution = await prisma.solution.create({
      data: solutionData,
    });
    console.log('✅ 创建解决方案:', solution.title);
  }

  console.log('\n🎉 数据库初始化完成！');
  console.log('📝 管理员邮箱:', adminUser.email);
  console.log('🔧 你可以通过注册页面设置密码！');
}

main()
  .catch((e) => {
    console.error('❌ 初始化错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
