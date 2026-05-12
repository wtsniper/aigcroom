# AIGC Room — 需求说明（与实现对齐）

本文档替代历史分散说明，与当前代码仓库一致。详细核对表见仓库根目录 `REQUIREMENTS_CHECK.md`。

## 核心目标

- **工具库**：浏览、搜索、分类/价格筛选、排序、分页；详情含评分、优缺点、联盟入口、评论、收藏。
- **评测**：列表与详情来自数据库（已发布状态）；支持评论。
- **对比**：多工具对比页。
- **方案**：行业解决方案列表与详情。
- **用户**：邮箱注册/登录（localStorage 会话）、**账户页**、收藏（服务端 `Favorite` 表）。
- **订阅**：定价页；配置 Stripe 时走 Checkout + **Webhook** 更新订阅，否则开发模式直接写库。
- **管理后台**：工具/评测/方案/联盟等维护（需管理员角色）。
- **SEO**：`metadataBase`、Open Graph、动态 `sitemap.xml`、`robots.txt`。

## 非目标 / 后续加强

- 服务端 Session/JWT（当前与订阅、收藏 API 一样为「客户端传 userId」模型，生产环境建议改为 HttpOnly Cookie + 服务端会话）。
- 浏览历史独立模块。
- 联盟链接服务端签名校验（防篡改）的完整方案。

## 环境变量要点

- `DATABASE_URL`：PostgreSQL（如 Neon）；避免使用 `channel_binding=require` 与部分 Node/pg 不兼容。
- `NEXT_PUBLIC_SITE_URL`：生产站点根 URL（SEO、Stripe 跳转）。
- Stripe：`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`STRIPE_PRICE_PRO`、`STRIPE_PRICE_PREMIUM`（用于 ENTERPRISE 档）。
