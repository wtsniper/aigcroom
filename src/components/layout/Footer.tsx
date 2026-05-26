import Link from 'next/link'

const GUIDE_LINKS = [
  { href: '/reviews/best-ai-books-2026', label: 'Best AI Books 2026' },
  { href: '/reviews/runway-vs-pika-vs-kling-2026', label: 'Runway vs Pika vs Kling' },
  { href: '/ai-shorts', label: 'Viral AI Shorts 2026' },
  { href: '/reviews/best-ai-tools-make-money-online-2026', label: 'Make Money with AI' },
  { href: '/reviews/chatgpt-plus-vs-claude-pro-2026', label: 'ChatGPT Plus vs Claude Pro' },
  { href: '/reviews/best-web-hosting-for-ai-projects-2026', label: 'Web Hosting for AI Sites' },
  { href: '/reviews/semrush-vs-ahrefs-seo-tools-2026', label: 'Semrush vs Ahrefs' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">AIGC Room</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover, compare, and review the latest AI tools. Honest comparisons and buyer guides
              to help you pick the right stack without overspending.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/tools" className="hover:text-white">AI Tools</Link></li>
              <li><Link href="/category" className="hover:text-white">Categories</Link></li>
              <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
              <li><Link href="/ai-shorts" className="hover:text-white">AI Shorts</Link></li>
              <li><Link href="/compare" className="hover:text-white">Comparisons</Link></li>
              <li><Link href="/solutions" className="hover:text-white">Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Guides</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {GUIDE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 AIGC Room. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
