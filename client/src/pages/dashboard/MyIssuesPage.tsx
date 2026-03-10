import { useEffect, useState, useCallback } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../components/layout/PageContainer';
import ReusableDataGrid from '../../components/ui/ReusableDataGrid';
import { Button, Typography } from '@mui/material';
import { returnBook as returnBookApi, getMyBorrows } from '../../services/booksService';
import type { BorrowRecord } from '../../types/borrow';
import toast from 'react-hot-toast';

function formatDate(value: string | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toISOString().slice(0, 10);
}

export default function MyIssuesPage() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const loadMyIssues = useCallback(() => {
    setLoading(true);
    getMyBorrows()
      .then(setBorrows)
      .catch(() => setBorrows([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadMyIssues();
  }, [loadMyIssues]);

  const handleReturn = useCallback(
    (bookId: string) => {
      setReturningId(bookId);
      returnBookApi(bookId)
        .then(() => {
          toast.success('Book returned successfully');
          loadMyIssues();
        })
        .catch((err: { response?: { data?: { message?: string } }; message?: string }) => {
          toast.error(err.response?.data?.message ?? err.message ?? 'Failed to return book');
        })
        .finally(() => setReturningId(null));
    },
    [loadMyIssues]
  );

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Book title', flex: 1, minWidth: 180 },
    { field: 'issuedDate', headerName: 'Issued date', width: 120 },
    { field: 'dueDate', headerName: 'Due date', width: 120 },
    { field: 'returnDate', headerName: 'Return date', width: 120 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) =>
        row.status === 'borrowed' ? (
          <Button
            size="small"
            variant="contained"
            color="primary"
            disabled={returningId === row.bookId}
            onClick={(e) => {
              e.stopPropagation();
              handleReturn(row.bookId);
            }}
          >
            {returningId === row.bookId ? 'Returning…' : 'Return'}
          </Button>
        ) : null,
    },
  ];

  const rows = borrows.map((b) => {
    const book = typeof b.book === 'object' && b.book != null ? b.book : null;
    return {
      id: b._id,
      bookId: book?._id ?? String(b.book),
      title: book?.title ?? '—',
      issuedDate: formatDate(b.borrowDate),
      dueDate: formatDate(b.dueDate),
      returnDate: b.returnDate ? formatDate(b.returnDate) : '—',
      status: b.status,
    };
  });

  return (
    <PageContainer title="My Issued Books">
      {loading ? (
        <Typography variant="body1" color="text.secondary">
          Loading…
        </Typography>
      ) : (
        <ReusableDataGrid
          columns={columns}
          rows={rows}
          emptyMessage="No issued books"
          pageSizeOptions={[5, 10, 25]}
          height={'89vh'}
        />
      )}
    </PageContainer>
  );
}
