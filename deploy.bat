@echo off
echo ========================================
echo    AIGC Room - Deploy to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Checking git status...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

if not exist ".git" (
    echo Initializing git repository...
    call git init
)

echo Adding files...
call git add .

echo.
set /p COMMIT_MSG="Enter commit message (e.g., Initial commit): "
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Initial commit
)

echo.
echo Committing changes...
call git commit -m "%COMMIT_MSG%"

echo.
echo Checking remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo Please set the GitHub remote URL first.
    echo.
    echo Run:
    echo git remote add origin https://github.com/wtsniper/aigcroom
    echo.
    pause
    exit /b 1
)

echo.
echo Pushing to GitHub...
call git branch -M main
call git push -u origin main

echo.
echo ========================================
echo    Done!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://github.com/wtsniper/aigcroom
echo 2. Import the repo to Vercel for deployment
echo.
pause
