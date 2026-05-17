# 系统架构文档
## 项目：PixSell AI — 跨境卖家 AI 营销素材生成平台
**版本：** v1.0  |  **日期：** 2026-05-16  |  **角色：架构师**

---

## 一、技术选型原则

1. **复用优先**：最大化复用 AIGC Room 已有代码（Next.js + Prisma + Stripe + NextAuth），降低开发成本
2. **按需付费**：AI 服务调用按量计费，避免固定高额基础设施成本
3. **快速验证**：MVP 阶段优先选择托管服务（Vercel/Supabase），而非自建服务器
4. **可替换性**：AI 模型调用层抽象化，未来可以切换到更好/更便宜的模型

---

## 二、整体架构图

```
┌──────────────────────────────────────────────────────────────────┐
│                        用户浏览器                                 │
│           Next.js App Router (前端 + API Routes)                  │
└─────────────────────────┬────────────────────────────────────────┘
                          │ HTTPS
         ┌────────────────▼────────────────┐
         │         Vercel (托管)            │
         │    Next.js 14 App Router        │
         │  ┌──────────┐ ┌──────────────┐  │
         │  │  Pages   │ │  API Routes  │  │
         │  │ (React)  │ │  /api/...    │  │
         │  └──────────┘ └──────┬───────┘  │
         └─────────────────────┼───────────┘
                               │
        ┌──────────────────────┼───────────────────────────┐
        │                      │                           │
        ▼                      ▼                           ▼
┌──────────────┐    ┌─────────────────────┐    ┌───────────────────┐
│  PostgreSQL  │    │   AI 服务层          │    │  Cloudflare R2    │
│  (Supabase)  │    │  (图像处理队列)       │    │  (图片存储CDN)    │
│              │    │                     │    │                   │
│  - users     │    │  ┌───────────────┐  │    │  - 原始上传图片   │
│  - credits   │    │  │ Remove.bg API │  │    │  - 生成结果图片   │
│  - jobs      │    │  │ (抠图)        │  │    │  - 临时预览图     │
│  - images    │    │  └───────────────┘  │    │                   │
│  - brands    │    │  ┌───────────────┐  │    └───────────────────┘
│  - subs      │    │  │ Replicate API │  │
└──────────────┘    │  │ (Flux.1 场景) │  │
                    │  └───────────────┘  │
                    │  ┌───────────────┐  │
                    │  │ OpenAI API    │  │
                    │  │ (Prompt翻译)  │  │
                    │  └───────────────┘  │
                    └─────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────────┐
        │  Stripe  │    │ Resend   │    │  Upstash     │
        │ (支付)   │    │ (邮件)   │    │  Redis       │
        └──────────┘    └──────────┘    │  (任务队列)  │
                                        └──────────────┘
```

---

## 三、技术栈详情

### 3.1 前端

| 技术 | 版本 | 用途 | 选择原因 |
|------|------|------|---------|
| Next.js | 15.x | 全栈框架，SSR/SSG | 已在 AIGC Room 中使用，复用性高 |
| React | 19.x | UI 组件库 | 同上 |
| TypeScript | 5.x | 类型安全 | 同上 |
| Tailwind CSS | 3.x | 样式框架 | 同上 |
| Shadcn/UI | latest | 组件库 | 快速构建高质量 UI，比手写快 3x |
| React Query | 5.x | 服务端状态管理 | 图片生成轮询、缓存管理 |
| Zustand | 4.x | 客户端状态 | 轻量，生成流程状态管理 |
| React Dropzone | latest | 文件上传 | 拖拽上传图片 |

### 3.2 后端（Next.js API Routes）

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js API Routes | 15.x | RESTful API |
| NextAuth.js | 5.x | 身份认证（邮箱+Google+微信） |
| Prisma | 5.x | ORM |
| Zod | 3.x | 请求参数校验 |

### 3.3 数据库

| 技术 | 选型 | 用途 |
|------|------|------|
| PostgreSQL | Supabase（托管） | 主数据库（用户、订单、图片元数据） |
| Redis | Upstash（Serverless） | 图片生成任务队列、速率限制 |

### 3.4 AI 服务

| 服务 | 用途 | 定价 | 选择理由 |
|------|------|------|---------|
| **Remove.bg API** | 背景移除（抠图） | $0.1/图 | 精度最高，支持复杂背景 |
| **Replicate API - Flux.1 DEV** | 场景图生成 | ~$0.03–0.05/图 | 开源模型，性价比高，可本地化 |
| **OpenAI GPT-4o mini** | 中文→英文 Prompt 翻译 | $0.15/1M tokens | 快速、便宜、翻译质量高 |
| **Claid.ai API**（可选） | 图片超分/增强 | $0.05/图 | 提升输出图片质量 |

> **备选方案：** Replicate 上的 BRIA RMBG 模型可替代 Remove.bg，成本更低

### 3.5 存储与 CDN

| 服务 | 用途 | 定价 |
|------|------|------|
| **Cloudflare R2** | 图片存储 | $0.015/GB/月，免流量费 |
| **Cloudflare CDN** | 全球分发 | 免费（绑定 R2） |

> **为什么选 R2 而非 S3：** R2 没有出站流量费（AWS S3 有），对图片密集型应用成本低很多

### 3.6 第三方服务

| 服务 | 用途 |
|------|------|
| **Stripe** | 订阅支付（已在 AIGC Room 集成，直接复用） |
| **Resend** | 事务性邮件（验证码、通知） |
| **Sentry** | 错误监控 |
| **Vercel Analytics** | 页面访问分析 |
| **PostHog** | 用户行为分析 |

---

## 四、数据库设计（Prisma Schema）

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatar        String?
  passwordHash  String?   // null if OAuth only
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // 关联
  accounts      Account[]
  sessions      Session[]
  subscription  Subscription?
  credits       UserCredits?
  workspaces    Workspace[]
  images        GeneratedImage[]
  jobs          ProcessingJob[]
}

// NextAuth OAuth accounts
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String  // "google" | "wechat" | "credentials"
  providerAccountId String
  // ... standard NextAuth fields
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

// 订阅表
model Subscription {
  id                   String    @id @default(cuid())
  userId               String    @unique
  stripeCustomerId     String    @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  plan                 Plan      @default(FREE)
  status               SubStatus @default(ACTIVE)
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Plan {
  FREE
  STARTER
  PRO
  BUSINESS
  AGENCY
}

enum SubStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
}

// Credits 余额表
model UserCredits {
  id          String   @id @default(cuid())
  userId      String   @unique
  balance     Int      @default(10)   // 初始赠送 10 credits
  totalEarned Int      @default(10)
  totalUsed   Int      @default(0)
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  transactions CreditTransaction[]
}

// Credits 流水记录
model CreditTransaction {
  id          String          @id @default(cuid())
  creditsId   String
  amount      Int             // 正数=充值，负数=消耗
  type        TransactionType
  description String?
  jobId       String?
  createdAt   DateTime        @default(now())
  credits     UserCredits     @relation(fields: [creditsId], references: [id])
}

enum TransactionType {
  SIGNUP_BONUS
  SUBSCRIPTION_RENEWAL
  IMAGE_GENERATION
  BATCH_PROCESSING
  REFUND
}

// 工作空间（品牌）
model Workspace {
  id            String   @id @default(cuid())
  userId        String
  name          String
  logoUrl       String?
  primaryColor  String?
  preferredStyle String? // "modern" | "nordic" | "american" | etc.
  platform      String[] // ["amazon", "tiktok", "shopify"]
  category      String?  // "home" | "apparel" | "electronics" | etc.
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  images        GeneratedImage[]
}

// 图片生成记录
model GeneratedImage {
  id            String      @id @default(cuid())
  userId        String
  workspaceId   String?
  jobId         String?
  type          ImageType
  sourceUrl     String      // 原始上传图片 URL (R2)
  resultUrl     String?     // 生成结果 URL (R2)
  thumbnailUrl  String?
  exports       Json?       // { "amazon_main": "url", "tiktok": "url", ... }
  status        ImageStatus @default(PENDING)
  metadata      Json?       // 生成参数记录（场景、模板ID等）
  creditsUsed   Int
  complianceReport Json?    // 合规检测结果
  createdAt     DateTime    @default(now())
  expiresAt     DateTime?   // 免费用户图片过期时间
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace     Workspace?  @relation(fields: [workspaceId], references: [id])
}

enum ImageType {
  WHITE_BG      // 白底主图
  SCENE         // 场景图
  APLUS_BANNER  // A+ 横幅
  APLUS_FEATURE // A+ 特性图
  COMPLIANCE    // 仅合规检测
}

enum ImageStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

// 图片处理任务队列
model ProcessingJob {
  id          String    @id @default(cuid())
  userId      String
  type        JobType
  status      JobStatus @default(QUEUED)
  inputData   Json      // 输入参数
  resultData  Json?     // 输出结果
  error       String?
  priority    Int       @default(0)
  attempts    Int       @default(0)
  maxAttempts Int       @default(3)
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  images      GeneratedImage[]
}

enum JobType {
  SINGLE_IMAGE
  BATCH_IMAGES
  COMPLIANCE_CHECK
}

enum JobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}
```

---

## 五、API 接口设计

### 5.1 图片生成 API

```
POST /api/images/white-bg
  Body: { imageFile: File, workspaceId?: string }
  Response: { jobId: string, estimatedSeconds: number }

POST /api/images/scene
  Body: { imageFile: File, sceneTemplateId?: string, customDescription?: string, workspaceId?: string }
  Response: { jobId: string, estimatedSeconds: number }

GET /api/jobs/:jobId
  Response: { status: JobStatus, progress: number, resultUrl?: string, error?: string }

POST /api/images/export
  Body: { imageId: string, formats: ExportFormat[] }
  Response: { exports: Record<ExportFormat, string> }
```

### 5.2 合规检测 API

```
POST /api/compliance/check
  Body: { imageFile: File }
  Response: {
    passed: boolean,
    items: [
      { check: string, status: 'pass'|'warning'|'fail', detail: string, suggestion?: string }
    ]
  }
```

### 5.3 用户/Credits API

```
GET /api/user/credits
  Response: { balance: number, plan: Plan, transactions: CreditTransaction[] }

GET /api/user/images
  Query: { page, limit, type?, status? }
  Response: { images: GeneratedImage[], total: number }
```

### 5.4 Stripe Webhook

```
POST /api/stripe/webhook
  Events handled:
  - checkout.session.completed → 激活订阅，补充 credits
  - customer.subscription.updated → 更新套餐
  - customer.subscription.deleted → 降级为 Free
  - invoice.payment_failed → 标记 past_due
```

---

## 六、图片生成核心流程（后端逻辑）

### 6.1 白底主图生成流程

```typescript
async function generateWhiteBg(imageUrl: string, jobId: string) {
  // Step 1: 背景移除 (Remove.bg API)
  const removedBg = await removeBgApi.remove(imageUrl);
  // 输出：PNG with transparent background
  
  // Step 2: 产品分析
  const productBounds = await analyzeProductBounds(removedBg);
  // 计算产品边界框，确定缩放比例
  
  // Step 3: 白底合成
  const whiteBg = await compositeOnWhite(removedBg, {
    targetOccupancy: 0.90, // 90% 产品占比
    addShadow: true,
    shadowOpacity: 0.15,
  });
  
  // Step 4: 质量校验
  const compliance = await checkCompliance(whiteBg);
  
  // Step 5: 上传到 R2
  const resultUrl = await uploadToR2(whiteBg, `results/${jobId}/white-bg.jpg`);
  
  // Step 6: 生成多规格版本
  const exports = await generateExports(resultUrl);
  
  // Step 7: 更新数据库
  await prisma.processingJob.update({
    where: { id: jobId },
    data: { status: 'COMPLETED', resultData: { resultUrl, exports, compliance } }
  });
}
```

### 6.2 场景图生成流程

```typescript
async function generateScene(
  productImageUrl: string,
  options: { templateId?: string, description?: string },
  jobId: string
) {
  // Step 1: 背景移除获得透明产品图
  const productPng = await removeBgApi.remove(productImageUrl);
  
  // Step 2: 翻译中文描述
  let scenePrompt = '';
  if (options.description) {
    scenePrompt = await translateToEnglishPrompt(options.description);
  } else if (options.templateId) {
    scenePrompt = SCENE_TEMPLATES[options.templateId].prompt;
  }
  
  // Step 3: 生成背景场景 (Flux.1 via Replicate)
  const backgroundUrl = await replicate.run('black-forest-labs/flux-dev', {
    input: {
      prompt: `${scenePrompt}, product photography, studio lighting, 8k, photorealistic`,
      width: 2000,
      height: 2000,
      num_inference_steps: 28,
    }
  });
  
  // Step 4: 产品与场景合成 (IP-Adapter / ControlNet)
  const composited = await compositeProductOnScene(productPng, backgroundUrl);
  
  // Step 5: 上传 & 多规格导出
  const resultUrl = await uploadToR2(composited, `results/${jobId}/scene.jpg`);
  const exports = await generateExports(resultUrl);
  
  await updateJob(jobId, 'COMPLETED', { resultUrl, exports });
}
```

---

## 七、任务队列设计（Upstash QStash）

图片生成是耗时操作（10–60秒），不能同步等待。使用 Upstash QStash 实现异步任务队列。

```
用户请求 → POST /api/images/white-bg
         → 创建 Job 记录（状态：QUEUED）
         → 发布到 QStash 队列
         → 立即返回 { jobId }

用户轮询 → GET /api/jobs/:jobId（每2秒）
         → 返回当前状态 + 进度百分比

QStash Worker → POST /api/worker/process-image（内部）
              → 执行生成逻辑
              → 更新 Job 状态
              → 完成后发送 WebSocket/SSE 通知（可选）
```

---

## 八、安全设计

### 8.1 图片 URL 安全
- R2 存储桶设为**私有**
- 下载链接为**签名 URL**（有效期 1 小时）
- 用户只能访问自己的图片（后端校验 userId）

### 8.2 速率限制
- 图片生成：**5次/分钟/用户**（防滥用）
- 合规检测：**20次/分钟/用户**
- 使用 Upstash Redis 实现滑动窗口限流

### 8.3 文件上传安全
- 仅允许 JPG/PNG/WEBP 格式
- 最大文件大小：20MB
- 上传前验证 MIME type（不信任扩展名）
- 上传到隔离的 R2 前缀（`uploads/` 与 `results/` 分开）

---

## 九、部署架构

### 开发环境（本机）
```
Next.js Dev Server (localhost:3000)
PostgreSQL (本机 or Supabase 免费层)
Redis (本机 or Upstash 免费层)
Cloudflare R2 (dev bucket)
```

### 生产环境
```
Vercel (Next.js 托管，自动 CI/CD，Edge Functions)
  ├── 域名：pixsell.ai (或 pixsell.io)
  └── 环境变量：DATABASE_URL, STRIPE_KEY, R2_* 等

Supabase (PostgreSQL 托管)
  ├── Free 层：500MB，5万行/月（够 MVP）
  └── Pro：$25/月（5GB）

Upstash (Redis + QStash 托管)
  ├── Redis：10万 commands/天（Free 层）
  └── QStash：500次/天（Free 层）

Cloudflare R2 (图片存储)
  └── $0.015/GB/月，免流量费

预估月成本（MVP 阶段，100用户）：
  Vercel Hobby: $0
  Supabase Free: $0
  Upstash Free: $0
  Cloudflare R2: ~$1–2/月
  Remove.bg API: ~$10–30/月（按调用量）
  Replicate API: ~$20–50/月
  OpenAI API: ~$5/月
  总计: ~$36–87/月
```

---

## 十、与 AIGC Room 代码复用清单

| 模块 | 复用情况 | 操作 |
|------|---------|------|
| Next.js 项目结构 | ✅ 直接复用 | `cp -r aigcroom/src/* pixsell/src/` 后按需清理 |
| Prisma + PostgreSQL 配置 | ✅ 复用框架 | 重写 schema.prisma，保留配置 |
| NextAuth 配置 | ✅ 复用 | 添加 Wechat Provider |
| Stripe 集成 | ✅ 完全复用 | 修改定价 ID 即可 |
| Tailwind 配置 | ✅ 复用 | 修改颜色主题 |
| Header/Footer 组件 | 部分复用 | 修改 Logo + 导航项 |
| 邮件模板 | ✅ 复用 nodemailer | 修改邮件内容 |
| API 路由结构 | ✅ 参考 | 按新需求重写具体逻辑 |
| 登录/注册页面 | ✅ 直接复用 | 修改样式 |
| 定价页面 | ✅ 参考结构 | 修改套餐内容 |
