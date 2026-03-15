import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function generateThumbnail(inputPath: string, outputPath: string): Promise<void> {
  try {
    await sharp(inputPath)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`✅ 缩略图生成成功：${outputPath}`);
  } catch (error: any) {
    console.error(`❌ 缩略图生成失败：${error.message}`);
    throw error;
  }
}

export function getThumbnailPath(rawPath: string): string {
  const dir = path.dirname(rawPath);
  const name = path.basename(rawPath, path.extname(rawPath));
  return path.join(dir, `${name}_thumb.jpg`);
}
