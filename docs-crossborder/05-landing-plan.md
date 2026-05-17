# 项目落地计划 + 分工说明
## 项目：PixSell AI
**版本：** v1.0  |  **日期：** 2026-05-16

---

## 一、总体时间线（10 周 MVP 上线）

```
Week 1–2:   基础框架搭建（复用 AIGC Room 代码）
Week 3–4:   AI 核心功能开发（背景移除 + 白底生成）
Week 5–6:   场景图生成 + 合规检测
Week 7:     Credits 系统 + Stripe 订阅
Week 8:     图片库 + 批量导出规格
Week 9:     Landing Page + Onboarding 流程
Week 10:    测试 + Bug 修复 + 内测上线
```

---

## 二、分工说明

### 【你（项目负责人）需要做的事】

#### 第1周必须完成
- [ ] **注册并配置服务账号**（1–2天）
  - Vercel 账号（部署）
  - Supabase 账号（数据库）：https://supabase.com
  - Cloudflare 账号（R2 存储）：https://cloudflare.com
  - Upstash 账号（Redis + QStash）：https://upstash.com
  - Remove.bg API Key：https://www.remove.bg/api
  - Replicate API Key：https://replicate.com
  - OpenAI API Key：https://platform.openai.com
  - Stripe 账号（支付）：https://stripe.com
  - Resend 账号（邮件）：https://resend.com

- [ ] **购买域名**（1小时）
  - 推荐：`pixsell.ai` 或 `pixsell.io`
  - 备选：`sellpix.ai`、`aipixsell.com`
  - 购买渠道：Namecheap / Cloudflare Registrar（后者可以直接配 R2 + CDN）

- [ ] **确定产品名称和品牌颜色**（1天）
  - 我们用了代号 PixSell AI，你可以改
  - 需要：产品名、主色调（供我写代码用）

#### 每周持续
- [ ] **测试和反馈**：每当我完成一个功能，你需要测试并反馈问题
- [ ] **内容填充**：场景模板的中文名称、分类描述（我提供英文Prompt，你审核中文展示名）
- [ ] **营销渠道准备**（Week 7+ 开始）：加入以下社群，准备发帖
  - 雨果跨境论坛（注册账号）
  - 卖家精灵 / AMZ123 社群
  - 亚马逊卖家微信群（找2–3个，方便内测推广）

#### MVP 上线后
- [ ] **获客推广**：在跨境卖家论坛发"我做了一个工具"帖，邀请内测
- [ ] **用户访谈**：至少和 5 个内测用户电话，收集真实反馈
- [ ] **内容营销**：写知乎/公众号文章：《亚马逊卖家如何用AI降低90%图片成本》

---

### 【AI 可以帮你完成的事】

| 任务 | 方式 |
|------|------|
| 搭建 Next.js 项目框架 | 直接写代码 |
| 复用 AIGC Room 代码（认证/支付/数据库） | 直接复制改写 |
| Prisma Schema 设计和迁移 | 直接写代码 |
| API 路由开发（图片生成、合规检测、Credits） | 直接写代码 |
| 前端页面开发（所有页面） | 直接写代码 |
| Remove.bg / Replicate API 集成 | 直接写代码 |
| Stripe 订阅系统（复用 AIGC Room） | 直接写代码 |
| 任务队列（Upstash QStash）集成 | 直接写代码 |
| Cloudflare R2 上传/下载 | 直接写代码 |
| Landing Page 文案（中英文） | 直接写文案 |
| 场景模板 Prompt 库（50个模板） | 直接写数据 |
| Code Review | 在 Cursor 中逐文件 Review |
| Bug 修复 | 直接改代码 |
| 单元测试 / 集成测试 | 直接写测试 |
| 部署脚本和 CI/CD 配置 | 直接写配置 |

---

## 三、详细开发任务清单

### Week 1–2：基础框架

```
[ ] 新建 Next.js 15 项目（参考 AIGC Room 结构）
[ ] 配置 Tailwind + Shadcn/UI
[ ] 配置 Prisma + 连接 Supabase
[ ] 运行 prisma migrate（创建所有表）
[ ] 配置 NextAuth（邮箱 + Google）
[ ] 配置 Stripe（复用 AIGC Room webhook）
[ ] 配置 Cloudflare R2 SDK
[ ] 配置 Upstash Redis
[ ] 配置 Resend 邮件
[ ] 搭建基础页面框架（Layout + Header + Footer）
[ ] 登录/注册页面
[ ] Dashboard 骨架
```

### Week 3–4：AI 核心功能

```
[ ] 文件上传 API（上传到 R2）
[ ] Remove.bg API 集成（背景移除服务）
[ ] 白底合成算法（产品居中、白底合成、阴影添加）
[ ] 产品占比计算（Canvas API 分析）
[ ] 白底主图生成 API（/api/images/white-bg）
[ ] 任务队列集成（QStash）
[ ] 任务状态轮询 API（/api/jobs/:id）
[ ] 前端：图片上传组件（拖拽）
[ ] 前端：生成进度组件（进度条 + 状态文字）
[ ] 前端：Before/After 对比滑块组件
```

### Week 5–6：场景图 + 合规检测

```
[ ] Replicate API 集成（Flux.1 模型）
[ ] OpenAI API 集成（中文→英文 Prompt 翻译）
[ ] 场景模板数据库（50个模板，初版20个）
[ ] 场景图生成 API（/api/images/scene）
[ ] 合规检测算法（背景颜色检测、产品占比、文字检测）
[ ] 合规检测 API（/api/compliance/check）
[ ] 前端：场景模板选择器（按类目分组）
[ ] 前端：中文场景描述输入框
[ ] 前端：合规检测结果展示（每项状态 + 说明）
[ ] 前端：独立合规检测工具页面
```

### Week 7：Credits + 支付

```
[ ] Credits 余额系统（扣减、充值、流水记录）
[ ] Stripe 订阅 Webhook（处理各种事件）
[ ] 定价页面（5个套餐，月付/年付切换）
[ ] Credits 余额展示（Header 全局显示）
[ ] Credits 不足提示 + 升级引导弹窗
[ ] 订阅管理页面（升级/降级/取消）
[ ] 发票下载 API
```

### Week 8：图片库 + 导出

```
[ ] 图片库页面（网格视图，分页）
[ ] 多规格导出逻辑（服务端裁剪 + R2 存储）
[ ] 导出格式选择器 UI
[ ] 打包下载 ZIP（多规格）
[ ] 图片详情页（原图 + 所有导出版本）
[ ] 图片删除功能
[ ] 图片存储过期策略（免费用户30天）
```

### Week 9：Landing Page + Onboarding

```
[ ] Landing Page（Hero + 功能展示 + Before/After + 定价 + FAQ）
[ ] Landing Page 中英文双语切换
[ ] 新手引导流程（3步 Onboarding）
[ ] SEO Meta 标签（中文 + 英文）
[ ] OpenGraph 图片
[ ] 博客框架（MDX，为后续 SEO 文章做准备）
```

### Week 10：测试 + 上线

```
[ ] E2E 测试（主要生成流程）
[ ] 性能测试（图片生成并发）
[ ] 安全测试（文件上传校验、URL 防盗链）
[ ] Vercel 生产环境部署
[ ] 自定义域名配置
[ ] Stripe 生产环境密钥配置
[ ] 错误监控（Sentry）接入
[ ] 内测用户邀请（10–30人）
```

---

## 四、上线后增长计划

### 内测阶段（Week 10–12）
**目标：** 50 注册用户，10 付费用户

- 在雨果跨境论坛发帖：《我做了一个专为跨境卖家的 AI 图片工具，免费内测》
- 加入亚马逊卖家微信群，发工具介绍（附 Before/After 对比图，视觉冲击力强）
- 产品猎人 (Product Hunt) 英文发布（面向全球）
- 在 Reddit r/AmazonSeller 发帖

### 增长阶段（Month 3–6）
**目标：** 200 付费用户，MRR $7K

- 制作 YouTube / 抖音教程视频（《用 AI 30秒搞定亚马逊主图》）
- 与跨境 KOL 合作（给 KOL 免费 Pro 账号，换测评视频）
- 写 SEO 文章（知乎、公众号、独立博客）
- 举办线上 Webinar：《2026 年跨境卖家图片合规避坑指南》

### 规模化阶段（Month 6–12）
**目标：** 500+ 付费用户，MRR $20K+

- 接入 Shopify App Store（打开新获客渠道）
- 开发 ERP 集成（店小秘 API）
- 推出 Agency 套餐，开始 B2B 销售
- 考虑 Product Hunt 正式发布

---

## 五、风险与应对

| 风险 | 概率 | 影响 | 应对方案 |
|------|------|------|---------|
| Remove.bg API 成本超预期 | 中 | 中 | 测试 Replicate BRIA RMBG 替代（约便宜 50%） |
| Replicate 生成质量不稳定 | 中 | 高 | 准备备用方案：Fal.ai / Stability AI API |
| 亚马逊推出免费官方 AI 图片工具 | 中 | 中 | 差异化：中文界面 + 多平台 + 专业合规 |
| 竞品出中文版 | 中 | 高 | 加速获客，建立用户粘性和数据壁垒 |
| Credits 成本核算失误 | 低 | 高 | MVP 阶段限制免费用量，仔细核算 API 成本 |
| 用户产品图版权纠纷 | 低 | 高 | ToS 明确声明用户对上传内容负责 |

---

## 六、成本预算（Month 1–3）

| 支出项 | 月费 | 备注 |
|-------|------|------|
| Vercel Hobby | $0 | MVP 阶段够用 |
| Supabase Free | $0 | 500MB，MVP 足够 |
| Cloudflare R2 | ~$2 | 按存储量 |
| Upstash Free | $0 | 10万 commands/天 |
| Remove.bg API | $0–30 | 免费200张/月，超出 $0.1/张 |
| Replicate API | $10–50 | 约 $0.03–0.05/图 |
| OpenAI API | $5 | Prompt 翻译成本极低 |
| 域名 | $10–15/年 | 一次性 |
| Resend 邮件 | $0 | 免费 3000 封/月 |
| **合计** | **~$27–97/月** | 远低于大多数 SaaS 起步成本 |

**盈亏平衡点：** 约 3–5 个付费用户（$19 Starter 套餐）即可覆盖月成本。
