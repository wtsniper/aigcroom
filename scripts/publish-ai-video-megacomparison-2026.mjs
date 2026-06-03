/**
 * Publish 5000+ word AI video generator megacomparison (June 2026)
 * node scripts/publish-ai-video-megacomparison-2026.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { PrismaClient } from '@prisma/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const p = new PrismaClient()
const ADMIN_ID = 'fckadsn7skgmozq8tys'
const PUBLISHED_AT = new Date('2026-06-02T08:00:00.000Z')

const content = readFileSync(
  join(__dirname, 'content/ai-video-generators-compared-2026.md'),
  'utf8'
)

const article = {
  title: 'AI Video Generators Compared 2026: Runway, Kling, Seedance & Pika (Complete Guide)',
  slug: 'ai-video-generators-compared-2026-complete-guide',
  excerpt:
    'A 5,000+ word comparison of Runway, Kling, Seedance 2.0, and Pika — pricing from official docs, credit math, workflows, commercial rights, and who each tool actually fits. No fake scores.',
  content,
}

const exists = await p.review.findUnique({ where: { slug: article.slug } })
const words = content.split(/\s+/).filter(Boolean).length

if (exists) {
  await p.review.update({
    where: { slug: article.slug },
    data: {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      status: 'PUBLISHED',
      updatedAt: new Date(),
    },
  })
  console.log(`↻ updated: ${article.slug} (${words} words)`)
} else {
  await p.review.create({
    data: {
      ...article,
      authorId: ADMIN_ID,
      status: 'PUBLISHED',
      publishedAt: PUBLISHED_AT,
    },
  })
  console.log(`✓ created: ${article.slug} (${words} words)`)
}

console.log(`  https://www.aigcroom.shop/reviews/${article.slug}`)
await p.$disconnect()
