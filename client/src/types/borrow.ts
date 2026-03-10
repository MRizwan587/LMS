export interface BorrowBookRef {
  _id: string;
  title: string;
}

export interface BorrowStudentRef {
  _id: string;
  name: string;
  email?: string;
  rollNumber?: string;
}

export interface BorrowRecord {
  _id: string;
  book: BorrowBookRef;
  student: BorrowStudentRef;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  createdAt?: string;
  updatedAt?: string;
}
