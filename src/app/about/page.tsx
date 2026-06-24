import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(
  '/about',
  'How We Review AI Tools — AIGC Room',
  'Our hands-on methodology: independent testing, clear comparisons, affiliate disclosure, and why we focus on modern AIGC creator tools.'
)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-8 inline-block">
          ← Home
        </Link>
        <h1 className="text-3xl font-bold text-white mb-4">How AIGC Room reviews AI software</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          We&apos;re an independent directory at aigcroom.shop — inspired by sites like Efficient
          App, but focused on generative AI for creators: video models, writing assistants, coding
          tools, and the workflows behind viral AI films.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10 mb-3">What every review includes</h2>
        <ul className="space-y-2 text-gray-400 mb-8">
          <li>• <strong className="text-gray-300">Quick snapshot</strong> — who it&apos;s for in 30 seconds</li>
          <li>• <strong className="text-gray-300">Hands-on testing</strong> — real prompts, exports, and limits</li>
          <li>• <strong className="text-gray-300">Pricing tiers</strong> — what you actually pay in 2026</li>
          <li>• <strong className="text-gray-300">Honest drawbacks</strong> — where tools break or disappoint</li>
          <li>• <strong className="text-gray-300">Comparisons</strong> — links to side-by-side guides when relevant</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-3">What we don&apos;t do</h2>
        <ul className="space-y-2 text-gray-400 mb-8">
          <li>• We don&apos;t sell your data or pass leads to vendors</li>
          <li>• We don&apos;t publish pay-to-rank listicles</li>
          <li>• We don&apos;t copy marketing pages — every article is written by our team</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-3">Affiliate disclosure</h2>
        <p className="mb-4 leading-relaxed">
          Some links are affiliate links (tools, hosting, SEO, Amazon books). We may earn a
          commission at no extra cost to you. Affiliate relationships never change our ratings or
          which tools we recommend.
        </p>
        <p className="mb-4 leading-relaxed">
          As an Amazon Associate we earn from qualifying purchases.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            Browse comparisons
          </Link>
          <Link
            href="/tools"
            className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 text-sm hover:bg-white/[0.06] transition-colors"
          >
            Explore all tools
          </Link>
        </div>
      </div>
    </div>
  )
}
