import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../data/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedRaw = ['.arw', '.cr2', '.cr3', '.nef', '.dng', '.orf', '.rw2'];
  const allowedJpg = ['.jpg', '.jpeg'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedRaw.includes(ext) || allowedJpg.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件格式：${ext}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB 限制
  }
});
