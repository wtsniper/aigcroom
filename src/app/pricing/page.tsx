import Link from 'next/link'

export const metadata = {
  title: 'Pricing | AIGC Room',
  description: 'Paid plans are coming soon. Everything on AIGC Room is free for now.',
  robots: 'noindex',
}

export default function PricingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
      <p className="text-lg text-gray-500 mb-2 max-w-md">
        Everything on AIGC Room is <strong>completely free</strong> right now.
      </p>
      <p className="text-sm text-gray-400 mb-8 max-w-md">
        Paid plans are coming soon. We&apos;ll let you know when they&apos;re available.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  )
}
