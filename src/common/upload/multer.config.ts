import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const uploadFileInterceptorOptions = {
  storage: diskStorage({
    destination: process.env.UPLOADS_DIR ?? 'uploads',
    filename: (_req, file, callback) => {
      const unique = randomBytes(16).toString('hex');
      callback(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req: unknown, file: Express.Multer.File, callback: (error: Error | null, accept: boolean) => void) => {
    if (!ALLOWED_EXTENSIONS.has(extname(file.originalname).toLowerCase())) {
      callback(new BadRequestException('Only PDF, JPG, and PNG files are allowed.'), false);
      return;
    }
    callback(null, true);
  },
};
