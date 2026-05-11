# AIGC Room 部署上线指南

## 目录
1. [部署方式选择](#1-部署方式选择)
2. [推荐方案：Vercel 一键部署](#2-推荐方案vercel-一键部署)
3. [数据库部署](#3-数据库部署)
4. [完整部署步骤](#4-完整部署步骤)
5. [域名配置](#5-域名配置)
6. [联盟营销赚钱指南](#6-联盟营销赚钱指南)

---

## 1. 部署方式选择

### 你需要部署的东西：
| 组件 | 说明 | 推荐平台 |
|------|------|----------|
| 前端网站 | Next.js 应用 | Vercel（首选）/ Railway |
| 后端API | Next.js API Routes | 和前端一起部署 |
| 数据库 | SQLite（开发）→ PostgreSQL（生产） | Neon / Supabase / Railway |
| 静态资源 | 图片、文件 | Vercel 自带 / Cloudinary |

### 推荐方案对比：

| 方案 | 难度 | 费用 | 适合 |
|------|------|------|------|
| Vercel + Neon | ⭐ 简单 | 免费额度够用 | 小白首选 |
| Railway | ⭐⭐ 中等 | 免费$5额度 | 想一体化管理 |
| 自建服务器 | ⭐⭐⭐ 难 | 服务器费用 | 有运维经验 |

**强烈建议：Vercel + Neon（最简单，免费额度足够）**

---

## 2. 推荐方案：Vercel 一键部署

### 什么是 Vercel？
Vercel 是 Next.js 官方推荐的部署平台，支持一键部署，自动构建，全球CDN。

### Vercel 优势：
- ✅ 一键部署，零配置
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 免费额度：100GB 带宽/月
- ✅ 完美支持 Next.js

---

## 3. 数据库部署

### 开发环境 vs 生产环境：
```
开发：SQLite（本地文件，不适合生产）
生产：PostgreSQL（云数据库，稳定可靠）
```

### 推荐数据库：Neon（免费PostgreSQL）

**为什么选 Neon？**
- ✅ 免费：500MB 存储
- ✅ Serverless：按需计费
- ✅ 支持 Prisma
- ✅ 自动备份

### 其他选择：
- **Supabase**：免费 500MB，带管理界面
- **Railway**：免费$5额度
- **PlanetScale**：免费 5GB（但已停止免费计划）

---

## 4. 完整部署步骤

### 第一步：准备 GitHub 仓库

```bash
# 1. 初始化 Git（如果还没有）
cd e:\work\aigcroom
git init

# 2. 创建 .gitignore（如果还没有）
# 确保包含以下内容：
```

**.gitignore 内容：**
```
node_modules/
.next/
.env
.env.local
*.db
*.db-journal
```

```bash
# 3. 提交代码
git add .
git commit -m "Initial commit"

# 4. 推送到 GitHub
git remote add origin https://github.com/你的用户名/aigcroom.git
git push -u origin main
```

### 第二步：创建 Neon 数据库

1. 访问 https://neon.tech
2. 用 GitHub 账号登录
3. 创建新项目，命名 `aigcroom`
4. 创建数据库，记下连接字符串

**连接字符串格式：**
```
postgresql://用户名:密码@ep-xxxx.us-east-2.aws.neon.tech/aigcroom?sslmode=require
```

### 第三步：部署到 Vercel

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 `aigcroom` 仓库
5. 配置环境变量：

```
DATABASE_URL=postgresql://用户名:密码@ep-xxxx.us-east-2.aws.neon.tech/aigcroom?sslmode=require
NEXTAUTH_URL=https://你的域名.com
NEXTAUTH_SECRET=随便写一个长字符串（至少32位）
STRIPE_SECRET_KEY=sk_test_xxx（如果需要支付）
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

6. 点击 "Deploy"
7. 等待部署完成（约2-5分钟）

### 第四步：初始化生产数据库

部署完成后，需要初始化数据库：

```bash
# 在 Vercel 的 Dashboard 中打开终端
# 或者本地执行（需要先配置生产环境变量）

# 1. 推送数据库结构
npx prisma db push

# 2. 初始化数据
npx prisma db seed
```

### 第五步：配置自定义域名（可选）

1. 购买域名（Namecheap / Cloudflare / 阿里云）
2. 在 Vercel Dashboard → Settings → Domains
3. 添加你的域名
4. 按照提示配置 DNS 记录

---

## 5. 域名配置

### 推荐域名注册商：
| 平台 | 价格 | 特点 |
|------|------|------|
| Namecheap | $8.88/年 | 便宜，支持支付宝 |
| Cloudflare | 成本价 | 最便宜，需已有账户 |
| 阿里云 | ¥35/年 | 国内备案方便 |

### DNS 配置示例：
```
类型: CNAME
名称: @ 或 www
值: cname.vercel-dns.com
```

---

## 6. 联盟营销赚钱指南

### 什么是联盟营销（Affiliate Marketing）？

**简单解释：**
你推荐别人的产品 → 用户通过你的链接购买 → 你获得佣金

### AI 工具联盟计划

#### 推荐加入的联盟计划：

| 工具 | 佣金比例 | 申请链接 |
|------|----------|----------|
| Jasper AI | 30%  recurring | https://www.jasper.ai/affiliate |
| Copy.ai | 45% 首月 | https://www.copy.ai/affiliate |
| Writesonic | 30% recurring | https://writesonic.com/affiliate |
| Surfer SEO | 25% recurring | https://surferseo.com/affiliate |
| Hostinger | 60% | https://www.hostinger.com/affiliate |

#### 如何申请：
1. 访问联盟计划页面
2. 填写申请（需要你的网站URL）
3. 等待审核（通常1-3天）
4. 审核通过后获得专属链接

### 赚钱策略

#### 策略一：评测文章引流
```
写一篇详细的工具评测
  ↓
文章中嵌入你的联盟链接
  ↓
读者点击链接购买
  ↓
你获得 20-40% 佣金
```

**示例文章结构：**
```
# ChatGPT Review 2026

[你的专业评测内容]

👉 [点击这里获取 ChatGPT Plus 20% 折扣] ← 这是你的联盟链接
```

#### 策略二：对比文章
```
写一篇 "ChatGPT vs Claude" 对比
  ↓
两个工具都放联盟链接
  ↓
用户无论选哪个你都赚钱
```

#### 策略三：行业解决方案
```
创建 "电商AI工具包"
  ↓
推荐3-5个工具的组合
  ↓
每个工具都带联盟链接
```

### 联盟链接管理

你的后台已经有联盟管理功能：
1. 登录后台：`/admin`
2. 进入 "联盟链接" 页面
3. 添加工具的联盟链接
4. 系统自动追踪点击和转化

### 预估收入

| 月访问量 | 转化率 | 平均佣金 | 月收入 |
|----------|--------|----------|--------|
| 1,000 | 2% | $10 | $200 |
| 5,000 | 3% | $15 | $2,250 |
| 10,000 | 3% | $20 | $6,000 |
| 50,000 | 4% | $25 | $50,000 |

### SEO 优化（获取流量）

#### 关键词策略：
```
目标关键词：
- "best AI tools 2026"
- "ChatGPT review"
- "AI writing tools comparison"
- "midjourney vs dall-e"
```

#### 内容策略：
1. 每周发布2-3篇评测
2. 每月发布1篇对比文章
3. 创建行业解决方案页面
4. 优化每篇文章的 SEO

#### SEO 检查清单：
- [ ] 标题包含关键词
- [ ] URL 包含关键词
- [ ] Meta Description 优化
- [ ] 文章长度 1500+ 词
- [ ] 包含图片并添加 alt 标签
- [ ] 内部链接到其他文章
- [ ] 外部链接到权威来源

---

## 快速行动清单

### 本周：
- [ ] 注册 Vercel 账号
- [ ] 注册 Neon 数据库
- [ ] 推送代码到 GitHub
- [ ] 完成部署

### 下周：
- [ ] 购买域名并配置
- [ ] 申请3-5个联盟计划
- [ ] 发布5篇评测文章

### 本月：
- [ ] 发布20篇以上评测
- [ ] 优化 SEO
- [ ] 开始获得自然流量
- [ ] 收到第一笔联盟佣金

---

## 常见问题

### Q: 部署需要花钱吗？
A: 初期完全免费。Vercel 和 Neon 的免费额度足够你起步。

### Q: 数据库需要单独维护吗？
A: Neon 是 Serverless 数据库，自动备份、自动扩展，几乎不需要维护。

### Q: 多久能开始赚钱？
A: 通常 2-3 个月开始有稳定流量，3-6 个月开始有可观收入。

### Q: 需要写多少篇文章？
A: 建议至少 30-50 篇高质量评测，才能开始获得稳定的搜索流量。

### Q: 联盟链接会被封吗？
A: 只要你的内容有价值、真实评测，一般不会被封。避免垃圾内容和虚假宣传。

---

## 需要帮助？

如果在部署过程中遇到问题，可以随时问我，我会帮你解决！
