import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ToolsPageClient from './ToolsPageClient'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata = pageMetadata(
  '/tools',
  'AI Tools Directory — Compare & Review',
  'Browse 80+ AI tools for video, writing, coding, and image. Filter by category, price, and rating. Search Runway, Claude, Midjourney, and more.'
)

export default async function ToolsPage() {
  const tools = await prisma.tool.findMany({
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
      priceMonthly: true,
      tags: true,
      isFeatured: true,
      createdAt: true,
    },
  })

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <ToolsPageClient
        initialTools={tools.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
        }))}
      />
    </Suspense>
  )
}
