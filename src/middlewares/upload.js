import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('src/tmp'));
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${uniquePrefix}_${safeName}`);
  },
});

export const upload = multer({
  storage,
});