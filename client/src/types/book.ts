export interface BookCreatedBy {
  _id: string;
  name: string;
  email?: string;
}

export interface BookBorrowedBy {
  _id: string;
  name: string;
  email?: string;
  rollNumber?: string;
}

export interface Book {
  _id: string;
  title: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
  coverImage?: string | null;
  pdf?: string | null;
  downloadable?: boolean;
  createdBy: BookCreatedBy;
  status: 'available' | 'borrowed';
  borrowedBy?: BookBorrowedBy | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookPayload {
  title: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
  downloadable?: boolean;
}
