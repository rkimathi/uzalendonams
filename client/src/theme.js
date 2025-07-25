import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336', // Red
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800', // Orange
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3', // Blue
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50', // Green
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#3949ab',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Create a dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    primary: {
      main: '#5c6bc0', // Lighter indigo for dark mode
      light: '#8e99f3',
      dark: '#26418f',
      contrastText: '#fff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
  },
  components: {
    ...theme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

export default theme;