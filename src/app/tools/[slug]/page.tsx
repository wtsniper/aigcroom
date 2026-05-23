import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CommentSection from '@/components/CommentSection'
import FavoriteButton from './FavoriteButton'
import ToolLogo from '@/components/ToolLogo'
import { RATING_MAX, normalizeRating, ratingBarPercent } from '@/lib/ratings'

interface PageProps {
  params: Promise<{ slug: string }>
}

function parseJsonArray(val: string | string[] | null | undefined): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) as string[] } catch { return [] }
}

function RatingBar({ value }: { value: number }) {
  const pct = ratingBarPercent(value)
  return (
    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const tool = await prisma.tool.findUnique({ where: { slug }, select: { name: true, description: true } })
  if (!tool) return { title: 'Tool Not Found' }
  return {
    title: `${tool.name} | AIGC Room`,
    description: tool.description,
  }
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params

  let tool: (Awaited<ReturnType<typeof prisma.tool.findUnique>> & { affiliateLinks: { id: string; slug: string; platform: string | null }[] }) | null = null
  try {
    tool = await prisma.tool.findUnique({
      where: { slug },
      include: { affiliateLinks: true },
    })
  } catch (error) {
    console.error('Error fetching tool:', error)
  }

  if (!tool) notFound()

  const tags     = parseJsonArray(tool.tags)
  const pros     = parseJsonArray(tool.pros)
  const cons     = parseJsonArray(tool.cons)
  const websiteUrl  = tool.websiteUrl || '#'
  const pricingType = tool.pricingType || 'Unknown'
  const rating         = normalizeRating(tool.rating         || 0)
  const ratingFeatures = normalizeRating(tool.ratingFeatures || tool.rating || 0)
  const ratingEase     = normalizeRating(tool.ratingEase     || tool.rating || 0)
  const ratingValue    = normalizeRating(tool.ratingValue    || tool.rating || 0)
  const ratingSupport  = normalizeRating(tool.ratingSupport  || tool.rating || 0)

  const getTrackingUrl = (linkSlug: string) => `/api/affiliate/track/${linkSlug}`

  const PRICE_COLOR: Record<string, string> = {
    FREE:     'bg-green-500/10 text-green-400 border border-green-500/20',
    FREEMIUM: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    PAID:     'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  }
  const priceColor = PRICE_COLOR[pricingType] || PRICE_COLOR.PAID

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Breadcrumb */}
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

        {/* Hero card */}
        <div className="glass rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-white/20">
              <ToolLogo
                logoUrl={tool.logoUrl}
                slug={tool.slug}
                name={tool.name}
                category={tool.category}
                fallbackClassName="text-4xl font-bold text-violet-300"
              />
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
            {/* Favorite button — client component */}
            <FavoriteButton toolId={tool.id} toolSlug={tool.slug} />

            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm glass glass-hover text-gray-300 hover:text-white transition-all"
            >
              🌐 Visit Website
            </a>

            {tool.affiliateLinks.length > 0
              ? tool.affiliateLinks.map((link) => (
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

        {/* Ratings */}
        <div className="glass rounded-2xl p-7 mb-6">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <span>📊</span> Ratings
          </h2>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-extrabold gradient-text-vb">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-lg mb-1">/ {RATING_MAX}</span>
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

        {/* Demo Video */}
        {tool.videoUrl && (() => {
          const ytMatch = tool.videoUrl!.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
          if (!ytMatch) return null
          return (
            <div className="glass rounded-2xl p-7 mb-6">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span>▶</span> Demo Video
              </h2>
              <div className="rounded-xl overflow-hidden aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${tool.name} demo`}
                />
              </div>
            </div>
          )
        })()}

        {/* Pros & Cons */}
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

        {/* Comments */}
        <CommentSection toolId={tool.id} />
      </div>
    </div>
  )
}
