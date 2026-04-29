import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from './theme';
import { DashboardLayout } from './components/DashboardLayout';
import { RecordingTable } from './features/table/RecordingTable';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';

const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => (
  <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
    <Typography variant="h5" color="error" gutterBottom>Something went wrong.</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{(error as Error).message || 'An unexpected error occurred.'}</Typography>
    <Button variant="contained" onClick={resetErrorBoundary}>Try again</Button>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <DashboardLayout>
            <RecordingTable />
          </DashboardLayout>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
