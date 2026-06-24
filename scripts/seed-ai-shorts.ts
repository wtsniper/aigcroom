/**
 * Seed ai_shorts table from static VIRAL_AI_SHORTS catalog.
 * npx tsx scripts/seed-ai-shorts.ts
 */

import { PrismaClient } from '@prisma/client'
import { VIRAL_AI_SHORTS } from '../src/lib/viral-ai-shorts'

const p = new PrismaClient()

async function main() {
  let created = 0
  let updated = 0

  for (const short of VIRAL_AI_SHORTS) {
  const data = {
    slug: short.id,
    title: short.title,
    originalTitle: short.originalTitle ?? null,
    creator: short.creator,
    creatorHandle: short.creatorHandle ?? null,
    description: short.description,
    tools: JSON.stringify(short.tools ?? []),
    youtubeVideoId: short.youtubeVideoId ?? null,
    youtubeNote: short.youtubeNote ?? null,
    bilibiliBvid: short.bilibiliBvid ?? null,
    galleryUrl: short.galleryUrl ?? null,
    duration: short.duration ?? null,
    tags: JSON.stringify(short.tags ?? []),
    viralNote: short.viralNote ?? null,
    featured: short.featured ?? false,
    preferredPlatform: short.preferredPlatform ?? null,
    sortOrder: short.sortOrder,
    status: 'PUBLISHED',
    publishedAt: new Date('2026-06-24T08:00:00.000Z'),
  }

  const existing = await p.aiShort.findUnique({ where: { slug: short.id } })
  if (existing) {
    await p.aiShort.update({ where: { slug: short.id }, data })
    console.log(`↻ updated: ${short.id}`)
    updated++
  } else {
    await p.aiShort.create({ data })
    console.log(`✓ created: ${short.id}`)
    created++
  }
}

  console.log(`\nDone: ${created} created, ${updated} updated (${VIRAL_AI_SHORTS.length} total)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => p.$disconnect())
