/**
 * Monetization paths for the Viral AI Shorts hub — tool pages, comparisons, and guides.
 */

export type AiShortsGuide = {
  title: string
  description: string
  href: string
  badge: string
  icon: string
  external?: boolean
}

/** Primary CTAs shown on /ai-shorts and below the homepage player */
export const AI_SHORTS_GUIDES: AiShortsGuide[] = [
  {
    title: 'Best AI Video Tools for Shorts',
    description: 'Seedance, Runway, Kling, CapCut — stack guide tied to our viral films hub.',
    href: '/reviews/best-ai-video-tools-for-shorts-2026',
    badge: 'Guide',
    icon: '🎬',
  },
  {
    title: 'Seedance vs Runway vs Kling',
    description: 'Which video model fits cinematic AI shorts in 2026?',
    href: '/reviews/seedance-vs-runway-vs-kling-2026',
    badge: 'Compare',
    icon: '⚡',
  },
  {
    title: 'Runway vs Pika vs Kling',
    description: 'Side-by-side pricing, quality, and workflow — pick one video stack.',
    href: '/reviews/runway-vs-pika-vs-kling-2026',
    badge: 'Compare',
    icon: '🎬',
  },
  {
    title: 'Make Money with AI',
    description: 'Hub linking every monetization path — video, SEO, hosting, and more.',
    href: '/reviews/best-ai-tools-make-money-online-2026',
    badge: 'Hub',
    icon: '💰',
  },
  {
    title: 'Midjourney Review',
    description: 'Concept stills and keyframes before you generate video.',
    href: '/reviews/midjourney-review-2026',
    badge: 'Review',
    icon: '🖼️',
  },
  {
    title: 'AI Video Tools',
    description: 'Browse every video generator, editor, and avatar tool we track.',
    href: '/category/ai-video',
    badge: 'Browse',
    icon: '📂',
  },
]

/** Map tool names from viral shorts → internal pages or tracked paths */
export const AI_SHORTS_TOOL_LINKS: Record<
  string,
  { href: string; external?: boolean; label?: string }
> = {
  Midjourney: { href: '/tools/midjourney' },
  Runway: { href: '/tools/runway-ml' },
  'Kling AI': { href: '/tools/kling-ai' },
  'CapCut Pro': { href: '/tools/capcut-ai', label: 'CapCut AI' },
  'Seedance 2.0': { href: '/reviews/seedance-vs-runway-vs-kling-2026', label: 'Seedance vs Runway vs Kling' },
  'TopView AI': { href: '/category/ai-video', label: 'AI video category' },
  'Soul Cinema': { href: 'https://higgsfield.ai/soul-cinema', external: true },
  'Soul Cast': { href: 'https://higgsfield.ai', external: true },
  'Nano Banana Pro': { href: 'https://higgsfield.ai', external: true },
  Flux: { href: '/tools/flux-ai', label: 'Flux AI' },
}

export function resolveShortToolHref(tool: {
  name: string
  slug?: string
  href?: string
}): { href: string; external: boolean; label: string } | null {
  if (tool.href) {
    return { href: tool.href, external: true, label: tool.name }
  }
  if (tool.slug) {
    return { href: `/tools/${tool.slug}`, external: false, label: tool.name }
  }
  const mapped = AI_SHORTS_TOOL_LINKS[tool.name]
  if (mapped) {
    return {
      href: mapped.href,
      external: Boolean(mapped.external),
      label: mapped.label ?? tool.name,
    }
  }
  return null
}

/** Distinct tools across all shorts that resolve to a link (for the tool strip) */
export function getLinkedToolsFromShorts(
  tools: { name: string; slug?: string; href?: string }[][]
): { name: string; href: string; external: boolean }[] {
  const seen = new Set<string>()
  const result: { name: string; href: string; external: boolean }[] = []

  for (const list of tools) {
    for (const tool of list) {
      const resolved = resolveShortToolHref(tool)
      if (!resolved || seen.has(resolved.href)) continue
      seen.add(resolved.href)
      result.push({ name: resolved.label, href: resolved.href, external: resolved.external })
    }
  }
  return result
}
