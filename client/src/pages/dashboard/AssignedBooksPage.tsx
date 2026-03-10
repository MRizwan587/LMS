import { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import ReusableDataGrid from '../../components/ui/ReusableDataGrid';
import { getBorrows, returnBook as returnBookApi } from '../../services/booksService';
import type { BorrowRecord } from '../../types/borrow';
import type { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString(undefined, { dateStyle: 'short' });
}

export default function AssignedBooksPage() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const loadBorrows = useCallback(() => {
    setLoading(true);
    getBorrows()
      .then(setBorrows)
      .catch(() => setBorrows([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = useCallback(
    (bookId: string) => {
      setReturningId(bookId);
      returnBookApi(bookId)
        .then(() => loadBorrows())
        .catch(() => {})
        .finally(() => setReturningId(null));
    },
    [loadBorrows]
  );

  useEffect(() => {
    loadBorrows();
  }, [loadBorrows]);

  const columns: GridColDef[] = [
    { field: 'bookTitle', headerName: 'Book', flex: 1, minWidth: 160 },
    { field: 'studentName', headerName: 'Student', flex: 1, minWidth: 140 },
    { field: 'rollNumber', headerName: 'Roll No', width: 110 },
    { field: 'borrowDate', headerName: 'Borrow Date', width: 120 },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    { field: 'returnDate', headerName: 'Return Date', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: ({ value }) => (
        <span
          style={{
            textTransform: 'capitalize',
            fontWeight: 600,
            color:
              value === 'overdue'
                ? '#b91c1c'
                : value === 'returned'
                  ? '#15803d'
                  : '#1d4ed8',
          }}
        >
          {value}
        </span>
      ),
    },
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
    const bookId = typeof b.book === 'object' && b.book?._id ? b.book._id : '';
    return {
      id: b._id,
      bookId,
      bookTitle: typeof b.book === 'object' && b.book?.title ? b.book.title : '—',
      studentName:
        typeof b.student === 'object' && b.student?.name ? b.student.name : '—',
      rollNumber:
        typeof b.student === 'object' && b.student?.rollNumber
          ? b.student.rollNumber
          : '—',
      borrowDate: formatDate(b.borrowDate),
      dueDate: formatDate(b.dueDate),
      returnDate: formatDate(b.returnDate ?? undefined),
      status: b.status,
    };
  });

  return (
    <PageContainer title="Assigned books">
      <ReusableDataGrid
        columns={columns}
        rows={rows}
        loading={loading}
        emptyMessage="No borrow records yet."
        height={520}
      />
    </PageContainer>
  );
}
