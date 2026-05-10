const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

const DB_PATH = path.join(__dirname, 'data', 'db.json')

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const hashedPassword2 = await bcrypt.hash('user123', 10)

  const now = new Date().toISOString()

  const data = {
    users: [
      {
        id: generateId(),
        name: 'Admin',
        email: 'admin@aigcroom.com',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Test User',
        email: 'user@test.com',
        password: hashedPassword2,
        role: 'USER',
        createdAt: now,
        updatedAt: now,
      },
    ],
    tools: [
      {
        id: generateId(),
        name: 'ChatGPT',
        description: 'OpenAI开发的AI聊天助手，支持自然语言对话、内容创作、代码编写等多种应用场景。',
        category: '聊天助手',
        website: 'https://chat.openai.com',
        pricing: 'Freemium',
        rating: 4.8,
        image: '/images/tools/chatgpt.png',
        features: ['自然语言对话', '内容创作', '代码编写', '多语言支持'],
        pros: ['强大的语言理解能力', '广泛的应用场景', '持续更新迭代'],
        cons: ['免费版有使用限制', '偶尔产生不准确信息'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Midjourney',
        description: '领先的AI图像生成工具，通过文字描述即可生成高质量的艺术图像。',
        category: '图像生成',
        website: 'https://midjourney.com',
        pricing: 'Paid',
        rating: 4.7,
        image: '/images/tools/midjourney.png',
        features: ['文字转图像', '多种艺术风格', '高分辨率输出', '社区画廊'],
        pros: ['图像质量极高', '艺术风格多样', '社区活跃'],
        cons: ['需要付费使用', '学习曲线较陡'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Claude',
        description: 'Anthropic开发的AI助手，以安全性和长文本处理能力著称。',
        category: '聊天助手',
        website: 'https://claude.ai',
        pricing: 'Freemium',
        rating: 4.6,
        image: '/images/tools/claude.png',
        features: ['长文本处理', '安全对话', '文档分析', '代码辅助'],
        pros: ['200K上下文窗口', '安全性高', '文档分析能力强'],
        cons: ['不支持图像生成', '国内访问不便'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Notion AI',
        description: 'Notion内置的AI功能，帮助你在笔记和文档中快速生成和整理内容。',
        category: '生产力',
        website: 'https://notion.so',
        pricing: 'Paid',
        rating: 4.5,
        image: '/images/tools/notion.png',
        features: ['AI写作助手', '内容摘要', '头脑风暴', '翻译'],
        pros: ['与Notion无缝集成', '提高工作效率', '多场景适用'],
        cons: ['需要Notion订阅', '功能相对基础'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'GitHub Copilot',
        description: 'GitHub和OpenAI合作开发的AI代码助手，支持多种编程语言的智能补全。',
        category: '开发工具',
        website: 'https://github.com/features/copilot',
        pricing: 'Paid',
        rating: 4.7,
        image: '/images/tools/copilot.png',
        features: ['代码补全', '代码解释', '单元测试生成', '多语言支持'],
        pros: ['大幅提高编码效率', '支持主流IDE', '持续学习改进'],
        cons: ['需要付费订阅', '偶有错误建议'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'Jasper AI',
        description: '专业的AI营销内容生成工具，适合营销人员和内容创作者。',
        category: '内容创作',
        website: 'https://jasper.ai',
        pricing: 'Paid',
        rating: 4.4,
        image: '/images/tools/jasper.png',
        features: ['营销文案生成', '博客文章', '社交媒体内容', 'SEO优化'],
        pros: ['营销内容专业', '模板丰富', '支持多语言'],
        cons: ['价格较高', '免费版功能有限'],
        createdAt: now,
        updatedAt: now,
      },
    ],
    reviews: [
      {
        id: generateId(),
        title: 'ChatGPT深度评测：2026年最值得使用的AI聊天工具',
        slug: 'chatgpt-review-2026',
        toolId: '',
        content: 'ChatGPT作为OpenAI的旗舰产品，在2026年依然保持着强大的竞争力。本文将从功能、性能、价格等多个维度进行全面评测。\n\n## 功能评测\nChatGPT支持自然语言对话、内容创作、代码编写等多种功能，其语言理解能力在行业内处于领先地位。\n\n## 性能表现\n在响应速度和准确性方面，ChatGPT表现优秀，GPT-4模型的准确率超过95%。\n\n## 价格分析\n免费版提供基础功能，Plus版本每月20美元，适合重度用户。\n\n## 总结\nChatGPT依然是2026年最值得使用的AI聊天工具之一。',
        author: 'Admin',
        status: 'PUBLISHED',
        rating: 4.8,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        title: 'Midjourney V6评测：AI图像生成的新标杆',
        slug: 'midjourney-v6-review',
        toolId: '',
        content: 'Midjourney V6带来了革命性的图像生成能力，本文将详细评测其各项功能。\n\n## 图像质量\nV6版本在图像细节、光影处理和风格一致性方面都有显著提升。\n\n## 使用体验\n通过Discord或Web界面使用，操作简单直观。\n\n## 价格方案\n基础版每月10美元，标准版30美元，专业版60美元。\n\n## 总结\nMidjourney V6是AI图像生成领域的新标杆。',
        author: 'Admin',
        status: 'PUBLISHED',
        rating: 4.7,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        title: 'Claude vs ChatGPT：谁才是更好的AI助手？',
        slug: 'claude-vs-chatgpt',
        toolId: '',
        content: '本文将对Claude和ChatGPT进行全面对比，帮助你选择最适合的AI助手。\n\n## 上下文长度\nClaude支持200K上下文，远超ChatGPT的32K。\n\n## 安全性\nClaude在安全性方面表现更优，内置了更多安全防护。\n\n## 价格对比\n两者都提供免费版本，付费版本价格相近。\n\n## 结论\n如果你需要处理长文档，Claude是更好的选择；如果需要多功能AI，ChatGPT更全面。',
        author: 'Admin',
        status: 'PUBLISHED',
        rating: 4.5,
        createdAt: now,
        updatedAt: now,
      },
    ],
    solutions: [
      {
        id: generateId(),
        title: '电商客服AI解决方案',
        description: '利用AI技术提升电商客服效率，降低人工成本，提高客户满意度。',
        content: '本方案整合了多个AI工具，为电商企业提供完整的客服解决方案。\n\n## 方案组成\n1. ChatGPT - 处理日常咨询\n2. 翻译工具 - 支持多语言客服\n3. 情感分析 - 识别客户情绪\n\n## 实施步骤\n1. 需求分析\n2. 工具选型\n3. 系统集成\n4. 培训上线\n\n## 预期效果\n- 客服响应时间缩短80%\n- 人工成本降低60%\n- 客户满意度提升30%',
        category: '电商',
        tools: [],
        image: '/images/solutions/ecommerce.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        title: '内容营销AI工作流',
        description: '从选题到发布，全流程AI辅助的内容营销解决方案。',
        content: '本方案帮助营销团队利用AI工具提升内容生产效率。\n\n## 工具推荐\n1. Jasper AI - 营销文案生成\n2. ChatGPT - 内容创意\n3. Midjourney - 配图生成\n4. Grammarly - 语法检查\n\n## 工作流程\n1. AI辅助选题\n2. 自动生成初稿\n3. AI配图\n4. 人工审核\n5. 发布推广\n\n## 效果预期\n- 内容生产效率提升3倍\n- 内容质量保持稳定\n- SEO排名提升',
        category: '营销',
        tools: [],
        image: '/images/solutions/content-marketing.png',
        createdAt: now,
        updatedAt: now,
      },
    ],
    affiliateLinks: [
      {
        id: generateId(),
        toolId: '',
        url: 'https://chat.openai.com/?ref=aigcroom',
        slug: 'chatgpt',
        clicks: 1250,
        conversions: 85,
        revenue: 425.00,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        toolId: '',
        url: 'https://midjourney.com/?ref=aigcroom',
        slug: 'midjourney',
        clicks: 980,
        conversions: 62,
        revenue: 310.00,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        toolId: '',
        url: 'https://claude.ai/?ref=aigcroom',
        slug: 'claude',
        clicks: 750,
        conversions: 45,
        revenue: 225.00,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        toolId: '',
        url: 'https://github.com/features/copilot?ref=aigcroom',
        slug: 'github-copilot',
        clicks: 620,
        conversions: 55,
        revenue: 550.00,
        createdAt: now,
        updatedAt: now,
      },
    ],
    affiliateClicks: [],
    subscriptions: [
      {
        id: generateId(),
        userId: '',
        planType: 'PRO',
        status: 'ACTIVE',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now,
        updatedAt: now,
      },
    ],
    comparisons: [],
    pricingPlans: [
      {
        id: generateId(),
        name: 'FREE',
        price: 0,
        period: 'month',
        features: ['浏览工具库', '基础评测', '2个工具对比', '行业资讯'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'PRO',
        price: 29,
        period: 'month',
        features: ['所有免费功能', '深度对比', 'ROI计算器', '基础模板', '专属折扣(10-20%)', '价格追踪', '无广告'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: 'ENTERPRISE',
        price: 99,
        period: 'month',
        features: ['所有Pro功能', '高级模板', '专属折扣(20-40%)', '1对1咨询(2次/月)', '定制解决方案', '抢先体验', '专属社区'],
        createdAt: now,
        updatedAt: now,
      },
    ],
    favorites: [],
    accounts: [],
    sessions: [],
  }

  // 将toolId关联到对应的tools和reviews
  const toolIds = data.tools.map(t => t.id)
  data.reviews[0].toolId = toolIds[0] // ChatGPT
  data.reviews[1].toolId = toolIds[1] // Midjourney
  
  data.affiliateLinks[0].toolId = toolIds[0]
  data.affiliateLinks[1].toolId = toolIds[1]
  data.affiliateLinks[2].toolId = toolIds[2]
  data.affiliateLinks[3].toolId = toolIds[4]

  data.solutions[0].tools = [toolIds[0]]
  data.solutions[1].tools = [toolIds[0], toolIds[1], toolIds[5]]

  const userId = data.users[1].id
  data.subscriptions[0].userId = userId

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  console.log('Database seeded successfully!')
  console.log('Admin account: admin@aigcroom.com / admin123')
  console.log('User account: user@test.com / user123')
}

seed().catch(console.error)
