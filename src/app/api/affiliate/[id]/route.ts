import { NextResponse } from 'next/server'
import { db } from '@/lib/db-simple'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const link = await db.affiliateLink.findMany({}).then(links => 
      links.find(l => l.id === params.id)
    )
    
    if (!link) {
      return NextResponse.json(
        { error: 'Affiliate link not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error fetching affiliate link:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliate link' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const link = await db.affiliateLink.update({
      where: { id: params.id },
      data: {
        toolId: data.toolId || null,
        url: data.url,
        slug: data.slug,
      },
    })
    
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating affiliate link:', error)
    return NextResponse.json(
      { error: 'Failed to update affiliate link' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.affiliateLink.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting affiliate link:', error)
    return NextResponse.json(
      { error: 'Failed to delete affiliate link' },
      { status: 500 }
    )
  }
}
