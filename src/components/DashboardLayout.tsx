import React from 'react';
import { Box, IconButton, Button, Chip, Typography, Snackbar } from '@mui/material';
import { ChevronLeft, Filter, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FilterSidebar } from '../features/filters/FilterSidebar';
import { AudioPlayer } from '../features/player/AudioPlayer';
import { theme } from '../theme';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { activeFilters, setFilters, setIsFilterDrawerOpen, selectedRows } = useStore();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleExportAll = () => {
    if (selectedRows.length === 0) return;
    console.log("Exporting selected IDs:", selectedRows);
    setSnackbarOpen(true);
  };

  const handleDeleteFilter = (key: string) => {
    if (key === 'interval') setFilters({ interval: 'Today' });
    else if (key === 'startDate' || key === 'endDate') setFilters({ [key]: null });
    else if (key === 'matchAll') setFilters({ matchAll: true });
    else setFilters({ [key]: '' });
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '' && v !== false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: theme.custom.headerMint, 
        px: 3, 
        py: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        gap: 2
      }}>
        {/* Left: Back Button & Active Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflow: 'hidden' }}>
          <IconButton sx={{ 
            bgcolor: 'white', 
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'grey.100' },
            flexShrink: 0
          }}>
            <ChevronLeft size={20} />
          </IconButton>
          
          {hasActiveFilters && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', bgcolor: 'white', px: 2, py: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'grey.300', overflow: 'hidden' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500, whiteSpace: 'nowrap' }}>
                Active Filters :
              </Typography>
              {Object.entries(activeFilters)
                .filter(([key, value]) => {
                  if (key === 'timezone' || key === 'matchAll') return false; 
                  if (key === 'interval' && value === 'Today') return false; 
                  return value !== '' && value !== null && value !== false;
                })
                .map(([key, value]) => {
                  let displayValue: string;
                  if (key === 'startDate' || key === 'endDate') {
                     const dateString = new Date(value as string).toLocaleDateString();
                     displayValue = `${key === 'startDate' ? 'From' : 'To'}: ${dateString}`;
                  } else if (key === 'interval') {
                     displayValue = `Time: ${value}`;
                  } else {
                     const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                     displayValue = `${formattedKey}: ${value}`;
                  }

                  return (
                    <Chip 
                      key={key}
                      label={displayValue}
                      onDelete={() => handleDeleteFilter(key)}
                      size="small"
                      className="Mui-selected"
                      sx={{ 
                        bgcolor: '#E8F5E9', 
                        color: 'primary.main',
                        fontWeight: 500,
                        height: 24,
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.main',
                          '&:hover': { color: 'primary.dark' }
                        }
                      }}
                    />
                  );
              })}
            </Box>
          )}
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
          <Button 
            variant="outlined" 
            startIcon={<Filter size={18} />}
            onClick={() => setIsFilterDrawerOpen(true)}
            sx={{ bgcolor: 'white', borderColor: 'grey.300', color: 'text.primary', display: { xs: 'none', sm: 'flex' } }}
          >
            Filter
          </Button>
          <IconButton 
            onClick={() => setIsFilterDrawerOpen(true)}
            sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'grey.300', color: 'text.primary', display: { xs: 'flex', sm: 'none' } }}
          >
            <Filter size={18} />
          </IconButton>

          <Button 
            variant="contained" 
            startIcon={<Download size={18} />}
            color="primary"
            onClick={handleExportAll}
            disabled={selectedRows.length === 0}
            sx={{ color: 'white', boxShadow: 'none', display: { xs: 'none', sm: 'flex' } }}
          >
            Export All
          </Button>
          <IconButton 
            color="primary"
            onClick={handleExportAll}
            disabled={selectedRows.length === 0}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, display: { xs: 'flex', sm: 'none' } }}
          >
            <Download size={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, bgcolor: '#F9FAFB', overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AudioPlayer />
        {children}
      </Box>

      {/* Filter Sidebar */}
      <FilterSidebar />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={`Bulk Download Started for ${selectedRows.length} items`}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
