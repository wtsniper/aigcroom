# AIGC Room — 产品说明

## 定位

面向企业与专业用户的 **AI 工具发现与决策** 站点：评测、对比、行业方案与联盟导流。

## 主要用户路径

1. **访客**：首页 → 工具列表（筛选/排序/分页）→ 工具详情 → 联盟或官网外链。
2. **注册用户**：登录 → **Account** 管理收藏；定价页查看/升级套餐。
3. **管理员**：登录（`ADMIN` 角色）→ `/admin` 维护内容与联盟数据。

## 信息架构（主要路由）

| 路径 | 说明 |
|------|------|
| `/` | 首页：精选工具、最新评测、方案入口 |
| `/tools` | 工具库 |
| `/tools/[slug]` | 工具详情、收藏、评论 |
| `/reviews` | 评测列表 |
| `/reviews/[slug]` | 评测正文 |
| `/compare` | 工具对比 |
| `/solutions` | 行业方案 |
| `/pricing` | 订阅与 Stripe（可选） |
| `/account` | 用户中心（收藏） |
| `/admin/*` | 管理后台 |

## 套餐命名

- **FREE** / **PRO** / **ENTERPRISE**（与数据库 `Subscription.planType` 及 Stripe Price 环境变量一致；企业档 Price 使用 `STRIPE_PRICE_PREMIUM` 时可映射到 ENTERPRISE）。
