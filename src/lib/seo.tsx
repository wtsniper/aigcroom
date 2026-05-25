import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site-url'

/** Absolute URL for a site path (path must start with /). */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function canonicalMetadata(path: string): Pick<Metadata, 'alternates'> {
  return {
    alternates: {
      canonical: path,
    },
  }
}

export function pageMetadata(
  path: string,
  title: string,
  description: string,
  extra?: Metadata
): Metadata {
  const url = absoluteUrl(path)
  return {
    title,
    description,
    ...canonicalMetadata(path),
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...extra,
  }
}

/** Strip markdown to plain text for schema fields. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .trim()
}

/** Parse ### questions under ## FAQ from our article markdown. */
export function extractFaqsFromMarkdown(content: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  const lines = content.split('\n')
  let inFaq = false
  let currentQ: string | null = null
  let answerLines: string[] = []

  const flush = () => {
    if (currentQ && answerLines.length > 0) {
      faqs.push({
        question: stripMarkdown(currentQ),
        answer: stripMarkdown(answerLines.join(' ')),
      })
    }
    currentQ = null
    answerLines = []
  }

  for (const line of lines) {
    if (/^##\s+FAQ/i.test(line.trim())) {
      flush()
      inFaq = true
      continue
    }
    if (!inFaq) continue
    if (/^##\s+/.test(line.trim()) && !/^##\s+FAQ/i.test(line.trim())) {
      flush()
      inFaq = false
      continue
    }
    if (/^---\s*$/.test(line.trim())) {
      flush()
      inFaq = false
      continue
    }
    if (/^###\s+/.test(line)) {
      flush()
      currentQ = line.replace(/^###\s+/, '')
      continue
    }
    if (currentQ && line.trim()) {
      answerLines.push(line.trim())
    }
  }
  flush()
  return faqs.filter((f) => f.question && f.answer)
}

export function buildArticleJsonLd(input: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
}) {
  const pageUrl = absoluteUrl(input.url)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: pageUrl,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      '@type': 'Organization',
      name: 'AIGC Room',
      url: getSiteUrl(),
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIGC Room',
      url: getSiteUrl(),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function buildSoftwareApplicationJsonLd(input: {
  name: string
  description: string
  url: string
  applicationCategory?: string
  rating?: number
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    applicationCategory: input.applicationCategory || 'BusinessApplication',
  }
  if (input.rating && input.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: input.rating,
      bestRating: 5,
      worstRating: 1,
    }
  }
  return schema
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] | null }) {
  if (!data) return null
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
