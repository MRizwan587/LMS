import { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import ReusableDataGrid from '../../components/ui/ReusableDataGrid';
import { getBorrows, returnBook as returnBookApi, getUploadUrl } from '../../services/booksService';
import type { BorrowRecord } from '../../types/borrow';
import type { GridColDef } from '@mui/x-data-grid';
import { Button, Box, Stack, Typography } from '@mui/material';

const thumbSize = { width: 40, height: 56 };
const brokenImageSvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="56" viewBox="0 0 40 56"><rect x="2" y="2" width="36" height="52" rx="2" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="1"/><path d="M2 2 L38 54 M38 2 L2 54" stroke="#9e9e9e" stroke-width="2" stroke-linecap="round"/></svg>'
)}`;

function BookThumbnail({ src }: { src: string | null }) {
  const [broken, setBroken] = useState(false);
  const showBroken = !src || broken;
  if (showBroken) {
    return (
      <Box
        component="img"
        src={brokenImageSvg}
        alt="No thumbnail"
        sx={{ ...thumbSize, borderRadius: 0.5, border: '1px solid', borderColor: 'divider', objectFit: 'contain', bgcolor: 'action.hover' }}
      />
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt=""
      onError={() => setBroken(true)}
      sx={{ ...thumbSize, objectFit: 'cover', borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}
    />
  );
}

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
    (bookId: string, studentId: string) => {
      setReturningId(bookId);
      returnBookApi(bookId, studentId)
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
    {
      field: 'bookTitle',
      headerName: 'Book',
      flex: 1,
      minWidth: 220,
      renderCell: ({ row }: { row: { bookTitle: string; bookCoverImage: string | null } }) => {
        const thumbUrl = row.bookCoverImage ? getUploadUrl(row.bookCoverImage) : null;
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BookThumbnail src={thumbUrl} />
            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
              {row.bookTitle}
            </Typography>
          </Stack>
        );
      },
    },
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
              handleReturn(row.bookId, row.studentId);
            }}
          >
            {returningId === row.bookId ? 'Returning…' : 'Return'}
          </Button>
        ) : null,
    },
  ];

  const rows = borrows.map((b) => {
    const book = typeof b.book === 'object' && b.book != null ? b.book : null;
    const bookId = book?._id ?? '';
    const studentId = typeof b.student === 'object' && b.student?._id ? b.student._id : '';
    return {
      id: b._id,
      bookId,
      studentId,
      bookTitle: book?.title ?? '—',
      bookCoverImage: book?.coverImage ?? null,
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
        height={'89vh'}
      />
    </PageContainer>
  );
}
