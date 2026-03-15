import db from '../database';
import { getThumbnailPath, generateThumbnail } from './thumbnail.service';
import fs from 'fs';
import path from 'path';

export interface PhotoInput {
  userId: number;
  rawFilename: string;
  rawPath: string;
  title?: string;
  comment?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  capturedAt?: string;
}

export interface JpgVersionInput {
  photoId: number;
  jpgFilename: string;
  jpgPath: string;
  styleName?: string;
  sortOrder?: number;
}

export async function createPhoto(input: PhotoInput): Promise<number> {
  const thumbnailPath = getThumbnailPath(input.rawPath);
  
  // 生成缩略图
  await generateThumbnail(input.rawPath, thumbnailPath);
  
  const stmt = db.prepare(`
    INSERT INTO photos (userId, rawFilename, storedRawPath, thumbnailPath, title, comment, iso, aperture, shutterSpeed, focalLength, capturedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    input.userId,
    input.rawFilename,
    input.rawPath,
    thumbnailPath,
    input.title || null,
    input.comment || null,
    input.iso || null,
    input.aperture || null,
    input.shutterSpeed || null,
    input.focalLength || null,
    input.capturedAt || null
  );
  
  return result.lastInsertRowid as number;
}

export async function addJpgVersion(input: JpgVersionInput): Promise<void> {
  const stats = fs.statSync(input.jpgPath);
  const metadata = await require('sharp')(input.jpgPath).metadata();
  
  const stmt = db.prepare(`
    INSERT INTO jpg_versions (photoId, jpgFilename, storedJpgPath, styleName, sortOrder, fileSize, width, height)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    input.photoId,
    input.jpgFilename,
    input.jpgPath,
    input.styleName || null,
    input.sortOrder || 0,
    stats.size,
    metadata.width || 0,
    metadata.height || 0
  );
}

export function getPhotosByUser(userId: number, limit = 50, offset = 0) {
  const stmt = db.prepare(`
    SELECT p.*, COUNT(j.id) as jpgCount
    FROM photos p
    LEFT JOIN jpg_versions j ON p.id = j.photoId
    WHERE p.userId = ?
    GROUP BY p.id
    ORDER BY p.createdAt DESC
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(userId, limit, offset);
}

export function getPhotoById(photoId: number, userId: number) {
  const stmt = db.prepare(`
    SELECT * FROM photos WHERE id = ? AND userId = ?
  `);
  
  return stmt.get(photoId, userId) as any;
}

export function getJpgVersions(photoId: number) {
  const stmt = db.prepare(`
    SELECT * FROM jpg_versions WHERE photoId = ? ORDER BY sortOrder ASC
  `);
  
  return stmt.all(photoId);
}

export function deletePhoto(photoId: number, userId: number): void {
  const photo = getPhotoById(photoId, userId);
  if (!photo) return;
  
  // 删除文件
  try {
    if (fs.existsSync(photo.storedRawPath)) fs.unlinkSync(photo.storedRawPath);
    if (fs.existsSync(photo.thumbnailPath)) fs.unlinkSync(photo.thumbnailPath);
    
    const jpgs = getJpgVersions(photoId);
    jpgs.forEach((jpg: any) => {
      if (fs.existsSync(jpg.storedJpgPath)) fs.unlinkSync(jpg.storedJpgPath);
    });
  } catch (error) {
    console.error('删除文件失败:', error);
  }
  
  // 删除数据库记录
  db.prepare('DELETE FROM jpg_versions WHERE photoId = ?').run(photoId);
  db.prepare('DELETE FROM photos WHERE id = ? AND userId = ?').run(photoId, userId);
}
