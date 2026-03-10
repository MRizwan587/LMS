import { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import ReusableDataGrid from '../../components/ui/ReusableDataGrid';
import { getStudents, updateStudentStatus, updateStudent } from '../../services/studentsService';
import type { StudentRow } from '../../types/student';
import type { UpdateStudentPayload } from '../../services/studentsService';
import { getBooks, borrowBook } from '../../services/booksService';
import type { Book } from '../../types/book';
import type { GridColDef } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Switch, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Typography } from '@mui/material';

const MoreVertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const initialForm = { name: '', email: '', rollNumber: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const loadStudents = useCallback(() => {
    setLoading(true);
    getStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStatusChange = (studentId: string, isActive: boolean) => {
    updateStudentStatus(studentId, isActive)
      .then((updated) => {
        setStudents((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
      })
      .catch(() => {});
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const openEdit = (row: StudentRow) => {
    setSelectedStudent(row);
    setForm({ name: row.name, email: row.email, rollNumber: row.rollNumber ?? '' });
    setError(null);
    setEditOpen(true);
  };

  const openDelete = (row: StudentRow) => {
    setSelectedStudent(row);
    setDeleteOpen(true);
  };

  const openAssign = (row: StudentRow) => {
    setSelectedStudent(row);
    setSelectedBookId(null);
    setError(null);
    getBooks()
      .then((books) => setAvailableBooks(books.filter((b) => b.status === 'available')))
      .catch(() => setAvailableBooks([]));
    setAssignOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSubmitting(true);
    setError(null);
    const payload: UpdateStudentPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      rollNumber: form.rollNumber.trim() || undefined,
    };
    updateStudent(selectedStudent._id, payload)
      .then((updated) => {
        setStudents((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
        setEditOpen(false);
      })
      .catch((err: { response?: { data?: { message?: string } }; message?: string }) => {
        setError(err.response?.data?.message ?? err.message ?? 'Update failed');
      })
      .finally(() => setSubmitting(false));
  };

  const handleDeleteConfirm = () => {
    if (!selectedStudent) return;
    setSubmitting(true);
    updateStudentStatus(selectedStudent._id, false)
      .then((updated) => {
        setStudents((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
        setDeleteOpen(false);
      })
      .finally(() => setSubmitting(false));
  };

  const handleAssignSubmit = () => {
    if (!selectedStudent || !selectedBookId) return;
    setSubmitting(true);
    setError(null);
    borrowBook(selectedBookId, selectedStudent._id)
      .then(() => {
        setAssignOpen(false);
        loadStudents();
      })
      .catch((err: { response?: { data?: { message?: string } }; message?: string }) => {
        setError(err.response?.data?.message ?? err.message ?? 'Assign failed');
      })
      .finally(() => setSubmitting(false));
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'rollNumber', headerName: 'Roll number', width: 130 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={!!params.row.isActive}
          onChange={() => handleStatusChange(String(params.id), !params.row.isActive)}
          onClick={(e) => e.stopPropagation()}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row as StudentRow & { id: string };
        return (
          <>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
                setSelectedStudent({
                  _id: row.id,
                  name: row.name,
                  email: row.email,
                  rollNumber: row.rollNumber === '—' ? undefined : row.rollNumber,
                  role: row.role,
                  isActive: row.isActive,
                });
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                onClick={() => {
                  const student = selectedStudent;
                  handleCloseMenu();
                  if (student) openEdit(student);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const student = selectedStudent;
                  handleCloseMenu();
                  if (student) openDelete(student);
                }}
              >
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const student = selectedStudent;
                  handleCloseMenu();
                  if (student) openAssign(student);
                }}
              >
                Assign book
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  const rows = students.map((s) => ({
    id: s._id,
    name: s.name,
    email: s.email,
    rollNumber: s.rollNumber ?? '—',
    role: s.role,
    isActive: s.isActive ?? true,
  }));

  return (
    <>
      <PageContainer title="Students">
        {loading ? (
          <p className="text-slate-600 dark:text-slate-400">Loading students…</p>
        ) : (
          <ReusableDataGrid
            columns={columns}
            rows={rows}
            emptyMessage="No students found"
            height={'89vh'}
          />
        )}
      </PageContainer>

      <Dialog open={editOpen} onClose={() => !submitting && setEditOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleEditSubmit}>
          <DialogTitle>Edit student</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <TextField
                label="Name"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Roll number"
                value={form.rollNumber}
                onChange={(e) => setForm((p) => ({ ...p, rollNumber: e.target.value }))}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => !submitting && setDeleteOpen(false)}>
        <DialogTitle>Delete student</DialogTitle>
        <DialogContent>
          <Typography>
            Deactivate student &quot;{selectedStudent?.name}&quot;? They will no longer appear in the active list and cannot borrow books.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={submitting}>
            {submitting ? 'Deactivating…' : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignOpen} onClose={() => !submitting && setAssignOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign book to {selectedStudent?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            {availableBooks.length === 0 ? (
              <Typography color="text.secondary">No available books.</Typography>
            ) : (
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Select a book to assign:
                </Typography>
                {availableBooks.map((book) => (
                  <Button
                    key={book._id}
                    variant={selectedBookId === book._id ? 'contained' : 'outlined'}
                    onClick={() => setSelectedBookId(book._id)}
                    fullWidth
                    sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    {book.title}
                    {book.genre ? ` · ${book.genre}` : ''}
                  </Button>
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignSubmit}
            disabled={submitting || !selectedBookId || availableBooks.length === 0}
          >
            {submitting ? 'Assigning…' : 'Assign book'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
