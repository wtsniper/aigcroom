'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface StoredUser {
  id: string
  name: string | null
  email: string
  role: string
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center text-gray-600">Loading pricing…</div>
      }
    >
      <PricingContent />
    </Suspense>
  )
}

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<StoredUser | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string>('FREE')

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setCurrentPlan('FREE')
      return
    }
    fetch(`/api/subscription?userId=${encodeURIComponent(user.id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.planType) setCurrentPlan(String(data.planType))
        else setCurrentPlan('FREE')
      })
      .catch(() => setCurrentPlan('FREE'))
  }, [user])

  useEffect(() => {
    if (searchParams?.get('checkout') === 'success' && user?.id) {
      fetch(`/api/subscription?userId=${encodeURIComponent(user.id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.planType) setCurrentPlan(String(data.planType))
        })
        .catch(() => {})
    }
  }, [searchParams, user])

  const handleSubscribe = async (planType: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing')
      return
    }

    if (planType === 'FREE') return

    setLoading(planType)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planType }),
      })

      const data = await res.json()

      if (res.ok && data.url && typeof data.url === 'string') {
        window.location.href = data.url
        return
      }

      if (res.ok) {
        alert(`Subscription updated. Plan: ${planType}`)
        setCurrentPlan(planType)
        window.location.href = '/pricing'
      } else {
        alert(data.error || 'Failed to activate subscription')
      }
    } catch {
      alert('Failed to process subscription')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      name: 'FREE',
      price: '$0',
      period: '/月',
      features: ['浏览AI工具库', '基础评测文章', '最多2个工具对比', '行业新闻'],
      cta: '当前套餐',
      highlighted: false,
    },
    {
      name: 'PRO',
      price: '$29',
      period: '/月',
      features: [
        '所有免费功能',
        '深度对比分析',
        'ROI计算器',
        '基础模板库',
        '专属折扣（10-20%）',
        '价格追踪',
        '无广告体验',
      ],
      cta: '立即订阅',
      highlighted: true,
    },
    {
      name: 'ENTERPRISE',
      price: '$99',
      period: '/月',
      features: [
        '所有Pro功能',
        '高级模板库',
        '专属折扣（20-40%）',
        '每月2次1对1咨询',
        '定制化解决方案',
        '抢先体验新功能',
        '专属社区访问权限',
      ],
      cta: '立即订阅',
      highlighted: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">Unlock the full potential of AI tools with our premium features</p>
        {user && (
          <p className="text-sm text-gray-500 mt-2">
            Your current plan: <strong>{currentPlan}</strong>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.name
          return (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-sm border p-8 ${
                plan.highlighted ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-bold mt-2">{plan.name}</h2>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleSubscribe(plan.name)}
                disabled={
                  loading === plan.name ||
                  isCurrentPlan ||
                  (plan.name === 'FREE' && currentPlan !== 'FREE')
                }
                className={`mt-8 w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.name
                  ? 'Processing…'
                  : isCurrentPlan
                    ? 'Current plan'
                    : plan.name === 'FREE' && currentPlan !== 'FREE'
                      ? 'Included'
                      : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-center text-gray-500 mt-8 text-sm">
        💡 When Stripe keys and price IDs are set in the environment, checkout uses Stripe. Otherwise
        subscription is activated in the database for local testing only.
      </p>
      <p className="text-center mt-4 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back home
        </Link>
      </p>
    </div>
  )
}
