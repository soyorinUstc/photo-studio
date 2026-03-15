import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../data/database.sqlite');

export const db: DatabaseType = new Database(dbPath);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 初始化数据库表
export function initDatabase() {
  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // RAW 照片主表
  db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      rawFilename TEXT,
      storedRawPath TEXT,
      thumbnailPath TEXT,
      title TEXT,
      comment TEXT,
      iso INTEGER,
      aperture TEXT,
      shutterSpeed TEXT,
      focalLength TEXT,
      capturedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // JPG 版本表
  db.exec(`
    CREATE TABLE IF NOT EXISTS jpg_versions (
      id INTEGER PRIMARY KEY,
      photoId INTEGER,
      jpgFilename TEXT,
      storedJpgPath TEXT,
      styleName TEXT,
      sortOrder INTEGER DEFAULT 0,
      fileSize INTEGER,
      width INTEGER,
      height INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (photoId) REFERENCES photos(id)
    )
  `);

  // 创建索引
  db.exec('CREATE INDEX IF NOT EXISTS idx_photos_user ON photos(userId)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_jpg_photo ON jpg_versions(photoId)');

  console.log('✅ 数据库初始化完成');
}

export default db;
