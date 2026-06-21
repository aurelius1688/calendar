@echo off
echo ================================
echo   Cloudflare Pages 部署脚本
echo ================================
echo.

REM 检查是否安装了 wrangler
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo [提示] 正在安装 Wrangler CLI...
    npm install -g wrangler
)

echo [1/4] 检查登录状态...
wrangler whoami
if %errorlevel% neq 0 (
    echo [提示] 请先登录...
    wrangler login
)

echo.
echo [2/4] 删除旧的 _routes.json (如果有)...
if exist "_routes.json" del "_routes.json"

echo.
echo [3/4] 部署到 Cloudflare Pages...
wrangler pages deploy . --project-name=calendar-new

echo.
echo [4/4] 部署完成!
echo.
echo 测试 API: https://calendar-new.pages.dev/api/test
echo.
pause
