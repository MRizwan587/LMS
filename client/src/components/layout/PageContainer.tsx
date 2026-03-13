import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PageContainerProps {
  title?: string;
  /** Rendered between title and action (e.g. search bar). */
  middle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, middle, action, children }: PageContainerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'auto',
        bgcolor: 'grey.50',
      }}
    >
      <Box sx={{ p: 3 }}>
        {(title || middle || action) && (
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {title && (
              <Typography variant="h5" component="h1" fontWeight={600} color="text.primary">
                {title}
              </Typography>
            )}
            {middle && (
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', px: 2 }}>
                {middle}
              </Box>
            )}
            {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
}
