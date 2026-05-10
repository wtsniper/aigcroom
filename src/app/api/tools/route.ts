import { NextResponse } from 'next/server';
import { db } from '@/lib/db-simple';

export async function GET() {
  try {
    const tools = await db.tool.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const tool = await db.tool.create({
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
    });
    
    if (data.pricingPlans && data.pricingPlans.length > 0) {
      for (const plan of data.pricingPlans) {
        await db.pricingPlan.create({
          data: {
            ...plan,
            toolId: tool.id,
            features: Array.isArray(plan.features) ? JSON.stringify(plan.features) : plan.features,
          },
        });
      }
    }
    
    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    );
  }
}
