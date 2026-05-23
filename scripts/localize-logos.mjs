/**
 * Download tool logos into public/logos/ and point DB logoUrl to local paths.
 *
 * Usage: node scripts/localize-logos.mjs
 *        node scripts/localize-logos.mjs --dry-run
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const LOGO_DIR = path.join(ROOT, 'public', 'logos')
const DRY_RUN = process.argv.includes('--dry-run')

const prisma = new PrismaClient()

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function extFromContentType(type) {
  if (!type) return 'png'
  if (type.includes('svg')) return 'svg'
  if (type.includes('webp')) return 'webp'
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg'
  if (type.includes('ico') || type.includes('x-icon')) return 'png'
  if (type.includes('png')) return 'png'
  return 'png'
}

function extFromUrl(url) {
  try {
    const p = new URL(url).pathname.toLowerCase()
    if (p.endsWith('.svg')) return 'svg'
    if (p.endsWith('.webp')) return 'webp'
    if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'jpg'
    if (p.endsWith('.ico')) return 'png'
    if (p.endsWith('.png')) return 'png'
  } catch {
    /* ignore */
  }
  return 'png'
}

async function fetchBuffer(url, timeoutMs = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIGCRoomLogoBot/1.0)',
        Accept: 'image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const type = res.headers.get('content-type') || ''
    if (type.includes('text/html')) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 32) return null
    return { buf, type }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function buildSvgFallback(name) {
  const letter = (name.match(/[A-Za-z0-9]/)?.[0] || '?').toUpperCase()
  const palette = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#db2777']
  const color = palette[letter.charCodeAt(0) % palette.length]
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="${color}"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    fill="#ffffff" font-family="system-ui,Segoe UI,sans-serif" font-size="56" font-weight="700">${letter}</text>
</svg>`
}

async function resolveLogo(tool) {
  const candidates = []
  if (tool.logoUrl && /^https?:\/\//i.test(tool.logoUrl)) {
    candidates.push(tool.logoUrl)
  }
  const domain = domainFromUrl(tool.websiteUrl)
  if (domain) {
    candidates.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`)
    candidates.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`)
  }

  for (const url of candidates) {
    const result = await fetchBuffer(url)
    if (result) {
      const ext = extFromContentType(result.type) || extFromUrl(url)
      return { buffer: result.buf, ext, source: url }
    }
  }

  return {
    buffer: Buffer.from(buildSvgFallback(tool.name), 'utf8'),
    ext: 'svg',
    source: 'generated',
  }
}

async function main() {
  if (!fs.existsSync(LOGO_DIR)) {
    fs.mkdirSync(LOGO_DIR, { recursive: true })
  }

  const tools = await prisma.tool.findMany({
    select: { id: true, slug: true, name: true, logoUrl: true, websiteUrl: true },
    orderBy: { name: 'asc' },
  })

  console.log(`Processing ${tools.length} tools${DRY_RUN ? ' (dry run)' : ''}...\n`)

  let ok = 0
  let generated = 0

  for (const tool of tools) {
    const localPath = `/logos/${tool.slug}`
    const existing = ['png', 'svg', 'webp', 'jpg'].find((ext) =>
      fs.existsSync(path.join(LOGO_DIR, `${tool.slug}.${ext}`))
    )

    if (existing && tool.logoUrl === `${localPath}.${existing}`) {
      console.log(`= ${tool.slug} (already local)`)
      ok++
      continue
    }

    const resolved = await resolveLogo(tool)
    const filename = `${tool.slug}.${resolved.ext}`
    const diskPath = path.join(LOGO_DIR, filename)
    const dbPath = `/logos/${filename}`

    if (resolved.source === 'generated') generated++
    else ok++

    console.log(
      `${resolved.source === 'generated' ? '~' : '✓'} ${tool.slug} <- ${resolved.source} => ${dbPath}`
    )

    if (!DRY_RUN) {
      fs.writeFileSync(diskPath, resolved.buffer)
      await prisma.tool.update({
        where: { id: tool.id },
        data: { logoUrl: dbPath },
      })
    }
  }

  console.log(`\nDone. Downloaded/found: ${ok}, generated fallback: ${generated}`)
  if (DRY_RUN) console.log('Dry run — no files or DB rows changed.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
