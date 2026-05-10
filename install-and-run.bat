
@echo off
chcp 65001 >nul
echo ==========================================
echo 🚀 AIGC Room - 自动安装启动
echo ==========================================
cd /d E:\work\aigcroom

echo.
echo [1/4] 正在安装依赖...
npm install

if errorlevel 1 (
    echo ❌ 依赖安装失败！
    pause
    exit /b 1
)

echo.
echo [2/4] 正在初始化数据库...
npx prisma db push

echo.
echo [3/4] 正在生成 Prisma 客户端...
npx prisma generate

echo.
echo [4/4] 正在启动开发服务器...
echo.
echo ==========================================
echo 🌐 访问地址：
echo   首页：http://localhost:3000
echo   后台：http://localhost:3000/admin
echo ==========================================
echo.

npm run dev

pause
