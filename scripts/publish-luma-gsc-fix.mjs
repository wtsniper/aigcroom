/**
 * Fix GSC 404: publish luma-vs-runway-vs-kling-2024 + duplicate article notices
 * node scripts/publish-luma-gsc-fix.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { PrismaClient } from '@prisma/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const p = new PrismaClient()
const ADMIN_ID = 'fckadsn7skgmozq8tys'
const PUBLISHED_AT = new Date('2026-06-03T08:00:00.000Z')

const LUMA_SLUG = 'luma-vs-runway-vs-kling-2024'
const lumaContent = readFileSync(join(__dirname, 'content/luma-vs-runway-vs-kling-2024.md'), 'utf8')

const lumaArticle = {
  title: 'Luma vs Runway vs Kling 2024–2026: AI Video Generator Comparison',
  slug: LUMA_SLUG,
  excerpt:
    'Luma Dream Machine vs Runway Gen-4 vs Kling Video 3.0 — who each tool fits, official credit pointers, and workflows tied to our AI Shorts hub. No fake scores.',
  content: lumaContent,
}

const exists = await p.review.findUnique({ where: { slug: LUMA_SLUG } })
if (exists) {
  await p.review.update({
    where: { slug: LUMA_SLUG },
    data: {
      title: lumaArticle.title,
      excerpt: lumaArticle.excerpt,
      content: lumaArticle.content,
      status: 'PUBLISHED',
      publishedAt: PUBLISHED_AT,
      updatedAt: new Date(),
    },
  })
  console.log(`↻ updated: ${LUMA_SLUG}`)
} else {
  await p.review.create({
    data: { ...lumaArticle, authorId: ADMIN_ID, status: 'PUBLISHED', publishedAt: PUBLISHED_AT },
  })
  console.log(`✓ created: ${LUMA_SLUG}`)
}

const NOTICE = (primarySlug, primaryTitle) =>
  `> **Editor note:** We also published a newer angle on this topic. For the most up-to-date stack, read **[${primaryTitle}](/reviews/${primarySlug})** first.\n\n`

const duplicatePatches = [
  {
    slug: 'deepseek-review-2026',
    primary: 'deepseek-vs-chatgpt-for-coding-2026',
    title: 'DeepSeek vs ChatGPT for Coding 2026',
  },
  {
    slug: 'deepseek-v4-pro-max-review-2026',
    primary: 'deepseek-vs-chatgpt-for-coding-2026',
    title: 'DeepSeek vs ChatGPT for Coding 2026',
  },
  {
    slug: 'speak-ai-vs-otter-ai-vs-fireflies-2026',
    primary: 'zoom-ai-vs-otter-vs-fireflies-2026',
    title: 'Zoom AI vs Otter vs Fireflies 2026',
  },
  {
    slug: 'zoom-ai-vs-otter-vs-fireflies-2026',
    primary: 'speak-ai-vs-otter-ai-vs-fireflies-2026',
    title: 'Speak AI vs Otter vs Fireflies 2026',
  },
]

for (const { slug, primary, title } of duplicatePatches) {
  const row = await p.review.findUnique({ where: { slug } })
  if (!row?.content) continue
  const marker = `primarySlug:${primary}`
  if (row.content.includes(marker) || row.content.includes(`(/reviews/${primary})`)) {
    console.log(`· skip notice: ${slug}`)
    continue
  }
  const notice = `<!-- ${marker} -->\n${NOTICE(primary, title)}`
  await p.review.update({
    where: { slug },
    data: { content: notice + row.content, updatedAt: new Date() },
  })
  console.log(`↻ cross-link notice: ${slug} → ${primary}`)
}

const words = lumaContent.split(/\s+/).filter(Boolean).length
console.log(`\nLuma article: ${words} words`)
console.log(`https://www.aigcroom.shop/reviews/${LUMA_SLUG}`)
await p.$disconnect()
