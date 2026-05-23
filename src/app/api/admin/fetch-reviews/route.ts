import { NextResponse } from 'next/server'
import { scheduleReviewFetch, fetchBloggerReviews } from '@/lib/scraper'
import { withAdmin } from '@/lib/api-guard'

export const POST = withAdmin(async (request: Request) => {
  try {
    const body = await request.json()
    const { type = 'blogger' } = body

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
      return NextResponse.json({ success: true, message: 'Scheduled review fetch completed' })
    }

    return NextResponse.json({ error: 'Invalid fetch type' }, { status: 400 })
  } catch (error) {
    console.error('Review fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
})

export const GET = withAdmin(async () => {
  return NextResponse.json({ status: 'ready', lastFetch: null, totalReviews: 0 })
})
