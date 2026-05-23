/**
 * Curated affiliate / monetization links for sitewide CTAs.
 * Update URLs in Admin → Affiliate when CJ approvals arrive.
 */
export const MONETIZATION_PICKS = [
  {
    title: 'Best AI Books 2026',
    description: '5 must-read titles with Amazon links — our top traffic driver.',
    href: '/reviews/best-ai-books-2026',
    badge: 'Amazon',
    icon: '📚',
  },
  {
    title: 'AI Tools to Make Money',
    description: 'Side hustles, freelancing & affiliate stacks that actually pay.',
    href: '/reviews/best-ai-tools-make-money-online-2026',
    badge: 'Guide',
    icon: '💰',
  },
  {
    title: 'Speak AI',
    description: 'Transcribe meetings & sell insights — our #1 SaaS pick.',
    href: '/tools/speak-ai',
    badge: 'Partner',
    icon: '🎙️',
  },
  {
    title: 'Semrush Free Trial',
    description: 'Find keywords that rank and drive affiliate clicks.',
    href: '/api/affiliate/track/semrush-deal',
    badge: 'SEO',
    icon: '📈',
    external: true,
  },
  {
    title: 'Hostinger',
    description: 'Launch your AI site for ~$3/mo — start earning faster.',
    href: '/api/affiliate/track/hostinger-deal',
    badge: 'Hosting',
    icon: '🚀',
    external: true,
  },
] as const
