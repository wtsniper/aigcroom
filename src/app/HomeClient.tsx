'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { formatRating } from '@/lib/ratings'
import ToolLogo from '@/components/ToolLogo'

// ─── Particle canvas background ───────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`
        ctx.fill()

        // Draw connecting lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  category: string
  rating: number
  pricingType: string
  isFeatured: boolean
}

interface Review {
  id: string
  title: string
  slug: string
  excerpt: string
  status: string
  createdAt: string
}

interface Solution {
  id: string
  title: string
  slug: string
  description: string
  industry: string
  isFeatured: boolean
}

// ─── Scroll reveal — callback ref fires the moment the element mounts ─────────
function useReveal() {
  return useCallback((el: HTMLElement | null) => {
    if (!el) return
    // If already animated in (e.g. HMR), skip
    if (el.classList.contains('visible')) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
  }, [])
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '50K+',   label: 'Professionals' },
  { value: '500+',   label: 'AI Tools' },
  { value: '1,200+', label: 'Expert Reviews' },
  { value: '98%',    label: 'Satisfaction' },
]

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="w-14 h-14 bg-white/[0.06] rounded-xl mb-5" />
      <div className="h-4 bg-white/[0.06] rounded w-3/4 mb-3" />
      <div className="h-3 bg-white/[0.04] rounded w-full mb-2" />
      <div className="h-3 bg-white/[0.04] rounded w-5/6 mb-5" />
      <div className="flex justify-between pt-4 border-t border-white/[0.06]">
        <div className="h-3 bg-white/[0.06] rounded w-12" />
        <div className="h-3 bg-white/[0.06] rounded w-16" />
      </div>
    </div>
  )
}

export default function HomeClient({
  initialTools = [],
  initialReviews = [],
  initialSolutions = [],
}: {
  initialTools?: Tool[]
  initialReviews?: Review[]
  initialSolutions?: Solution[]
}) {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>(initialTools)
  const [recentReviews, setRecentReviews] = useState<Review[]>(initialReviews)
  const [featuredSolutions, setFeaturedSolutions] = useState<Solution[]>(initialSolutions)
  const [loading, setLoading] = useState(
    initialTools.length === 0 && initialReviews.length === 0 && initialSolutions.length === 0
  )
  const [error, setError] = useState(false)

  const heroRef      = useRef<HTMLElement>(null)
  const statsReveal     = useReveal()
  const toolsReveal     = useReveal()
  const reviewsReveal   = useReveal()
  const solutionsReveal = useReveal()
  const ctaReveal       = useReveal()

  useEffect(() => {
    if (initialTools.length > 0 || initialReviews.length > 0 || initialSolutions.length > 0) return
    async function fetchData() {
      try {
        const [toolsRes, reviewsRes, solutionsRes] = await Promise.all([
          fetch('/api/tools?homepage=1'),
          fetch('/api/reviews'),
          fetch('/api/solutions'),
        ])
        if (toolsRes.ok)     setFeaturedTools(await toolsRes.json())
        if (reviewsRes.ok)   setRecentReviews(
          (await reviewsRes.json())
            .filter((r: Review) => r.status === 'PUBLISHED')
            .slice(0, 3)
        )
        if (solutionsRes.ok) setFeaturedSolutions((await solutionsRes.json()).slice(0, 4))
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [initialTools.length, initialReviews.length, initialSolutions.length])

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden py-28 md:py-36">

        {/* Animated particle canvas */}
        <ParticleCanvas />

        {/* Background orbs */}
        <div className="orb absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/20" style={{ animationDelay: '0s' }} />
        <div className="orb absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/20" style={{ animationDelay: '3s' }} />
        <div className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/10" style={{ animationDelay: '6s' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 dot-pattern opacity-40" />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,80,255,0.15),transparent)]" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Trusted by 50,000+ professionals worldwide
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Discover the{' '}
            <span className="gradient-text">Best AI Tools</span>
            <br />
            <span className="text-gray-300">for Your Workflow</span>
          </h1>

          <p
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Expert reviews, side-by-side comparisons, and real user insights — everything you need
            to choose the perfect AI stack.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/tools"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] active:scale-100 transition-all duration-200"
            >
              Explore Tools
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 glass glass-hover text-white px-8 py-3.5 rounded-xl font-semibold hover:scale-[1.03] active:scale-100 transition-all duration-200"
            >
              Read Reviews
            </Link>
          </div>

          {/* Floating tags */}
          <div className="mt-14 flex flex-wrap justify-center gap-2 animate-fade-up" style={{ animationDelay: '0.45s' }}>
            {['ChatGPT', 'Midjourney', 'Cursor', 'Notion AI', 'Claude', 'GitHub Copilot', 'Gemini'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full border border-white/10 text-gray-500 bg-white/[0.03] hover:border-violet-500/40 hover:text-violet-400 transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-white/[0.05]">
        <div ref={statsReveal} className="reveal container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className={`text-center delay-${(i + 1) * 100}`}>
                <div className="text-3xl md:text-4xl font-extrabold gradient-text-vb mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Tools ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div ref={toolsReveal} className="reveal container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">Curated</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Featured Tools</h2>
              <p className="text-gray-400 mt-2">Hand-picked by our expert team</p>
            </div>
            <Link
              href="/tools"
              className="hidden md:flex items-center gap-1 text-violet-400 hover:text-violet-300 font-medium text-sm transition-colors"
            >
              View all{' '}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredTools.length > 0
                ? featuredTools.map((tool, i) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className={`group glass glass-hover rounded-2xl p-6 hover:scale-[1.02] hover:-translate-y-1 active:scale-100 transition-all duration-300 delay-${(i + 1) * 100}`}
                    >
                      <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-5 overflow-hidden group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                        <ToolLogo
                          logoUrl={tool.logoUrl}
                          slug={tool.slug}
                          name={tool.name}
                          category={tool.category}
                          fallbackClassName="text-2xl font-bold text-violet-300"
                        />
                      </div>
                      <h3 className="font-semibold text-lg text-white mb-2 group-hover:text-violet-300 transition-colors">{tool.name}</h3>
                      <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">{tool.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                        <span className="text-sm text-yellow-400 font-medium flex items-center gap-1">
                          ⭐ {formatRating(tool.rating)}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                          tool.pricingType === 'FREE'     ? 'bg-green-500/10 text-green-400' :
                          tool.pricingType === 'FREEMIUM' ? 'bg-blue-500/10 text-blue-400' :
                                                            'bg-orange-500/10 text-orange-400'
                        }`}>
                          {tool.pricingType}
                        </span>
                      </div>
                    </Link>
                  ))
                : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-sm">No tools yet.</p>
                    </div>
                  )
            }
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/tools" className="text-violet-400 hover:text-violet-300 font-medium text-sm">View all tools →</Link>
          </div>
        </div>
      </section>

      {/* ─── Latest Reviews ─────────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
        <div ref={reviewsReveal} className="reveal container mx-auto px-4 max-w-7xl relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest">In-depth</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Latest Reviews</h2>
              <p className="text-gray-400 mt-2">Honest analysis you can trust</p>
            </div>
            <Link
              href="/reviews"
              className="hidden md:flex items-center gap-1 text-violet-400 hover:text-violet-300 font-medium text-sm transition-colors"
            >
              View all{' '}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : recentReviews.length > 0
                ? recentReviews.map((review, i) => (
                    <Link
                      key={review.id}
                      href={`/reviews/${review.slug}`}
                      className={`group glass glass-hover rounded-2xl p-7 hover:scale-[1.02] hover:-translate-y-1 active:scale-100 transition-all duration-300 delay-${(i + 1) * 100}`}
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center ring-1 ring-violet-500/20">
                          <span className="text-violet-400 text-sm">📝</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-white mb-3 line-clamp-2 group-hover:text-violet-300 transition-colors leading-snug">{review.title}</h3>
                      <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed">{review.excerpt}</p>
                      <div className="flex items-center gap-1 text-violet-400 font-medium text-sm group-hover:gap-2 transition-all">
                        Read review
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))
                : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-sm">No published reviews yet.</p>
                    </div>
                  )
            }
          </div>
        </div>
      </section>

      {/* ─── Industry Solutions ──────────────────────────────────────────── */}
      <section className="py-24">
        <div ref={solutionsReveal} className="reveal container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Use Cases</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Industry Solutions</h2>
              <p className="text-gray-400 mt-2">AI-powered workflows for every field</p>
            </div>
            <Link
              href="/solutions"
              className="hidden md:flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
            >
              View all{' '}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredSolutions.length > 0
                ? featuredSolutions.map((solution, i) => (
                    <Link
                      key={solution.id}
                      href={`/solutions/${solution.slug}`}
                      className={`group glass glass-hover rounded-2xl p-6 hover:scale-[1.02] hover:-translate-y-1 active:scale-100 transition-all duration-300 delay-${(i + 1) * 100}`}
                    >
                      <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform">
                        <span className="text-blue-400 text-xl">💡</span>
                      </div>
                      <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">{solution.industry}</span>
                      <h3 className="font-semibold text-base text-white mb-2 mt-1.5 group-hover:text-blue-300 transition-colors line-clamp-2">{solution.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{solution.description}</p>
                    </Link>
                  ))
                : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-sm">No solutions yet.</p>
                    </div>
                  )
            }
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div ref={ctaReveal} className="reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl p-[1px] gradient-border">
            <div className="relative rounded-3xl bg-gradient-to-br from-violet-950/80 via-gray-950 to-blue-950/80 p-12 md:p-16 text-center overflow-hidden">
              <div className="orb absolute -top-20 -left-20 w-64 h-64 bg-violet-600/20" style={{ animationDelay: '2s' }} />
              <div className="orb absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20" style={{ animationDelay: '5s' }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
                  🚀 Free to get started
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Find your perfect<br />
                  <span className="gradient-text">AI tool stack</span> today
                </h2>
                <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                  Join thousands of professionals who trust AIGC Room for AI tool discovery and comparison.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] active:scale-100 transition-all duration-200"
                  >
                    Browse Tools
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 glass glass-hover text-white px-8 py-3.5 rounded-xl font-semibold hover:scale-[1.03] active:scale-100 transition-all duration-200"
                  >
                    Create free account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
