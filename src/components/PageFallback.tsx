import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function PageFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}
