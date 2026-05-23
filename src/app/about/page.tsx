import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About AIGC Room — AI tools directory and reviews.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-bold text-white mb-6">About AIGC Room</h1>
        <p className="mb-4">AIGC Room is an independent AI tools directory and review site at aigcroom.shop.</p>
        <p className="mb-4">We help professionals discover, compare, and choose AI software through expert reviews and curated solutions.</p>
        <h2 className="text-xl font-semibold text-white mt-8 mb-3">Affiliate Disclosure</h2>
        <p>Some links are affiliate links. As an Amazon Associate we earn from qualifying purchases.</p>
      </div>
    </div>
  )
}
