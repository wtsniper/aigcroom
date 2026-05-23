import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

function baseUrl() {
  const u = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return u.replace(/\/$/, '')
}

export async function POST(request: Request) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { planType } = await request.json()

    if (!planType || planType === 'FREE') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    const pricePro = process.env.STRIPE_PRICE_PRO
    const pricePremium = process.env.STRIPE_PRICE_PREMIUM || process.env.STRIPE_PRICE_ENTERPRISE
    const priceId = planType === 'PRO' ? pricePro : planType === 'ENTERPRISE' ? pricePremium : null

    if (!stripeSecret || !priceId) {
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 })
      }
      const existing = await prisma.subscription.findUnique({ where: { userId: auth.id } })
      if (existing) {
        await prisma.subscription.update({
          where: { userId: auth.id },
          data: { planType, status: 'ACTIVE', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        })
      } else {
        await prisma.subscription.create({
          data: {
            userId: auth.id,
            planType,
            status: 'ACTIVE',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
      }
      return NextResponse.json({ success: true, message: 'Dev mode subscription activated' })
    }

    const user = await prisma.user.findUnique({ where: { id: auth.id } })
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
      client_reference_id: auth.id,
      metadata: { userId: auth.id, planType },
      subscription_data: { metadata: { userId: auth.id, planType } },
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
