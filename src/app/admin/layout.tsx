'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login?redirect=/admin')
      return
    }

    try {
      const userData = JSON.parse(userStr)
      if (userData.role !== 'ADMIN') {
        router.push('/')
        return
      }
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('user')
      router.push('/login?redirect=/admin')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const adminLinks = [
    { name: '仪表盘', href: '/admin' },
    { name: '工具管理', href: '/admin/tools' },
    { name: '评测管理', href: '/admin/reviews' },
    { name: '解决方案', href: '/admin/solutions' },
    { name: '联盟链接', href: '/admin/affiliate' },
    { name: '收入报表', href: '/admin/revenue' },
    { name: '数据抓取', href: '/admin/data-fetch' },
    { name: '数据分析', href: '/admin/analytics' },
    { name: '系统设置', href: '/admin/settings' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证权限...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold">🤖 AIGC Room 管理后台</h2>
          <p className="text-gray-400 text-sm mt-1">内容管理系统</p>
        </div>
        <nav className="flex-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-6 py-3 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-800">
          <div className="mb-4">
            <p className="text-sm text-gray-400">当前用户</p>
            <p className="text-white font-medium">{user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            退出登录
          </button>
          <Link
            href="/"
            className="block mt-2 text-gray-400 hover:text-white text-sm text-center"
          >
            ← 返回网站
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
