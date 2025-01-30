import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createStorage = (folderName: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', '..', 'uploads', folderName));
    },
    filename: (req, file, cb) => {
      if (!req.userId) {
        return cb(new Error('User ID is required'), '');
      }
      const fileName = `${req.userId}-${new Date().toISOString()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadMiddleware = (folderName: string) =>
  multer({ storage: createStorage(folderName), fileFilter }).single('image');

export default uploadMiddleware;
