import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

function ensureDbExists() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      tools: [],
      reviews: [],
      solutions: [],
      affiliateLinks: [],
      affiliateClicks: [],
      subscriptions: [],
      comparisons: [],
      pricingPlans: [],
      favorites: [],
      accounts: [],
      sessions: [],
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2))
  }
}

function readDb() {
  ensureDbExists()
  const data = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

function writeDb(data: any) {
  ensureDbExists()
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

export const db = {
  user: {
    findUnique: async ({ where }: { where: any }) => {
      const db = readDb()
      if (where.email) {
        return db.users.find((u: any) => u.email === where.email) || null
      }
      if (where.id) {
        return db.users.find((u: any) => u.id === where.id) || null
      }
      return null
    },
    findMany: async ({ where, orderBy }: { where?: any; orderBy?: any } = {}) => {
      const db = readDb()
      let results = db.users
      if (where) {
        results = results.filter((u: any) => {
          return Object.entries(where).every(([key, value]) => u[key] === value)
        })
      }
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results = [...results].sort((a: any, b: any) => {
          if (direction === 'desc') {
            return b[field] > a[field] ? 1 : -1
          }
          return a[field] > b[field] ? 1 : -1
        })
      }
      return results
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newUser = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.users.push(newUser)
      writeDb(db)
      return newUser
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      const db = readDb()
      const index = db.users.findIndex((u: any) => u.id === where.id)
      if (index === -1) return null
      db.users[index] = { ...db.users[index], ...data, updatedAt: new Date().toISOString() }
      writeDb(db)
      return db.users[index]
    },
    delete: async ({ where }: { where: any }) => {
      const db = readDb()
      db.users = db.users.filter((u: any) => u.id !== where.id)
      writeDb(db)
      return { count: 1 }
    },
  },

  tool: {
    findMany: async ({ where, orderBy, include, skip, take }: any = {}) => {
      const db = readDb()
      let results = db.tools
      if (where) {
        results = results.filter((t: any) => {
          return Object.entries(where).every(([key, value]) => {
            if (key === 'isFeatured') return t[key] === value
            return t[key] === value
          })
        })
      }
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results = [...results].sort((a: any, b: any) => {
          if (direction === 'desc') {
            return new Date(b[field]) > new Date(a[field]) ? 1 : -1
          }
          return new Date(a[field]) > new Date(b[field]) ? 1 : -1
        })
      }
      if (skip) results = results.slice(skip)
      if (take) results = results.slice(0, take)
      
      if (include) {
        results = results.map((tool: any) => {
          const result = { ...tool }
          if (include.pricingPlans) {
            result.pricingPlans = db.pricingPlans.filter((p: any) => p.toolId === tool.id)
          }
          if (include.affiliateLinks) {
            result.affiliateLinks = db.affiliateLinks.filter((l: any) => l.toolId === tool.id)
          }
          if (include.favorites) {
            result.favorites = db.favorites.filter((f: any) => f.toolId === tool.id)
          }
          if (include.reviews) {
            result.reviews = db.reviews.filter((r: any) => r.toolId === tool.id)
          }
          return result
        })
      }
      return results
    },
    findUnique: async ({ where, include }: { where: any; include?: any }) => {
      const db = readDb()
      const tool = db.tools.find((t: any) => t.slug === where.slug || t.id === where.id) || null
      if (tool && include) {
        if (include.pricingPlans) {
          tool.pricingPlans = db.pricingPlans.filter((p: any) => p.toolId === tool.id)
        }
        if (include.affiliateLinks) {
          tool.affiliateLinks = db.affiliateLinks.filter((l: any) => l.toolId === tool.id)
        }
      }
      return tool
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newTool = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.tools.push(newTool)
      writeDb(db)
      return newTool
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      const db = readDb()
      const index = db.tools.findIndex((t: any) => t.id === where.id)
      if (index === -1) return null
      db.tools[index] = { ...db.tools[index], ...data, updatedAt: new Date().toISOString() }
      writeDb(db)
      return db.tools[index]
    },
    delete: async ({ where }: { where: any }) => {
      const db = readDb()
      db.tools = db.tools.filter((t: any) => t.id !== where.id)
      db.pricingPlans = db.pricingPlans.filter((p: any) => p.toolId !== where.id)
      db.affiliateLinks = db.affiliateLinks.filter((l: any) => l.toolId !== where.id)
      writeDb(db)
      return { count: 1 }
    },
    count: async ({ where }: { where?: any } = {}) => {
      const db = readDb()
      let tools = db.tools
      if (where) {
        tools = tools.filter((t: any) => {
          return Object.entries(where).every(([key, value]) => t[key] === value)
        })
      }
      return tools.length
    },
  },

  review: {
    findMany: async ({ where, orderBy, include, skip, take }: any = {}) => {
      const db = readDb()
      let results = db.reviews
      if (where) {
        results = results.filter((r: any) => {
          return Object.entries(where).every(([key, value]) => r[key] === value)
        })
      }
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results = [...results].sort((a: any, b: any) => {
          if (direction === 'desc') {
            return new Date(b[field]) > new Date(a[field]) ? 1 : -1
          }
          return new Date(a[field]) > new Date(b[field]) ? 1 : -1
        })
      }
      if (skip) results = results.slice(skip)
      if (take) results = results.slice(0, take)
      
      if (include) {
        results = results.map((review: any) => {
          const result = { ...review }
          if (include.author) {
            result.author = db.users.find((u: any) => u.id === review.authorId) || null
          }
          if (include.tool) {
            result.tool = db.tools.find((t: any) => t.id === review.toolId) || null
          }
          return result
        })
      }
      return results
    },
    findUnique: async ({ where, include }: { where: any; include?: any }) => {
      const db = readDb()
      let review = null
      if (where.slug) {
        review = db.reviews.find((r: any) => r.slug === where.slug) || null
      }
      if (!review && where.id) {
        review = db.reviews.find((r: any) => r.id === where.id) || null
      }
      if (review && include) {
        if (include.author) {
          review.author = db.users.find((u: any) => u.id === review.authorId)
        }
        if (include.tool) {
          review.tool = db.tools.find((t: any) => t.id === review.toolId)
        }
      }
      return review
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newReview = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.reviews.push(newReview)
      writeDb(db)
      return newReview
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      const db = readDb()
      const index = db.reviews.findIndex((r: any) => r.id === where.id)
      if (index === -1) return null
      db.reviews[index] = { ...db.reviews[index], ...data, updatedAt: new Date().toISOString() }
      writeDb(db)
      return db.reviews[index]
    },
    delete: async ({ where }: { where: any }) => {
      const db = readDb()
      db.reviews = db.reviews.filter((r: any) => r.id !== where.id)
      writeDb(db)
      return { count: 1 }
    },
    count: async ({ where }: { where?: any } = {}) => {
      const db = readDb()
      let reviews = db.reviews
      if (where) {
        reviews = reviews.filter((r: any) => {
          return Object.entries(where).every(([key, value]) => r[key] === value)
        })
      }
      return reviews.length
    },
  },

  solution: {
    findMany: async ({ where, orderBy, skip, take }: any = {}) => {
      const db = readDb()
      let results = db.solutions
      if (where) {
        results = results.filter((s: any) => {
          return Object.entries(where).every(([key, value]) => s[key] === value)
        })
      }
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results = [...results].sort((a: any, b: any) => {
          if (direction === 'desc') {
            return new Date(b[field]) > new Date(a[field]) ? 1 : -1
          }
          return new Date(a[field]) > new Date(b[field]) ? 1 : -1
        })
      }
      if (skip) results = results.slice(skip)
      if (take) results = results.slice(0, take)
      return results
    },
    findUnique: async ({ where }: { where: any }) => {
      const db = readDb()
      return db.solutions.find((s: any) => s.slug === where.slug || s.id === where.id) || null
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newSolution = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.solutions.push(newSolution)
      writeDb(db)
      return newSolution
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      const db = readDb()
      const index = db.solutions.findIndex((s: any) => s.id === where.id)
      if (index === -1) return null
      db.solutions[index] = { ...db.solutions[index], ...data, updatedAt: new Date().toISOString() }
      writeDb(db)
      return db.solutions[index]
    },
    delete: async ({ where }: { where: any }) => {
      const db = readDb()
      db.solutions = db.solutions.filter((s: any) => s.id !== where.id)
      writeDb(db)
      return { count: 1 }
    },
    count: async () => {
      const db = readDb()
      return db.solutions.length
    },
  },

  affiliateLink: {
    findMany: async ({ where, orderBy }: any = {}) => {
      const db = readDb()
      let results = db.affiliateLinks
      if (where) {
        results = results.filter((l: any) => {
          return Object.entries(where).every(([key, value]) => l[key] === value)
        })
      }
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results = [...results].sort((a: any, b: any) => {
          if (direction === 'desc') {
            return b[field] > a[field] ? 1 : -1
          }
          return a[field] > b[field] ? 1 : -1
        })
      }
      return results
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newLink = {
        ...data,
        id: generateId(),
        clicks: data.clicks || 0,
        conversions: data.conversions || 0,
        revenue: data.revenue || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.affiliateLinks.push(newLink)
      writeDb(db)
      return newLink
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      const db = readDb()
      const index = db.affiliateLinks.findIndex((l: any) => l.id === where.id)
      if (index === -1) return null
      db.affiliateLinks[index] = { ...db.affiliateLinks[index], ...data, updatedAt: new Date().toISOString() }
      writeDb(db)
      return db.affiliateLinks[index]
    },
    delete: async ({ where }: { where: any }) => {
      const db = readDb()
      db.affiliateLinks = db.affiliateLinks.filter((l: any) => l.id !== where.id)
      writeDb(db)
      return { count: 1 }
    },
  },

  affiliateClick: {
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newClick = {
        ...data,
        id: generateId(),
        clickedAt: new Date().toISOString(),
      }
      db.affiliateClicks.push(newClick)
      writeDb(db)
      return newClick
    },
    findMany: async ({ where }: any = {}) => {
      const db = readDb()
      let results = db.affiliateClicks
      if (where) {
        results = results.filter((c: any) => {
          return Object.entries(where).every(([key, value]) => c[key] === value)
        })
      }
      return results
    },
  },

  pricingPlan: {
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newPlan = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.pricingPlans.push(newPlan)
      writeDb(db)
      return newPlan
    },
    findMany: async ({ where }: any = {}) => {
      const db = readDb()
      let results = db.pricingPlans
      if (where) {
        results = results.filter((p: any) => {
          return Object.entries(where).every(([key, value]) => p[key] === value)
        })
      }
      return results
    },
  },

  subscription: {
    findMany: async ({ where }: any = {}) => {
      const db = readDb()
      let results = db.subscriptions
      if (where) {
        results = results.filter((s: any) => {
          return Object.entries(where).every(([key, value]) => s[key] === value)
        })
      }
      return results
    },
    findUnique: async ({ where }: { where: any }) => {
      const db = readDb()
      return db.subscriptions.find((s: any) => s.userId === where.userId) || null
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newSub = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.subscriptions.push(newSub)
      writeDb(db)
      return newSub
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      const db = readDb()
      const index = db.subscriptions.findIndex((s: any) => s.userId === where.userId)
      if (index === -1) return null
      db.subscriptions[index] = { ...db.subscriptions[index], ...data, updatedAt: new Date().toISOString() }
      writeDb(db)
      return db.subscriptions[index]
    },
  },

  comparison: {
    findMany: async ({ orderBy, skip, take }: any = {}) => {
      const db = readDb()
      let results = db.comparisons
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0]
        results = [...results].sort((a: any, b: any) => {
          if (direction === 'desc') {
            return new Date(b[field]) > new Date(a[field]) ? 1 : -1
          }
          return new Date(a[field]) > new Date(b[field]) ? 1 : -1
        })
      }
      if (skip) results = results.slice(skip)
      if (take) results = results.slice(0, take)
      return results
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newComparison = {
        ...data,
        id: generateId(),
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.comparisons.push(newComparison)
      writeDb(db)
      return newComparison
    },
  },

  favorite: {
    findMany: async ({ where }: any = {}) => {
      const db = readDb()
      let results = db.favorites
      if (where) {
        results = results.filter((f: any) => {
          return Object.entries(where).every(([key, value]) => f[key] === value)
        })
      }
      return results
    },
    create: async ({ data }: { data: any }) => {
      const db = readDb()
      const newFavorite = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      db.favorites.push(newFavorite)
      writeDb(db)
      return newFavorite
    },
    delete: async ({ where }: { where: any }) => {
      const db = readDb()
      db.favorites = db.favorites.filter((f: any) => !(f.userId === where.userId && f.toolId === where.toolId))
      writeDb(db)
      return { count: 1 }
    },
  },

  $queryRaw: async (query: any) => {
    return []
  },
}
