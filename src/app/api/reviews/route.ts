import { NextResponse } from 'next/server';
import { db } from '@/lib/db-simple';

export async function GET() {
  try {
    const reviews = await db.review.findMany({
      include: {
        author: true,
        tool: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const review = await db.review.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        toolId: data.toolId || null,
        authorId: data.authorId,
        status: data.status || 'DRAFT',
        publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
      },
    });
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
