import { NextResponse } from 'next/server'
import { db } from '@/lib/db-simple'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    await db.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the current period',
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
