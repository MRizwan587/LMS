import { useEffect, useState, useCallback } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../components/layout/PageContainer';
import ReusableDataGrid from '../../components/ui/ReusableDataGrid';
import { Typography, Box, Stack } from '@mui/material';
import { getMyBorrows, getUploadUrl } from '../../services/booksService';
import type { BorrowRecord } from '../../types/borrow';

const thumbSize = { width: 40, height: 56 };
const brokenImageSvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="56" viewBox="0 0 40 56"><rect x="2" y="2" width="36" height="52" rx="2" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="1"/><path d="M2 2 L38 54 M38 2 L2 54" stroke="#9e9e9e" stroke-width="2" stroke-linecap="round"/></svg>'
)}`;

function formatDate(value: string | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toISOString().slice(0, 10);
}

export default function MyIssuesPage() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
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

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Book title',
      flex: 1,
      minWidth: 220,
      renderCell: ({ row }: { row: { title: string; coverImage?: string | null } }) => {
        const thumbUrl = row.coverImage ? getUploadUrl(row.coverImage) : null;
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="img"
              src={thumbUrl || brokenImageSvg}
              alt=""
              onError={(e) => { (e.target as HTMLImageElement).src = brokenImageSvg; }}
              sx={{ ...thumbSize, objectFit: thumbUrl ? 'cover' : 'contain', borderRadius: 0.5, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
            />
            <Typography variant="body2" noWrap sx={{ flex: 1 }}>{row.title}</Typography>
          </Stack>
        );
      },
    },
    { field: 'issuedDate', headerName: 'Issued date', width: 120 },
    { field: 'dueDate', headerName: 'Due date', width: 120 },
    { field: 'returnDate', headerName: 'Return date', width: 120 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  const rows = borrows.map((b) => {
    const book = typeof b.book === 'object' && b.book != null ? b.book : null;
    return {
      id: b._id,
      bookId: book?._id ?? String(b.book),
      title: book?.title ?? '—',
      coverImage: book?.coverImage ?? null,
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
