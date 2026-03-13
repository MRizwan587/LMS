import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import ReusableDataGrid from '../../components/ui/ReusableDataGrid';
import { HasRole } from '../../components/auth/HasRole';
import { getBooks, createBook, updateBook, searchByTitle } from '../../services/booksService';
import type { Book } from '../../types/book';
import type { GridColDef } from '@mui/x-data-grid';
import { Button, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, FormControlLabel, Checkbox, Box, IconButton, Menu, MenuItem, InputAdornment } from '@mui/material';
import toast from 'react-hot-toast';
import { getUploadUrl } from '../../services/booksService';
import { PdfViewerDialog } from '../../components/pdf/PdfViewerDialog';

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

function getStoredUser(): { id: string; role: string } | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as { id: string; role: string }) : null;
  } catch {
    return null;
  }
}

const initialForm = {
  title: '',
  description: '',
  genre: '',
  publishedYear: '',
  copies: '1',
  downloadable: false,
  thumbnail: null as File | null,
  pdf: null as File | null,
};

function MoreVertIcon() {
  return (
    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor" sx={{ display: 'block' }}>
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </Box>
  );
}

function SearchIcon() {
  return (
    <Box component="svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} sx={{ display: 'block' }}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </Box>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; bookId: string } | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const user = getStoredUser();
  const isAuthorOrLibrarian = user?.role === 'author' || user?.role === 'librarian';
  const isStudent = user?.role === 'student';
  const [searchTitle, setSearchTitle] = useState('');
  const openPdfViewer = (url: string) => setPdfViewerUrl(url);
  const closePdfViewer = () => setPdfViewerUrl(null);

  const loadBooks = () => {
    setLoading(true);
    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleOpenDialog = () => {
    setEditingBookId(null);
    setForm(initialForm);
    setError(null);
    setDialogOpen(true);
  };

  const handleSearch = () => {
    setLoading(true);
    searchByTitle(searchTitle).then(setBooks).catch(() => setBooks([])).finally(() => setLoading(false));
  };

  const handleOpenEditDialog = (book: Book) => {
    setEditingBookId(book._id);
    setForm({
      title: book.title,
      description: book.description ?? '',
      genre: book.genre ?? '',
      publishedYear: book.publishedYear ? String(book.publishedYear) : '',
      copies: book.copies != null ? String(book.copies) : '1',
      downloadable: book.downloadable ?? false,
      thumbnail: null,
      pdf: null,
    });
    setError(null);
    setMenuAnchor(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!submitting) {
      setDialogOpen(false);
      setEditingBookId(null);
    }
  };

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'downloadable') {
      setForm((prev) => ({ ...prev, downloadable: e.target.checked }));
    } else if (field === 'thumbnail' || field === 'pdf') {
      const file = e.target.files?.[0];
      setForm((prev) => ({ ...prev, [field]: file ?? null }));
    } else {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError('Title is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    const fd = new FormData();
    fd.append('title', title);
    if (form.description.trim()) fd.append('description', form.description.trim());
    if (form.genre.trim()) fd.append('genre', form.genre.trim());
    if (form.publishedYear) fd.append('publishedYear', form.publishedYear);
    const copiesNum = form.copies.trim() ? parseInt(form.copies, 10) : 1;
    fd.append('copies', String(isNaN(copiesNum) || copiesNum < 1 ? 1 : copiesNum));
    fd.append('downloadable', String(form.downloadable));
    if (form.thumbnail) fd.append('thumbnail', form.thumbnail);
    if (form.pdf) fd.append('pdf', form.pdf);
    const promise = editingBookId ? updateBook(editingBookId, fd) : createBook(fd);
    promise
      .then(() => {
        handleCloseDialog();
        loadBooks();
        toast.success(editingBookId ? 'Book updated' : 'Book added');
      })
      .catch((err: { response?: { data?: { message?: string } }; message?: string }) => {
        setError(err.response?.data?.message ?? err.message ?? (editingBookId ? 'Failed to update book' : 'Failed to add book'));
      })
      .finally(() => setSubmitting(false));
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      renderCell: ({ row }: { row: { title: string; coverImage?: string | null } }) => {
        const thumbUrl = row.coverImage ? getUploadUrl(row.coverImage) : null;
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BookThumbnail src={thumbUrl || null} />
            <Typography variant="body2" noWrap sx={{ flex: 1 }}>{row.title}</Typography>
          </Stack>
        );
      },
    },
    { field: 'createdByName', headerName: 'Created by', flex: 1, minWidth: 140 },
    { field: 'genre', headerName: 'Genre', width: 120 },
    ...(isAuthorOrLibrarian ? [{ field: 'copiesInfo', headerName: 'Copies', width: 100 }] as GridColDef[] : []),
    ...(isStudent ? [{ field: 'status', headerName: 'Status', width: 100 }] as GridColDef[] : []),
    { field: 'borrowedByName',
      headerName: 'Borrowed by',
      flex: 1,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={value === 'Available' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'pdf',
      headerName: 'PDF',
      width: 200,
      sortable: false,
      renderCell: ({ row }: { row: { pdf?: string | null; downloadable?: boolean } }) => {
        if (!row.pdf) return '—';
        const pdfUrl = getUploadUrl(row.pdf);
        return (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
              size="small"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                openPdfViewer(pdfUrl);
              }}
            >
              Read
            </Button>
            {row.downloadable && (
              <Button
                size="small"
                variant="contained"
                component="a"
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </Button>
            )}
            </Stack>
          </Box>
        );
      },
    },
    ...(isAuthorOrLibrarian
      ? [
          {
            field: 'menuAction',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: ({ row }: { row: { id: string } }) => (
              <IconButton
                size="small"
                aria-label="Actions"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuAnchor({ el: e.currentTarget, bookId: row.id });
                }}
              >
                <MoreVertIcon />
              </IconButton>
            ),
          } as GridColDef,
        ]
      : []),
  ];

  const rows = books.map((b) => ({
    id: b._id,
    title: b.title,
    coverImage: b.coverImage ?? null,
    createdByName: b.createdBy?.name ?? '—',
    genre: b.genre ?? '—',
    copiesInfo: b.pdf ? 'Digital' : (b.countborrowed != null ? `${b.countborrowed}/${b.copies ?? 1} out` : `${b.copies ?? 1}`),
    status: b.status,
    borrowedByName: Array.isArray(b.borrowedBy) && b.borrowedBy.length
      ? b.borrowedBy.map((u) => u.name).join(', ')
      : 'Available',
    isAvailable: b.status === 'available',
    pdf: b.pdf ?? null,
    downloadable: b.downloadable ?? false,
  }));

  const addBookAction = (
    <HasRole roles={['librarian', 'author']}>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Add Book
      </Button>
    </HasRole>
  );

  const searchBar = (
    <TextField
      placeholder="Search by title…"
      size="small"
      value={searchTitle}
      onChange={(e) => setSearchTitle(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
      fullWidth
      sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              size="small"
              onClick={handleSearch}
              aria-label="Search"
              sx={{ p: 0.5 }}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <>
      <PageContainer title="Books" middle={searchBar} action={addBookAction}>
        {loading ? (
          <Typography variant="body1" color="text.secondary">Loading books…</Typography>
        ) : (
          <ReusableDataGrid
            columns={columns}
            rows={rows}
            emptyMessage="No books found"
            height={'89vh'}
          />
        )}
      </PageContainer>

      <Menu
        anchorEl={menuAnchor?.el}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            const book = books.find((b) => b._id === menuAnchor?.bookId);
            if (book) handleOpenEditDialog(book);
          }}
        >
          Update book
        </MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingBookId ? 'Update Book' : 'Add Book'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {error && (
                <Typography component="p" color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <TextField label="Title" required value={form.title} onChange={handleChange('title')} fullWidth autoFocus />
              <TextField label="Description" value={form.description} onChange={handleChange('description')} fullWidth multiline rows={2}/>
              <TextField label="Genre" value={form.genre} onChange={handleChange('genre')} fullWidth/>
              <TextField label="Published year of book" type="number" value={form.publishedYear} onChange={handleChange('publishedYear')} fullWidth inputProps={{ min: 1, max: new Date().getFullYear() }} />
              <TextField label="Copies" type="number" value={form.copies} onChange={handleChange('copies')} fullWidth inputProps={{ min: 1 }} helperText="Number of physical copies available for borrowing" />
              <Typography variant="body2" color="text.secondary">Thumbnail (image)</Typography>
              <Button variant="outlined" component="label" fullWidth>
                {form.thumbnail ? form.thumbnail.name : 'Choose thumbnail'}
                <input type="file" accept="image/*" hidden onChange={handleChange('thumbnail')} />
              </Button>
              <Typography variant="body2" color="text.secondary">PDF if digital book (optional)</Typography>
              <Button variant="outlined" component="label" fullWidth>
                {form.pdf ? form.pdf.name : 'Choose PDF'}
                <input type="file" accept="application/pdf" hidden onChange={handleChange('pdf')} />
              </Button>
              <FormControlLabel
                control={<Checkbox checked={form.downloadable} onChange={handleChange('downloadable')} />}
                label="Downloadable (students can download PDF)"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? (editingBookId ? 'Updating…' : 'Adding…') : (editingBookId ? 'Update Book' : 'Add Book')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <PdfViewerDialog
        open={!!pdfViewerUrl}
        pdfUrl={pdfViewerUrl}
        onClose={closePdfViewer}
      />
    </>
  );
}
