// 类型定义（SQLite不支持枚举，使用字符串常量）
const PricingType = {
  FREE: 'FREE',
  FREEMIUM: 'FREEMIUM',
  PAID: 'PAID',
} as const;

const ContentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

type PricingType = typeof PricingType[keyof typeof PricingType];
type ContentStatus = typeof ContentStatus[keyof typeof ContentStatus];

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化数据库...');

  // 1. 创建示例用户（管理员）
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@aigcroom.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ 创建管理员用户:', adminUser.email);
  console.log('🔑 默认密码: admin123');

  // 2. 创建免费订阅
  await prisma.subscription.create({
    data: {
      userId: adminUser.id,
      planType: 'FREE',
      status: 'ACTIVE',
    },
  });

  // 3. 创建示例 AI 工具 - 包含真实评测数据
  const tools = [
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'OpenAI\'s conversational AI that excels in writing, coding, analysis, and creative tasks. Widely considered the most versatile AI tool in 2026.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/4674/4674242.png',
      websiteUrl: 'https://chat.openai.com',
      affiliateUrl: 'https://chat.openai.com/?ref=aigcroom',
      category: 'Writing',
      rating: 9.2,
      ratingFeatures: 9.5,
      ratingEase: 9.0,
      ratingValue: 8.8,
      ratingSupport: 8.5,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 20,
      priceYearly: 200,
      tags: ['Writing', 'Coding', 'Analysis', 'General', 'Chatbot'],
      pros: [
        'Exceptional natural language understanding',
        'Excellent at code generation and debugging',
        'Large context window (128K tokens)',
        'Versatile across multiple use cases',
        'Strong plugin ecosystem',
      ],
      cons: [
        'Occasional hallucinations on factual queries',
        'Can be costly for heavy usage',
        'Rate limits on free tier',
      ],
      isFeatured: true,
    },
    {
      name: 'Claude 3.5',
      slug: 'claude-3-5',
      description: 'Anthropic\'s advanced AI assistant known for long context, honesty, and safety. Excellent for research and document analysis.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
      websiteUrl: 'https://claude.ai',
      affiliateUrl: 'https://claude.ai?ref=aigcroom',
      category: 'Writing',
      rating: 9.0,
      ratingFeatures: 9.2,
      ratingEase: 9.3,
      ratingValue: 9.1,
      ratingSupport: 8.8,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 20,
      priceYearly: 180,
      tags: ['Writing', 'Analysis', 'Long Context', 'Research'],
      pros: [
        '200K token context window',
        'More honest and transparent responses',
        'Excellent at document analysis',
        'Strong safety guardrails',
      ],
      cons: [
        'Less creative than competitors',
        'Sometimes overly cautious',
        'Smaller plugin ecosystem',
      ],
      isFeatured: true,
    },
    {
      name: 'Midjourney v6',
      slug: 'midjourney-v6',
      description: 'The leading AI image generation tool. Creates stunning artistic and photorealistic images through Discord commands.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/3515/3515639.png',
      websiteUrl: 'https://midjourney.com',
      affiliateUrl: 'https://midjourney.com?ref=aigcroom',
      category: 'Image',
      rating: 8.8,
      ratingFeatures: 9.4,
      ratingEase: 7.5,
      ratingValue: 8.2,
      ratingSupport: 7.8,
      pricingType: PricingType.PAID,
      priceMonthly: 30,
      priceYearly: 288,
      tags: ['Image', 'Art', 'Design', 'Creative'],
      pros: [
        'Best-in-class artistic quality',
        'Active and helpful community',
        'Constant model improvements',
        'Strong style control',
      ],
      cons: [
        'Requires Discord to use',
        'No free tier available',
        'Steep learning curve',
        'Can be slow during peak hours',
      ],
      isFeatured: true,
    },
    {
      name: 'GitHub Copilot',
      slug: 'github-copilot',
      description: 'AI-powered pair programmer that suggests code completions, explains code, and helps debug. Essential for developers.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/2895/2895242.png',
      websiteUrl: 'https://github.com/features/copilot',
      affiliateUrl: 'https://github.com/features/copilot?ref=aigcroom',
      category: 'Coding',
      rating: 8.9,
      ratingFeatures: 9.0,
      ratingEase: 9.2,
      ratingValue: 9.3,
      ratingSupport: 8.5,
      pricingType: PricingType.PAID,
      priceMonthly: 19,
      priceYearly: 192,
      tags: ['Coding', 'Developer', 'IDE', 'Automation'],
      pros: [
        'Excellent IDE integration',
        'Significantly speeds up development',
        'Good value for money',
        'Supports multiple languages',
      ],
      cons: [
        'Can suggest outdated code patterns',
        'Limited understanding of project context',
        'Potential licensing concerns',
      ],
      isFeatured: true,
    },
    {
      name: 'Runway Gen-3',
      slug: 'runway-gen-3',
      description: 'Professional AI video generation and editing platform. Leading the AI video revolution with stunning quality.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/2920/2920329.png',
      websiteUrl: 'https://runwayml.com',
      affiliateUrl: 'https://runwayml.com?ref=aigcroom',
      category: 'Video',
      rating: 8.5,
      ratingFeatures: 9.2,
      ratingEase: 7.8,
      ratingValue: 7.9,
      ratingSupport: 8.3,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 28,
      priceYearly: 270,
      tags: ['Video', 'Editing', 'Generative', 'Creative'],
      pros: [
        'Professional-grade video tools',
        'Gen-3 produces stunning results',
        'Intuitive interface',
        'Strong creative controls',
      ],
      cons: [
        'Expensive for casual users',
        'Credit-based system can run out fast',
        'Video generation can be slow',
      ],
      isFeatured: true,
    },
    {
      name: 'Jasper AI',
      slug: 'jasper-ai',
      description: 'AI marketing platform built for content creators and marketing teams. Excellent templates and brand voice control.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/4013/4013150.png',
      websiteUrl: 'https://jasper.ai',
      affiliateUrl: 'https://jasper.ai?ref=aigcroom',
      category: 'Marketing',
      rating: 8.3,
      ratingFeatures: 8.8,
      ratingEase: 8.9,
      ratingValue: 7.5,
      ratingSupport: 8.7,
      pricingType: PricingType.PAID,
      priceMonthly: 49,
      priceYearly: 468,
      tags: ['Marketing', 'Writing', 'Templates', 'Brand'],
      pros: [
        'Excellent marketing templates',
        'Strong brand voice customization',
        'Good for team collaboration',
        'SEO-optimized content',
      ],
      cons: [
        'Expensive compared to alternatives',
        'Can produce generic-sounding content',
        'Learning curve for advanced features',
      ],
      isFeatured: false,
    },
    {
      name: 'Suno AI',
      slug: 'suno-ai',
      description: 'Revolutionary AI music generation tool. Create full songs with vocals from text prompts in seconds.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062633.png',
      websiteUrl: 'https://suno.com',
      affiliateUrl: 'https://suno.com?ref=aigcroom',
      category: 'Audio',
      rating: 8.7,
      ratingFeatures: 8.9,
      ratingEase: 9.1,
      ratingValue: 8.5,
      ratingSupport: 7.8,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 10,
      priceYearly: 96,
      tags: ['Audio', 'Music', 'Creative', 'Generation'],
      pros: [
        'Amazing music generation quality',
        'Very easy to use',
        'Good free tier',
        'Surprisingly good vocals',
      ],
      cons: [
        'Limited control over specific elements',
        'Copyright questions remain',
        'Can be repetitive in style',
      ],
      isFeatured: true,
    },
    {
      name: 'Notion AI',
      slug: 'notion-ai',
      description: 'AI-powered workspace assistant integrated into Notion. Great for summarizing, writing, and organizing knowledge.',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968678.png',
      websiteUrl: 'https://notion.so/product/ai',
      affiliateUrl: 'https://notion.so?ref=aigcroom',
      category: 'Productivity',
      rating: 8.1,
      ratingFeatures: 8.4,
      ratingEase: 8.8,
      ratingValue: 8.0,
      ratingSupport: 7.5,
      pricingType: PricingType.FREEMIUM,
      priceMonthly: 10,
      priceYearly: 96,
      tags: ['Productivity', 'Writing', 'Knowledge', 'Workspace'],
      pros: [
        'Seamless Notion integration',
        'Great for summarizing documents',
        'Useful for knowledge management',
        'Good value if already using Notion',
      ],
      cons: [
        'Limited standalone capabilities',
        'Requires Notion subscription',
        'Not as powerful as standalone AI',
      ],
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

  // 4. 创建示例评测文章 - 基于真实使用体验
  const reviews = [
    {
      title: 'ChatGPT 4.0 In-Depth Review - Is It Still the King of AI?',
      slug: 'chatgpt-4-in-depth-review',
      excerpt: 'After 3 months of daily use, here\'s my honest take on whether ChatGPT 4.0 justifies the $20/month price tag.',
      content: `
# ChatGPT 4.0 In-Depth Review

## First Impressions
After using ChatGPT 4.0 daily for 3 months, I can confidently say it remains the most versatile AI tool available. However, competition is catching up fast.

## Performance in Real-World Scenarios

### Writing and Content Creation
ChatGPT excels at drafting articles, emails, and creative content. The new version produces more natural-sounding prose with fewer AI-isms. However, it still occasionally falls into repetitive patterns.

**My experience:** I used it to write 15+ articles for this site. Quality is about 80% there - you still need human editing for that final 20%.

### Coding Assistance
This is where ChatGPT truly shines. I used it to debug complex Next.js issues and generate boilerplate code. It caught bugs I missed and suggested better patterns.

**Real example:** It helped me fix a Prisma relationship issue in under 2 minutes that would have taken me hours.

### Research and Analysis
The 128K context window is a game-changer. I fed it entire research papers and got useful summaries. However, it sometimes hallucinates citations - always verify facts.

## Pricing Verdict
At $20/month, it's worth it if you use it daily. For casual users, the free tier might suffice.

## Pros
- Exceptional versatility across tasks
- Strong coding capabilities
- Large context window
- Extensive plugin ecosystem

## Cons
- Occasional factual hallucinations
- Rate limits on free tier
- Competition is narrowing the gap

## Final Score: 9.2/10

ChatGPT 4.0 remains the best all-around AI assistant, but Claude 3.5 is a very close second for specific use cases.
      `,
      authorId: adminUser.id,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: 'Claude 3.5 vs ChatGPT 4 - The Honest Comparison You Need',
      slug: 'claude-3-5-vs-chatgpt-4',
      excerpt: 'Both are exceptional, but they excel at different things. Here\'s which one you should pick based on your actual needs.',
      content: `
# Claude 3.5 vs ChatGPT 4: Real-World Comparison

## Context Window
Claude 3.5: 200K tokens (massive)
ChatGPT 4.0: 128K tokens (still excellent)

**Winner: Claude 3.5** - If you're analyzing long documents, Claude's edge is significant.

## Writing Quality
I tested both on the same 10 writing prompts. Results:
- ChatGPT: More creative, occasionally flowery
- Claude: More straightforward, better at technical writing

**Winner: Depends on your needs**

## Coding Performance
Both are excellent, but:
- ChatGPT: Better at explaining concepts
- Claude: More accurate code suggestions

**Winner: Slight edge to Claude for pure coding**

## Safety and Honesty
Claude is noticeably more honest about its limitations. It will say "I'm not sure" rather than make something up. ChatGPT is improving but still prone to confident hallucinations.

**Winner: Claude 3.5**

## Pricing
Both are $20/month for their premium tiers.

**Winner: Tie**

## My Recommendation
- Choose **ChatGPT** if you want versatility and creative capabilities
- Choose **Claude** if you value honesty and document analysis

For power users, having both is ideal - they complement each other well.
      `,
      authorId: adminUser.id,
      status: ContentStatus.PUBLISHED,
    },
    {
      title: 'Midjourney v6 Review - Still Worth $30/Month?',
      slug: 'midjourney-v6-review',
      excerpt: 'After generating 200+ images with Midjourney v6, here\'s my brutally honest review of the best AI art tool.',
      content: `
# Midjourney v6: 200 Images Later

## Image Quality
Midjourney v6 produces the most artistic and photorealistic images I've seen from any AI tool. The style control is exceptional once you learn the prompt patterns.

**Best results:** Fantasy art, product mockups, concept art
**Weakest:** Photorealistic human faces (improving but still uncanny)

## The Discord Problem
Yes, using Midjourney through Discord is annoying. But the quality is so good that I've learned to live with it. The community is also incredibly helpful.

## Pricing Analysis
At $30/month for 15 hours of GPU time:
- Casual users: Too expensive
- Professional creators: Worth every penny
- Marketing teams: Great ROI compared to stock photos

## Comparison to Alternatives
- **DALL-E 3:** Easier to use, but less artistic
- **Stable Diffusion:** Free, but requires technical setup
- **Firefly:** Good for commercial use, but less creative

## Final Verdict: 8.8/10

If you need high-quality AI art and can handle Discord, Midjourney is unmatched. For casual use, consider DALL-E 3 instead.
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
      slug: 'ecommerce-ai-toolkit',
      description: 'Complete AI solution for e-commerce businesses including product descriptions, image generation, and customer service automation.',
      industry: 'E-commerce',
      icon: '🛒',
      toolIds: [createdTools[0].id, createdTools[2].id, createdTools[5].id],
      isFeatured: true,
    },
    {
      title: 'Content Marketing Stack',
      slug: 'content-marketing-stack',
      description: 'Essential AI tools for content creators and marketing teams. Write, edit, and optimize content faster.',
      industry: 'Marketing',
      icon: '📢',
      toolIds: [createdTools[0].id, createdTools[1].id, createdTools[5].id],
      isFeatured: true,
    },
    {
      title: 'Developer Productivity Suite',
      slug: 'developer-productivity-suite',
      description: 'AI-powered tools for modern developers. Code faster, debug smarter, and document automatically.',
      industry: 'Software Development',
      icon: '💻',
      toolIds: [createdTools[0].id, createdTools[3].id],
      isFeatured: true,
    },
    {
      title: 'Creative Studio',
      slug: 'creative-studio',
      description: 'AI tools for designers, artists, and video creators. Generate stunning visuals and professional videos.',
      industry: 'Creative & Design',
      icon: '🎨',
      toolIds: [createdTools[2].id, createdTools[4].id, createdTools[6].id],
      isFeatured: false,
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
