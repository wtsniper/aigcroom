import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="mb-4 text-sm text-gray-500">Last updated: May 2026</p>
        <p className="mb-4">We collect account email, usage analytics, and newsletter subscriptions if you opt in.</p>
        <p className="mb-4">We use cookies for session management and analytics. Third-party affiliate links may set their own cookies.</p>
        <p>Contact <a href="mailto:contact@aigcroom.shop" className="text-violet-400">contact@aigcroom.shop</a> for data requests.</p>
      </div>
    </div>
  )
}
