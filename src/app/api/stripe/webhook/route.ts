import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured' }, { status: 503 })
  }

  const stripe = new Stripe(stripeSecret)
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planType = session.metadata?.planType
        if (!userId || !planType) break

        const subId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id ?? null
        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            planType,
            status: 'ACTIVE',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subId,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          update: {
            planType,
            status: 'ACTIVE',
            stripeCustomerId: customerId ?? undefined,
            stripeSubscriptionId: subId ?? undefined,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const existing = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: sub.id },
        })
        if (existing) {
          await prisma.subscription.update({
            where: { userId: existing.userId },
            data: {
              planType: 'FREE',
              status: 'ACTIVE',
              stripeSubscriptionId: null,
              currentPeriodEnd: null,
              cancelAtPeriodEnd: false,
            },
          })
        }
        break
      }
      default:
        break
    }
  } catch (e) {
    console.error('Stripe webhook handler error:', e)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
