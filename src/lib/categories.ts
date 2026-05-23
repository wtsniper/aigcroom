export interface ToolCategory {
  slug: string
  name: string
  /** SEO title, e.g. "Best AI Writing Tools (2026)" */
  seoTitle: string
  description: string
  icon: string
  /** Raw `Tool.category` values grouped under this page */
  match: string[]
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    slug: 'ai-writing',
    name: 'AI Writing',
    seoTitle: 'Best AI Writing Tools',
    description:
      'Compare the best AI writing assistants for blogs, marketing copy, emails, and long-form content. Expert ratings and pricing.',
    icon: '✍️',
    match: ['AI Writing', 'AI Writing Tools', 'Writing'],
  },
  {
    slug: 'ai-image',
    name: 'AI Image',
    seoTitle: 'Best AI Image Generators',
    description:
      'Discover top AI image generators and editors for art, design, logos, and marketing visuals.',
    icon: '🎨',
    match: ['AI Image', 'AI Image Generation', 'Image Generation', 'Design'],
  },
  {
    slug: 'ai-video',
    name: 'AI Video',
    seoTitle: 'Best AI Video Tools',
    description:
      'Find AI video generators, editors, and avatar tools for content creators and marketers.',
    icon: '🎬',
    match: ['AI Video', 'AI Video Tools', 'Video Generation', 'Video'],
  },
  {
    slug: 'ai-coding',
    name: 'AI Coding',
    seoTitle: 'Best AI Coding Tools',
    description:
      'AI coding assistants, IDEs, and developer tools to ship software faster.',
    icon: '💻',
    match: ['Coding', 'AI Coding'],
  },
  {
    slug: 'ai-chat',
    name: 'AI Chat & Assistants',
    seoTitle: 'Best AI Chat Assistants',
    description:
      'ChatGPT alternatives and AI assistants for research, Q&A, and daily productivity.',
    icon: '💬',
    match: ['Chat Assistant', 'AI Chatbots', 'Search & Research', 'AI Search & Research'],
  },
  {
    slug: 'ai-audio',
    name: 'AI Audio & Voice',
    seoTitle: 'Best AI Audio & Voice Tools',
    description:
      'AI voice generators, text-to-speech, music, and podcast tools reviewed and compared.',
    icon: '🎵',
    match: ['AI Audio', 'AI Audio & Voice', 'Audio'],
  },
  {
    slug: 'ai-productivity',
    name: 'AI Productivity',
    seoTitle: 'Best AI Productivity Tools',
    description:
      'AI tools that automate workflows, notes, meetings, and team productivity.',
    icon: '⚡',
    match: ['AI Productivity', 'Productivity', 'Business'],
  },
  {
    slug: 'ai-marketing',
    name: 'AI Marketing',
    seoTitle: 'Best AI Marketing Tools',
    description:
      'AI tools for ads, SEO, social media, and growth marketing campaigns.',
    icon: '📣',
    match: ['Marketing'],
  },
]

const bySlug = new Map(TOOL_CATEGORIES.map((c) => [c.slug, c]))

const byDbCategory = new Map<string, ToolCategory>()
for (const cat of TOOL_CATEGORIES) {
  for (const name of cat.match) {
    byDbCategory.set(name, cat)
  }
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return bySlug.get(slug)
}

export function getCategoryForDbValue(dbCategory: string): ToolCategory | undefined {
  return byDbCategory.get(dbCategory)
}

export function categorySlugForDbValue(dbCategory: string): string | undefined {
  return getCategoryForDbValue(dbCategory)?.slug
}

export function allCategorySlugs(): string[] {
  return TOOL_CATEGORIES.map((c) => c.slug)
}

export interface CategoryWithCount {
  slug: string
  name: string
  icon: string
  count: number
  description: string
}

export function buildCategoriesWithCounts(tools: { category: string }[]): CategoryWithCount[] {
  const counts = new Map<string, number>()
  for (const cat of TOOL_CATEGORIES) counts.set(cat.slug, 0)
  for (const tool of tools) {
    const canonical = getCategoryForDbValue(tool.category)
    if (canonical) counts.set(canonical.slug, (counts.get(canonical.slug) || 0) + 1)
  }
  return TOOL_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    icon: cat.icon,
    count: counts.get(cat.slug) || 0,
    description: cat.description,
  })).filter((c) => c.count > 0)
}
