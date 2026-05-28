import Link from 'next/link'
import { pageMetadata, buildFaqJsonLd, buildBreadcrumbJsonLd, JsonLd } from '@/lib/seo'
import {
  VIRAL_AI_SHORTS,
  displaySubtitle,
  displayTitle,
} from '@/lib/viral-ai-shorts'
import { getLinkedToolsFromShorts } from '@/lib/ai-shorts-monetization'
import { getPillarFaqs } from '@/lib/pillar-faqs'
import AiShortsMonetizationCta from '@/components/AiShortsMonetizationCta'
import PillarFaqSection from '@/components/PillarFaqSection'
import ToolStackCta from '@/components/ToolStackCta'
import { SHOW_TOOL_STACK_CTA } from '@/lib/site-features'
import ViralShortPlayer from '@/components/ViralShortPlayer'
import ViralShortToolsList from '@/components/ViralShortToolsList'

export const metadata = pageMetadata(
  '/ai-shorts',
  'Viral AI Short Films 2026 | YouTube & Bilibili + Tools Used',
  'Curated 2026 viral AI shorts. Watch on YouTube or Bilibili and see Seedance, Runway, Kling and other tools used.'
)

export default function AiShortsPage() {
  const sorted = [...VIRAL_AI_SHORTS].sort((a, b) => a.sortOrder - b.sortOrder)
  const toolLinks = getLinkedToolsFromShorts(sorted.map((s) => s.tools))
  const faqs = getPillarFaqs('ai-shorts')

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'AI Shorts', path: '/ai-shorts' },
    ]),
    ...(buildFaqJsonLd(faqs) ? [buildFaqJsonLd(faqs)!] : []),
  ]

  return (
    <>
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-10">
        <span className="text-pink-400 text-xs font-semibold uppercase tracking-widest">
          AI Short Films
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">
          Viral AI Short Films (2026)
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed">
          Each entry links to the original on YouTube or Bilibili, lists the creator, AI tools
          used, and cites public sources. We embed official players only — no self-hosted video.
          View counts come from press reports, not our analytics.
        </p>
        <Link
          href="/reviews/zombie-scavenger-hell-grind-ai-workflow-2026"
          className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-pink-400 hover:text-pink-300 transition-colors"
        >
          How Zombie Scavenger &amp; Hell Grind were made (workflow guide) →
        </Link>
      </div>

      {SHOW_TOOL_STACK_CTA && (
        <div className="mb-8">
          <ToolStackCta source="ai-shorts" />
        </div>
      )}

      <div className="mb-12">
        <AiShortsMonetizationCta toolLinks={toolLinks} />
      </div>

      <div className="space-y-16">
        {sorted.map((short, index) => {
          const subtitle = displaySubtitle(short)
          const showWorkflow =
            short.id === 'zombie-scavenger' || short.id === 'hell-grind' || short.id === 'zephyr'
          return (
            <article
              key={short.id}
              id={short.id}
              className="scroll-mt-24 border-b border-white/[0.06] pb-16 last:border-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ViralShortPlayer short={short} autoplay={index === 0} />

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {short.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25">
                        Viral 2026
                      </span>
                    )}
                    {short.duration && (
                      <span className="text-xs text-gray-500">{short.duration}</span>
                    )}
                    {short.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-white">{displayTitle(short)}</h2>
                  {subtitle && (
                    <p className="text-base text-gray-500 mt-0.5">{subtitle}</p>
                  )}
                  <p className="text-violet-400 text-sm mt-1">
                    {short.creator}
                    {short.creatorHandle && (
                      <span className="text-gray-600 ml-2">{short.creatorHandle}</span>
                    )}
                  </p>

                  <p className="text-gray-400 mt-4 leading-relaxed">{short.description}</p>

                  {short.viralNote && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                      <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                        Public reporting
                      </p>
                      <p className="text-sm text-amber-200/80 leading-relaxed">{short.viralNote}</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-white mb-3">Tools used</h3>
                    <ViralShortToolsList tools={short.tools} />
                  </div>

                  {short.galleryUrl && (
                    <div className="mt-4">
                      <a
                        href={short.galleryUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
                      >
                        Creator / studio page ↗
                      </a>
                    </div>
                  )}

                  <div className="mt-5 p-4 rounded-xl bg-violet-950/20 border border-violet-500/15">
                    <p className="text-xs font-semibold text-violet-300 uppercase tracking-wider mb-2">
                      Want to make something similar?
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {showWorkflow && (
                        <Link
                          href="/reviews/zombie-scavenger-hell-grind-ai-workflow-2026"
                          className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                        >
                          Workflow guide →
                        </Link>
                      )}
                      <Link
                        href="/reviews/seedance-vs-runway-vs-kling-2026"
                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Seedance vs Runway →
                      </Link>
                      <Link
                        href="/reviews/best-ai-video-tools-for-shorts-2026"
                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Video tool stack →
                      </Link>
                      <Link
                        href="/reviews/best-ai-tools-make-money-online-2026"
                        className="text-sm text-gray-500 hover:text-violet-400 transition-colors"
                      >
                        Monetize with AI →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-12">
        <AiShortsMonetizationCta toolLinks={toolLinks} />
      </div>

      <PillarFaqSection faqs={faqs} dark />

      <p className="text-xs text-gray-600 mt-8 leading-relaxed max-w-3xl">
        Videos belong to their creators and hosting platforms. Embeds are for convenience; contact
        us for takedown requests. Tool and viewership details cite public sources and may change —
        verify on the creator or platform page. Some tool links are affiliate links — see our{' '}
        <Link href="/about" className="text-gray-500 hover:text-violet-400 underline">
          disclosure
        </Link>
        .
      </p>
    </div>
    <JsonLd data={jsonLd} />
    </>
  )
}
