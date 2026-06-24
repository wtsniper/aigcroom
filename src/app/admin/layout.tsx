'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string | null; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error('unauthorized')
        return r.json()
      })
      .then((data) => {
        if (data.user?.role !== 'ADMIN') {
          router.push('/')
          return
        }
        setUser(data.user)
      })
      .catch(() => router.push('/login?redirect=/admin'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST', credentials: 'include' }).catch(() => {})
    localStorage.removeItem('user')
    router.push('/')
  }

  const adminLinks = [
    { name: '仪表盘', href: '/admin' },
    { name: '工具管理', href: '/admin/tools' },
    { name: '评测管理', href: '/admin/reviews' },
    { name: 'AI 短片', href: '/admin/ai-shorts' },
    { name: '解决方案', href: '/admin/solutions' },
    { name: '联盟链接', href: '/admin/affiliate' },
    { name: '收入报表', href: '/admin/revenue' },
    { name: '数据抓取', href: '/admin/data-fetch' },
    { name: '数据分析', href: '/admin/analytics' },
    { name: '系统设置', href: '/admin/settings' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading admin...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="text-xl font-bold">管理后台</Link>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="block text-sm text-gray-400 hover:text-white mb-2">← 返回网站</Link>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">退出登录</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
