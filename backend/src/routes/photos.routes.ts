import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { createPhoto, addJpgVersion, getPhotosByUser, getPhotoById, getJpgVersions, deletePhoto } from '../services/photo.service';
import path from 'path';
import express from 'express';

const router = Router();

// 获取用户照片列表
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const photos = getPhotosByUser(req.user!.id, limit, offset);
    res.json({ photos });
  } catch (error: any) {
    console.error('获取照片列表失败:', error);
    res.status(500).json({ error: '获取照片列表失败' });
  }
});

// 获取单张照片详情
router.get('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const photo = getPhotoById(parseInt(req.params.id), req.user!.id);
    if (!photo) {
      return res.status(404).json({ error: '照片不存在' });
    }
    
    const jpgVersions = getJpgVersions(photo.id);
    res.json({ photo, jpgVersions });
  } catch (error: any) {
    console.error('获取照片详情失败:', error);
    res.status(500).json({ error: '获取照片详情失败' });
  }
});

// 上传 RAW + JPG
router.post('/upload', authMiddleware, upload.fields([
  { name: 'raw', maxCount: 1 },
  { name: 'jpg', maxCount: 10 }
]), async (req: AuthRequest, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const rawFiles = files?.raw;
    const jpgFiles = files?.jpg;
    
    if (!rawFiles || rawFiles.length === 0) {
      return res.status(400).json({ error: '必须上传 RAW 文件' });
    }
    
    const rawFile = rawFiles[0];
    
    // 创建照片记录
    const photoId = await createPhoto({
      userId: req.user!.id,
      rawFilename: rawFile.originalname,
      rawPath: rawFile.path,
      title: req.body.title,
      comment: req.body.comment,
      iso: req.body.iso ? parseInt(req.body.iso) : undefined,
      aperture: req.body.aperture,
      shutterSpeed: req.body.shutterSpeed,
      focalLength: req.body.focalLength,
      capturedAt: req.body.capturedAt
    });
    
    // 添加 JPG 版本
    if (jpgFiles) {
      for (let i = 0; i < jpgFiles.length; i++) {
        const jpgFile = jpgFiles[i];
        await addJpgVersion({
          photoId,
          jpgFilename: jpgFile.originalname,
          jpgPath: jpgFile.path,
          styleName: req.body[`styleName_${i}`] || `版本${i + 1}`,
          sortOrder: i
        });
      }
    }
    
    res.status(201).json({
      message: '上传成功',
      photoId
    });
  } catch (error: any) {
    console.error('上传失败:', error);
    res.status(500).json({ error: `上传失败：${error.message}` });
  }
});

// 删除照片
router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    deletePhoto(parseInt(req.params.id), req.user!.id);
    res.json({ message: '删除成功' });
  } catch (error: any) {
    console.error('删除失败:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

// 静态文件服务（缩略图和原图）
router.use('/files', express.static(path.join(__dirname, '../../data/uploads')));

export default router;
