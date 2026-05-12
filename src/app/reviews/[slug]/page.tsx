import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CommentSection from '@/components/CommentSection'

interface Review {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  createdAt: Date
  publishedAt: Date | null
  tool: {
    id: string
    name: string
    slug: string
  } | null
}

async function getReview(slug: string): Promise<Review | null> {
  const review = await prisma.review.findUnique({
    where: { slug },
    include: {
      tool: true,
    },
  })
  return review
}

const renderMarkdown = (content: string) => {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let inList = false
  let listItems: JSX.Element[] = []
  let inTable = false
  let tableRows: JSX.Element[] = []
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++} className="list-disc list-inside space-y-1 mb-4 ml-4">{listItems}</ul>)
      listItems = []
      inList = false
    }
  }

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0]
      const bodyRows = tableRows.slice(1)
      elements.push(
        <div key={key++} className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">{headerRow}</thead>
            <tbody className="bg-white divide-y divide-gray-200">{bodyRows}</tbody>
          </table>
        </div>
      )
      tableRows = []
      inTable = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) flushList()
      inTable = true
      const cells = line.split('|').filter(c => c.trim())
      const isSeparator = cells.every(c => c.trim().match(/^[-]+$/))
      if (isSeparator) continue
      
      const row = (
        <tr key={key++}>
          {cells.map((cell, idx) => (
            <td key={idx} className="px-4 py-2 text-sm">{renderInline(cell.trim())}</td>
          ))}
        </tr>
      )
      tableRows.push(row)
      continue
    } else if (inTable) {
      flushTable()
    }

    if (line.startsWith('# ')) {
      flushList()
      elements.push(<h1 key={key++} className="text-3xl font-bold text-gray-900 mb-4 mt-8">{renderInline(line.slice(2))}</h1>)
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(<h2 key={key++} className="text-2xl font-semibold text-gray-800 mb-3 mt-6">{renderInline(line.slice(3))}</h2>)
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(<h3 key={key++} className="text-xl font-medium text-gray-700 mb-2 mt-4">{renderInline(line.slice(4))}</h3>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) inList = true
      listItems.push(<li key={key++} className="text-gray-700">{renderInline(line.slice(2))}</li>)
    } else if (line.trim() === '') {
      flushList()
      elements.push(<div key={key++} className="h-4" />)
    } else {
      flushList()
      elements.push(<p key={key++} className="text-gray-700 mb-4 leading-relaxed">{renderInline(line)}</p>)
    }
  }

  flushList()
  flushTable()
  return elements
}

const renderInline = (text: string): JSX.Element | string => {
  const parts: JSX.Element[] = []
  const regex = /\*\*(.+?)\*\*|`(.+?)`/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>)
    }
    if (match[1]) {
      parts.push(<strong key={key++} className="font-semibold">{match[1]}</strong>)
    } else if (match[2]) {
      parts.push(<code key={key++} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{match[2]}</code>)
    }
    lastIndex = regex.lastIndex
  }

  if (parts.length === 0) return text
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>)
  }
  return <>{parts}</>
}

export default async function ReviewDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const review = await getReview(slug)

  if (!review) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/reviews" className="text-blue-600 hover:underline text-sm mb-6 inline-block">← Back to Reviews</Link>
      
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{review.title}</h1>
          
          {review.tool && (
            <Link href={`/tools/${review.tool.slug}`} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200">
              {review.tool.name}
            </Link>
          )}
          
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>Published: {new Date(review.publishedAt || review.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          {renderMarkdown(review.content)}
        </div>
      </article>

      <CommentSection reviewId={review.id} />
    </div>
  )
}
