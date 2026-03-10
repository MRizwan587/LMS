// server/routes/books.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { uploadBookFiles } from '../middleware/upload.js';
import { getBorrows, getMyBorrows, getAll, getOne, create, update, remove, borrow, returnBook } from '../controllers/bookController.js';

const router = express.Router();
router.use(protect);  // all book routes require login

router.get('/borrows/list', getBorrows);
router.get('/borrows/my', getMyBorrows);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/create', (req, res, next) => {
  uploadBookFiles(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
    next();
  });
}, create);
router.put('/:id', (req, res, next) => {
  uploadBookFiles(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
    next();
  });
}, update);
router.delete('/:id', remove);
router.post('/:id/borrow', borrow);
router.post('/:id/return', returnBook);

export default router;