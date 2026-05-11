import { NextResponse } from 'next/server'
import { scheduleReviewFetch, fetchBloggerReviews } from '@/lib/scraper'

// 手动触发抓取评测文章
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type = 'blogger' } = body
    
    console.log(`Starting review fetch with type: ${type}`)
    
    if (type === 'blogger') {
      const reviews = await fetchBloggerReviews()
      
      return NextResponse.json({
        success: true,
        message: `Found ${reviews.length} reviews from bloggers`,
        reviews,
      })
    }
    
    if (type === 'scheduled') {
      await scheduleReviewFetch()
      
      return NextResponse.json({
        success: true,
        message: 'Scheduled review fetch completed',
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid fetch type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Review fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// 获取抓取状态
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    lastFetch: null,
    totalReviews: 0,
  })
}
