import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          display: 'flex',
          minWidth: 0,
          flex: 1,
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
