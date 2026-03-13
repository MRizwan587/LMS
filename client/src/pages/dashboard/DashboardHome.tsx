import { PageContainer } from '../../components/layout/PageContainer';
import { StatCard } from '../../components/ui/StatCard';
import ReusableDataGrid from '../../components/ui/ReusableDataGrid';
import { HasRole } from '../../components/auth/HasRole.tsx';
import type { User } from '../../types/auth';
import type { GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { getCounts } from '../../services/booksService.ts';

const issuedBooksColumns: GridColDef[] = [
  { field: 'title', headerName: 'Book title', flex: 1, minWidth: 180 },
  { field: 'issuedDate', headerName: 'Issued date', width: 120 },
  { field: 'dueDate', headerName: 'Due date', width: 120 },
  { field: 'status', headerName: 'Status', width: 100 },
];

const books = ['The Great Gatsby', '1984', 'To Kill a Mockingbird', 'Pride and Prejudice', 'The Catcher in the Rye', 'the stains'];

const issuedBooksRows: { id: string; title: string; issuedDate: string; dueDate: string; status: string }[] = books.map((book, index) => ({
  id: index.toString(),
  title: book,
  issuedDate: new Date().toISOString(),
  dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'Pending',
}));

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

const iconSx = { width: 32, height: 32 };

const IconBook = () => (
  <Box component="svg" sx={iconSx} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </Box>
);
const IconClock = () => (
  <Box component="svg" sx={iconSx} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Box>
);

export default function DashboardHome() {
  const user = getStoredUser();
  const [counts, setCounts] = useState({
    issued: 0,
    pendingReturn: 0,
    totalBorrowed: 0,
    overdue: 0,
  });
  useEffect(() => {
    getCounts().then((counts) => {
      setCounts({
        issued: counts.issued,
        pendingReturn: counts.pendingReturn,
        totalBorrowed: counts.totalBorrowed,
        overdue: counts.overdue,
      });
    }).catch(() => {
      setCounts({
        issued: 0,
        pendingReturn: 0,
        totalBorrowed: 0,
        overdue: 0,
      });
    });
  }, []);
  return (
    <PageContainer title={`Welcome, ${user?.name ?? 'User'}`}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You are logged in as{' '}
        <Box component="span" fontWeight={500} sx={{ textTransform: 'capitalize' }} color="text.primary">
          {user?.role}
        </Box>
        .
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <HasRole roles={['librarian', 'student']}>  <StatCard title="Total Issued books" value={counts.issued} icon={<IconBook />} subtitle="Total Issued books" /> 
        <StatCard title="Pending returns" value={counts.pendingReturn} icon={<IconClock />} subtitle="Pending return books" /> 
        <StatCard title="Current borrowed" value={counts.totalBorrowed} icon={<IconBook />} subtitle="Currently borrowed books" /> 
        <StatCard title="Over-Due return Books" value={counts.overdue} icon={<IconClock />} subtitle="Overdue books" /> </HasRole>
        <HasRole roles={['author']}>  <StatCard title="Total Issued books" value={counts.issued} icon={<IconBook />} subtitle="Total Issued books" /> </HasRole>
      </Grid>

      <HasRole roles={['librarian']}>
        <Alert severity="info" sx={{ mb: 2 }}>
          You are a librarian. you can manage books and students.
        </Alert>
      </HasRole>
      <HasRole roles={['author']}>
        <Alert severity="info" sx={{ mb: 2 }}>
          You are author. you can add and manage your books.
        </Alert>
      </HasRole>
      <HasRole roles={['student']}>
        <Alert severity="success" sx={{ mb: 2 }}>
          You are a student. you can browse and issue books.
        </Alert>
      </HasRole>

      <HasRole roles={[]}>
        <Box component="section" sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
            Issued books
          </Typography>
          <ReusableDataGrid
            columns={issuedBooksColumns}
            rows={issuedBooksRows}
            emptyMessage="No issued books"
            pageSizeOptions={[5, 10, 25]}
            height={500}
          />
        </Box>
      </HasRole>
    </PageContainer>
  );
}
