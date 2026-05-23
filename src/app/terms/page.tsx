import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        <p className="mb-4 text-sm text-gray-500">Last updated: May 2026</p>
        <p className="mb-4">By using aigcroom.shop you agree to these terms. Content is for informational purposes only.</p>
        <p className="mb-4">We participate in affiliate programs and may earn commissions from qualifying purchases.</p>
        <p>The site is provided as-is without warranties.</p>
      </div>
    </div>
  )
}
