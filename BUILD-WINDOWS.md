# 📦 Windows 打包指南

## 快速开始（在 Windows 电脑上操作）

### 1️⃣ 准备工作

确保已安装：
- **Node.js** (v18+) → https://nodejs.org/
- **Git** (可选，用于克隆项目)

### 2️⃣ 安装依赖

```powershell
# 进入项目目录
cd photo-studio

# 安装前端依赖
cd frontend
npm install
npm run build
cd ..

# 安装后端依赖
cd backend
npm install
cd ..

# 安装 Electron 打包工具
cd tray-app
npm install
```

### 3️⃣ 打包成 Windows 安装包

```powershell
# 在 tray-app 目录下执行
npm run build:win
```

### 4️⃣ 获取安装包

打包完成后，在 `tray-app/dist/` 目录下找到：
- `Photo Studio Setup 1.0.0.exe` ← 安装文件

直接双击安装即可！

---

## 🎯 运行效果

安装后：
- ✅ 桌面快捷方式
- ✅ 开始菜单快捷方式
- ✅ 系统托盘图标（最小化到托盘）
- ✅ 双击打开应用窗口
- ✅ 右键托盘图标可退出/最小化

---

## 🐛 常见问题

### Q: 打包时报错 `electron-builder` 找不到？
```powershell
npm install electron-builder --save-dev
```

### Q: 图标不显示？
确保 `tray-app/icon.ico` 文件存在（Windows 格式图标）

### Q: 后端启动失败？
检查后端 `package.json` 的启动命令是否正确

---

## 📝 自定义配置

修改 `tray-app/package.json` 中的 `build` 部分：

```json
"build": {
  "productName": "你的应用名称",
  "appId": "com.yourcompany.app",
  "win": {
    "target": "nsis"  // 或 "portable" (免安装版)
  }
}
```

---

## 🚀 高级选项

### 免安装便携版
```json
"win": {
  "target": "portable"
}
```

### 打包成 MSI
```json
"win": {
  "target": "msi"
}
```

### 同时打包多个格式
```json
"win": {
  "target": ["nsis", "portable"]
}
```

---

## 🎨 图标转换

如果只有 SVG 图标，需要转换成 Windows 的 `.ico` 格式：

**方法 1：在线转换**
1. 访问 https://cloudconvert.com/svg-to-ico
2. 上传 `icon.svg`
3. 下载 `icon.ico`
4. 放到 `tray-app/` 目录

**方法 2：使用 ImageMagick（如果已安装）**
```powershell
magick convert icon.svg -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

---
