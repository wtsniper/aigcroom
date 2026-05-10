
# 🚀 AIGC Room - 简单启动指南

## 第一步：清理旧文件

打开终端（PowerShell 或 CMD），运行：

```
E:
cd E:\work\aigcroom
rmdir /s /q node_modules
del package-lock.json
```

## 第二步：安装依赖

```
npm install
```

## 第三步：初始化数据库

```
npx prisma db push
npx prisma generate
```

## 第四步：启动服务器

```
npm run dev
```

## 访问地址

- 🏠 网站首页: http://localhost:3000
- 🛠️ 管理后台: http://localhost:3000/admin
- 📝 发布测评: http://localhost:3000/admin/reviews/new
- 👤 登录: http://localhost:3000/login
- 📝 注册: http://localhost:3000/register

## 功能说明

✅ 首页 - 特色工具、最新测评
✅ Tools 页面 - 浏览所有 AI 工具
✅ Compare 页面 - 对比工具
✅ Reviews 页面 - 测评文章
✅ Solutions 页面 - 行业解决方案
✅ Pricing 页面 - 价格方案
✅ 登录/注册功能
✅ 管理后台
✅ 发布新测评

## 备注

所有页面都已经改成 Next.js 标准格式，使用 next/link 进行路由！
