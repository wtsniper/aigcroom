# Vercel 部署 + Cloudflare 域名绑定指南

## 你的信息
- 域名：aigcroom.shop
- 域名管理：Cloudflare
- 代码仓库：https://github.com/wtsniper/aigcroom

---

## 第一步：部署到 Vercel

### 1. 访问 Vercel
打开 https://vercel.com/dashboard

### 2. 导入项目
- 点击 "Add New..." → "Project"
- 选择 "Import Git Repository"
- 搜索并选择 `wtsniper/aigcroom`
- 点击 "Import"

### 3. 配置项目设置

**Framework Preset:** Next.js（会自动识别）

**Root Directory:** `./`（默认）

**Build Command:** `next build`（默认）

**Output Directory:** `.next`（默认）

### 4. 添加环境变量

点击 "Environment Variables"，添加以下：

```
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://aigcroom.vercel.app
NEXTAUTH_SECRET=aigcroom-super-secret-key-2026-production-ready-string-min-32-chars
NEXT_PUBLIC_SITE_URL=https://aigcroom.vercel.app
```

### 5. 点击 Deploy
- 等待 2-3 分钟
- 部署完成后你会看到一个 Vercel 提供的 URL（类似：`aigcroom.vercel.app`）
- 先访问这个 URL 确认网站正常

---

## 第二步：绑定自定义域名 aigcroom.shop

### 方式一：在 Vercel 中直接添加域名（推荐）

1. 在 Vercel 项目页面，点击 "Settings" → "Domains"

2. 在 "Domains" 输入框中输入：`aigcroom.shop`

3. 点击 "Add"

4. Vercel 会显示 DNS 配置信息，复制以下信息：
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

5. Vercel 会提示你验证 DNS，点击 "Verify"

6. 等待 DNS 生效（通常 5-30 分钟，最长 24 小时）

### 方式二：在 Cloudflare 中手动配置 DNS

如果 Vercel 没有自动配置，你需要手动去 Cloudflare 设置：

1. 登录 https://dash.cloudflare.com

2. 选择你的域名 `aigcroom.shop`

3. 点击左侧菜单 "DNS" → "Records"

4. 点击 "Add record"，添加以下记录：

   **记录 1 - CNAME（www 子域名）：**
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy status: DNS only（灰色云朵，不要开橙色）
   TTL: Auto
   ```

   **记录 2 - CNAME（根域名）：**
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   Proxy status: DNS only（灰色云朵）
   TTL: Auto
   ```

5. 保存后，回到 Vercel 点击 "Verify"

---

## 第三步：在 Vercel 中启用自动 HTTPS

Vercel 会自动为你配置 SSL 证书，无需额外操作。

- Vercel 会自动申请 Let's Encrypt 证书
- 等待 5-10 分钟，HTTPS 就会生效
- 访问 `https://aigcroom.shop` 应该能看到绿色锁标志

---

## 第四步：配置 Cloudflare（重要）

### 关闭 Cloudflare 的代理（如果使用了）

1. 在 Cloudflare DNS 设置中
2. 确保 `aigcroom.shop` 的 CNAME 记录是 **灰色云朵**（DNS only）
3. **不要**使用橙色云朵（Proxied），因为这会和 Vercel 的 CDN 冲突

### 可选：在 Cloudflare 开启 CDN

如果你想使用 Cloudflare 的 CDN 而不是 Vercel 的：

1. 将 DNS 记录改为 **橙色云朵**（Proxied）
2. 在 Cloudflare 设置 SSL/TLS 为 "Full" 模式
3. 在 Vercel 中添加自定义 Header

**建议：** 先用灰色云朵（Vercel CDN），等网站稳定后再考虑优化。

---

## 第五步：验证部署

### 检查清单：

- [ ] 访问 `https://aigcroom.shop` 能看到网站
- [ ] 访问 `https://aigcroom.shop/admin` 能进入后台
- [ ] 浏览器显示 HTTPS 锁标志
- [ ] 网站加载速度正常

### 测试页面：
```
首页：https://aigcroom.shop
工具列表：https://aigcroom.shop/tools
评测文章：https://aigcroom.shop/reviews
后台管理：https://aigcroom.shop/admin
```

---

## 常见问题

### Q: DNS 验证失败怎么办？
A: DNS 生效需要时间，通常 5-30 分钟。等待后再试。

### Q: 网站访问显示 502 错误？
A: 可能是 Vercel 构建失败，检查 Vercel 的部署日志。

### Q: HTTPS 不生效？
A: 等待 10 分钟，Vercel 会自动配置证书。

### Q: 能同时使用 Cloudflare 和 Vercel 吗？
A: 可以，但建议先用 Vercel 的 CDN，后期再优化。

### Q: 数据库用 SQLite 能在线上跑吗？
A: 可以跑，但 Vercel 是无服务器环境，SQLite 数据不会持久化。建议尽快迁移到 Neon（PostgreSQL）。

---

## 下一步：迁移到 PostgreSQL（推荐）

### 为什么需要迁移？
- Vercel 的无服务器环境每次部署会重置 SQLite
- PostgreSQL 数据持久化，不会丢失

### 迁移步骤（网站上线后再做）：
1. 注册 https://neon.tech
2. 创建数据库，复制连接字符串
3. 在 Vercel 环境变量中更新 `DATABASE_URL`
4. 重新部署

---

## 部署检查清单

### 部署前：
- [x] 代码推送到 GitHub
- [x] 环境变量配置完成
- [ ] Vercel 项目创建
- [ ] 首次部署成功

### 部署后：
- [ ] 绑定域名 aigcroom.shop
- [ ] DNS 配置完成
- [ ] HTTPS 生效
- [ ] 测试所有页面正常
- [ ] 测试后台登录
- [ ] 测试 API 功能

---

## 需要帮助？

如果在部署过程中遇到任何问题，随时告诉我，我会帮你解决！
