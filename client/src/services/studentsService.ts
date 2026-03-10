import { api } from './authService';
import type { StudentRow } from '../types/student';

export async function getStudents(): Promise<StudentRow[]> {
  const { data } = await api.get<StudentRow[]>('/users/students');
  return data;
}

export async function updateStudentStatus(studentId: string, isActive: boolean): Promise<StudentRow> {
  const { data } = await api.patch<StudentRow>(`/users/students/${studentId}/status`, { isActive });
  return data;
}

export interface UpdateStudentPayload {
  name?: string;
  email?: string;
  rollNumber?: string;
}

export async function updateStudent(studentId: string, payload: UpdateStudentPayload): Promise<StudentRow> {
  const { data } = await api.patch<StudentRow>(`/users/students/${studentId}`, payload);
  return data;
}
