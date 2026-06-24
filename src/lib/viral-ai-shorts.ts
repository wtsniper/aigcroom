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
    id: 'paperclip-heart',
    title: 'Paperclip Heart',
    creator: 'Tim Simmons / Theoretically Media',
    creatorHandle: '@TheoreticallyMedia',
    description:
      'AI dystopia framed as a product launch — Solace, an ambient companion that cures loneliness until comfort becomes control. June 2026 "film of the week" in AI filmmaker circles; title references the paperclip maximizer thought experiment.',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video generation' },
      { name: 'Claude Cowork', role: 'Production office / MCP workflow' },
      { name: 'Suno', role: 'Music' },
    ],
    youtubeVideoId: 'Wb2AcOVwPQs',
    youtubeNote: 'Full film (~8 min). Workflow breakdown on Theoretically Media channel.',
    galleryUrl: 'https://theoreticallymedia.beehiiv.com/',
    duration: '8:19',
    tags: ['Seedance', 'Dystopia', 'Film of the Week', 'Theoretically Media'],
    viralNote:
      'Featured in AI-Weekly (Jun 2026), Michael Korican SOTA AIGC roundup, and tippet.org Film of the Week community vote — standout AI-as-horror narrative using Seedance 2.0 + Claude MCP workflow.',
    featured: true,
    sortOrder: 0,
  },
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
      { name: 'Flux', slug: 'flux-ai', role: 'Select frames' },
      { name: 'CapCut Pro', slug: 'capcut-ai', role: 'Edit, grade, subtitles' },
    ],
    bilibiliBvid: 'BV1FFRQB2Eqw',
    galleryUrl: 'https://curiousrefuge.com/ai-film-gallery',
    duration: '3:34',
    tags: ['Seedance', 'Wasteland', 'Viral 2026', 'China'],
    viralNote:
      'Sina News and Newswav (May 2026) reported tens of millions of views overseas; Newswav cited 70M+ plays on Douyin alone. Hollywood AI producer PJ Ace publicly searched for the creator on X to collaborate.',
    featured: true,
    preferredPlatform: 'bilibili',
    sortOrder: 3,
  },
  {
    id: 'veo-sailor-sea',
    title: 'Veo 3 Demo — Sailor and the Sea',
    creator: 'Google DeepMind',
    description:
      'Official Google DeepMind Veo 3 clip: a sailor on deck delivers dialogue with native audio, churning sea, and lip-sync — one of the most-watched official AI video demos on YouTube.',
    tools: [
      { name: 'Google Veo 3', role: 'Text-to-video + native audio/dialogue' },
      { name: 'Google Gemini', slug: 'google-gemini', role: 'Consumer access via Gemini app' },
    ],
    youtubeVideoId: 'mCFMn0UkRt0',
    youtubeNote: 'Official Google DeepMind channel. More demos: Feather’s Journey (vcHxAwDwPOg).',
    galleryUrl: 'https://deepmind.google/models/veo/',
    duration: '0:08',
    tags: ['Veo 3', 'Google', 'Native Audio', 'Official'],
    viralNote:
      'Google DeepMind upload (May 2025). Public view count on YouTube exceeded 500K — among the most-watched official generative-video demos on the platform.',
    sortOrder: 4,
  },
  {
    id: 'hell-grind',
    title: 'Hell Grind — Episode 1',
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
      'Official Episode 1 (22 min) on Higgsfield AI YouTube. Trailer listed separately. Full series on higgsfield.ai/original-series/hell-grind.',
    galleryUrl: 'https://higgsfield.ai/original-series/hell-grind/episode-1',
    duration: '22:32 (Ep. 1)',
    tags: ['Seedance', 'Cannes 2026', 'AI Feature', 'Higgsfield'],
    viralNote:
      'Higgsfield reports ~$500K total budget (~$400K compute), 15-person team, 14-day generation window. SCMP and TechNode covered the Cannes city screening (May 2026).',
    sortOrder: 7,
  },
  {
    id: 'hell-grind-trailer',
    title: 'Hell Grind — Official Trailer',
    creator: 'Higgsfield AI / Aitore Zholdaskali',
    description:
      'Cannes 2026 industry-preview trailer for Hell Grind — the 95-minute AI-native sci-fi heist feature built entirely on Higgsfield with Dreamina Seedance 2.0, Soul Cinema, and Soul Cast.',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video (Dreamina / Higgsfield)' },
      { name: 'Soul Cinema', role: 'Character & world consistency' },
      { name: 'Soul Cast', role: 'Cast / character pipeline' },
    ],
    youtubeVideoId: 'CVzfQuC0aMU',
    youtubeNote: 'Official Higgsfield AI trailer. Full Episode 1 listed separately.',
    galleryUrl: 'https://higgsfield.ai/original-series/hell-grind',
    duration: '3:08',
    tags: ['Seedance', 'Cannes 2026', 'Trailer', 'Higgsfield'],
    viralNote:
      'Higgsfield AI official upload (May 2026). Press reported ~150K+ YouTube views on the trailer; SCMP and Joblo covered the Cannes market screening.',
    sortOrder: 4,
  },
  {
    id: 'dragon-blue',
    title: 'Dragon Blue',
    creator: 'Tim Simmons / Theoretically Media',
    description:
      'Hyper-stylized action AI short — katana revenge in a neon-soaked world. Widely shared in AI filmmaker circles as a benchmark for Seedance 2.0 + reference-image pipelines in March 2026.',
    tools: [
      { name: 'Seedance 2.0', role: 'Video via Dreamina Omni model' },
      { name: 'Nano Banana Pro', role: 'Reference stills & character frames' },
      { name: 'Claude Cowork', role: 'Production office / script pipeline' },
    ],
    youtubeVideoId: 'dRjN6Cr2Z00',
    youtubeNote:
      'Full film. BTS masterclass: youtube.com/watch?v=ORuSQ0Fui-A. Creator reports ~$187 production cost in walkthrough.',
    galleryUrl: 'https://theoreticallymedia.beehiiv.com/p/the-ultimate-ai-film-pipeline',
    duration: 'Full short',
    tags: ['Seedance', 'Action', 'Workflow', 'Theoretically Media'],
    viralNote:
      'Covered by Michael Korican, Aatventure, and Draven’s Tales (March–April 2026) as a state-of-the-art GAIV showcase. Creator published free Claude SKILL.md pipeline.',
    sortOrder: 5,
  },
  {
    id: 'seedance-viral-formats',
    title: 'Seedance 2.0 — Viral Formats Breakdown',
    creator: 'Higgsfield AI',
    description:
      'Official Higgsfield walkthrough of five Shorts formats going viral in 2026: transformations, POV power sequences, samurai train fights, animation, and fight choreography — all single-generation Seedance 2.0.',
    tools: [
      { name: 'Seedance 2.0', role: 'All formats shown' },
      { name: 'Soul Cinema', role: 'Character references' },
      { name: 'Claude Cowork', role: 'Prompt skill (linked in video)' },
    ],
    youtubeVideoId: 'PsQovs2FwqQ',
    youtubeNote: 'Official Higgsfield AI channel — includes copy-paste prompts in description.',
    galleryUrl: 'https://higgsfield.ai/blog/guide-youtube-seedance2.0',
    duration: '11:34',
    tags: ['Seedance', 'YouTube Shorts', 'Tutorial', 'Higgsfield'],
    viralNote:
      'Higgsfield official upload (April 2026). Describes POV, transformation, and fight formats trending across Shorts/Reels/TikTok.',
    sortOrder: 6,
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
    sortOrder: 8,
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
    sortOrder: 9,
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
    sortOrder: 10,
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
    sortOrder: 11,
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
    sortOrder: 12,
  },
  {
    id: 'the-patchwright',
    title: 'The Patchwright',
    creator: 'Gossip Goblin / Zack London',
    description:
      'A 21-minute cyberpunk AI short film set in the sprawling slag heaps of NiiroCradle. A fugitive android visits the Patchwright, an unlicensed body mechanic, begging him to trace a fragment of a childhood memory. Photo-realistic visuals compared to Hollywood productions.',
    tools: [
      { name: 'Midjourney', slug: 'midjourney', role: 'Character and environment concept design' },
      { name: 'Nano Banana Pro', role: 'Character-environment fusion and consistency' },
      { name: 'Kling AI', slug: 'kling-ai', role: 'Main video generation' },
      { name: 'SyncLabs', role: 'Lip-sync and performance adjustment' },
    ],
    youtubeVideoId: '-Rzl7nUdEs4',
    youtubeNote: 'Official Gossip Goblin channel. Watch in 4K for best results.',
    galleryUrl: 'https://www.youtube.com/@GossipGoblin',
    duration: '21:32',
    tags: ['Cyberpunk', 'Gossip Goblin', 'Viral 2026', 'Hollywood Interest'],
    viralNote:
      'Reached 11 million+ views on YouTube since April 2026 release. Hollywood agents, producers, and A-list actors reportedly flying to Stockholm to meet the team. Joe Rogan publicly praised the work.',
    featured: true,
    sortOrder: 1,
  },
  {
    id: 'sincitium',
    title: 'Sincitium',
    originalTitle: '合胞体',
    creator: 'ContAnimation / Javier De La Chica & Guillermo Miranda',
    description:
      'A 2:29 AI animated short film that won the Grand Prize ($50,000) at Runway\'s inaugural Big Pitch Contest. Set in an isolated desert town where all residents are connected through a mysterious biological network called Sincitium. A female doctor discovers the horrifying truth.',
    tools: [
      { name: 'Runway', slug: 'runway-ml', role: 'Primary video generation and Nano Banana for storyboarding' },
      { name: 'Nano Banana', role: 'Storyboard and concept frames' },
    ],
    youtubeVideoId: 'YS8dn-VJBEU',
    youtubeNote: 'ContAnimation official upload. Part of Runway Big Pitch Contest winning entry.',
    galleryUrl: 'https://runwayml.com/bigpitchcontest',
    duration: '2:29',
    tags: ['Runway', 'Contest Winner', 'Love Death + Robots Style', 'Cthulhu'],
    viralNote:
      'Created in just 7 days with under $2,000 budget. Reached 2 million+ views within 2 days of release. Won $50,000 Grand Prize at Runway Big Pitch Contest (May 2026).',
    sortOrder: 8,
  },
  {
    id: 'runway-pigeon',
    title: 'Push The Button',
    creator: 'Marko Slavnic / Runway',
    description:
      'A 47-second AI-generated Pixar-style animation featuring pigeons in a desert town. Created by Runway\'s Technical Artist Marko Slavnic as a quick demonstration of the platform\'s capabilities. The short went viral with millions of views across platforms.',
    tools: [
      { name: 'Runway', slug: 'runway-ml', role: 'Full video generation' },
    ],
    youtubeVideoId: 'mRKJxN9b9Yg',
    youtubeNote: 'Marko Slavnic official upload. Quick demo showcasing Runway\'s animation capabilities.',
    duration: '0:47',
    tags: ['Runway', 'Pixar Style', 'Pigeons', 'Viral Demo'],
    viralNote:
      'Reached millions of views across platforms shortly after release (May 2026). Demonstrates Runway\'s ability to create Pixar-quality animation in under a minute.',
    sortOrder: 3,
  },
  {
    id: 'arena-zero-ep1',
    title: 'Arena Zero — Episode 1',
    creator: 'Higgsfield AI',
    description:
      'Higgsfield’s long-form AI action series — billed as the first complete AI streaming-style original. Episode 1 showcases Cinema Studio and Seedance 2.0 at feature length.',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video generation' },
      { name: 'Soul Cinema', role: 'Character & scene consistency' },
    ],
    youtubeVideoId: 'qqcH-1Rk-ow',
    youtubeNote: 'Official Higgsfield AI channel — Higgsfield Original Series.',
    galleryUrl: 'https://higgsfield.ai/original-series',
    duration: '10:03',
    tags: ['Seedance', 'Action', 'Higgsfield', 'Series'],
    viralNote:
      'Higgsfield AI official upload (March 2026). Public YouTube view count exceeded 1.8M — among the most-watched AI original series episodes on the platform.',
    sortOrder: 2,
  },
  {
    id: 'bone-throne',
    title: 'Bone Throne',
    creator: 'Lennard Smith',
    description:
      'Fantasy action AI short — a warrior infiltrates a desert fortress built around a colossal skeleton to rescue his father from his tyrant brother. Higgsfield Action Contest entry.',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video generation' },
      { name: 'Kling AI', slug: 'kling-ai', role: 'Select action shots' },
    ],
    youtubeVideoId: '6D4_ZMnPx7I',
    youtubeNote: 'Lennard Smith channel. Creator notes longer-format development in progress.',
    duration: '5:00',
    tags: ['Seedance', 'Kling', 'Fantasy', 'Action'],
    viralNote:
      'Lennard Smith upload (February 2026). Public YouTube view count ~300K; finalist in Higgsfield Action Contest.',
    sortOrder: 7,
  },
  {
    id: 'replaced-by-ai',
    title: 'Replaced by AI!',
    creator: 'Rogue Cell Pictures',
    description:
      'Satirical action AI short — an AI engineer learns his job is being eliminated by the very systems he built, then fights back through the corporate HQ.',
    tools: [
      { name: 'Seedance 2.0', role: 'Primary video generation' },
    ],
    youtubeVideoId: 'gLTbl8Jfi4s',
    duration: '4:30',
    tags: ['Seedance', 'Satire', 'Action', 'Corporate'],
    viralNote:
      'Rogue Cell Pictures upload (February 2026). Public YouTube view count exceeded 100K within weeks of release.',
    sortOrder: 9,
  },
  {
    id: 'ai-man',
    title: 'AI MAN',
    creator: 'Heydin',
    description:
      'Cinematic sci-fi AI short — creator’s first narrative film built with Seedance 2.0, using Midjourney V7 and Nano Banana Pro for keyframe references.',
    tools: [
      { name: 'Seedance 2.0', role: 'Video generation' },
      { name: 'Midjourney', slug: 'midjourney', role: 'Base stills (V7)' },
      { name: 'Nano Banana Pro', role: 'Character frames' },
    ],
    youtubeVideoId: 'dp4-Sv0uVzE',
    duration: '4:30',
    tags: ['Seedance', 'Sci-Fi', 'Indie'],
    viralNote:
      'Heydin channel upload (February 2026). Public YouTube view count ~85K.',
    sortOrder: 10,
  },
  {
    id: 'veo-feather-journey',
    title: 'Veo 3 Demo — Feather\'s Journey',
    creator: 'Google DeepMind',
    description:
      'Official Veo 3 micro-film: a feather lifts from a fence post and drifts over rooftops with native ambient audio — a poetic physics demo from Google DeepMind.',
    tools: [
      { name: 'Google Veo 3', role: 'Text-to-video + native audio' },
    ],
    youtubeVideoId: 'vcHxAwDwPOg',
    youtubeNote: 'Official Google DeepMind channel. Pair with Sailor and the Sea demo on this hub.',
    galleryUrl: 'https://deepmind.google/models/veo/',
    duration: '0:08',
    tags: ['Veo 3', 'Google', 'Official'],
    viralNote:
      'Google DeepMind upload (May 2025). Public YouTube view count ~54K.',
    sortOrder: 21,
  },
  {
    id: 'stay-seedance',
    title: 'STAY',
    creator: 'ZenityX',
    description:
      'Experimental narrative AI short leaning into nostalgia, memory fragments, and aesthetic storytelling — creator pushed Seedance 2.0 beyond typical action/demo clips.',
    tools: [{ name: 'Seedance 2.0', role: 'Full generation' }],
    youtubeVideoId: 'lbAV0DgWIyI',
    duration: '8:59',
    tags: ['Seedance', 'Experimental', 'Art Film'],
    sortOrder: 22,
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

export const AI_SHORTS_PAGE_SIZE = 6

export function getSortedViralShorts(): ViralAiShort[] {
  return [...VIRAL_AI_SHORTS].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function paginateViralShortsList(
  shorts: ViralAiShort[],
  page: number,
  pageSize = AI_SHORTS_PAGE_SIZE
) {
  const sorted = [...shorts].sort((a, b) => a.sortOrder - b.sortOrder)
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * pageSize
  return {
    items: sorted.slice(start, start + pageSize),
    totalPages,
    currentPage,
    total: sorted.length,
  }
}

export function paginateViralShorts(page: number, pageSize = AI_SHORTS_PAGE_SIZE) {
  return paginateViralShortsList(getSortedViralShorts(), page, pageSize)
}

export function getFeaturedFromList(shorts: ViralAiShort[]): ViralAiShort {
  const sorted = [...shorts].sort((a, b) => a.sortOrder - b.sortOrder)
  return sorted.find((s) => s.featured) ?? sorted[0]
}
