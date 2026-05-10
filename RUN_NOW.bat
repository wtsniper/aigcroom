
@echo off
cd /d E:\work\aigcroom
echo ===================================
echo 🚀 AIGC Room 启动助手
echo ===================================
echo.
echo [1/4] 检查依赖...
if not exist "node_modules" (
    echo ❌ 依赖未安装！正在安装...
    echo.
    call npm install
    if errorlevel 1 (
        echo ❌ 安装失败！请手动运行 npm install
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装
)

echo.
echo [2/4] 初始化数据库...
call npx prisma db push
if errorlevel 1 (
    echo ⚠️ 数据库初始化可能有问题，但继续尝试启动...
)

echo.
echo [3/4] 生成 Prisma 客户端...
call npx prisma generate

echo.
echo [4/4] 启动开发服务器...
echo.
echo ===================================
echo 🌐 访问地址:
echo    首页: http://localhost:3000
echo    后台: http://localhost:3000/admin
echo ===================================
echo.
call npm run dev
pause
