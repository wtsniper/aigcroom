'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSubscribe = async (planType: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    setLoading(planType)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planType }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(`Subscription activated! Plan: ${planType}`)
        window.location.reload()
      } else {
        alert(data.error || 'Failed to activate subscription')
      }
    } catch (error) {
      alert('Failed to process subscription')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      name: 'FREE',
      price: '$0',
      period: '/month',
      features: ['Browse tool library', 'Basic reviews', '2-tool compare', 'Industry news'],
      cta: 'Current Plan',
      highlighted: false,
    },
    {
      name: 'PRO',
      price: '$29',
      period: '/month',
      features: ['All Free features', 'Deep comparisons', 'ROI Calculator', 'Basic templates', 'Exclusive discounts (10-20%)', 'Price tracking', 'Ad-free experience'],
      cta: 'Subscribe',
      highlighted: true,
    },
    {
      name: 'ENTERPRISE',
      price: '$99',
      period: '/month',
      features: ['All Pro features', 'Advanced templates', 'Exclusive discounts (20-40%)', '1v1 Consulting (2x/month)', 'Custom solutions', 'Early access', 'Exclusive community'],
      cta: 'Subscribe',
      highlighted: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">Unlock the full potential of AI tools with our premium features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = user && (plan.name === 'FREE' || user.role === 'USER')
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
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading === plan.name || (plan.name === 'FREE' && isCurrentPlan)}
                className={`mt-8 w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.name ? 'Processing...' : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-center text-gray-500 mt-8 text-sm">
        💡 All plans include a 14-day money-back guarantee.
      </p>
    </div>
  )
}
