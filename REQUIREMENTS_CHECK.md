# 📋 AIGC Room 需求核对表（与实现对齐 · 定期更新）

> 需求/产品正文见 `docs/01-requirements.md`、`docs/02-product.md`。架构见 `docs/03-architecture.md`。

---

## ✅ 1. MVP 功能核对

### F1: 工具库浏览
| 功能点 | 状态 | 说明 |
|--------|------|------|
| 工具列表展示（卡片式） | ✅ | `/tools` |
| 分类筛选 | ✅ | 客户端筛选 |
| 价格筛选 | ✅ | FREE / FREEMIUM / PAID |
| 搜索功能 | ✅ | 名称与描述 |
| 排序功能 | ✅ | 评分、名称、上新 |
| 分页加载 | ✅ | 每页 9 条 |

### F2: 工具详情页
| 功能点 | 状态 | 说明 |
|--------|------|------|
| 工具基本信息 | ✅ | `GET /api/tools/slug/[slug]` |
| 多维度评分 | ✅ | |
| 价格方案展示 | ✅ | Prisma `pricingPlans` |
| 优缺点分析 | ✅ | |
| 深度评测文章 | ✅ | 数据库 + 详情页 |
| 联盟链接 | ⚠️ | 数据在库；运营在后台维护 URL |
| 相似工具推荐 | ✅ | |
| 收藏 | ✅ | `/api/favorites` + 工具页「Save tool」 |

### F3: 工具对比功能
| 功能点 | 状态 | 说明 |
|--------|------|------|
| 选择对比工具 | ✅ | `/compare` |
| 对比表生成 | ✅ | |
| 对比结论 + 推荐 | ⚠️ | 基础版；可继续加强文案与规则 |
| 对比页联盟链接 | ⚠️ | 与工具详情同源数据 |

### F4: 评测文章系统
| 功能点 | 状态 | 说明 |
|--------|------|------|
| 文章列表 | ✅ | `GET /api/reviews` + 仅 `PUBLISHED` |
| 文章详情 | ✅ | Prisma + `/reviews/[slug]` |
| 文章内联盟链接 | ⚠️ | 模板/Markdown 内链接由内容控制 |
| 相关文章推荐 | ✅ | |

### F5: 行业解决方案
| 功能点 | 状态 | 说明 |
|--------|------|------|
| 行业分类 | ✅ | |
| 工具包推荐 | ✅ | |
| 工作流说明 | ✅ | |
| 联盟链接 | ⚠️ | 与联盟模块数据一致 |

### F6: 用户系统
| 功能点 | 状态 | 说明 |
|--------|------|------|
| 注册/登录 | ✅ | 自定义 API + `localStorage` |
| 用户中心 | ✅ | `/account`（收藏列表） |
| 收藏工具 | ✅ | 见 F2 |
| 浏览历史 | ❌ | 仍为后续项 |

### F7: 付费会员系统
| 功能点 | 状态 | 说明 |
|--------|------|------|
| 会员等级 | ✅ | FREE / PRO / ENTERPRISE |
| Stripe 支付集成 | ⚠️ | 配置 `STRIPE_*` 后走 Checkout；否则开发模式写库 |
| 会员专属内容 | ⚠️ | 数据字段具备；前端门禁可再加 |
| Webhook 处理 | ⚠️ | `POST /api/stripe/webhook`（`checkout.session.completed`、`customer.subscription.deleted`） |

### F8: SEO 优化
| 功能点 | 状态 | 说明 |
|--------|------|------|
| Meta 标签 | ✅ | `layout` + `metadataBase`（`NEXT_PUBLIC_SITE_URL`） |
| Open Graph 标签 | ✅ | 相对路径图片基于 `metadataBase` |
| Sitemap 生成 | ✅ | 动态 `sitemap.xml`（含工具/评测/方案 URL） |
| Robots.txt | ✅ | `src/app/robots.ts` |
| 结构化数据 | ❌ | JSON-LD 可后续加 |

---

## 🔧 2. 管理后台功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 仪表盘 | ✅ | |
| 工具管理 | ✅ | Prisma CRUD（以当前 admin 页为准） |
| 评测管理 | ✅ | |
| 解决方案管理 | ✅ | |
| 联盟链接管理 | ✅ | |
| 数据分析 | ✅ | |
| 系统设置 | ✅ | |

---

## 🏗️ 3. 架构和数据库

| 模块 | 状态 | 说明 |
|------|------|------|
| 用户模块 | ✅ | User / Account / Session（Prisma） |
| 工具模块 | ✅ | Tool / PricingPlan / Favorite |
| 内容模块 | ✅ | Review + Comment |
| 解决方案 | ✅ | Solution |
| 支付模块 | ✅ | Subscription + Stripe（可选） |
| 联盟模块 | ✅ | AffiliateLink / AffiliateClick |
| 对比模块 | ✅ | Comparison |

---

## 🔒 4. 安全性

| 项目 | 状态 |
|------|------|
| 用户密码加密 | ✅ bcrypt |
| XSS/CSRF 防护 | ⚠️ Next 默认 + 建议上 HttpOnly 会话 |
| HTTPS 强制 | ⚠️ 托管侧（Vercel）默认 HTTPS |
| 联盟链接防篡改 | ❌ 后续可做签名跳转 |
| 收藏/订阅 API | ⚠️ 当前信任 `userId` 查询串；生产需会话/JWT |

---

## 📝 待办事项（优先级）

### 🟡 中优先级
1. 将登录态改为 HttpOnly Cookie + 服务端会话（替换 `localStorage` 传 `userId`）
2. 对比结论与联盟文案增强
3. 结构化数据（JSON-LD）与博客文章 Schema

### 🟢 低优先级
4. 浏览历史
5. 会员专属内容门禁（按 `planType` 限制路由或 API）
6. 联盟链接签名校验

---

## 总结

**整体完成度**：约 **85%+**（随运营配置 Stripe/联盟链接继续升高）

- ✅ 数据库与前台/后台主路径已对齐 PostgreSQL + Prisma  
- ✅ 工具列表筛选/搜索/排序/分页、SEO、收藏、账户页、Stripe Webhook 骨架  
- ⚠️ 生产级认证与防篡改仍需一轮安全加固  
