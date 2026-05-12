# AIGC Room

> Discover the Best AI Tools for Your Business

## 项目状态

✅ **已完成（摘要）**：
- 需求 / 产品 / 架构文档：`docs/01-requirements.md`、`docs/02-product.md`、`docs/03-architecture.md`
- 工具库（搜索、分类/价格筛选、排序、分页）、工具详情（按 slug API）、评测与方案前台
- PostgreSQL + Prisma、管理后台、评论、联盟追踪、收藏与用户中心 `/account`
- SEO：`metadataBase`、Open Graph、动态 `sitemap.xml`、`robots.txt`
- Stripe：配置密钥后 Checkout；`POST /api/stripe/webhook` 更新订阅（未配置时定价页为开发写库模式）

🔧 **建议后续**：
- 用 HttpOnly Cookie + 服务端会话替代 `localStorage` 传 `userId`（收藏/订阅 API 加固）
- 结构化数据（JSON-LD）、更细的 E2E 测试

---

## 快速开始

### 环境要求

- **Node.js 18.x 或 20.x 或 22.x** (推荐 Node.js 20 LTS，**不要使用 Node.js 24.x**)
- npm 9+

### 安装步骤

```bash
# 1. 确保使用正确的 Node.js 版本
node -v  # 应该是 18.x 或 20.x 或 22.x

# 2. 安装依赖
npm install

# 3. 复制环境变量
cp .env.example .env.local

# 4. 启动开发服务器
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 查看应用。

---

## 项目结构

```
aigcroom/
├── docs/
│   ├── 01-requirements.md  # 需求文档
│   ├── 02-product.md       # 产品文档
│   └── 03-architecture.md  # 架构文档
├── src/
│   ├── app/                # Next.js 页面路由
│   │   ├── page.tsx        # 首页
│   │   ├── tools/          # 工具列表
│   │   ├── compare/        # 工具对比
│   │   ├── reviews/        # 评测文章
│   │   ├── solutions/      # 行业方案
│   │   ├── pricing/        # 定价页面
│   │   ├── login/          # 登录页
│   │   └── register/       # 注册页
│   ├── components/         # 组件
│   │   ├── layout/         # 布局组件
│   │   ├── tools/          # 工具组件
│   │   └── reviews/        # 评测组件
│   ├── lib/                # 工具函数
│   └── types/              # TypeScript 类型
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2.5 | 前端框架，SSR/SSG |
| React | 18.3.1 | UI 库 |
| TypeScript | 5.5.3 | 类型安全 |
| Tailwind CSS | 3.4.6 | 样式框架 |
| Prisma | 5.17.0 | ORM（待配置）|
| NextAuth | 4.24.7 | 身份认证（待集成）|
| Stripe | 16.2.0 | 支付（待集成）|

---

## 功能列表

### 已实现（前端页面）

- ✅ 首页（Hero、精选工具、分类导航）
- ✅ 工具浏览页
- ✅ 工具详情页
- ✅ 工具对比页
- ✅ 评测文章页
- ✅ 行业方案页
- ✅ 定价页
- ✅ 登录/注册页
- ✅ Header 和 Footer 布局组件
- ✅ 响应式设计

### 待实现

- 🔄 数据库设计与 Prisma 配置
- 🔄 用户身份认证（NextAuth）
- 🔄 支付系统（Stripe）
- 🔄 数据填充与种子脚本
- 🔄 SEO 优化
- 🔄 测试用例

---

## 部署

### Vercel（推荐）

直接连接 GitHub 仓库即可自动部署：

```bash
# 1. 推送到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/wtsniper/aigcroom
git push -u origin main

# 2. 在 Vercel 中导入仓库
```

---

## 文档

详细文档见 `docs/` 目录（仓库内已包含）：
- [需求说明](docs/01-requirements.md)
- [产品说明](docs/02-product.md)
- [架构说明](docs/03-architecture.md)

根目录 [`REQUIREMENTS_CHECK.md`](REQUIREMENTS_CHECK.md) 为与代码同步的核对表。

---

## 问题排查

### Node.js 版本问题

如果安装依赖时遇到问题，请确保使用 Node.js 20 LTS：

```bash
# 使用 nvm（如果已安装）
nvm install 20
nvm use 20
```

### npm 权限问题

Windows PowerShell 执行策略限制：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

## License

MIT
