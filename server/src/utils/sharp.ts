import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import type { Express } from 'express';
import type { Multer } from 'multer';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveResizedImage = async (
  image: Express.Multer.File,
  userId: string,
  folderName: string,
  width: number,
  height: number,
): Promise<string> => {
  try {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', folderName);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const extension = path.extname(image.originalname);
    const relativeFilePath = `/uploads/${folderName}/${userId}-${new Date().toISOString()}${extension}`;
    const fullFilePath = path.join(__dirname, '..', '..', relativeFilePath);

    await sharp(image.buffer).resize({ width, height, fit: 'inside' }).toFile(fullFilePath);

    return relativeFilePath;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to process image');
  }
};
