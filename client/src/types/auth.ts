export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface SignupData {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'librarian' | 'author';
    rollNumber?: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: 'student' | 'librarian' | 'author';
    };
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'librarian' | 'author';
    rollNumber?: string;
  }