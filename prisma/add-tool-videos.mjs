/**
 * 给热门工具添加 YouTube 演示视频
 * node prisma/add-tool-videos.mjs
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// slug → YouTube URL（选择官方或高质量教程视频）
const videos = {
  'chatgpt':            'https://youtu.be/JTxsNm9IdYU',
  'midjourney':         'https://youtu.be/MBMlhypBHoI',
  'claude':             'https://youtu.be/QiinUjwBVKk',
  'cursor-ide':         'https://youtu.be/gqUQbjsYZLQ',
  'runway-ml':          'https://youtu.be/6mJHnJGXMxs',
  'elevenlabs':         'https://youtu.be/eo0wNqijUBE',
  'heygen':             'https://youtu.be/NNR_mGPDxJQ',
  'canva':              'https://youtu.be/4GI3w0MYgb0',
  'notion-ai':          'https://youtu.be/4YqAu0JR1JE',
  'google-gemini':      'https://youtu.be/Q_nDSo5GFOY',
  'perplexity-ai':      'https://youtu.be/wh3O9HlhOLc',
  'grammarly':          'https://youtu.be/FnkIoBWoKBM',
};

let updated = 0;
for (const [slug, videoUrl] of Object.entries(videos)) {
  const tool = await prisma.tool.findFirst({ where: { slug } });
  if (!tool) { console.log(`⊘ Not found: ${slug}`); continue; }
  await prisma.tool.update({ where: { id: tool.id }, data: { videoUrl } });
  console.log(`✓ ${tool.name}`);
  updated++;
}

console.log(`\n✅ Updated ${updated} tools with video URLs`);
await prisma.$disconnect();
