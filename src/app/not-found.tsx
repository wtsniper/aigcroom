import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>
        <p className="text-gray-400 mb-8">Page not found</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500">
            Home
          </Link>
          <Link href="/tools" className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white">
            Browse Tools
          </Link>
          <Link href="/reviews" className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white">
            Reviews
          </Link>
        </div>
      </div>
    </div>
  )
}
