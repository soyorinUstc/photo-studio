@echo off
echo 🚀 启动 Photo Studio...

cd /d "%~dp0.."

REM 启动后端
start "Photo Studio Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul

REM 启动前端
start "Photo Studio Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ 服务已启动！
echo 📱 手机访问：http://你的电脑IP:5173
echo 💻 本地访问：http://localhost:5173
echo 按任意键关闭此窗口...
pause >nul
