import type { ReactNode } from 'react';
import type { User } from '../../types/auth';
import Box from '@mui/material/Box';

export type Role = User['role'];

export interface NavItem {
  path: string;
  label: string;
  roles: Role[];
  icon: ReactNode;
}

const iconSx = { width: 20, height: 20 };

const IconHome = () => (
  <Box component="svg" sx={iconSx} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </Box>
);
const IconBook = () => (
  <Box component="svg" sx={iconSx} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </Box>
);
const IconIssue = () => (
  <Box component="svg" sx={iconSx} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </Box>
);
const IconUsers = () => (
  <Box component="svg" sx={iconSx} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </Box>
);

const IconAssignedBooks = () => (
  <Box component="svg" sx={iconSx} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </Box>
);

export const navItems: NavItem[] = [
  { path: '/', label: 'Home', roles: ['student', 'librarian', 'author'], icon: <IconHome /> },
  { path: '/books', label: 'Books', roles: ['student', 'librarian', 'author'], icon: <IconBook /> },
  { path: '/my-issues', label: 'My Issues', roles: ['student'], icon: <IconIssue /> },
  { path: '/assigned-books', label: 'Assigned Books', roles: ['librarian'], icon: <IconAssignedBooks /> },
  { path: '/students', label: 'Students', roles: ['librarian'], icon: <IconUsers /> },
];
