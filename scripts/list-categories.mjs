import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
p.tool.groupBy({ by: ['category'], _count: true, orderBy: { _count: { category: 'desc' } } })
  .then((r) => { r.forEach((x) => console.log(x._count, x.category)) })
  .finally(() => p.$disconnect())
