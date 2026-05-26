'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  VIRAL_AI_SHORTS,
  displaySubtitle,
  displayTitle,
  getFeaturedViralShort,
} from '@/lib/viral-ai-shorts'
import ViralShortPlayer from '@/components/ViralShortPlayer'

export default function ViralAiShortsSection({ compact = false }: { compact?: boolean }) {
  const featured = getFeaturedViralShort()
  const [activeId, setActiveId] = useState(featured.id)
  const active = VIRAL_AI_SHORTS.find((s) => s.id === activeId) ?? featured
  const list = compact ? VIRAL_AI_SHORTS.slice(0, 6) : VIRAL_AI_SHORTS
  const activeSubtitle = displaySubtitle(active)

  return (
    <section className="py-10 md:py-14 px-4 border-b border-white/[0.05]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-pink-400 text-xs font-semibold uppercase tracking-widest">
              Trending 2026
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Viral AI Short Films
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">
              Watch on YouTube or Bilibili — plus the AI tools behind each film. View counts are
              cited from public reports, not measured by us.
            </p>
          </div>
          <Link
            href="/ai-shorts"
            className="shrink-0 inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            View all {VIRAL_AI_SHORTS.length} films
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <ViralShortPlayer short={active} autoplay className="w-full" />
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white">{displayTitle(active)}</h3>
              {activeSubtitle && (
                <p className="text-sm text-gray-500 mt-0.5">{activeSubtitle}</p>
              )}
              <p className="text-sm text-violet-400/90 mt-1">{active.creator}</p>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-3">
                {active.description}
              </p>
              {active.viralNote && (
                <p className="text-xs text-amber-500/80 mt-2 leading-relaxed border-l-2 border-amber-500/30 pl-3">
                  {active.viralNote}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {list.map((item) => {
              const isActive = item.id === activeId
              const subtitle = displaySubtitle(item)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`text-left rounded-xl p-3 border transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-500/10 border-violet-500/40 ring-1 ring-violet-500/20'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-white leading-snug">
                      {displayTitle(item)}
                    </span>
                    {item.featured && (
                      <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/25">
                        HOT
                      </span>
                    )}
                  </div>
                  {subtitle && <p className="text-[11px] text-gray-600 mt-0.5">{subtitle}</p>}
                  <p className="text-xs text-gray-500 mt-1">{item.creator}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tools.slice(0, 2).map((t) => (
                      <span
                        key={t.name}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-500"
                      >
                        {t.name}
                      </span>
                    ))}
                    {item.duration && (
                      <span className="text-[10px] text-gray-600 ml-auto">{item.duration}</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
