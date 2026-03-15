import express from 'express';
import cors from 'cors';
import { initDatabase } from './database';
import authRoutes from './routes/auth.routes';
import photosRoutes from './routes/photos.routes';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// 初始化数据库
initDatabase();

// 创建 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/photos', photosRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, HOST, () => {
  console.log(`🚀 服务器启动成功：http://${HOST}:${PORT}`);
  console.log(`📷 Photo Studio Backend 运行中...`);
});
