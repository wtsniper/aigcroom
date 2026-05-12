import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('开始迁移数据...')

  const dbPath = path.join(process.cwd(), 'data', 'db.json')
  const jsonData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

  // 1. 迁移用户
  console.log('\n迁移用户...')
  for (const user of jsonData.users || []) {
    try {
      await prisma.user.upsert({
        where: { id: user.id || `user_${Math.random()}` },
        update: {},
        create: {
          id: user.id || undefined,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role || 'USER',
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
        },
      })
      console.log(`  - ${user.email}`)
    } catch (e: any) {
      console.log(`  跳过用户 ${user.email}: ${e.message}`)
    }
  }

  // 2. 迁移工具
  console.log('\n迁移工具...')
  for (const tool of jsonData.tools || []) {
    try {
      await prisma.tool.upsert({
        where: { slug: tool.slug },
        update: {},
        create: {
          id: tool.id || undefined,
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          logoUrl: tool.logoUrl || '',
          websiteUrl: tool.website || '',
          affiliateUrl: '',
          category: tool.category || '',
          rating: tool.rating || 0,
          ratingFeatures: 0,
          ratingEase: 0,
          ratingValue: 0,
          ratingSupport: 0,
          pricingType: tool.pricing === 'Freemium' ? 'FREEMIUM' : tool.pricing === 'Paid' ? 'PAID' : 'FREE',
          priceMonthly: null,
          priceYearly: null,
          tags: tool.features ? JSON.stringify(tool.features) : null,
          pros: tool.pros ? JSON.stringify(tool.pros) : null,
          cons: tool.cons ? JSON.stringify(tool.cons) : null,
          isFeatured: tool.isFeatured || false,
          createdAt: tool.createdAt ? new Date(tool.createdAt) : new Date(),
          updatedAt: tool.updatedAt ? new Date(tool.updatedAt) : new Date(),
        },
      })
      console.log(`  - ${tool.name}`)
    } catch (e: any) {
      console.log(`  跳过工具 ${tool.name}: ${e.message}`)
    }
  }

  // 3. 迁移评测文章
  console.log('\n迁移评测文章...')
  for (const review of jsonData.reviews || []) {
    try {
      await prisma.review.upsert({
        where: { slug: review.slug },
        update: {},
        create: {
          id: review.id || undefined,
          title: review.title,
          slug: review.slug,
          excerpt: review.excerpt,
          content: review.content,
          toolId: review.toolId || null,
          authorId: review.authorId || (jsonData.users?.[0]?.id) || '',
          status: review.status || 'PUBLISHED',
          publishedAt: review.createdAt ? new Date(review.createdAt) : new Date(),
          createdAt: review.createdAt ? new Date(review.createdAt) : new Date(),
          updatedAt: review.updatedAt ? new Date(review.updatedAt) : new Date(),
        },
      })
      console.log(`  - ${review.title}`)
    } catch (e: any) {
      console.log(`  跳过评测 ${review.title}: ${e.message}`)
    }
  }

  // 4. 迁移解决方案
  console.log('\n迁移解决方案...')
  for (const solution of jsonData.solutions || []) {
    try {
      await prisma.solution.upsert({
        where: { slug: solution.slug },
        update: {},
        create: {
          id: solution.id || undefined,
          title: solution.title,
          slug: solution.slug,
          description: solution.description,
          industry: solution.industry,
          icon: '',
          toolIds: solution.tools ? JSON.stringify(solution.tools) : null,
          isFeatured: solution.isFeatured || false,
          createdAt: solution.createdAt ? new Date(solution.createdAt) : new Date(),
          updatedAt: solution.updatedAt ? new Date(solution.updatedAt) : new Date(),
        },
      })
      console.log(`  - ${solution.title}`)
    } catch (e: any) {
      console.log(`  跳过解决方案 ${solution.title}: ${e.message}`)
    }
  }

  // 5. 迁移联盟链接
  console.log('\n迁移联盟链接...')
  for (const link of jsonData.affiliateLinks || []) {
    try {
      await prisma.affiliateLink.upsert({
        where: { slug: link.slug },
        update: {},
        create: {
          id: link.id || undefined,
          toolId: link.toolId || null,
          url: link.url,
          slug: link.slug,
          clicks: link.clicks || 0,
          conversions: link.conversions || 0,
          revenue: link.revenue || 0,
          createdAt: link.createdAt ? new Date(link.createdAt) : new Date(),
          updatedAt: link.updatedAt ? new Date(link.updatedAt) : new Date(),
        },
      })
      console.log(`  - ${link.slug}`)
    } catch (e: any) {
      console.log(`  跳过联盟链接 ${link.slug}: ${e.message}`)
    }
  }

  // 6. 迁移订阅
  console.log('\n迁移订阅...')
  for (const sub of jsonData.subscriptions || []) {
    try {
      await prisma.subscription.upsert({
        where: { userId: sub.userId },
        update: {},
        create: {
          id: sub.id || undefined,
          userId: sub.userId,
          planType: sub.planType || 'FREE',
          status: sub.status || 'ACTIVE',
          createdAt: sub.createdAt ? new Date(sub.createdAt) : new Date(),
          updatedAt: sub.updatedAt ? new Date(sub.updatedAt) : new Date(),
        },
      })
      console.log(`  - 用户 ${sub.userId}`)
    } catch (e: any) {
      console.log(`  跳过订阅 ${sub.userId}: ${e.message}`)
    }
  }

  console.log('\n✅ 数据迁移完成！')
}

main()
  .catch((e) => {
    console.error('迁移失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
