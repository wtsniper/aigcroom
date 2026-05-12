# AIGC Room — 架构说明

## 技术栈（当前）

- **框架**：Next.js 16（App Router）、React 19、TypeScript
- **样式**：Tailwind CSS
- **数据**：Prisma 5 + PostgreSQL
- **支付**：Stripe SDK（可选；未配置密钥时使用开发模式写库）
- **认证**：自定义邮箱密码 API + 客户端 `localStorage` 用户对象（非 NextAuth 会话）

## 目录要点

- `src/app/`：页面与 `api/*` Route Handlers
- `prisma/schema.prisma`：数据模型（用户、工具、评测、方案、订阅、联盟、收藏、评论等）
- `src/lib/prisma.ts`：单例 Prisma Client

## 关键 API

- `GET/POST /api/tools`；`GET /api/tools/slug/[slug]`；`GET/PUT/DELETE /api/tools/[id]`
- `GET/POST /api/reviews`；`GET /api/reviews/[id]`
- `GET/POST /api/favorites`；`DELETE /api/favorites?userId=&toolId=`
- `GET /api/subscription?userId=`
- `POST /api/stripe/create-checkout`；`POST /api/stripe/webhook`（仅 Raw body + 签名验证）

## SEO

- `src/app/layout.tsx`：`metadataBase` 取自 `NEXT_PUBLIC_SITE_URL`
- `src/app/sitemap.ts`：静态页 + 从数据库生成的工具/评测/方案 URL（数据库不可用时降级为静态条目）
- `src/app/robots.ts`：允许抓取站点，禁止 `/admin`
