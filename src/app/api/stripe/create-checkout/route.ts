import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

function baseUrl() {
  const u = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return u.replace(/\/$/, '')
}

/** Dev fallback: activate subscription in DB without Stripe (when keys missing). */
async function activateInDb(userId: string, planType: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const existing = await prisma.subscription.findUnique({ where: { userId } })
  if (existing) {
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
    message: 'Subscription activated (dev mode — no Stripe charge)',
    subscription: {
      planType,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  })
}

export async function POST(request: Request) {
  try {
    const { userId, planType } = await request.json()

    if (!userId || !planType || planType === 'FREE') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    const pricePro = process.env.STRIPE_PRICE_PRO
    const pricePremium = process.env.STRIPE_PRICE_PREMIUM || process.env.STRIPE_PRICE_ENTERPRISE

    const priceId = planType === 'PRO' ? pricePro : planType === 'ENTERPRISE' ? pricePremium : null

    if (!stripeSecret || !priceId) {
      return activateInDb(userId, planType)
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const stripe = new Stripe(stripeSecret)
    const base = baseUrl()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/pricing?checkout=success`,
      cancel_url: `${base}/pricing?checkout=cancel`,
      client_reference_id: userId,
      metadata: { userId, planType },
      subscription_data: {
        metadata: { userId, planType },
      },
      customer_email: user.email || undefined,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
