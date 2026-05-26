/**
 * Curated 2026 viral AI short films — sources are public uploads & media reports.
 * Playback: YouTube / Bilibili embed only; we do not self-host video.
 */

export type ViralShortTool = {
  name: string
  /** Internal tool slug when we have a review page */
  slug?: string
  role?: string
}

export type ViralAiShort = {
  id: string
  title: string
  /** Original / alternate title (e.g. non-English release name) */
  originalTitle?: string
  creator: string
  creatorHandle?: string
  description: string
  tools: ViralShortTool[]
  /** YouTube video ID for embed (11 chars) */
  youtubeVideoId?: string
  youtubeNote?: string
  bilibiliBvid?: string
  /** Curious Refuge, creator site, etc. */
  galleryUrl?: string
  duration?: string
  tags: string[]
  /** Media-reported reach — cite sources in viralNote, not our own measurement */
  viralNote?: string
  /** Homepage autoplay default */
  featured?: boolean
  preferredPlatform?: 'youtube' | 'bilibili'
  sortOrder: number
}

export const VIRAL_AI_SHORTS: ViralAiShort[] = [
  {
    id: 'zombie-scavenger',
    title: 'Zombie Scavenger',
    originalTitle: '丧尸清道夫',
    creator: 'Mx-Shell (Liu Ziyu)',
    creatorHandle: '@Mx-Shell',
    description:
      'A 3:34 post-apocalyptic AI short — robot cowboy meets zombie wasteland. Press coverage compared the cinematography to Love, Death & Robots. Creator is a wedding photographer from Yunnan, not film-school trained; end credits list the generation tools used.',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video (Xiao Yunque app)' },
      { name: 'Midjourney', slug: 'midjourney', role: 'Concept stills' },
      { name: 'Flux', role: 'Select frames' },
      { name: 'CapCut Pro', role: 'Edit, grade, subtitles' },
    ],
    bilibiliBvid: 'BV1FFRQB2Eqw',
    galleryUrl: 'https://curiousrefuge.com/ai-film-gallery',
    duration: '3:34',
    tags: ['Seedance', 'Wasteland', 'Viral 2026', 'China'],
    viralNote:
      'Sina News and Newswav (May 2026) reported tens of millions of views overseas; Newswav cited 70M+ plays on Douyin alone. Hollywood AI producer PJ Ace publicly searched for the creator on X to collaborate.',
    featured: true,
    preferredPlatform: 'bilibili',
    sortOrder: 1,
  },
  {
    id: 'hell-grind',
    title: 'Hell Grind',
    creator: 'Higgsfield AI / Aitore Zholdaskali',
    description:
      'Sci-fi heist AI series expanded into a 95-minute feature — four street kids touch a museum artifact and gain powers. Built on Higgsfield with Dreamina Seedance 2.0; screened at a Cannes side event in May 2026 (not an official festival selection).',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video (Dreamina / Higgsfield)' },
      { name: 'Soul Cinema', role: 'Character & world consistency' },
      { name: 'Soul Cast', role: 'Cast / character pipeline' },
    ],
    youtubeVideoId: 'digHr6k38x0',
    youtubeNote:
      'Official Episode 1 (22 min) on Higgsfield AI YouTube. Cannes trailer: youtube.com/watch?v=CVzfQuC0aMU. Full series on higgsfield.ai/original-series/hell-grind.',
    galleryUrl: 'https://higgsfield.ai/original-series/hell-grind/episode-1',
    duration: '22:32 (Ep. 1)',
    tags: ['Seedance', 'Cannes 2026', 'AI Feature', 'Higgsfield'],
    viralNote:
      'Higgsfield reports ~$500K total budget (~$400K compute), 15-person team, 14-day generation window. SCMP and TechNode covered the Cannes city screening (May 2026).',
    sortOrder: 2,
  },
  {
    id: 'zephyr',
    title: 'Zephyr',
    creator: 'Higgsfield AI / Ilya Karchin',
    description:
      'K-pop–styled mecha girl squad vs alien bugs — fight scenes, cockpits, and a full choreographed dance sequence. Higgsfield’s breakout Seedance 2.0 original series; the 2-minute intro went viral before Episode 1 dropped.',
    tools: [
      { name: 'Seedance 2.0', role: 'Video generation & direction' },
      { name: 'Soul Cinema', role: 'Face & outfit references' },
      { name: 'Nano Banana Pro', role: 'Character asset fusion' },
    ],
    youtubeVideoId: 'LQ-vSa9_H98',
    youtubeNote: 'Official Episode 1 — Higgsfield AI YouTube channel.',
    galleryUrl: 'https://higgsfield.ai/original-series/zephyr/episode-1',
    duration: 'Ep. 1 (full episode)',
    tags: ['Seedance', 'K-Pop', 'Mecha', 'Higgsfield'],
    viralNote:
      'Higgsfield says the intro alone reached millions of views (April 2026). Workflow breakdown published on higgsfield.ai/blog/guide-youtube-seedance2.0.',
    sortOrder: 3,
  },
  {
    id: 'the-sister',
    title: 'The Sister',
    creator: 'JSFILMZ',
    description:
      'Sci-fi survival short: two survivors visit an abandoned diner and are ambushed by a creature. Listed on Curious Refuge (April 2026); creator reports ~$400 budget and 4–5 days of work.',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video generation' },
      { name: 'TopView AI', role: 'Select shots / workflow' },
    ],
    youtubeVideoId: 'E54A5iWz_2U',
    youtubeNote: 'Full short plus behind-the-scenes breakdown (JSFILMZ channel).',
    galleryUrl: 'https://curiousrefuge.com/ai-film-gallery/the-sister-ai-short-film',
    duration: '~3 min film',
    tags: ['Seedance', 'Sci-Fi', 'Curious Refuge'],
    sortOrder: 4,
  },
  {
    id: 'live-action-seedance',
    title: 'Live-Action Seedance Short',
    creator: 'JSFILMZ',
    description:
      'Tests whether Seedance 2.0 can carry a live-action–style narrative. First half is the uninterrupted short; second half walks through the production pipeline.',
    tools: [
      { name: 'Seedance 2.0', role: 'Physics, camera, character consistency' },
      { name: 'TopView AI', role: 'High-impact shots' },
    ],
    youtubeVideoId: 'jwFfkFywpu8',
    youtubeNote: 'Creator self-reported ~$400 budget (JSFILMZ, March 2026).',
    duration: '~7 min (film + BTS)',
    tags: ['Seedance', 'Live Action', 'Workflow'],
    sortOrder: 5,
  },
  {
    id: 'black-knight',
    title: 'Black Knight: Her Final Look Back',
    creator: 'Ether Pulse',
    description:
      'Fantasy narrative AI short about a wounded knight fleeing through the forest. Publicly labeled as made with Seedance 2.0.',
    tools: [{ name: 'Seedance 2.0', role: 'Full generation' }],
    youtubeVideoId: 'wvJvxJiQX4w',
    duration: '5:36',
    tags: ['Seedance', 'Fantasy'],
    sortOrder: 6,
  },
  {
    id: 'z-world-ep1',
    title: 'The Z World — Episode 1',
    creator: 'TNT Records Films',
    description:
      'Episode one of a zombie / post-apocalypse AI series. Creator credits Seedance 2.0 plus their own storyboarding.',
    tools: [{ name: 'Seedance 2.0', role: 'Video generation' }],
    youtubeVideoId: 'pT0aYqeXog8',
    duration: '17:04',
    tags: ['Seedance', 'Zombie', 'Series'],
    sortOrder: 7,
  },
  {
    id: 'runway-kingdom',
    title: 'KINGDOM.',
    creator: 'Andrés Bronnimann / DREAM STUFF INC.',
    description:
      'Generative AI narrative short (2024) on inherited trauma and free will; screened at BAIFF 2024. Included as a benchmark — Runway-era AI shorts already had full story arcs; 2026 toolchains cut cost further.',
    tools: [
      { name: 'Runway', slug: 'runway-ml', role: 'Video generation' },
      { name: 'Kling AI', slug: 'kling-ai', role: 'Select shots (per creator tags)' },
    ],
    youtubeVideoId: 'xksMy0DYmOs',
    duration: '3:23',
    tags: ['Runway', 'Kling', 'Classic AI Film'],
    sortOrder: 8,
  },
]

export function getFeaturedViralShort(): ViralAiShort {
  return VIRAL_AI_SHORTS.find((s) => s.featured) ?? VIRAL_AI_SHORTS[0]
}

export function getViralShortById(id: string): ViralAiShort | undefined {
  return VIRAL_AI_SHORTS.find((s) => s.id === id)
}

export function bilibiliWatchUrl(bvid: string): string {
  return `https://www.bilibili.com/video/${bvid}`
}

export function bilibiliEmbedUrl(
  bvid: string,
  opts?: { autoplay?: boolean; muted?: boolean }
): string {
  const params = new URLSearchParams({
    isOutside: 'true',
    bvid,
    high_quality: '1',
    danmaku: '0',
  })
  if (opts?.autoplay) {
    params.set('autoplay', '1')
    params.set('muted', opts.muted === false ? '0' : '1')
  }
  return `https://player.bilibili.com/player.html?${params.toString()}`
}

export function youtubeEmbedUrl(
  videoId: string,
  opts?: { autoplay?: boolean; mute?: boolean; origin?: string }
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  if (opts?.autoplay) {
    params.set('autoplay', '1')
    params.set('mute', '1')
  } else if (opts?.mute) {
    params.set('mute', '1')
  }
  if (opts?.origin) params.set('origin', opts.origin)
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

export function defaultPlatformForShort(short: ViralAiShort): 'youtube' | 'bilibili' {
  if (short.preferredPlatform) return short.preferredPlatform
  if (short.bilibiliBvid) return 'bilibili'
  if (short.youtubeVideoId) return 'youtube'
  return 'youtube'
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function displayTitle(short: ViralAiShort): string {
  return short.title
}

export function displaySubtitle(short: ViralAiShort): string | null {
  if (short.originalTitle && short.originalTitle !== short.title) {
    return short.originalTitle
  }
  return null
}
