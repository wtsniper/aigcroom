import { NextResponse } from 'next/server';
import { db } from '@/lib/db-simple';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const tool = await db.tool.findUnique({
      where: { id },
    });
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json();
    
    const tool = await db.tool.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        affiliateUrl: data.affiliateUrl,
        category: data.category,
        rating: data.rating,
        ratingFeatures: data.ratingFeatures,
        ratingEase: data.ratingEase,
        ratingValue: data.ratingValue,
        ratingSupport: data.ratingSupport,
        pricingType: data.pricingType,
        priceMonthly: data.priceMonthly,
        priceYearly: data.priceYearly,
        tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags,
        pros: Array.isArray(data.pros) ? JSON.stringify(data.pros) : data.pros,
        cons: Array.isArray(data.cons) ? JSON.stringify(data.cons) : data.cons,
        isFeatured: data.isFeatured,
      },
    });
    
    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.tool.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json(
      { error: 'Failed to delete tool' },
      { status: 500 }
    );
  }
}
