import { PageContainer } from "../../components/layout/PageContainer";
import ReusableDataGrid from "../../components/ui/ReusableDataGrid";
import { useState, useEffect } from "react";
import { getOverdueBorrows } from "../../services/booksService";
import type { BorrowRecord } from "../../types/borrow";
import { Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

export default function OverduePage() {
    const [overdueBorrows, setOverdueBorrows] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOverdueBorrows().then(setOverdueBorrows).catch(() => setOverdueBorrows([])).finally(() => setLoading(false));
    }, [getOverdueBorrows]);

    const columns: GridColDef[] = [
        { field: 'bookTitle', headerName: 'Book', flex: 1, minWidth: 220 },
        { field: 'studentName', headerName: 'Student', flex: 1, minWidth: 140 },
        { field: 'rollNumber', headerName: 'Roll No', width: 110 },
        { field: 'borrowDate', headerName: 'Borrow Date', width: 140 },
        { field: 'dueDate', headerName: 'Due Date', width: 140 },
        { field: 'returnDate', headerName: 'Return Date', width: 140 },
        { field: 'status', headerName: 'Status', width: 140 },
        { field: 'fine', headerName: 'Fine', width: 100 },
    ];
    return (
        <PageContainer title="Overdue Borrows">
            {loading ? (
                <Typography variant="body1" color="text.secondary">
                    Loading…
                </Typography>
            ) : (
                <ReusableDataGrid
                    columns={columns}
                    rows={overdueBorrows.map((borrow) => ({
                        id: borrow._id,
                        bookTitle: borrow.book?.title,
                        studentName: borrow.student?.name,
                        rollNumber: borrow.student?.rollNumber ?? '',
                        borrowDate: new Date(borrow.borrowDate).toLocaleDateString(),
                        dueDate: new Date(borrow.dueDate).toLocaleDateString(),
                        returnDate: borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : '',
                        status: borrow.status,
                        fine: borrow.fine ?? 0,
                    }))}
                    emptyMessage="No overdue borrows"
                    pageSizeOptions={[5, 10, 25]}
                    height={'89vh'}
                />
            )}
        </PageContainer>
    );
}