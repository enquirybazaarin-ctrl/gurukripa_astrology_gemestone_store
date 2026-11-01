import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CustomError } from '../middleware/errorHandler';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxSize = parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10); // 5MB default

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(uploadDir, 'products'),
    path.join(uploadDir, 'banners'),
    path.join(uploadDir, 'reviews'),
    path.join(uploadDir, 'users'),
    path.join(uploadDir, 'stories')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadDir;

    if (file.fieldname === 'product') {
      uploadPath = path.join(uploadDir, 'products');
    } else if (file.fieldname === 'banner') {
      uploadPath = path.join(uploadDir, 'banners');
    } else if (file.fieldname === 'review') {
      uploadPath = path.join(uploadDir, 'reviews');
    } else if (file.fieldname === 'avatar') {
      uploadPath = path.join(uploadDir, 'users');
    } else if (file.fieldname === 'story-video' || file.fieldname === 'story-logo') {
      uploadPath = path.join(uploadDir, 'stories');
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new CustomError('Invalid file type. Only JPEG, PNG, WebP and MP4/WebM videos are allowed', 400));
  }
};

// Multer instance
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for videos
  fileFilter
});

// Helper to get file URL
export const getFileUrl = (filename: string, type: 'product' | 'banner' | 'review' | 'user' | 'story'): string => {
  const baseUrl = process.env.PUBLIC_UPLOAD_URL || '/uploads';
  const folderMap = {
    product: 'products',
    banner: 'banners',
    review: 'reviews',
    user: 'users',
    story: 'stories'
  };

  return `${baseUrl}/${folderMap[type]}/${filename}`;
};

