'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { formatRating, normalizeRating } from '@/lib/ratings'
import ToolLogo from '@/components/ToolLogo'

const PAGE_SIZE = 9

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  category: string
  rating: number
  pricingType: string
  priceMonthly: number | null
  tags: string | null
  isFeatured: boolean
  createdAt?: string
}

type SortBy = 'rating' | 'name' | 'newest'

const PRICE_BADGE: Record<string, string> = {
  FREE:     'bg-green-500/10 text-green-400 border border-green-500/20',
  FREEMIUM: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  PAID:     'bg-orange-500/10 text-orange-400 border border-orange-500/20',
}

export default function ToolsPageClient({
  initialTools = [],
}: {
  initialTools?: Tool[]
}) {
  const [tools, setTools] = useState<Tool[]>(initialTools)
  const [loading, setLoading] = useState(initialTools.length === 0)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [priceFilter, setPriceFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<SortBy>('rating')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (initialTools.length > 0) return
    fetch('/api/tools')
      .then((r) => (r.ok ? r.json() : []))
      .then(setTools)
      .catch(() => setTools([]))
      .finally(() => setLoading(false))
  }, [initialTools.length])

  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(tools.map((t) => t.category)))],
    [tools]
  )

  const filteredTools = useMemo(() => {
    const q = searchTerm.toLowerCase()
    let list = tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)
      const matchesCategory = categoryFilter === 'ALL' || tool.category === categoryFilter
      const matchesPrice =
        priceFilter === 'ALL' ||
        (priceFilter === 'FREE'     && tool.pricingType === 'FREE')     ||
        (priceFilter === 'FREEMIUM' && tool.pricingType === 'FREEMIUM') ||
        (priceFilter === 'PAID'     && tool.pricingType === 'PAID')
      return matchesSearch && matchesCategory && matchesPrice
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') return normalizeRating(b.rating) - normalizeRating(a.rating)
      if (sortBy === 'name')   return a.name.localeCompare(b.name)
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return tb - ta
    })
    return list
  }, [tools, searchTerm, categoryFilter, priceFilter, sortBy])

  const totalPages  = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE))
  const effectivePage = Math.min(page, totalPages)

  const pagedTools = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE
    return filteredTools.slice(start, start + PAGE_SIZE)
  }, [filteredTools, effectivePage])

  useEffect(() => { setPage(1) }, [searchTerm, categoryFilter, priceFilter, sortBy])

  const selectCls = 'px-4 py-2.5 bg-white/[0.04] border border-white/10 text-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-colors'

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ─── Page header ─── */}
      <div className="relative border-b border-white/[0.06] py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(139,92,246,0.12),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Browse AI Tools</h1>
          <p className="text-gray-400 text-lg">Discover and compare {tools.length > 0 ? `${tools.length}+` : ''} AI tools curated by experts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ─── Filters ─── */}
        <div className="flex flex-col lg:flex-row flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tools…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 text-gray-200 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-colors"
            />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectCls}>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-900">{cat === 'ALL' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className={selectCls}>
            <option value="ALL"      className="bg-gray-900">All Pricing</option>
            <option value="FREE"     className="bg-gray-900">Free</option>
            <option value="FREEMIUM" className="bg-gray-900">Freemium</option>
            <option value="PAID"     className="bg-gray-900">Paid</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className={selectCls}>
            <option value="rating"  className="bg-gray-900">Highest Rating</option>
            <option value="name"    className="bg-gray-900">Name (A–Z)</option>
            <option value="newest"  className="bg-gray-900">Newest</option>
          </select>
        </div>

        {/* ─── Result count ─── */}
        <p className="text-sm text-gray-500 mb-6">
          {loading ? 'Loading…' : (
            filteredTools.length === 0
              ? 'No tools found'
              : `Showing ${(effectivePage - 1) * PAGE_SIZE + 1}–${Math.min(effectivePage * PAGE_SIZE, filteredTools.length)} of ${filteredTools.length} tools`
          )}
        </p>

        {/* ─── Grid ─── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/[0.06] rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/[0.06] rounded w-3/4" />
                    <div className="h-3 bg-white/[0.04] rounded w-full" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-white/[0.04] rounded-full w-16" />
                  <div className="h-6 bg-white/[0.04] rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg font-medium">No tools found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pagedTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="group glass glass-hover rounded-2xl p-6 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-300">
                      <ToolLogo logoUrl={tool.logoUrl} slug={tool.slug} name={tool.name} category={tool.category} useCategoryEmoji fallbackClassName="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs rounded-lg font-medium">
                      {tool.category}
                    </span>
                    <span className={`px-2.5 py-1 text-xs rounded-lg font-medium ${PRICE_BADGE[tool.pricingType] || PRICE_BADGE.PAID}`}>
                      {tool.pricingType}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-sm text-yellow-400 font-medium flex items-center gap-1">
                      ⭐ {formatRating(tool.rating)}
                    </span>
                    <span className="text-violet-400 text-xs font-medium group-hover:text-violet-300 flex items-center gap-1 transition-colors">
                      View details
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <button
                  type="button"
                  disabled={effectivePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-5 py-2 rounded-xl glass glass-hover text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <span className="text-sm text-gray-400 px-2">
                  Page <span className="text-white font-semibold">{effectivePage}</span> / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={effectivePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-5 py-2 rounded-xl glass glass-hover text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center gap-1.5"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
