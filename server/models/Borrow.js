import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'books',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed',
  },
}, { timestamps: true });

const Borrow = mongoose.model('borrows', borrowSchema);

export default Borrow;
