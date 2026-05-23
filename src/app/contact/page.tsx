import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-8 inline-block">← Home</Link>
        <h1 className="text-3xl font-bold text-white mb-6">Contact</h1>
        <p className="mb-4">Email: <a href="mailto:contact@aigcroom.shop" className="text-violet-400">contact@aigcroom.shop</a></p>
        <p>For tool submissions or partnerships, include your tool name, URL, and description.</p>
      </div>
    </div>
  )
}
