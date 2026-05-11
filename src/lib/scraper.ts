// ========================================
// AI工具评测数据抓取服务 V2
// 
// 设计原则：
// - 使用RSS/API而非网页爬虫（更可靠）
// - 只抓取真实用户评测数据
// - 支持知名博主RSS源
// - 自动过滤垃圾内容
// ========================================

interface AIToolReview {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  url: string;
  publishedAt: string;
  tags: string[];
  rating?: number;
  toolName: string;
  source: string;
}

interface AIToolData {
  name: string;
  website: string;
  category: string;
  description: string;
  rating: number;
  pros: string[];
  cons: string[];
  pricing: string;
  tags: string[];
}

// 知名AI博主RSS源列表
const TECH_BLOGGERS_RSS = [
  {
    name: 'Ethan Mollick',
    url: 'https://www.oneusefulthing.org/rss',
    focus: 'AI education and practical AI use',
  },
  {
    name: 'Matt Wolfe',
    url: 'https://matthewwolfe.substack.com/feed',
    focus: 'AI tools reviews and tutorials',
  },
  {
    name: "Ben's Bites",
    url: 'https://bensbites.beehiiv.com/feed',
    focus: 'AI news and tool reviews',
  },
  {
    name: 'The AI Exchange',
    url: 'https://theaiexchange.news/feed',
    focus: 'AI industry analysis',
  },
];

// AI工具评测网站API
const REVIEW_SOURCES = [
  {
    name: 'G2',
    baseUrl: 'https://www.g2.com',
    searchUrl: 'https://www.g2.com/search?query=',
    apiAvailable: false,
  },
  {
    name: 'Product Hunt',
    baseUrl: 'https://www.producthunt.com',
    searchUrl: 'https://www.producthunt.com/search?q=',
    apiAvailable: false,
  },
];

// 预定义的权威评测文章模板（用于手动添加或半自动生成）
const REVIEW_TEMPLATES = [
  {
    title: '{Tool} Review 2026: Is It Worth It?',
    structure: [
      'Introduction and overview',
      'Key features analysis',
      'Pricing breakdown',
      'Real user experiences',
      'Pros and cons',
      'Comparison with alternatives',
      'Final verdict',
    ],
  },
  {
    title: '{Tool} vs {Competitor}: Which One Should You Choose?',
    structure: [
      'Overview of both tools',
      'Feature comparison',
      'Performance benchmarks',
      'Pricing comparison',
      'User experience',
      'Use case recommendations',
      'Winner and conclusion',
    ],
  },
];

/**
 * 获取知名博主的最新AI评测文章
 * 注意：实际部署需要RSS解析库如rss-parser
 */
async function fetchBloggerReviews(): Promise<AIToolReview[]> {
  const reviews: AIToolReview[] = [];
  
  // 这里使用RSS解析来获取最新文章
  // 实际部署时需要：npm install rss-parser
  
  for (const blogger of TECH_BLOGGERS_RSS) {
    try {
      console.log(`Fetching articles from ${blogger.name}...`);
      
      // 实际实现示例（需要rss-parser库）：
      /*
      const Parser = require('rss-parser');
      const parser = new Parser();
      const feed = await parser.parseURL(blogger.url);
      
      for (const item of feed.items) {
        if (isAIReviewArticle(item.title, item.contentSnippet)) {
          reviews.push({
            title: item.title,
            excerpt: item.contentSnippet,
            content: item.content,
            author: item.creator || blogger.name,
            url: item.link,
            publishedAt: item.pubDate,
            tags: extractAITags(item.title + ' ' + item.contentSnippet),
            toolName: extractToolName(item.title),
            source: blogger.name,
          });
        }
      }
      */
      
      // 临时模拟数据
      await sleep(1000);
    } catch (error) {
      console.error(`Failed to fetch from ${blogger.name}:`, error);
    }
  }
  
  return reviews;
}

/**
 * 判断文章是否是AI评测类文章
 */
function isAIReviewArticle(title: string, excerpt: string): boolean {
  const aiKeywords = [
    'review', 'test', 'hands-on', 'tested', 'comparison',
    'vs', 'versus', 'best', 'top', 'guide',
    'chatgpt', 'claude', 'midjourney', 'copilot', 'gemini',
    'ai tool', 'ai assistant', 'ai writing', 'ai image',
  ];
  
  const text = (title + ' ' + excerpt).toLowerCase();
  return aiKeywords.some(keyword => text.includes(keyword));
}

/**
 * 从文章标题中提取AI工具名称
 */
function extractToolName(title: string): string {
  const toolPatterns = [
    'ChatGPT', 'Claude', 'Midjourney', 'Copilot', 'Gemini',
    'Perplexity', 'Jasper', 'Runway', 'Suno', 'Notion AI',
    'GitHub Copilot', 'DALL-E', 'Stable Diffusion', 'DeepSeek',
    'Grok', 'Llama', 'Mistral', 'Cursor', 'Windsurf',
  ];
  
  const titleLower = title.toLowerCase();
  for (const tool of toolPatterns) {
    if (titleLower.includes(tool.toLowerCase())) {
      return tool;
    }
  }
  
  return 'Unknown';
}

/**
 * 从文章内容中提取AI相关标签
 */
function extractAITags(text: string): string[] {
  const tagMap: Record<string, string[]> = {
    'chatgpt': ['Chat Assistant', 'Writing', 'Coding'],
    'claude': ['Chat Assistant', 'Long Context', 'Coding'],
    'midjourney': ['Image Generation', 'Art', 'Design'],
    'copilot': ['Coding', 'Productivity', 'Microsoft'],
    'gemini': ['Chat Assistant', 'Multimodal', 'Google'],
    'perplexity': ['Search', 'Research', 'AI Assistant'],
    'runway': ['Video Generation', 'Video Editing'],
    'jasper': ['Marketing', 'Writing', 'Content'],
    'sun': ['Audio', 'Music Generation'],
    'notion ai': ['Productivity', 'Writing', 'Workspace'],
  };
  
  const textLower = text.toLowerCase();
  const tags = new Set<string>();
  
  for (const [keyword, associatedTags] of Object.entries(tagMap)) {
    if (textLower.includes(keyword)) {
      associatedTags.forEach(tag => tags.add(tag));
    }
  }
  
  return Array.from(tags);
}

/**
 * 生成AI工具的基础数据
 * 基于已知的工具信息生成标准化的工具数据
 */
function generateToolData(toolName: string): AIToolData | null {
  const toolsDB: Record<string, AIToolData> = {
    'ChatGPT': {
      name: 'ChatGPT',
      website: 'https://chat.openai.com',
      category: 'Chat Assistant',
      description: 'OpenAI\'s conversational AI that excels in writing, coding, analysis, and creative tasks.',
      rating: 9.2,
      pros: [
        'Exceptional natural language understanding',
        'Excellent at code generation and debugging',
        'Large context window (128K tokens)',
        'Versatile across multiple use cases',
      ],
      cons: [
        'Occasional hallucinations on factual queries',
        'Can be costly for heavy usage',
        'Rate limits on free tier',
      ],
      pricing: 'Freemium ($20/month for Plus)',
      tags: ['Writing', 'Coding', 'Analysis', 'General'],
    },
    'Claude': {
      name: 'Claude',
      website: 'https://claude.ai',
      category: 'Chat Assistant',
      description: 'Anthropic\'s advanced AI assistant known for long context, honesty, and safety.',
      rating: 9.0,
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
      pricing: 'Freemium ($20/month for Pro)',
      tags: ['Writing', 'Analysis', 'Long Context', 'Research'],
    },
    'Midjourney': {
      name: 'Midjourney',
      website: 'https://midjourney.com',
      category: 'Image Generation',
      description: 'The leading AI image generation tool. Creates stunning artistic and photorealistic images.',
      rating: 8.8,
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
      ],
      pricing: 'Paid ($30-120/month)',
      tags: ['Image', 'Art', 'Design', 'Creative'],
    },
    'GitHub Copilot': {
      name: 'GitHub Copilot',
      website: 'https://github.com/features/copilot',
      category: 'Coding',
      description: 'AI-powered pair programmer that suggests code completions and helps debug.',
      rating: 8.9,
      pros: [
        'Excellent IDE integration',
        'Significantly speeds up development',
        'Good value for money',
        'Supports multiple languages',
      ],
      cons: [
        'Can suggest outdated code patterns',
        'Limited understanding of project context',
      ],
      pricing: 'Paid ($19/month)',
      tags: ['Coding', 'Developer', 'IDE', 'Automation'],
    },
    'Gemini': {
      name: 'Google Gemini',
      website: 'https://gemini.google.com',
      category: 'Chat Assistant',
      description: 'Google\'s multimodal AI with excellent image understanding and Workspace integration.',
      rating: 8.5,
      pros: [
        'Excellent at image understanding',
        'YouTube video summarization',
        'Native Google Workspace integration',
      ],
      cons: [
        'Less versatile than ChatGPT',
        'Can fabricate citations',
      ],
      pricing: 'Freemium ($20/month for Advanced)',
      tags: ['Chat Assistant', 'Multimodal', 'Google'],
    },
  };
  
  return toolsDB[toolName] || null;
}

/**
 * 生成评测文章的结构化内容
 */
function generateReviewContent(toolName: string, reviewType: 'single' | 'comparison' = 'single'): string {
  const tool = generateToolData(toolName);
  if (!tool) {
    return '';
  }
  
  if (reviewType === 'single') {
    return `# ${toolName} Review 2026: Is It Worth It?

## Overview

${tool.description}

**Overall Rating: ${tool.rating}/10**

## Pricing

${tool.pricing}

## Key Features

${tool.pros.map(pro => `- ${pro}`).join('\n')}

## Pros and Cons

### Pros
${tool.pros.map(pro => `✅ ${pro}`).join('\n')}

### Cons
${tool.cons.map(con => `❌ ${con}`).join('\n')}

## Who Should Use ${toolName}?

${tool.tags.includes('Coding') ? '- Software developers and engineers\n- Teams looking to improve productivity' : ''}
${tool.tags.includes('Writing') ? '- Content creators and marketers\n- Writers and bloggers' : ''}
${tool.tags.includes('Image') ? '- Designers and creative professionals\n- Marketing teams needing visual content' : ''}

## Final Verdict

${tool.rating >= 9 ? 'Highly recommended. One of the best AI tools available in 2026.' : ''}
${tool.rating >= 8 && tool.rating < 9 ? 'Strong choice with excellent capabilities. Worth considering for your workflow.' : ''}
${tool.rating < 8 ? 'Good tool but has some limitations. Consider alternatives based on your specific needs.' : ''}
`;
  }
  
  return '';
}

/**
 * 定期检查新评测文章的调度器
 * 可以在Next.js App Router中使用Route Handlers定时调用
 */
async function scheduleReviewFetch(): Promise<void> {
  console.log('Starting scheduled review fetch...');
  
  try {
    // 获取博主最新文章
    const bloggerReviews = await fetchBloggerReviews();
    
    console.log(`Found ${bloggerReviews.length} new reviews from bloggers`);
    
    // 这里可以保存到数据库
    // for (const review of bloggerReviews) {
    //   await db.review.create({ data: { ... } });
    // }
    
    return;
  } catch (error) {
    console.error('Scheduled review fetch failed:', error);
  }
}

/**
 * 辅助函数：休眠
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  fetchBloggerReviews,
  generateToolData,
  generateReviewContent,
  scheduleReviewFetch,
  isAIReviewArticle,
  extractToolName,
  extractAITags,
  REVIEW_TEMPLATES,
  TECH_BLOGGERS_RSS,
};

export type { AIToolReview, AIToolData };
