import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  TOOL_CATEGORIES,
  allCategorySlugs,
  getCategoryBySlug,
} from '@/lib/categories'
import ToolLogo from '@/components/ToolLogo'
import { formatRating } from '@/lib/ratings'
import type { Metadata } from 'next'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return allCategorySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found' }

  const year = new Date().getFullYear()
  return {
    title: `${category.seoTitle} (${year})`,
    description: category.description,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${category.seoTitle} | AIGC Room`,
      description: category.description,
    },
  }
}

const PRICE_BADGE: Record<string, string> = {
  FREE: 'bg-green-500/10 text-green-400 border border-green-500/20',
  FREEMIUM: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  PAID: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const tools = await prisma.tool.findMany({
    where: { category: { in: category.match } },
    orderBy: { rating: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      category: true,
      rating: true,
      pricingType: true,
    },
  })

  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="border-b border-white/[0.06]">
        <div className="container mx-auto px-4 max-w-5xl py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/category" className="hover:text-gray-300">Categories</Link>
          <span>/</span>
          <span className="text-gray-400">{category.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="mb-10">
          <span className="text-4xl mb-4 block">{category.icon}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {category.seoTitle} ({year})
          </h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">{category.description}</p>
          <p className="text-sm text-gray-500 mt-3">{tools.length} tools in this category</p>
        </div>

        {tools.length === 0 ? (
          <p className="text-gray-500">No tools in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="glass glass-hover rounded-2xl p-5 flex gap-4 hover:scale-[1.01] transition-transform"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-white/20">
                  <ToolLogo
                    logoUrl={tool.logoUrl}
                    slug={tool.slug}
                    name={tool.name}
                    category={tool.category}
                    fallbackClassName="text-xl font-bold text-violet-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-white truncate">{tool.name}</h2>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">{tool.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-yellow-400">⭐ {formatRating(tool.rating)}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                        PRICE_BADGE[tool.pricingType] || PRICE_BADGE.PAID
                      }`}
                    >
                      {tool.pricingType}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white mb-4">More categories</h2>
          <div className="flex flex-wrap gap-2">
            {TOOL_CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/[0.04] text-gray-300 border border-white/10 hover:border-violet-500/40 hover:text-violet-300 transition-colors"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: category.seoTitle,
            description: category.description,
            numberOfItems: tools.length,
            itemListElement: tools.slice(0, 20).map((tool, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: tool.name,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aigcroom.shop'}/tools/${tool.slug}`,
            })),
          }),
        }}
      />
    </div>
  )
}
