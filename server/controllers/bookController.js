// server/controllers/bookController.js
import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';
import { getRelativePath } from '../middleware/upload.js';

const canModify = (user, book) => {
  if (user.role === 'librarian') return true;
  if (user.role === 'author' && book.createdBy.toString() === user.id) return true;
  return false;
};

//search by title of book
export const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const books = await Book.find({ title: { $regex: title, $options: 'i' } }).populate('createdBy', 'name email').populate('borrowedBy', 'name email rollNumber');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCounts = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    let issuedCounts = 0;
    let pendingReturnCounts = 0;
    let totalBorrowedCounts = 0;
    let overdueCounts = 0;
    if (req.user?.role == 'librarian') {
      issuedCounts = await Borrow.countDocuments();
      pendingReturnCounts = await Borrow.countDocuments({  returnDate: null });
      totalBorrowedCounts = await Borrow.countDocuments({ status: 'borrowed' });
      overdueCounts = await Borrow.countDocuments({ dueDate: { $lt: new Date() } });
    }
    if (req.user?.role == 'student') {
      issuedCounts = await Borrow.countDocuments({ student: userId });
      pendingReturnCounts = await Borrow.countDocuments({ student: userId, returnDate: null });
      totalBorrowedCounts = await Book.countDocuments({ borrowedBy: userId });
      overdueCounts = await Borrow.countDocuments({ student: userId, dueDate: { $lt: new Date() } });
    }
    if (req.user?.role == 'author') {
      issuedCounts = await Book.countDocuments({ createdBy: userId });
    }
    res.status(200).json({
      issued: issuedCounts,
      pendingReturn: pendingReturnCounts,
      totalBorrowed: totalBorrowedCounts,
      overdue: overdueCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /books/borrows/list — list all borrow records (librarian only)
export const getBorrows = async (req, res) => {
  try {
    if (req.user?.role !== 'librarian') {
      return res.status(403).json({ message: 'Only librarian can view borrow history' });
    }
    const borrows = await Borrow.find()
      .sort({ borrowDate: -1 })
      .populate('book', 'title coverImage')
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
      .populate('book', 'title coverImage');
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
    const { title, description, genre, publishedYear, copies, downloadable } = req.body;
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
      copies,
      downloadable: downloadable === 'true' || downloadable === true,
      createdBy: id,
      status: 'available',
      borrowedBy: [],
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
    const { title, description, genre, publishedYear, copies, downloadable } = req.body;
    if (title !== undefined) book.title = title;
    if (description !== undefined) book.description = description;
    if (genre !== undefined) book.genre = genre;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;
    if (copies !== undefined) book.copies = copies;
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

// POST /books/:id/borrow — only librarian can assign a book to a student
export const borrow = async (req, res) => {
  try {
    if (req.user?.role !== 'librarian') {
      return res.status(403).json({ message: 'Only librarian can assign books to students' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const studentId = req.body.studentId;
    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    if (book.pdf) {
      return res.status(400).json({
        message: 'This book is digital (PDF only) and cannot be assigned for borrow. Students can read it from the system.',
      });
    }

    if (book.copies <= book.countborrowed) {
      return res.status(400).json({ message: 'Book is out of stock' });
    }
    const alreadyHasCopy = Array.isArray(book.borrowedBy) && book.borrowedBy.some((id) => id.toString() === studentId);
    if (alreadyHasCopy) {
      return res.status(400).json({message: 'Student has already borrowed a copy of this book; they must return it first.'});
    }
    if (!Array.isArray(book.borrowedBy)) book.borrowedBy = [];
    book.borrowedBy.push(studentId);
    book.countborrowed++;
    if (book.countborrowed === book.copies) {
      book.status = 'borrowed';
    }
    await book.save();

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);
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

// POST /books/:id/return — only librarian can return a book (body.studentId)
export const returnBook = async (req, res) => {
  try {
    if (req.user?.role !== 'librarian') {
      return res.status(403).json({ message: 'Only librarian can return books' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const studentId = req.body.studentId;
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }

    const returnDate = new Date();
    const updated = await Borrow.findOneAndUpdate(
      { book: book._id, student: studentId, status: 'borrowed' },
      { returnDate, status: 'returned' },
      { new: true }
    );
    if (!updated) {
      return res.status(400).json({ message: 'No active borrow found for this book and student' });
    }

    book.countborrowed--;
    if (!Array.isArray(book.borrowedBy)) book.borrowedBy = [];
    book.borrowedBy = book.borrowedBy.filter((id) => id.toString() !== studentId);
    if (book.countborrowed === 0) {
      book.status = 'available';
      book.borrowedBy = [];
    }
    await book.save();

    const populated = await Book.findById(book._id)
      .populate('createdBy', 'name email')
      .populate('borrowedBy', 'name email rollNumber');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//due date < date now return the list of books that are overdue
export const getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await Borrow.find({ dueDate: { $lt: new Date() } })
      .populate('book', 'title coverImage')
      .populate('student', 'name email rollNumber');
    const finePerDay = process.env.FINE_PER_DAY;
    const overdueBorrowsWithFine = overdueBooks.map((borrow) => {
      const daysOverdue = Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24));
      return {
        ...borrow._doc,
        fine: daysOverdue * finePerDay,
      };
    });
    res.status(200).json(overdueBorrowsWithFine);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};