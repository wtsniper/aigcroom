/**
 * One-time migration: convert legacy 10-point tool ratings to 5-point scale.
 * Run: node scripts/normalize-ratings.mjs
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const RATING_MAX = 5

function normalize(value) {
  if (!Number.isFinite(value) || value <= 0) return value
  if (value > RATING_MAX) return Math.min(value / 2, RATING_MAX)
  return value
}

async function main() {
  const tools = await prisma.tool.findMany({
    select: {
      id: true,
      name: true,
      rating: true,
      ratingFeatures: true,
      ratingEase: true,
      ratingValue: true,
      ratingSupport: true,
    },
  })

  let updated = 0
  for (const tool of tools) {
    const fields = ['rating', 'ratingFeatures', 'ratingEase', 'ratingValue', 'ratingSupport']
    const data = {}
    let changed = false

    for (const field of fields) {
      const raw = tool[field]
      const next = normalize(raw)
      if (next !== raw) {
        data[field] = next
        changed = true
      }
    }

    if (changed) {
      await prisma.tool.update({ where: { id: tool.id }, data })
      updated++
      console.log(`✓ ${tool.name}: ${tool.rating} → ${data.rating ?? tool.rating}`)
    }
  }

  console.log(`\nDone. Updated ${updated} of ${tools.length} tools.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
