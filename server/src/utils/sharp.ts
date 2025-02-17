import sharp from 'sharp';
import cloudinary from '../cloudinary.ts';
import { Readable } from 'stream';
import type { Express } from 'express';

export const saveResizedImage = async (image: Express.Multer.File, userId: string, width: number): Promise<string> => {
  try {
    const metadata = await sharp(image.buffer).metadata();

    let processedImage = sharp(image.buffer).trim().toFormat('jpeg');

    if ((metadata.width && metadata.width > width) || !metadata.width) {
      processedImage = processedImage.resize({ width, fit: 'inside' });
    }

    const processedImageBuffer = await processedImage.toBuffer();

    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          public_id: `${userId}-${new Date().toISOString()}-${Math.random()}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );

      Readable.from(processedImageBuffer).pipe(stream);
    });
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to process image');
  }
};
