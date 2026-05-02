import { createTheme, alpha } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#3b82f6' : '#1e3a8a', // Electric blue in dark, Deep navy in light
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#f8fafc', // Slate 950 vs 50
      paper: mode === 'dark' ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
      secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
    },
    divider: mode === 'dark' ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: mode === 'dark' 
            ? alpha('#1e293b', 0.8) 
            : alpha('#ffffff', 0.8),
          backdropFilter: 'blur(12px)',
          border: `1px solid ${mode === 'dark' ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'dark' 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' 
            ? alpha('#0f172a', 0.8) 
            : alpha('#ffffff', 0.8),
          backdropFilter: 'blur(12px)',
          color: mode === 'dark' ? '#f1f5f9' : '#1e293b',
          boxShadow: 'none',
          borderBottom: `1px solid ${mode === 'dark' ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1)}`,
        },
      },
    },
  },
});

export const theme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
