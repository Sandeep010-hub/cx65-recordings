import React, { useEffect, useState } from 'react';
import { 
  Drawer, Box, Typography, IconButton, TextField, 
  Select, MenuItem, FormControl, InputLabel, 
  ToggleButtonGroup, ToggleButton, Stack, Divider 
} from '@mui/material';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDebounce } from 'use-debounce';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const FilterSidebar: React.FC = () => {
  const { isFilterDrawerOpen, setIsFilterDrawerOpen, activeFilters, setFilters } = useStore();

  // Local state for debounced inputs
  const [aniInput, setAniInput] = useState(activeFilters.ani);
  const [dnisInput, setDnisInput] = useState(activeFilters.dnis);
  
  const [debouncedAni] = useDebounce(aniInput, 300);
  const [debouncedDnis] = useDebounce(dnisInput, 300);

  useEffect(() => {
    setFilters({ ani: debouncedAni, dnis: debouncedDnis });
  }, [debouncedAni, debouncedDnis, setFilters]);

  // Sync back from store if cleared externally
  useEffect(() => {
    const t1 = setTimeout(() => {
      if (activeFilters.ani !== debouncedAni) setAniInput(activeFilters.ani);
      if (activeFilters.dnis !== debouncedDnis) setDnisInput(activeFilters.dnis);
    }, 0);
    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters.ani, activeFilters.dnis]);

  const handleClose = () => setIsFilterDrawerOpen(false);

  const handleDateChange = (field: 'startDate' | 'endDate', date: Dayjs | null) => {
    if (date) {
      // Convert to UTC before saving
      setFilters({ [field]: date.utc().toISOString() });
    } else {
      setFilters({ [field]: null });
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isFilterDrawerOpen}
      onClose={handleClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 3, 
          bgcolor: 'custom.headerMint',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Filters</Typography>
          <IconButton onClick={handleClose} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Stack spacing={3}>
            {/* Logic Toggle */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Logic</Typography>
              <ToggleButtonGroup
                color="primary"
                value={activeFilters.matchAll ? 'all' : 'any'}
                exclusive
                onChange={(_, val) => {
                  if (val !== null) setFilters({ matchAll: val === 'all' });
                }}
                fullWidth
                size="small"
              >
                <ToggleButton value="all">Match All</ToggleButton>
                <ToggleButton value="any">Match Any</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Divider />

            {/* Time & Date */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Time Range ({activeFilters.timezone})</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Interval</InputLabel>
                <Select
                  value={activeFilters.interval}
                  label="Interval"
                  onChange={(e) => setFilters({ interval: e.target.value })}
                >
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                  <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={activeFilters.startDate ? dayjs(activeFilters.startDate) : null}
                  onChange={(val) => handleDateChange('startDate', val)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <DatePicker
                  label="End Date"
                  value={activeFilters.endDate ? dayjs(activeFilters.endDate) : null}
                  onChange={(val) => handleDateChange('endDate', val)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Caller Details */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Caller Details</Typography>
              <Stack spacing={2}>
                <TextField 
                  label="ANI (Caller ID)" 
                  size="small" 
                  fullWidth 
                  value={aniInput}
                  onChange={(e) => setAniInput(e.target.value)}
                />
                <TextField 
                  label="DNIS (Dialed Number)" 
                  size="small" 
                  fullWidth 
                  value={dnisInput}
                  onChange={(e) => setDnisInput(e.target.value)}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Additional Attributes */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Call Attributes</Typography>
              <Stack spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Direction</InputLabel>
                  <Select
                    value={activeFilters.direction}
                    label="Direction"
                    onChange={(e) => setFilters({ direction: e.target.value })}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Inbound">Inbound</MenuItem>
                    <MenuItem value="Outbound">Outbound</MenuItem>
                    <MenuItem value="Internal">Internal</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small">
                  <InputLabel>Call Flow</InputLabel>
                  <Select
                    value={activeFilters.callFlow}
                    label="Call Flow"
                    onChange={(e) => setFilters({ callFlow: e.target.value })}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Main IVR > Agent">Main IVR &gt; Agent</MenuItem>
                    <MenuItem value="Direct > Agent">Direct &gt; Agent</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Media Type</InputLabel>
                  <Select
                    value={activeFilters.mediaType}
                    label="Media Type"
                    onChange={(e) => setFilters({ mediaType: e.target.value })}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Audio">Audio</MenuItem>
                    <MenuItem value="Video">Video</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};
