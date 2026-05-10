import { NextResponse } from 'next/server'
import { db } from '@/lib/db-simple'

export async function GET() {
  try {
    const links = await db.affiliateLink.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching affiliate links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliate links' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const link = await db.affiliateLink.create({
      data: {
        toolId: data.toolId || null,
        url: data.url,
        slug: data.slug,
      },
    })
    
    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating affiliate link:', error)
    return NextResponse.json(
      { error: 'Failed to create affiliate link' },
      { status: 500 }
    )
  }
}
