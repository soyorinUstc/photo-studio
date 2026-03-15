import { Router, Request, Response } from 'express';
import db from '../database';
import { hashPassword, verifyPassword, generateToken } from '../auth';

const router = Router();

// 注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少 6 位' });
    }
    
    // 检查用户名是否已存在
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      return res.status(409).json({ error: '用户名已存在' });
    }
    
    // 创建用户
    const passwordHash = await hashPassword(password);
    const stmt = db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)');
    const result = stmt.run(username, passwordHash);
    
    res.status(201).json({
      message: '注册成功',
      userId: result.lastInsertRowid
    });
  } catch (error: any) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });
    
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

export default router;
