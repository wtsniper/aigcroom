'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            AIGC Room
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tools
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-blue-600 transition-colors">
              Reviews
            </Link>
            <Link href="/solutions" className="text-gray-700 hover:text-blue-600 transition-colors">
              Solutions
            </Link>
            <Link href="/compare" className="text-gray-700 hover:text-blue-600 transition-colors">
              Compare
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Admin
                  </Link>
                )}
                <span className="text-gray-700 text-sm">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <Link href="/tools" className="text-gray-700 hover:text-blue-600 py-2">
                Tools
              </Link>
              <Link href="/reviews" className="text-gray-700 hover:text-blue-600 py-2">
                Reviews
              </Link>
              <Link href="/solutions" className="text-gray-700 hover:text-blue-600 py-2">
                Solutions
              </Link>
              <Link href="/compare" className="text-gray-700 hover:text-blue-600 py-2">
                Compare
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 py-2">
                Pricing
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
