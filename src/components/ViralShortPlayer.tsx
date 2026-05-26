'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { ViralAiShort } from '@/lib/viral-ai-shorts'
import {
  bilibiliEmbedUrl,
  bilibiliWatchUrl,
  defaultPlatformForShort,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from '@/lib/viral-ai-shorts'

export type VideoPlatform = 'youtube' | 'bilibili'

type ViralShortPlayerProps = {
  short: ViralAiShort
  autoplay?: boolean
  className?: string
  onPlatformChange?: (platform: VideoPlatform) => void
}

function buildEmbedSrc(
  short: ViralAiShort,
  platform: VideoPlatform,
  opts: { autoplay: boolean; muted: boolean; origin?: string }
): string | null {
  if (platform === 'youtube' && short.youtubeVideoId) {
    return `${youtubeEmbedUrl(short.youtubeVideoId, {
      autoplay: opts.autoplay,
      mute: opts.muted || opts.autoplay,
      origin: opts.origin,
    })}&enablejsapi=1`
  }
  if (short.bilibiliBvid) {
    return bilibiliEmbedUrl(short.bilibiliBvid, {
      autoplay: opts.autoplay,
      muted: opts.muted || opts.autoplay,
    })
  }
  return null
}

export default function ViralShortPlayer({
  short,
  autoplay = false,
  className = '',
  onPlatformChange,
}: ViralShortPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [muted, setMuted] = useState(true)
  const [origin, setOrigin] = useState<string>()
  const [platform, setPlatform] = useState<VideoPlatform>(() => defaultPlatformForShort(short))
  const [session, setSession] = useState(0)

  const canYouTube = Boolean(short.youtubeVideoId)
  const canBilibili = Boolean(short.bilibiliBvid)
  const wantAutoplay = autoplay && inView
  const showIframe = !autoplay || inView

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setPlatform(defaultPlatformForShort(short))
    setMuted(true)
    setSession((s) => s + 1)
  }, [short.id])

  const wasInView = useRef(false)
  useEffect(() => {
    if (autoplay && inView && !wasInView.current) {
      setSession((s) => s + 1)
    }
    wasInView.current = inView
  }, [autoplay, inView])

  const setPlatformAndNotify = (p: VideoPlatform) => {
    setPlatform(p)
    setSession((s) => s + 1)
    onPlatformChange?.(p)
  }

  const embedSrc = showIframe
    ? buildEmbedSrc(short, platform, {
        autoplay: wantAutoplay,
        muted,
        origin,
      })
    : null

  return (
    <div ref={containerRef} className={className}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
        {embedSrc ? (
          <iframe
            key={`${short.id}-${platform}-${session}-${muted ? 'm' : 'u'}`}
            src={embedSrc}
            title={short.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-950 text-gray-500">
            <span className="w-8 h-8 rounded-full border-2 border-violet-500/40 border-t-violet-400 animate-spin" />
            <span className="text-xs">Loading player…</span>
          </div>
        )}

        {showIframe && (canYouTube || canBilibili) && (
          <button
            type="button"
            onClick={() => {
              setMuted((m) => !m)
              setSession((s) => s + 1)
            }}
            className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/70 text-white border border-white/20 hover:bg-black/90 transition-colors"
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        )}
      </div>

      {(canYouTube || canBilibili) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {canYouTube && canBilibili && (
            <>
              <button
                type="button"
                onClick={() => setPlatformAndNotify('bilibili')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  platform === 'bilibili'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    : 'text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                Bilibili
              </button>
              <button
                type="button"
                onClick={() => setPlatformAndNotify('youtube')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  platform === 'youtube'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                YouTube
              </button>
            </>
          )}
          {canBilibili && (
            <a
              href={bilibiliWatchUrl(short.bilibiliBvid!)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-pink-300 transition-colors"
            >
              Watch on Bilibili ↗
            </a>
          )}
          {canYouTube && (
            <a
              href={youtubeWatchUrl(short.youtubeVideoId!)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-red-300 transition-colors"
            >
              YouTube ↗
            </a>
          )}
          {short.galleryUrl && (
            <a
              href={short.galleryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-violet-300 transition-colors"
            >
              Gallery ↗
            </a>
          )}
        </div>
      )}

      {short.youtubeNote && platform === 'youtube' && (
        <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{short.youtubeNote}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {short.tools.map((tool) =>
          tool.slug ? (
            <Link
              key={tool.name}
              href={`/tools/${tool.slug}`}
              className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
              title={tool.role}
            >
              {tool.name}
            </Link>
          ) : (
            <span
              key={tool.name}
              className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-gray-400 border border-white/10"
              title={tool.role}
            >
              {tool.name}
            </span>
          )
        )}
      </div>
    </div>
  )
}
