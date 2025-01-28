import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'profiles'));
  },
  filename: (req, file, cb) => {
    console.log(req.userId);
    const fileName = `${req.userId}-${new Date().toISOString()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter }).single('image');

export default upload;
