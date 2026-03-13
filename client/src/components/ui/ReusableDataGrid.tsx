import type { DataGridProps, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

export interface ReusableDataGridProps
  extends Omit<DataGridProps, 'rows' | 'columns'> {
  columns: GridColDef[];
  rows: readonly Record<string, unknown>[] | Record<string, unknown>[];
  rowCount?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  onRowClick?: (params: GridRowParams) => void;
  emptyMessage?: string;
  height?: string | number;
}

export default function ReusableDataGrid({
  columns,
  rows,
  rowCount,
  pageSizeOptions = [5, 10, 25, 50],
  checkboxSelection = false,
  onRowClick,
  emptyMessage = 'No records found',
  height = 500,
  ...rest
}: ReusableDataGridProps) {
  return (
    <Box sx={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={!checkboxSelection}
        onRowClick={onRowClick}
        slots={{
          noRowsOverlay: () => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                minHeight: 120,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <Typography color="text.secondary">{emptyMessage}</Typography>
            </Box>
          ),
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': { textTransform: 'uppercase', fontWeight: 'bold',  borderBottom: '1px solid #0f172b', },
        }}
        {...rest}
      />
    </Box>
  );
}
