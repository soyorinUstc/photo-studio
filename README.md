# Photo Studio - RAW 照片管理工作坊

本地局域网部署的 RAW 照片管理系统，支持多用户、JPG 对比、暗色主题。

## ✨ 功能特性

- 🔐 **多用户系统** - 独立账号，数据隔离
- 📷 **RAW 支持** - 索尼 ARW、佳能 CR2/CR3、尼康 NEF 等
- 🖼️ **JPG 滑动对比** - 快速切换不同调色版本
- 🌓 **暗色主题** - 护眼模式，专业感
- 📱 **响应式设计** - 电脑、平板、手机全适配
- 🖥️ **系统托盘** - 后台运行，随时访问
- 🚀 **开机自启** - 可选配置

## 🚀 快速开始

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install

# 托盘应用（可选）
cd tray-app
npm install
```

### 2. 启动服务

**开发模式：**
```bash
# Windows - 一键启动
scripts\start.bat

# 或手动启动
# 终端 1 - 后端
cd backend && npm run dev

# 终端 2 - 前端
cd frontend && npm run dev
```

**生产模式：**
```bash
# 打包托盘应用
cd tray-app
npm run build
```

### 3. 访问

- 本机：http://localhost:5173
- 手机（同 WiFi）：http://你的电脑 IP:5173

查看电脑 IP：`ipconfig` → 找到 `192.168.x.x`

## 📖 使用说明

### 注册账号
1. 首次访问点击"注册"
2. 输入用户名和密码（至少 6 位）
3. 注册成功后登录

### 上传照片
1. 点击"上传照片"
2. 选择 RAW 文件（必须）
3. 选择 JPG 文件（可选，支持多个版本）
4. 填写元数据（ISO、光圈、快门、焦距）
5. 填写标题和备注
6. 点击上传

### JPG 对比
- 单张 JPG：直接显示
- 多张 JPG：滑动条对比
- 3 张以上：底部切换按钮

## 🛠️ 技术栈

**后端：**
- Node.js + Express
- SQLite 数据库
- JWT 认证
- Sharp 缩略图生成

**前端：**
- React 18 + TypeScript
- Vite 构建
- Tailwind CSS
- Zustand 状态管理
- React Compare Slider

## ⚙️ 配置

### 端口
- 后端：3000
- 前端：5173

修改 `.env` 文件或启动脚本。

### 开机自启（Windows）

1. 创建快捷方式到启动文件夹：
   ```
   shell:startup
   ```

2. 或使用任务计划程序

## 📝 注意事项

- RAW 文件较大，确保磁盘空间充足
- 首次上传 ARW 文件时，缩略图生成可能需要几秒
- 手机访问需确保防火墙允许 5173 端口

## 🐛 常见问题

**Q: 手机无法访问？**
A: 检查电脑和手机是否在同一 WiFi，关闭防火墙或添加例外。

**Q: 上传失败？**
A: 检查文件大小（限制 100MB），确保格式支持。

**Q: 缩略图生成失败？**
A: 确保 sharp 库正确安装，某些特殊 RAW 格式可能需要额外依赖。

## 📄 License

MIT
