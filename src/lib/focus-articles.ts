/**
 * Five articles we actively promote for SEO + affiliate revenue (30-day focus).
 * Used for internal linking hubs — not every published review.
 */
export const FOCUS_ARTICLE_SLUGS = [
  'best-ai-books-2026',
  'semrush-vs-ahrefs-seo-tools-2026',
  'best-web-hosting-for-ai-projects-2026',
  'amazon-listing-main-image-rejected-2026',
  'best-ai-tools-make-money-online-2026',
] as const

export type FocusArticleSlug = (typeof FOCUS_ARTICLE_SLUGS)[number]

export const FOCUS_ARTICLE_META: Record<
  FocusArticleSlug,
  { why: string; targetKeyword: string; monetization: string }
> = {
  'best-ai-books-2026': {
    why: 'Amazon Associates — lowest friction, homepage pinned',
    targetKeyword: 'best ai books 2026',
    monetization: 'Amazon book commissions',
  },
  'semrush-vs-ahrefs-seo-tools-2026': {
    why: 'High-ticket SaaS affiliate + matches our business model',
    targetKeyword: 'semrush vs ahrefs 2026',
    monetization: 'Semrush trial / paid referral',
  },
  'best-web-hosting-for-ai-projects-2026': {
    why: 'Commercial intent — readers ready to spend',
    targetKeyword: 'best web hosting for ai projects',
    monetization: 'Hostinger affiliate',
  },
  'amazon-listing-main-image-rejected-2026': {
    why: 'Long-tail niche, less competition than generic AI comparisons',
    targetKeyword: 'amazon main image rejected',
    monetization: 'Jasper + Hostinger + PixSell funnel',
  },
  'best-ai-tools-make-money-online-2026': {
    why: 'Hub page — links to all money paths',
    targetKeyword: 'best ai tools make money online',
    monetization: 'Multi-affiliate hub',
  },
}
