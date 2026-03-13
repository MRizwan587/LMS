import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  pdf: {
    type: String,
  },
  copies:{
    type: Number,
    default: 1,
  },
  countborrowed:{
    type: Number,
    default: 0,
  },
  downloadable: {
    type: Boolean,
    default: false,
  },
  genre: {
    type: String,
  },
  publishedYear: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'borrowed'],
    default: 'available',
  },
  borrowedBy: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Book = mongoose.model('books', bookSchema);

export default Book;