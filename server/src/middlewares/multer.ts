import multer from 'multer';

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

export default uploadMiddleware;
