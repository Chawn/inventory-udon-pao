'use client';

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { thTH } from '@mui/material/locale';

// สร้าง theme สำหรับระบบจัดการเครื่องจักร
const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', // สีน้ำเงิน
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#2e7d32', // สีเขียว
        light: '#4caf50',
        dark: '#1b5e20',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        'Sarabun',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
  },
  thTH // Thai locale
);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
