import multer from 'multer';
import dotenv from 'dotenv';
// import path from 'path';
import fs from 'fs';
import { type Request } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const uploadDir = './public/uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//MUTLER STORAGE
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//       // Create a unique filename: timestamp + original name
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

dotenv.config();

//CLOUDINARY STORAGE
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campushub_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
      cb(null, true);
  } else {
      cb(new Error('Only images are allowed!'), false);
  }
}

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});