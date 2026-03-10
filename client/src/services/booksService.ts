import { api } from './authService';
import type { Book } from '../types/book';
import type { BorrowRecord } from '../types/borrow';

const API_URL = import.meta.env.VITE_API_URL ?? '';

/** Build full URL for an upload path stored in DB (e.g. thumbnails/xxx.jpg) */
export function getUploadUrl(relativePath: string | null | undefined): string {
  if (!relativePath) return '';
  const base = API_URL.replace(/\/$/, '');
  const seg = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${base}/uploads/${seg}`;
}

export async function getBooks(): Promise<Book[]> {
  const { data } = await api.get<Book[]>('/books');
  return data;
}

export async function createBook(formData: FormData): Promise<Book> {
  const { data } = await api.post<Book>('/books/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateBook(bookId: string, formData: FormData): Promise<Book> {
  const { data } = await api.put<Book>(`/books/${bookId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function borrowBook(bookId: string, studentId?: string): Promise<Book> {
  const body = studentId != null ? { studentId } : undefined;
  const { data } = await api.post<Book>(`/books/${bookId}/borrow`, body);
  return data;
}

export async function getBorrows(): Promise<BorrowRecord[]> {
  const { data } = await api.get<BorrowRecord[]>('/books/borrows/list');
  return data;
}

export async function getMyBorrows(): Promise<BorrowRecord[]> {
  const { data } = await api.get<BorrowRecord[]>('/books/borrows/my');
  return data;
}

export async function returnBook(bookId: string): Promise<Book> {
  const { data } = await api.post<Book>(`/books/${bookId}/return`);
  return data;
}
