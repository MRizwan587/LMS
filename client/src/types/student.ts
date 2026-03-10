export interface StudentRow {
  _id: string;
  name: string;
  email: string;
  rollNumber?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
}