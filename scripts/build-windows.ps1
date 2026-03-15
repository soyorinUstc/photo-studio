# Photo Studio Windows 打包脚本
Write-Host "🚀 开始打包 Photo Studio..." -ForegroundColor Green

# 进入项目根目录
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# 1. 构建前端
Write-Host "`n📦 构建前端..." -ForegroundColor Cyan
Set-Location frontend
npm install
npm run build
Set-Location ..

# 2. 安装后端依赖
Write-Host "`n🔧 安装后端依赖..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..

# 3. 安装 Electron 依赖
Write-Host "`n⚡ 安装 Electron..." -ForegroundColor Cyan
Set-Location tray-app
npm install

# 4. 打包
Write-Host "`n📦 开始打包 Windows 安装包..." -ForegroundColor Cyan
npm run build:win

Write-Host "`n✅ 打包完成！" -ForegroundColor Green
Write-Host "安装包位置：$(Get-Location)\dist\Photo Studio Setup 1.0.0.exe" -ForegroundColor Yellow

# 打开文件夹
explorer.exe (Join-Path (Get-Location) "dist")
