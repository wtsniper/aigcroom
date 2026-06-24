'use client'

type ShareArticleProps = {
  title: string
  path: string
}

export default function ShareArticle({ title, path }: ShareArticleProps) {
  const url =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://www.aigcroom.shop${path.startsWith('/') ? path : `/${path}`}`

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // fallback ignored
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <span className="text-xs text-gray-500">Share:</span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        Post on X
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        Copy link
      </button>
    </div>
  )
}
