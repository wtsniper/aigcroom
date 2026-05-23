import { prisma } from '@/lib/prisma'
import ToolsPageClient from './ToolsPageClient'

export const revalidate = 300

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
    <ToolsPageClient
      initialTools={tools.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      }))}
    />
  )
}
