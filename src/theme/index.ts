import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      headerMint: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      headerMint?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2F9A4E', // Emerald
    },
  },
  custom: {
    headerMint: '#E8F5E9',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '4px 12px',
          textTransform: 'none',
          '&:active': {
            backgroundColor: '#2F9A4E',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '4px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&.Mui-selected': {
            backgroundColor: '#2F9A4E',
            color: '#fff',
          },
        },
      },
    },
  },
});
