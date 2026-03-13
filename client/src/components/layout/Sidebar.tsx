import { navItems } from './navConfig';
import { SidebarNavItem } from './SidebarNavItem';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function Sidebar() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const currentRole = user?.role;
  const visibleItems = navItems.filter(
    (item) => currentRole && item.roles.includes(currentRole)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      component="aside"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 256,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: 56,
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
          px: 2,
        }}
      >
        <Typography variant="h6" component="span" color="text.primary">
          Library
        </Typography>
      </Box>
      <Box component="nav" sx={{ flex: 1, py: 1.5, px: 1.5 }}>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {visibleItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </List>
      </Box>
      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          p: 1.5,
        }}
      >
        <Box
          sx={{
            borderRadius: 1,
            px: 1.5,
            py: 1,
          }}
        >
          <Typography variant="body2" fontWeight={500} color="text.primary" noWrap>
            {user?.name ?? 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {user?.role ?? '—'}
          </Typography>
        </Box>
        <Button
          fullWidth
          onClick={handleLogout}
          sx={{
            mt: 1,
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'text.primary',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
