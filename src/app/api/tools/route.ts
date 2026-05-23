import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/api-guard'
import { getHomeFeaturedTools } from '@/lib/featured-tools'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    if (searchParams.get('homepage') === '1') {
      const tools = await getHomeFeaturedTools(4)
      return NextResponse.json(tools)
    }

    const tools = await prisma.tool.findMany({
      orderBy: { createdAt: 'desc' },
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
    return NextResponse.json(tools)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 })
  }
}

export const POST = withAdmin(async (request: Request) => {
  try {
    const data = await request.json()

    const tool = await prisma.tool.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        affiliateUrl: data.affiliateUrl,
        category: data.category,
        rating: data.rating || 0,
        ratingFeatures: data.ratingFeatures || 0,
        ratingEase: data.ratingEase || 0,
        ratingValue: data.ratingValue || 0,
        ratingSupport: data.ratingSupport || 0,
        pricingType: data.pricingType || 'FREE',
        priceMonthly: data.priceMonthly,
        priceYearly: data.priceYearly,
        tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags,
        pros: Array.isArray(data.pros) ? JSON.stringify(data.pros) : data.pros,
        cons: Array.isArray(data.cons) ? JSON.stringify(data.cons) : data.cons,
        isFeatured: data.isFeatured || false,
      },
    })

    if (data.pricingPlans?.length > 0) {
      await prisma.pricingPlan.createMany({
        data: data.pricingPlans.map((plan: {
          name: string
          description?: string
          priceMonthly?: number
          priceYearly?: number
          features?: string[]
          affiliateUrl?: string
          isPopular?: boolean
        }) => ({
          name: plan.name,
          description: plan.description,
          priceMonthly: plan.priceMonthly,
          priceYearly: plan.priceYearly,
          features: Array.isArray(plan.features) ? JSON.stringify(plan.features) : plan.features,
          affiliateUrl: plan.affiliateUrl,
          isPopular: plan.isPopular || false,
          toolId: tool.id,
        })),
      })
    }

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 })
  }
})
