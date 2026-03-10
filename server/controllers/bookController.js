// server/controllers/bookController.js
import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';
import { getRelativePath } from '../middleware/upload.js';

const canModify = (user, book) => {
  if (user.role === 'librarian') return true;
  if (user.role === 'author' && book.createdBy.toString() === user.id) return true;
  return false;
};

// GET /books/borrows/list — list all borrow records (librarian only)
export const getBorrows = async (req, res) => {
  try {
    if (req.user?.role !== 'librarian') {
      return res.status(403).json({ message: 'Only librarian can view borrow history' });
    }
    const borrows = await Borrow.find()
      .sort({ borrowDate: -1 })
      .populate('book', 'title')
      .populate('student', 'name email rollNumber');
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /books/borrows/my — current user's borrows (student: own only)
export const getMyBorrows = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    const borrows = await Borrow.find({ student: userId })
      .sort({ borrowDate: -1 })
      .populate('book', 'title');
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /books — list (student: all; author: own; librarian: all)
export const getAll = async (req, res) => {
  try {
    const { role, id } = req.user || {};
    let filter = { isActive: true };
    if (role === 'author') filter.createdBy = id;
    const books = await Book.find(filter)
      .populate('createdBy', 'name email')
      .populate('borrowedBy', 'name email rollNumber');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /books/:id — get one
export const getOne = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('borrowedBy', 'name email rollNumber');
    if (!book || !book.isActive) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /create — create (librarian or author; createdBy = logged-in user)
export const create = async (req, res) => {
  try {
    const { role, id } = req.user;
    if (role !== 'librarian' && role !== 'author') {
      return res.status(403).json({ message: 'Only librarian or author can add books' });
    }
    const { title, description, genre, publishedYear, downloadable } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const coverImagePath = req.files?.thumbnail?.[0]?.path ? getRelativePath(req.files.thumbnail[0].path) : undefined;
    const pdfPath = req.files?.pdf?.[0]?.path ? getRelativePath(req.files.pdf[0].path) : undefined;
    const book = new Book({
      title,
      description,
      genre,
      publishedYear,
      coverImage: coverImagePath,
      pdf: pdfPath,
      downloadable: downloadable === 'true' || downloadable === true,
      createdBy: id,
      status: 'available',
      borrowedBy: null,
    });
    await book.save();
    const populated = await Book.findById(book._id).populate('createdBy', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /books/:id — update (librarian: any; author: own only)
export const update = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!canModify(req.user, book)) {
      return res.status(403).json({ message: 'You can only update your own books' });
    }
    const { title, description, genre, publishedYear, downloadable } = req.body;
    if (title !== undefined) book.title = title;
    if (description !== undefined) book.description = description;
    if (genre !== undefined) book.genre = genre;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;
    if (downloadable !== undefined) book.downloadable = downloadable === 'true' || downloadable === true;
    if (req.files?.thumbnail?.[0]?.path) book.coverImage = getRelativePath(req.files.thumbnail[0].path);
    if (req.files?.pdf?.[0]?.path) book.pdf = getRelativePath(req.files.pdf[0].path);
    await book.save();
    const populated = await Book.findById(book._id)
      .populate('createdBy', 'name email')
      .populate('borrowedBy', 'name email rollNumber');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /books/:id — soft delete (librarian: any; author: own only)
export const remove = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!canModify(req.user, book)) {
      return res.status(403).json({ message: 'You can only delete your own books' });
    }
    book.isActive = false;
    await book.save();
    res.status(200).json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /books/:id/borrow — student borrows; librarian can assign for a student
export const borrow = async (req, res) => {
  try {
    const { role, id } = req.user;
    if (role !== 'student' && role !== 'librarian') {
      return res.status(403).json({ message: 'Only students can borrow books' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status === 'borrowed') {
      return res.status(400).json({ message: 'Book is already borrowed' });
    }
    const studentId = role === 'librarian' ? req.body.studentId : id;
    if (!studentId) return res.status(400).json({ message: 'studentId is required when librarian assigns' });
    book.status = 'borrowed';
    book.borrowedBy = studentId;
    await book.save();

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 10);
    await Borrow.create({
      book: book._id,
      student: studentId,
      borrowDate,
      dueDate,
      status: 'borrowed',
    });

    const populated = await Book.findById(book._id)
      .populate('createdBy', 'name email')
      .populate('borrowedBy', 'name email rollNumber');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /books/:id/return — student returns own; librarian returns any
export const returnBook = async (req, res) => {
  try {
    const { role, id } = req.user;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status !== 'borrowed') {
      return res.status(400).json({ message: 'Book is not borrowed' });
    }
    if (role === 'student' && book.borrowedBy.toString() !== id) {
      return res.status(403).json({ message: 'You can only return books you borrowed' });
    }

    const returnDate = new Date();
    await Borrow.findOneAndUpdate(
      { book: book._id, student: book.borrowedBy, status: 'borrowed' },
      { returnDate, status: 'returned' }
    );

    book.status = 'available';
    book.borrowedBy = null;
    await book.save();
    const populated = await Book.findById(book._id).populate('createdBy', 'name email');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};