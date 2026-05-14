'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import CommentSection from '@/components/CommentSection'

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  websiteUrl?: string
  website?: string
  affiliateUrl?: string | null
  category: string
  rating?: number
  ratingFeatures?: number
  ratingEase?: number
  ratingValue?: number
  ratingSupport?: number
  pricingType?: string
  pricing?: string
  priceMonthly?: number | null
  priceYearly?: number | null
  tags?: string | string[] | null
  pros?: string | string[] | null
  cons?: string | string[] | null
  features?: string[]
  affiliateLinks?: AffiliateLink[]
}

interface AffiliateLink {
  id: string
  toolId: string | null
  url: string
  slug: string
  clicks: number
  platform?: string
}

interface StoredUser {
  id: string
  name: string | null
  email: string
  role: string
}

function parseJsonArray(val: string | string[] | null | undefined): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) as string[] } catch { return [] }
}

function RatingBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function ToolLogo({ logoUrl, name }: { logoUrl: string; name: string }) {
  const [broken, setBroken] = useState(false)
  if (!logoUrl || broken) {
    return <span className="text-4xl">🤖</span>
  }
  return (
    <img
      src={logoUrl}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setBroken(true)}
    />
  )
}

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [tool, setTool] = useState<Tool | null>(null)
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favBusy, setFavBusy] = useState(false)

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch { setUser(null) }
    }
  }, [])

  useEffect(() => {
    fetch(`/api/tools/slug/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Tool | null) => {
        setTool(data)
        setAffiliateLinks(data?.affiliateLinks || [])
      })
      .catch(() => setTool(null))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!user || !tool) return
    fetch(`/api/favorites?userId=${encodeURIComponent(user.id)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: { toolId: string }[]) => setIsFavorite(list.some((f) => f.toolId === tool.id)))
      .catch(() => setIsFavorite(false))
  }, [user, tool])

  const toggleFavorite = async () => {
    if (!tool) return
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/tools/${slug}`)}`)
      return
    }
    setFavBusy(true)
    try {
      if (isFavorite) {
        const res = await fetch(
          `/api/favorites?userId=${encodeURIComponent(user.id)}&toolId=${encodeURIComponent(tool.id)}`,
          { method: 'DELETE' }
        )
        if (res.ok) setIsFavorite(false)
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, toolId: tool.id }),
        })
        if (res.ok) setIsFavorite(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setFavBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 animate-pulse" />
          <div className="text-gray-500 text-sm">Loading…</div>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-3">Tool Not Found</h1>
          <Link href="/tools" className="text-violet-400 hover:text-violet-300 font-medium">
            ← Back to Tools
          </Link>
        </div>
      </div>
    )
  }

  const tags     = parseJsonArray(tool.tags)
  const pros     = parseJsonArray(tool.pros)
  const cons     = parseJsonArray(tool.cons)
  const features = tool.features || []
  const websiteUrl  = tool.websiteUrl || tool.website || '#'
  const pricingType = tool.pricingType || tool.pricing || 'Unknown'
  const rating         = tool.rating         || 0
  const ratingFeatures = tool.ratingFeatures || rating
  const ratingEase     = tool.ratingEase     || rating
  const ratingValue    = tool.ratingValue    || rating
  const ratingSupport  = tool.ratingSupport  || rating

  const getTrackingUrl = (linkSlug: string) => `/api/affiliate/track/${linkSlug}`

  const PRICE_COLOR: Record<string, string> = {
    FREE:     'bg-green-500/10 text-green-400 border border-green-500/20',
    FREEMIUM: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    PAID:     'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  }
  const priceColor = PRICE_COLOR[pricingType] || PRICE_COLOR.PAID

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ─── Breadcrumb ─── */}
      <div className="border-b border-white/[0.06]">
        <div className="container mx-auto px-4 max-w-5xl py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">Tools</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-400 truncate max-w-[200px]">{tool.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">

        {/* ─── Hero card ─── */}
        <div className="glass rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-white/10">
              <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-3xl font-extrabold text-white">{tool.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${priceColor}`}>
                  {pricingType}
                </span>
              </div>
              <p className="text-gray-400 mt-1 leading-relaxed">{tool.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs rounded-lg font-medium">
                  {tool.category}
                </span>
                {tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white/[0.04] text-gray-400 border border-white/[0.08] text-xs rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-7 flex gap-3 flex-wrap">
            <button
              type="button"
              disabled={favBusy}
              onClick={toggleFavorite}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                isFavorite
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20'
                  : 'bg-white/[0.04] text-gray-300 border border-white/10 hover:border-yellow-500/30 hover:text-yellow-400'
              }`}
            >
              {isFavorite ? '★ Saved' : '☆ Save tool'}
            </button>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm glass glass-hover text-gray-300 hover:text-white transition-all"
            >
              🌐 Visit Website
            </a>
            {affiliateLinks.length > 0
              ? affiliateLinks.map((link) => (
                  <a
                    key={link.id}
                    href={getTrackingUrl(link.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/20 transition-all"
                  >
                    💰 {link.platform || 'Get Deal'}
                  </a>
                ))
              : tool.affiliateUrl
                ? (
                  <a
                    href={tool.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/20 transition-all"
                  >
                    💰 Try for Free
                  </a>
                )
                : null
            }
          </div>
        </div>

        {/* ─── Ratings ─── */}
        <div className="glass rounded-2xl p-7 mb-6">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <span>📊</span> Ratings
          </h2>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-extrabold gradient-text-vb">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-lg mb-1">/ 10</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Features',    value: ratingFeatures, color: 'text-violet-400' },
              { label: 'Ease of Use', value: ratingEase,     color: 'text-blue-400'   },
              { label: 'Value',       value: ratingValue,    color: 'text-green-400'  },
              { label: 'Support',     value: ratingSupport,  color: 'text-yellow-400' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className={`text-2xl font-bold ${color}`}>{value.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                <RatingBar value={value} />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Key Features ─── */}
        {features.length > 0 && (
          <div className="glass rounded-2xl p-7 mb-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span>✨</span> Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-gray-300 text-sm">
                  <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs shrink-0">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Pros & Cons ─── */}
        {(pros.length > 0 || cons.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {pros.length > 0 && (
              <div className="rounded-2xl p-6 bg-green-500/[0.05] border border-green-500/20">
                <h3 className="text-base font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span>✅</span> Pros
                </h3>
                <ul className="space-y-2.5">
                  {pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="rounded-2xl p-6 bg-red-500/[0.05] border border-red-500/20">
                <h3 className="text-base font-bold text-red-400 mb-4 flex items-center gap-2">
                  <span>❌</span> Cons
                </h3>
                <ul className="space-y-2.5">
                  {cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                      <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ─── Comments ─── */}
        <CommentSection toolId={tool.id} />
      </div>
    </div>
  )
}
