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
  let inOrderedList = false
  let listItems: JSX.Element[] = []
  let inTable = false
  let tableRows: string[][] = []
  let isFirstTableRow = true
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      if (inOrderedList) {
        elements.push(<ol key={key++} className="list-decimal list-inside space-y-1 mb-4 ml-4">{listItems}</ol>)
      } else {
        elements.push(<ul key={key++} className="list-disc list-inside space-y-1 mb-4 ml-4">{listItems}</ul>)
      }
      listItems = []
      inList = false
      inOrderedList = false
    }
  }

  const flushTable = () => {
    if (tableRows.length === 0) return
    const [header, ...body] = tableRows
    elements.push(
      <div key={key++} className="overflow-x-auto mb-6 rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              {header.map((cell, i) => (
                <th key={i} className="px-4 py-3 text-left text-gray-900 font-semibold whitespace-nowrap">
                  {renderInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {body.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-gray-700">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableRows = []
    inTable = false
    isFirstTableRow = true
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) { flushList(); inTable = true }
      const cells = line.split('|').slice(1, -1).map(c => c.trim())
      const isSeparator = cells.every(c => /^[-: ]+$/.test(c))
      if (!isSeparator) tableRows.push(cells)
      continue
    } else if (inTable) {
      flushTable()
    }

    if (line.startsWith('# ')) {
      flushList()
      elements.push(<h1 key={key++} className="text-3xl font-bold text-gray-900 mb-4 mt-8">{renderInline(line.slice(2))}</h1>)
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(<h2 key={key++} className="text-2xl font-semibold text-gray-800 mb-3 mt-6 pb-2 border-b border-gray-200">{renderInline(line.slice(3))}</h2>)
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(<h3 key={key++} className="text-lg font-semibold text-gray-800 mb-2 mt-5">{renderInline(line.slice(4))}</h3>)
    } else if (line.startsWith('#### ')) {
      flushList()
      elements.push(<h4 key={key++} className="text-base font-semibold text-gray-700 mb-2 mt-4">{renderInline(line.slice(5))}</h4>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { inList = true; inOrderedList = false }
      listItems.push(<li key={key++} className="text-gray-700">{renderInline(line.slice(2))}</li>)
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) { inList = true; inOrderedList = true }
      listItems.push(<li key={key++} className="text-gray-700">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>)
    } else if (/https?:\/\/(www\.)?(youtube\.com\/watch|youtu\.be\/)/.test(line.trim())) {
      flushList()
      const ytMatch = line.trim().match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      if (ytMatch) {
        elements.push(
          <div key={key++} className="my-6 rounded-xl overflow-hidden aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${ytMatch[1]}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video"
            />
          </div>
        )
      }
    } else if (line.startsWith('> ')) {
      flushList()
      elements.push(
        <blockquote key={key++} className="border-l-4 border-blue-400 pl-4 py-1 my-4 bg-blue-50 rounded-r-lg">
          <p className="text-gray-700 italic">{renderInline(line.slice(2))}</p>
        </blockquote>
      )
    } else if (line.trim() === '') {
      flushList()
      elements.push(<div key={key++} className="h-3" />)
    } else {
      flushList()
      elements.push(<p key={key++} className="text-gray-700 mb-3 leading-relaxed">{renderInline(line)}</p>)
    }
  }

  flushList()
  flushTable()
  return elements
}

const renderInline = (text: string): JSX.Element | string => {
  const parts: JSX.Element[] = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>)
    }
    if (match[1]) {
      parts.push(<strong key={key++} className="font-semibold text-gray-900">{match[1]}</strong>)
    } else if (match[2]) {
      parts.push(<em key={key++} className="italic">{match[2]}</em>)
    } else if (match[3]) {
      parts.push(<code key={key++} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{match[3]}</code>)
    } else if (match[4] && match[5]) {
      parts.push(<a key={key++} href={match[5]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{match[4]}</a>)
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
