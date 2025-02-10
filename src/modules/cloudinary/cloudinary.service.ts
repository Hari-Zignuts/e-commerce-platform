import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { Image } from '../products/entities/image.entity';

@Injectable()
export class CloudinaryService {
  // Upload a single image
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { folder: 'e-commerce' },
        (error, result) => {
          if (error) return reject(new Error(error.message || 'Upload failed'));
          if (!result)
            return reject(new Error('Upload failed with no response'));
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(uploadStream);
    });
  }

  // Upload multiple images
  async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<UploadApiResponse[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }

  async deleteImage(publicId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .destroy(publicId, (error: any, result: { result: string }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          if (error) return reject(new Error(error.message || 'Delete failed'));
          resolve(result.result === 'ok');
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        .catch((err: any) => reject(new Error(err.message || 'Delete failed')));
    });
  }

  async deleteMultipleImages(images: Image[]): Promise<boolean[]> {
    return Promise.all(images.map((image) => this.deleteImage(image.publicId)));
  }
}
