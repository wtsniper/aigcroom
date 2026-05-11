import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId, planType } = await request.json()

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const prices: Record<string, number> = { PRO: 29, ENTERPRISE: 99 }
    const price = prices[planType] || 0

    const subscription = await prisma.subscription.findUnique({ where: { userId } })

    if (subscription) {
      await prisma.subscription.update({
        where: { userId },
        data: {
          planType,
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          planType,
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated',
      subscription: {
        planType,
        price,
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
