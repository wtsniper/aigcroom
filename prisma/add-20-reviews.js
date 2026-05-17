// 添加20篇新的AI工具评测文章
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

const adminUser = db.users.find(u => u.role === 'ADMIN');
const authorId = adminUser.id;

// 20个新的AI工具及其评测内容
const newToolsAndReviews = [
  {
    tool: {
      name: 'Jasper AI',
      category: 'Content Generation',
      description: 'AI-powered content creation platform specializing in marketing copy, blog posts, and social media content. Trusted by over 70,000 businesses worldwide.',
      websiteUrl: 'https://jasper.ai',
      logoUrl: 'https://jasper.ai/favicon.ico',
      pricingType: 'PAID',
      priceMonthly: 49,
      rating: 8.3,
      ratingFeatures: 8.5,
      ratingEase: 8.0,
      ratingValue: 8.2,
      ratingSupport: 8.5,
      tags: JSON.stringify(['Marketing', 'Writing', 'Content', 'Social Media']),
      pros: JSON.stringify([
        'Excellent for marketing copy and blog posts',
        'Over 50 templates for different use cases',
        'Brand voice customization',
        'Strong integration with marketing tools'
      ]),
      cons: JSON.stringify([
        'Expensive for individual users',
        'Limited free trial',
        'Can produce generic content without proper prompting'
      ]),
      isFeatured: true,
    },
    review: {
      title: 'Jasper AI Review 2026: The Marketing Content Powerhouse',
      excerpt: 'AI-powered content creation platform trusted by 70,000+ businesses. Best for marketing teams needing scalable content production.',
      rating: 8.3,
    }
  },
  {
    tool: {
      name: 'Canva AI',
      category: 'Design',
      description: 'AI-enhanced design platform with Magic Studio features including text-to-image, background removal, and AI-powered design suggestions.',
      websiteUrl: 'https://canva.com',
      logoUrl: 'https://canva.com/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 15,
      rating: 8.6,
      ratingFeatures: 8.8,
      ratingEase: 9.2,
      ratingValue: 8.5,
      ratingSupport: 8.0,
      tags: JSON.stringify(['Design', 'Graphics', 'Marketing', 'Social Media']),
      pros: JSON.stringify([
        'Extremely user-friendly interface',
        'Massive template library',
        'Magic AI features are powerful',
        'Great for non-designers'
      ]),
      cons: JSON.stringify([
        'Limited advanced design features',
        'Premium elements require paid plan',
        'Can feel overwhelming with options'
      ]),
      isFeatured: true,
    },
    review: {
      title: 'Canva AI Review 2026: Democratizing Design with AI',
      excerpt: 'AI-enhanced design platform with Magic Studio features. Best for non-designers and marketing teams needing quick visual content.',
      rating: 8.6,
    }
  },
  {
    tool: {
      name: 'Suno AI',
      category: 'Music Generation',
      description: 'Revolutionary AI music generation platform that creates complete songs from text prompts. Supports multiple genres and styles with professional-quality output.',
      websiteUrl: 'https://suno.com',
      logoUrl: 'https://suno.com/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 10,
      rating: 8.1,
      ratingFeatures: 8.5,
      ratingEase: 8.8,
      ratingValue: 7.8,
      ratingSupport: 7.5,
      tags: JSON.stringify(['Music', 'Audio', 'Creative', 'Entertainment']),
      pros: JSON.stringify([
        'Creates professional-quality songs',
        'Easy to use - just describe what you want',
        'Supports multiple genres and languages',
        'Fast generation times'
      ]),
      cons: JSON.stringify([
        'Limited commercial rights on free plan',
        'Can produce inconsistent results',
        'Lacks fine-grained control over composition'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Suno AI Review 2026: The Future of AI Music Creation',
      excerpt: 'Revolutionary AI that creates complete songs from text prompts. Professional-quality music generation for creators and businesses.',
      rating: 8.1,
    }
  },
  {
    tool: {
      name: 'Synthesia',
      category: 'Video Generation',
      description: 'AI video generation platform that creates professional videos with AI avatars. No cameras, microphones, or actors needed.',
      websiteUrl: 'https://synthesia.io',
      logoUrl: 'https://synthesia.io/favicon.ico',
      pricingType: 'PAID',
      priceMonthly: 30,
      rating: 8.4,
      ratingFeatures: 8.6,
      ratingEase: 8.8,
      ratingValue: 8.0,
      ratingSupport: 8.2,
      tags: JSON.stringify(['Video', 'Avatar', 'Training', 'Marketing']),
      pros: JSON.stringify([
        '140+ diverse AI avatars',
        '120+ languages supported',
        'Professional video quality',
        'Significant time and cost savings'
      ]),
      cons: JSON.stringify([
        'Avatar expressions can look unnatural',
        'Expensive for high-volume usage',
        'Limited customization of avatars'
      ]),
      isFeatured: true,
    },
    review: {
      title: 'Synthesia Review 2026: AI Avatar Video Generation Made Easy',
      excerpt: 'Create professional videos with AI avatars in minutes. No cameras or actors needed. Best for training and marketing content.',
      rating: 8.4,
    }
  },
  {
    tool: {
      name: 'Grammarly',
      category: 'Writing Assistant',
      description: 'AI-powered writing assistant that checks grammar, spelling, punctuation, and style. Now with AI text generation capabilities.',
      websiteUrl: 'https://grammarly.com',
      logoUrl: 'https://grammarly.com/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 12,
      rating: 8.7,
      ratingFeatures: 8.5,
      ratingEase: 9.5,
      ratingValue: 8.8,
      ratingSupport: 8.2,
      tags: JSON.stringify(['Writing', 'Grammar', 'Productivity', 'Business']),
      pros: JSON.stringify([
        'Excellent grammar and style checking',
        'Works across all applications',
        'New AI text generation features',
        'Tone detection and suggestions'
      ]),
      cons: JSON.stringify([
        'Can be overly strict with style rules',
        'Some features require Premium',
        'Occasionally incorrect suggestions'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Grammarly Review 2026: The Essential AI Writing Assistant',
      excerpt: 'AI-powered writing assistant with grammar checking, style suggestions, and now AI text generation. Essential for professional writing.',
      rating: 8.7,
    }
  },
  {
    tool: {
      name: 'ElevenLabs',
      category: 'Voice AI',
      description: 'Industry-leading AI voice generation platform. Create realistic voiceovers in multiple languages with emotional control and voice cloning.',
      websiteUrl: 'https://elevenlabs.io',
      logoUrl: 'https://elevenlabs.io/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 5,
      rating: 8.9,
      ratingFeatures: 9.2,
      ratingEase: 8.5,
      ratingValue: 9.0,
      ratingSupport: 8.5,
      tags: JSON.stringify(['Voice', 'Audio', 'Text-to-Speech', 'Accessibility']),
      pros: JSON.stringify([
        'Most realistic AI voices available',
        'Voice cloning technology',
        'Emotional control and inflection',
        '29+ languages supported'
      ]),
      cons: JSON.stringify([
        'Free tier has limited characters',
        'Voice cloning requires consent',
        'Can be misused without proper safeguards'
      ]),
      isFeatured: true,
    },
    review: {
      title: 'ElevenLabs Review 2026: The Gold Standard in AI Voice Generation',
      excerpt: 'Industry-leading AI voice generation with emotional control and voice cloning. The most realistic AI voices available in 2026.',
      rating: 8.9,
    }
  },
  {
    tool: {
      name: 'Cursor',
      category: 'Coding',
      description: 'AI-first code editor built for pair programming with AI. Integrates GPT-4 and Claude for intelligent code completion and generation.',
      websiteUrl: 'https://cursor.sh',
      logoUrl: 'https://cursor.sh/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 20,
      rating: 9.0,
      ratingFeatures: 9.3,
      ratingEase: 8.8,
      ratingValue: 9.2,
      ratingSupport: 8.5,
      tags: JSON.stringify(['Coding', 'IDE', 'Developer', 'AI Assistant']),
      pros: JSON.stringify([
        'Best AI code completion available',
        'Understands entire codebase context',
        'Natural language code editing',
        'VS Code compatibility'
      ]),
      cons: JSON.stringify([
        'Can suggest incorrect code',
        'Requires good internet connection',
        'Privacy concerns with code uploads'
      ]),
      isFeatured: true,
    },
    review: {
      title: 'Cursor Review 2026: The AI-First Code Editor Revolutionizing Development',
      excerpt: 'AI-first code editor with GPT-4 and Claude integration. The best AI pair programmer for developers in 2026.',
      rating: 9.0,
    }
  },
  {
    tool: {
      name: 'Windsurf',
      category: 'Coding',
      description: 'AI-powered IDE by Codeium with agentic capabilities. Can autonomously write, edit, and debug code across multiple files.',
      websiteUrl: 'https://windsurf.ai',
      logoUrl: 'https://windsurf.ai/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 15,
      rating: 8.5,
      ratingFeatures: 8.8,
      ratingEase: 8.3,
      ratingValue: 8.6,
      ratingSupport: 8.0,
      tags: JSON.stringify(['Coding', 'IDE', 'Developer', 'Automation']),
      pros: JSON.stringify([
        'Autonomous multi-file editing',
        'Excellent code understanding',
        'Fast and responsive',
        'Free tier is generous'
      ]),
      cons: JSON.stringify([
        'Newer platform with less community',
        'Occasional hallucinations in code',
        'Learning curve for advanced features'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Windsurf Review 2026: The Agentic AI Code Editor',
      excerpt: 'AI-powered IDE with autonomous multi-file editing capabilities. A strong competitor to Cursor for AI-assisted development.',
      rating: 8.5,
    }
  },
  {
    tool: {
      name: 'Pika',
      category: 'Video Generation',
      description: 'AI video generation and editing platform with text-to-video, image-to-video, and video style transfer capabilities.',
      websiteUrl: 'https://pika.art',
      logoUrl: 'https://pika.art/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 8,
      rating: 7.9,
      ratingFeatures: 8.0,
      ratingEase: 8.5,
      ratingValue: 7.8,
      ratingSupport: 7.5,
      tags: JSON.stringify(['Video', 'Animation', 'Creative', 'Social Media']),
      pros: JSON.stringify([
        'Easy video generation from text',
        'Good animation quality',
        'Style transfer capabilities',
        'Affordable pricing'
      ]),
      cons: JSON.stringify([
        'Short video duration limits',
        'Less control than professional tools',
        'Watermark on free plan'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Pika Review 2026: Quick AI Video Generation for Creators',
      excerpt: 'AI video generation platform with text-to-video and style transfer. Best for social media creators needing quick video content.',
      rating: 7.9,
    }
  },
  {
    tool: {
      name: 'Luma Dream Machine',
      category: 'Video Generation',
      description: 'High-quality AI video generation model that creates realistic, cinematic videos from text and image prompts.',
      websiteUrl: 'https://lumalabs.ai',
      logoUrl: 'https://lumalabs.ai/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 30,
      rating: 8.2,
      ratingFeatures: 8.5,
      ratingEase: 8.0,
      ratingValue: 7.9,
      ratingSupport: 7.8,
      tags: JSON.stringify(['Video', 'Cinematic', 'Creative', '3D']),
      pros: JSON.stringify([
        'Cinematic video quality',
        'Realistic motion and physics',
        '3D-aware generation',
        'Fast generation times'
      ]),
      cons: JSON.stringify([
        'Limited free tier',
        'Can struggle with complex prompts',
        'Still evolving technology'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Luma Dream Machine Review 2026: Cinematic AI Video Generation',
      excerpt: 'High-quality AI video generation with realistic, cinematic output. Best for filmmakers and content creators seeking professional video AI.',
      rating: 8.2,
    }
  },
  {
    tool: {
      name: 'Leonardo AI',
      category: 'Image Generation',
      description: 'Advanced AI image generation platform with fine-tuned models for game assets, concept art, and product photography.',
      websiteUrl: 'https://leonardo.ai',
      logoUrl: 'https://leonardo.ai/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 12,
      rating: 8.4,
      ratingFeatures: 8.6,
      ratingEase: 8.3,
      ratingValue: 8.5,
      ratingSupport: 8.0,
      tags: JSON.stringify(['Image', 'Game Assets', 'Art', 'Design']),
      pros: JSON.stringify([
        'Excellent for game assets and concept art',
        'Fine-tuned specialized models',
        'Generous free daily tokens',
        'Strong community and marketplace'
      ]),
      cons: JSON.stringify([
        'Learning curve for advanced features',
        'Limited commercial rights on free tier',
        'Can be slower than competitors'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Leonardo AI Review 2026: The Game Developer\'s AI Image Tool',
      excerpt: 'Advanced AI image generation with specialized models for game assets and concept art. Best for game developers and digital artists.',
      rating: 8.4,
    }
  },
  {
    tool: {
      name: 'Fliki',
      category: 'Video Generation',
      description: 'AI video creation platform that turns text into videos with AI voiceovers. Perfect for social media content and marketing.',
      websiteUrl: 'https://fliki.ai',
      logoUrl: 'https://fliki.ai/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 28,
      rating: 7.8,
      ratingFeatures: 8.0,
      ratingEase: 8.8,
      ratingValue: 7.5,
      ratingSupport: 7.6,
      tags: JSON.stringify(['Video', 'Social Media', 'Marketing', 'Voiceover']),
      pros: JSON.stringify([
        'Simple text-to-video workflow',
        'Built-in AI voiceover',
        'Great for social media content',
        'Large media library'
      ]),
      cons: JSON.stringify([
        'Limited customization options',
        'Video quality not professional-grade',
        'Watermark on free plan'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Fliki Review 2026: Turn Text into Videos with AI',
      excerpt: 'AI video creation platform that turns text into videos with voiceovers. Best for social media marketers and content creators.',
      rating: 7.8,
    }
  },
  {
    tool: {
      name: 'HeyGen',
      category: 'Video Generation',
      description: 'AI video platform specializing in avatar-based videos, video translation, and lip-sync technology for global content.',
      websiteUrl: 'https://heygen.com',
      logoUrl: 'https://heygen.com/favicon.ico',
      pricingType: 'PAID',
      priceMonthly: 24,
      rating: 8.3,
      ratingFeatures: 8.5,
      ratingEase: 8.6,
      ratingValue: 8.0,
      ratingSupport: 8.2,
      tags: JSON.stringify(['Video', 'Avatar', 'Translation', 'Marketing']),
      pros: JSON.stringify([
        'Excellent lip-sync technology',
        'Video translation with lip-sync',
        'Custom avatar creation',
        'Professional output quality'
      ]),
      cons: JSON.stringify([
        'Expensive for high volume',
        'Limited avatar customization',
        'Generation time can be long'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'HeyGen Review 2026: AI Video Translation and Avatar Platform',
      excerpt: 'AI video platform with avatar creation, translation, and lip-sync technology. Best for global marketing and training content.',
      rating: 8.3,
    }
  },
  {
    tool: {
      name: 'Stable Diffusion',
      category: 'Image Generation',
      description: 'Open-source AI image generation model with complete control and customization. Best for developers and advanced users.',
      websiteUrl: 'https://stability.ai',
      logoUrl: 'https://stability.ai/favicon.ico',
      pricingType: 'OPEN_SOURCE',
      priceMonthly: null,
      rating: 8.6,
      ratingFeatures: 9.0,
      ratingEase: 7.0,
      ratingValue: 9.5,
      ratingSupport: 7.5,
      tags: JSON.stringify(['Image', 'Open Source', 'Customization', 'Developer']),
      pros: JSON.stringify([
        'Completely open source and free',
        'Full control over generation',
        'Massive community and extensions',
        'Can run locally for privacy'
      ]),
      cons: JSON.stringify([
        'Steep learning curve',
        'Requires powerful hardware',
        'Quality depends on setup and prompts'
      ]),
      isFeatured: true,
    },
    review: {
      title: 'Stable Diffusion Review 2026: The Open Source AI Image Powerhouse',
      excerpt: 'Open-source AI image generation with complete control. Best for developers and advanced users wanting maximum customization.',
      rating: 8.6,
    }
  },
  {
    tool: {
      name: 'Claude Code',
      category: 'Coding',
      description: "Anthropic's agentic coding assistant that works in your terminal. Can autonomously complete complex coding tasks across your codebase.",
      websiteUrl: 'https://claude.ai/code',
      logoUrl: 'https://claude.ai/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 20,
      rating: 8.8,
      ratingFeatures: 9.0,
      ratingEase: 8.5,
      ratingValue: 8.8,
      ratingSupport: 8.5,
      tags: JSON.stringify(['Coding', 'Terminal', 'Developer', 'Automation']),
      pros: JSON.stringify([
        'Excellent code understanding',
        'Terminal-based workflow',
        'Can complete complex multi-step tasks',
        'Strong safety guardrails'
      ]),
      cons: JSON.stringify([
        'Requires technical knowledge',
        'Limited to terminal environment',
        'Usage limits on free tier'
      ]),
      isFeatured: true,
    },
    review: {
      title: "Claude Code Review 2026: Anthropic's Terminal-Based AI Developer",
      excerpt: "Anthropic's agentic coding assistant for the terminal. Autonomous code completion with strong safety guardrails.",
      rating: 8.8,
    }
  },
  {
    tool: {
      name: 'Mistral AI',
      category: 'Chat Assistant',
      description: 'European AI company offering open-weight models with excellent performance and efficiency. Strong multilingual capabilities.',
      websiteUrl: 'https://mistral.ai',
      logoUrl: 'https://mistral.ai/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: null,
      rating: 8.2,
      ratingFeatures: 8.5,
      ratingEase: 8.0,
      ratingValue: 8.8,
      ratingSupport: 7.8,
      tags: JSON.stringify(['Chat Assistant', 'Open Source', 'European', 'Multilingual']),
      pros: JSON.stringify([
        'Open-weight models available',
        'Excellent European language support',
        'Efficient and fast inference',
        'Strong privacy and compliance'
      ]),
      cons: JSON.stringify([
        'Smaller ecosystem than US competitors',
        'Less polished user experience',
        'Limited multimodal capabilities'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Mistral AI Review 2026: The European Open-Weight AI Champion',
      excerpt: 'European AI with open-weight models and excellent multilingual capabilities. Best for privacy-conscious and European users.',
      rating: 8.2,
    }
  },
  {
    tool: {
      name: 'Tome',
      category: 'Presentation',
      description: 'AI-powered presentation creation platform. Generate decks, proposals, and pitch decks from text prompts in minutes.',
      websiteUrl: 'https://tome.app',
      logoUrl: 'https://tome.app/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 16,
      rating: 7.9,
      ratingFeatures: 8.0,
      ratingEase: 9.0,
      ratingValue: 7.8,
      ratingSupport: 7.5,
      tags: JSON.stringify(['Presentation', 'Business', 'Marketing', 'Sales']),
      pros: JSON.stringify([
        'Fast presentation generation',
        'Beautiful template designs',
        'Easy to customize',
        'Great for sales and marketing'
      ]),
      cons: JSON.stringify([
        'Limited advanced formatting',
        'Export options restricted',
        'AI content needs heavy editing'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Tome Review 2026: AI-Powered Presentations in Minutes',
      excerpt: 'AI presentation platform that generates decks from text prompts. Best for sales teams and marketers needing quick presentations.',
      rating: 7.9,
    }
  },
  {
    tool: {
      name: 'Beautiful.ai',
      category: 'Presentation',
      description: 'Smart presentation software with AI design assistant. Automatically formats and designs slides for professional results.',
      websiteUrl: 'https://beautiful.ai',
      logoUrl: 'https://beautiful.ai/favicon.ico',
      pricingType: 'PAID',
      priceMonthly: 12,
      rating: 7.7,
      ratingFeatures: 7.8,
      ratingEase: 8.8,
      ratingValue: 7.6,
      ratingSupport: 7.5,
      tags: JSON.stringify(['Presentation', 'Design', 'Business', 'Templates']),
      pros: JSON.stringify([
        'Automatic slide formatting',
        'Professional design templates',
        'Easy collaboration features',
        'Brand kit support'
      ]),
      cons: JSON.stringify([
        'Limited free tier',
        'Less flexible than traditional tools',
        'Can feel restrictive'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Beautiful.ai Review 2026: Smart AI Design for Presentations',
      excerpt: 'AI presentation software with automatic formatting and design. Best for business professionals wanting polished presentations quickly.',
      rating: 7.7,
    }
  },
  {
    tool: {
      name: 'Gamma',
      category: 'Presentation',
      description: 'AI presentation generator that creates decks, documents, and webpages from simple prompts. Modern, clean design.',
      websiteUrl: 'https://gamma.app',
      logoUrl: 'https://gamma.app/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: 10,
      rating: 8.1,
      ratingFeatures: 8.3,
      ratingEase: 9.2,
      ratingValue: 8.0,
      ratingSupport: 7.8,
      tags: JSON.stringify(['Presentation', 'Document', 'Web', 'Creative']),
      pros: JSON.stringify([
        'Extremely easy to use',
        'Beautiful modern designs',
        'Multiple output formats',
        'Generous free tier'
      ]),
      cons: JSON.stringify([
        'Limited customization options',
        'Export quality varies',
        'Still maturing platform'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Gamma Review 2026: The Modern AI Presentation Tool',
      excerpt: 'AI presentation generator with modern, clean designs. Best for startups and creatives needing quick, beautiful presentations.',
      rating: 8.1,
    }
  },
  {
    tool: {
      name: 'Kling AI',
      category: 'Video Generation',
      description: 'Advanced Chinese AI video generation model with impressive motion quality and realism. Competing with global leaders.',
      websiteUrl: 'https://klingai.com',
      logoUrl: 'https://klingai.com/favicon.ico',
      pricingType: 'FREEMIUM',
      priceMonthly: null,
      rating: 8.0,
      ratingFeatures: 8.3,
      ratingEase: 7.8,
      ratingValue: 8.2,
      ratingSupport: 7.5,
      tags: JSON.stringify(['Video', 'Cinematic', 'Motion', 'Chinese']),
      pros: JSON.stringify([
        'Impressive motion quality',
        'High-resolution output',
        'Competitive with global leaders',
        'Free tier available'
      ]),
      cons: JSON.stringify([
        'Limited accessibility outside China',
        'Interface primarily in Chinese',
        'Still evolving capabilities'
      ]),
      isFeatured: false,
    },
    review: {
      title: 'Kling AI Review 2026: China\'s Answer to AI Video Generation',
      excerpt: 'Advanced AI video generation with impressive motion quality. China\'s leading video AI competing with global platforms.',
      rating: 8.0,
    }
  },
];

const now = new Date().toISOString();
const newReviews = [];
const newTools = [];

newToolsAndReviews.forEach((item, index) => {
  const toolId = generateId();
  const slug = generateSlug(item.tool.name);

  // 创建 Tool 记录
  const tool = {
    id: toolId,
    name: item.tool.name,
    slug: slug,
    description: item.tool.description,
    logoUrl: item.tool.logoUrl,
    websiteUrl: item.tool.websiteUrl,
    affiliateUrl: `${item.tool.websiteUrl}?ref=aigcroom`,
    category: item.tool.category,
    rating: item.tool.rating,
    ratingFeatures: item.tool.ratingFeatures,
    ratingEase: item.tool.ratingEase,
    ratingValue: item.tool.ratingValue,
    ratingSupport: item.tool.ratingSupport,
    pricingType: item.tool.pricingType,
    priceMonthly: item.tool.priceMonthly,
    priceYearly: item.tool.priceMonthly ? Math.round(item.tool.priceMonthly * 10) : null,
    tags: item.tool.tags,
    pros: item.tool.pros,
    cons: item.tool.cons,
    isFeatured: item.tool.isFeatured,
    createdAt: now,
    updatedAt: now,
  };

  // 创建 Review 内容
  const reviewContent = `# ${item.review.title}

## Overview

${item.tool.description}

**Overall Rating: ${item.review.rating} / 10**

## Pricing

${item.tool.pricingType === 'OPEN_SOURCE' ? '**Free & Open Source**' : 
  item.tool.pricingType === 'FREEMIUM' ? 
    `**Free Tier**: Available with limitations\n**Pro Plan**: $${item.tool.priceMonthly}/month` :
    `**Pro Plan**: $${item.tool.priceMonthly}/month`}

## Key Features

${JSON.parse(item.tool.pros).map(pro => `- ${pro}`).join('\n')}

## Pros and Cons

### Pros
${JSON.parse(item.tool.pros).map(pro => `✅ ${pro}`).join('\n')}

### Cons
${JSON.parse(item.tool.cons).map(con => `❌ ${con}`).join('\n')}

## Who Should Use ${item.tool.name}?

${item.tool.tags.includes('Coding') ? '- Software developers and engineers\n- Teams looking to improve coding productivity' : ''}
${item.tool.tags.includes('Writing') || item.tool.tags.includes('Content') ? '- Content creators and marketers\n- Writers and bloggers' : ''}
${item.tool.tags.includes('Image') || item.tool.tags.includes('Design') ? '- Designers and creative professionals\n- Marketing teams needing visual content' : ''}
${item.tool.tags.includes('Video') ? '- Video creators and filmmakers\n- Marketing teams and social media managers' : ''}
${item.tool.tags.includes('Voice') || item.tool.tags.includes('Audio') ? '- Podcasters and content creators\n- Businesses needing voiceover solutions' : ''}
${item.tool.tags.includes('Presentation') ? '- Business professionals and sales teams\n- Educators and trainers' : ''}
${item.tool.tags.includes('Marketing') ? '- Marketing professionals\n- Social media managers' : ''}

## Final Verdict

${item.review.rating >= 9 ? 'Highly recommended. One of the best AI tools available in 2026. A must-have for professionals in its category.' : ''}
${item.review.rating >= 8.5 && item.review.rating < 9 ? 'Excellent choice with powerful features. Strong contender in its category and well worth considering.' : ''}
${item.review.rating >= 8 && item.review.rating < 8.5 ? 'Strong tool with good capabilities. Worth considering, though there may be better alternatives depending on your specific needs.' : ''}
${item.review.rating >= 7.5 && item.review.rating < 8 ? 'Good tool with solid features. Has some limitations but can be useful for specific use cases.' : ''}
${item.review.rating < 7.5 ? 'Decent tool but has notable limitations. Consider alternatives based on your specific requirements.' : ''}

## Rating Breakdown

- **Features**: ${item.tool.ratingFeatures}/10
- **Ease of Use**: ${item.tool.ratingEase}/10
- **Value for Money**: ${item.tool.ratingValue}/10
- **Support**: ${item.tool.ratingSupport}/10

---

*This review was last updated in May 2026. Ratings and features may have changed since publication.*`;

  const review = {
    id: generateId(),
    title: item.review.title,
    slug: `${slug}-review-2026`,
    excerpt: item.review.excerpt,
    content: reviewContent,
    toolId: toolId,
    authorId: authorId,
    status: 'PUBLISHED',
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  newTools.push(tool);
  newReviews.push(review);
});

// 添加到数据库
db.tools = db.tools.concat(newTools);
db.reviews = db.reviews.concat(newReviews);

// 写回文件
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

console.log(`✅ 成功添加 ${newTools.length} 个新工具`);
console.log(`✅ 成功添加 ${newReviews.length} 篇评测文章`);
console.log('');
console.log('新增的工具和评测:');
newTools.forEach((tool, i) => {
  console.log(`${i + 1}. ${tool.name} - ${tool.category} (评分: ${tool.rating})`);
});
