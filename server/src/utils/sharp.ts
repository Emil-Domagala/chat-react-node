import sharp from 'sharp';
import cloudinary from '../cloudinary.ts';
import { Readable } from 'stream';
import type { Express } from 'express';

export const saveResizedImage = async (
  image: Express.Multer.File,
  userId: string,
  width: number,
  height?: number,
): Promise<string> => {
  try {
    const processedImage = await sharp(image.buffer)
      .trim() // Auto-crops unnecessary whitespace
      .resize({ width, height })
      .toFormat('jpeg') // Convert to JPEG
      .toBuffer();

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

      Readable.from(processedImage).pipe(stream);
    });
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to process image');
  }
};
