import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'
import {
  VIRAL_AI_SHORTS,
  displaySubtitle,
  displayTitle,
} from '@/lib/viral-ai-shorts'
import ViralShortPlayer from '@/components/ViralShortPlayer'

export const metadata = pageMetadata(
  '/ai-shorts',
  'Viral AI Short Films 2026 | YouTube & Bilibili + Tools Used',
  'Curated 2026 viral AI shorts. Watch on YouTube or Bilibili and see Seedance, Runway, Kling and other tools used.'
)

export default function AiShortsPage() {
  const sorted = [...VIRAL_AI_SHORTS].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
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
      </div>

      <div className="space-y-16">
        {sorted.map((short, index) => {
          const subtitle = displaySubtitle(short)
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
                    <ul className="space-y-2">
                      {short.tools.map((tool) => (
                        <li key={tool.name} className="flex items-start gap-2 text-sm">
                          {tool.slug ? (
                            <Link
                              href={`/tools/${tool.slug}`}
                              className="text-violet-400 hover:text-violet-300 font-medium shrink-0"
                            >
                              {tool.name}
                            </Link>
                          ) : (
                            <span className="text-white font-medium shrink-0">{tool.name}</span>
                          )}
                          {tool.role && (
                            <span className="text-gray-500">— {tool.role}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/reviews/runway-vs-pika-vs-kling-2026"
                      className="text-xs text-gray-500 hover:text-violet-400 transition-colors"
                    >
                      Runway vs Kling comparison →
                    </Link>
                    <Link
                      href="/category/ai-video"
                      className="text-xs text-gray-500 hover:text-violet-400 transition-colors"
                    >
                      More AI video tools →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <p className="text-xs text-gray-600 mt-12 leading-relaxed max-w-3xl">
        Videos belong to their creators and hosting platforms. Embeds are for convenience; contact
        us for takedown requests. Tool and viewership details cite public sources and may change —
        verify on the creator or platform page.
      </p>
    </div>
  )
}
