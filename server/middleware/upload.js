import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const THUMBNAILS_DIR = path.join(UPLOADS_DIR, 'thumbnails');
const PDFS_DIR = path.join(UPLOADS_DIR, 'pdfs');

// Ensure upload directories exist
[UPLOADS_DIR, THUMBNAILS_DIR, PDFS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'thumbnail' ? THUMBNAILS_DIR : PDFS_DIR;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.fieldname === 'thumbnail' ? '.jpg' : '.pdf');
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'thumbnail') {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Thumbnail must be an image (jpeg, png, webp, gif)'), false);
  }
  if (file.fieldname === 'pdf') {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    return cb(new Error('File must be a PDF'), false);
  }
  cb(null, true);
};

export const uploadBookFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per file
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

/** Path relative to uploads folder for DB, e.g. "thumbnails/xxx.jpg" */
export function getRelativePath(absolutePath) {
  if (!absolutePath) return null;
  const rel = path.relative(UPLOADS_DIR, path.normalize(absolutePath));
  return rel.replace(/\\/g, '/');
}
