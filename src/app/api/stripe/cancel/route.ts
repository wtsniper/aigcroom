import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    if (session instanceof NextResponse) return session

    await prisma.subscription.update({
      where: { userId: session.id },
      data: { cancelAtPeriodEnd: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the current period',
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
