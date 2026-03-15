@echo off
echo 📦 安装 Photo Studio 开机自启服务...

set SCRIPT_DIR=%~dp0
set APP_DIR=%SCRIPT_DIR%..

:: 创建启动脚本
cat > "%APP_DIR%\launch.bat" << LAUNCH_EOF
@echo off
cd /d "%APP_DIR%"
start "" "cd backend ^&^& npm run dev"
timeout /t 3 /nobreak >nul
start "" "cd frontend ^&^& npm run dev"
LAUNCH_EOF

:: 添加到启动文件夹
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
copy /Y "%APP_DIR%\launch.bat" "%STARTUP%\PhotoStudio.bat"

echo ✅ 安装完成！
echo 下次开机将自动启动 Photo Studio
echo.
echo 如需卸载，请删除：%STARTUP%\PhotoStudio.bat
pause
