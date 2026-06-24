/** Extract YouTube video ID from URL or raw 11-char ID */
export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

/** Extract Bilibili BV id from URL or raw BV string */
export function extractBilibiliBvid(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const bvMatch = trimmed.match(/(BV[a-zA-Z0-9]+)/i)
  if (bvMatch) return bvMatch[1]
  return null
}
