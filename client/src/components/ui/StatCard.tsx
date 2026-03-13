
import { Card, CardContent, Typography, Box } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function StatCard({ title, value, icon, subtitle }: StatCardProps) {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 1,
        border: "1px solid rgb(27, 54, 207)",
        backgroundColor: "rgb(252, 252, 252)",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgb(235, 235, 235)",
          transform: "scale(1.01)",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={600} mt={0.5}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box color="text.secondary" display="flex" alignItems="center">
              {icon}
            </Box>
          )}

        </Box>
      </CardContent>
    </Card>
  );
}