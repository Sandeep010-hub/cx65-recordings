import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel, GridRowId } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Snackbar, LinearProgress, Typography } from '@mui/material';
import { Play, Download, Monitor, Volume2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Recording } from '../../store/useStore';
import { mockRecordings } from './mockData';
import dayjs from 'dayjs';

export const handleDownload = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const RecordingTable: React.FC = () => {
  const { setActiveRecording, activeFilters, activeRecording, setSelectedRows } = useStore();
  const [rows, setRows] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => setLoading(true), 0);
    const timer = setTimeout(() => {
      clearTimeout(loadTimer);
      // API Simulation Logic
      let filtered = [...mockRecordings];

      // Time Range Logic (Simplified for demonstration)
      if (activeFilters.interval !== 'Today' && activeFilters.interval !== 'Custom') {
         // Placeholder for interval logic (e.g. Last 7 Days)
      }

      // Main Filter Logic
      filtered = filtered.filter(rec => {
        const matchesAni = activeFilters.ani ? rec.ani.toLowerCase().includes(activeFilters.ani.toLowerCase()) : null;
        const matchesDnis = activeFilters.dnis ? rec.dnis.toLowerCase().includes(activeFilters.dnis.toLowerCase()) : null;
        const matchesDirection = activeFilters.direction ? rec.direction === activeFilters.direction : null;
        const matchesCallFlow = activeFilters.callFlow ? rec.callFlow === activeFilters.callFlow : null;

        const checks = [matchesAni, matchesDnis, matchesDirection, matchesCallFlow].filter(c => c !== null);

        if (checks.length === 0) return true;

        if (activeFilters.matchAll) {
          return checks.every(c => c === true);
        } else {
          return checks.some(c => c === true);
        }
      });

      setRows(filtered);
      setLoading(false);
    }, 500); // Simulated network latency
    return () => clearTimeout(timer);
  }, [activeFilters]);

  const handlePlayClick = (row: Recording) => {
    setActiveRecording(row);
  };

  const handleDownloadClick = (row: Recording) => {
    setSnackbarOpen(true);
    handleDownload('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', `recording_${row.id}.mp3`);
  };

  const getIconColor = (id: string) => {
    return selectedRowIds.ids.has(id as GridRowId) ? '#2F9A4E' : 'action.active';
  };

  const columns: GridColDef[] = [
    {
      field: 'play',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={() => handlePlayClick(params.row)} sx={{ color: getIconColor(params.row.id as string) }}>
          <Play size={18} />
        </IconButton>
      ),
    },
    {
      field: 'download',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={() => handleDownloadClick(params.row)} sx={{ color: getIconColor(params.row.id as string) }}>
          <Download size={18} />
        </IconButton>
      ),
    },
    {
      field: 'monitor',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isLoaded = activeRecording?.id === params.row.id;
        return (
          <IconButton size="small" sx={{ color: isLoaded ? '#2F9A4E' : getIconColor(params.row.id as string) }}>
            {isLoaded ? <Volume2 size={18} /> : <Monitor size={18} />}
          </IconButton>
        );
      },
    },
    {
      field: 'direction',
      headerName: 'Direction',
      width: 110,
      renderCell: (params) => {
        const direction = params.value as string;
        const color: 'info' | 'warning' | 'default' = direction === 'Inbound' ? 'info' : direction === 'Outbound' ? 'warning' : 'default';
        return (
          <Chip 
            label={direction} 
            size="small" 
            color={color} 
            variant="outlined" 
            sx={{ fontWeight: 500 }} 
          />
        );
      },
    },
    { field: 'ani', headerName: 'ANI', width: 140 },
    { field: 'dnis', headerName: 'DNIS', width: 140 },
    { 
      field: 'startTime', 
      headerName: 'Start Time', 
      width: 180,
      valueFormatter: (value) => dayjs(value).format('MM/DD/YYYY HH:mm:ss')
    },
    { field: 'callFlow', headerName: 'Call Flow', width: 180 },
    { 
      field: 'duration', 
      headerName: 'Duration', 
      width: 100,
      valueFormatter: (value) => {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    },
    { field: 'agent', headerName: 'Agent', width: 150 },
    { field: 'queue', headerName: 'Queue', width: 150 },
  ];

  const CustomNoRowsOverlay = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>No recordings found</Typography>
      <Typography variant="body2" color="text.secondary">Adjust your filters to see more results.</Typography>
    </Box>
  );

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {loading && <LinearProgress sx={{ '& .MuiLinearProgress-bar': { bgcolor: '#2F9A4E' } }} />}
      
      <Box sx={{ 
        flexGrow: 1, 
        bgcolor: 'white', 
        borderRadius: 1, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowX: 'auto'
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection: any) => {
            setSelectedRowIds(newSelection);
            if (newSelection?.ids) {
              setSelectedRows(Array.from(newSelection.ids).map(id => String(id)));
            } else if (Array.isArray(newSelection)) {
              setSelectedRows(newSelection.map(id => String(id)));
            }
          }}
          rowSelectionModel={selectedRowIds}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 7 },
            },
          }}
          pageSizeOptions={[7, 15, 25]}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
            },
            '& .MuiDataGrid-row.Mui-selected': {
              bgcolor: '#E8F5E9',
              '&:hover': {
                bgcolor: '#C8E6C9',
              },
            },
            '& .MuiCheckbox-root.Mui-checked': {
              color: '#2F9A4E',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #F3F4F6',
            },
          }}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Downloading..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
