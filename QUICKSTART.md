# 🚀 AIGC Room 快速启动指南

## 系统当前状态

✅ **已完成：**
- 完整的数据库架构（Prisma + SQLite）
- 用户认证系统（NextAuth）
- 完整的管理后台（仪表盘、工具管理、评测管理）
- API 接口（工具、评测 CRUD）
- 联盟链接管理系统
- 支付系统预留接口
- 完整的前端页面

⚙️ **需要手动设置：**
- 安装依赖
- 初始化数据库
- 配置环境变量（可选）

---

## 快速启动（3步）

### 第1步：安装依赖

```bash
cd e:\work\aigcroom
npm install
```

### 第2步：初始化数据库并添加示例数据

```bash
# 推送数据库 schema
npm run db:push

# 生成 Prisma Client
npx prisma generate

# 添加示例数据（推荐）
npm run db:seed
```

### 第3步：启动开发服务器

```bash
npm run dev
```

---

## 🎯 接下来做什么？

### 1. 访问网站

- **网站：** http://localhost:3000
- **管理后台：** http://localhost:3000/admin

### 2. 创建管理员账户

1. 访问 http://localhost:3000/register
2. 使用邮箱：`admin@aigcroom.com`（或你自己的邮箱）
3. 设置密码
4. 登录后访问管理后台

### 3. 发布内容

- **添加工具：** http://localhost:3000/admin/tools/new
- **发布评测：** http://localhost:3000/admin/reviews/new

---

## 💰 联盟营销配置

### 注册联盟平台

| 平台 | 注册地址 | 适用工具 |
|------|---------|---------|
| PartnerStack | https://partnerstack.com | 大部分 SaaS AI 工具 |
| ShareASale | https://shareasale.com | 综合类，包含很多 AI 工具 |
| CJ Affiliate | https://cj.com | 大品牌 |

### 获取联盟链接

1. 注册平台后搜索工具名称
2. 申请加入联盟（通常即时批准）
3. 获取专属推广链接
4. 更新到网站中（管理后台可以编辑）

### 常见 AI 工具联盟

- OpenAI / ChatGPT - PartnerStack
- Anthropic / Claude - 官网 affiliate 页面
- Midjourney - 官网 affiliate 页面
- Jasper - PartnerStack
- Copy.ai - ShareASale

---

## 🔐 支付系统（可选）

### Stripe 配置

1. 注册 Stripe：https://stripe.com
2. 获取 API Keys
3. 创建价格计划：
   - Pro: $19/month
   - Premium: $49/month
4. 更新 .env 文件

---

## 📊 其他操作

### 查看数据库内容

```bash
npm run db:studio
```

会在浏览器打开 Prisma Studio，可以直接查看和编辑数据。

### 重新初始化（清空数据）

```bash
# 删除数据库文件
# Windows: 删除 prisma\dev.db
# Mac/Linux: rm prisma/dev.db

# 重新初始化
npm run db:push
npm run db:seed
```

---

## 🆘 常见问题

### 端口被占用？

如果 3000 端口被占用，修改端口或关闭占用程序。

### npm install 失败？

确保 Node.js 版本是 18 或更高，或者使用最新的 LTS 版本。

### 数据库报错？

确保运行了 `npm run db:push` 和 `npx prisma generate`。

---

## 📝 项目结构

```
aigcroom/
├── prisma/
│   ├── schema.prisma    # 数据库模型
│   └── seed.ts         # 初始化脚本
├── src/
│   ├── app/
│   │   ├── admin/      # 管理后台
│   │   ├── api/        # API 接口
│   │   └── ...        # 前端页面
│   └── lib/
│       ├── db.ts       # 数据库连接
│       └── auth.ts     # 认证配置
└── package.json
```

---

## 🎉 准备上线！

完成以上步骤后，你就有了一个完整可用的 AI 工具评测网站！

- ✅ 可以发布评测
- ✅ 可以管理工具
- ✅ 可以通过联盟赚钱
- ✅ 可以添加会员付费功能

需要帮助随时告诉我！
