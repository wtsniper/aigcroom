import { NextResponse } from 'next/server'
import { db } from '@/lib/db-simple'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const subscription = await db.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      planType: subscription.planType,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt,
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}
