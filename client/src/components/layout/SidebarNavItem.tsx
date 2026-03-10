import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

interface SidebarNavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export function SidebarNavItem({ to, icon, label }: SidebarNavItemProps) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        borderRadius: 1,
        py: 1.25,
        px: 1.5,
        '&.active': {
          bgcolor: 'action.selected',
          color: 'text.primary',
          '& .MuiListItemIcon-root': {
            color: 'text.secondary',
          },
        },
        '&:not(.active)': {
          color: 'text.secondary',
          '& .MuiListItemIcon-root': {
            color: 'text.secondary',
          },
          '&:hover': {
            bgcolor: 'action.hover',
            color: 'text.primary',
          },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }} aria-hidden>
          {icon}
        </Box>
      </ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
    </ListItemButton>
  );
}
