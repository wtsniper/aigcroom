/** Canonical production URL — keep robots, sitemap, and metadata in sync. */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aigcroom.shop').replace(/\/$/, '')
}
