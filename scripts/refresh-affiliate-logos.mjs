/**
 * Refresh high-quality logos for affiliate tools (Speak AI, Robofy).
 * Usage: node scripts/refresh-affiliate-logos.mjs
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO_DIR = path.join(__dirname, '..', 'public', 'logos')

const AFFILIATE_LOGOS = {
  'speak-ai': [
    'https://www.google.com/s2/favicons?domain=speakai.co&sz=256',
    'https://speakai.co/favicon.ico',
  ],
  robofy: [
    'https://www.google.com/s2/favicons?domain=robofy.ai&sz=256',
    'https://www.robofy.ai/favicon.ico',
  ],
}

function extFromContentType(type) {
  if (type?.includes('svg')) return 'svg'
  if (type?.includes('webp')) return 'webp'
  if (type?.includes('jpeg') || type?.includes('jpg')) return 'jpg'
  return 'png'
}

async function fetchBest(urls) {
  let best = null
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AIGCRoom/1.0)', Accept: 'image/*,*/*' },
        redirect: 'follow',
      })
      if (!res.ok) continue
      const type = res.headers.get('content-type') || ''
      if (type.includes('text/html')) continue
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 500) continue
      if (!best || buf.length > best.buf.length) {
        best = { buf, ext: extFromContentType(type), url, bytes: buf.length }
      }
    } catch {
      /* try next */
    }
  }
  return best
}

async function refreshSlug(slug, urls) {
  const best = await fetchBest(urls)
  if (!best) {
    console.log(`✗ ${slug}: no logo downloaded`)
    return
  }

  const filename = `${slug}.${best.ext}`
  const diskPath = path.join(LOGO_DIR, filename)
  const dbPath = `/logos/${filename}`

  for (const oldExt of ['png', 'jpg', 'webp', 'svg']) {
    const oldPath = path.join(LOGO_DIR, `${slug}.${oldExt}`)
    if (oldExt !== best.ext && fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
  }

  fs.writeFileSync(diskPath, best.buf)
  console.log(`✓ ${slug}: ${best.url} (${best.bytes} bytes) -> ${dbPath}`)

  try {
    const prisma = new PrismaClient()
    await prisma.tool.updateMany({ where: { slug }, data: { logoUrl: dbPath } })
    await prisma.$disconnect()
  } catch (e) {
    console.log(`  (DB skip: ${e.message?.split('\n')[0] || 'unavailable'})`)
  }

  return dbPath
}

async function main() {
  if (!fs.existsSync(LOGO_DIR)) fs.mkdirSync(LOGO_DIR, { recursive: true })
  for (const [slug, urls] of Object.entries(AFFILIATE_LOGOS)) {
    await refreshSlug(slug, urls)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
