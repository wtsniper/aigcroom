import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { buildCategoriesWithCounts } from '@/lib/categories'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'AI Tool Categories',
  description:
    'Browse AI tools by category — writing, image, video, coding, chat, audio, productivity, and marketing.',
}

export default async function CategoryIndexPage() {
  const tools = await prisma.tool.findMany({ select: { category: true } })
  const categories = buildCategoriesWithCounts(tools)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block">
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">AI Tool Categories</h1>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Explore curated AI tools by category. Each page includes ratings, pricing, and links to
          in-depth reviews.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="glass glass-hover rounded-2xl p-6 block hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">{cat.name}</h2>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                  <p className="text-xs text-violet-400 mt-3 font-medium">{cat.count} tools →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
