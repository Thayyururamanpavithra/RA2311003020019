import { createTheme, alpha } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#60a5fa' : '#1e3a8a', // Electric blue in dark, Deep navy in light
      light: '#93c5fd',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#c084fc',
    },
    background: {
      default: mode === 'dark' ? '#020617' : '#f8fafc', // Slate 950 vs 50
      paper: mode === 'dark' ? '#0f172a' : '#ffffff', // Slate 900 vs white
    },
    text: {
      primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
      secondary: mode === 'dark' ? '#94a3b8' : '#475569',
    },
    divider: mode === 'dark' ? alpha('#ffffff', 0.08) : alpha('#000000', 0.08),
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.01em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px -4px rgba(0,0,0,0.2)',
          },
        },
        containedPrimary: {
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
            : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          '&:hover': {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' 
              : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: mode === 'dark' 
            ? alpha('#0f172a', 0.4) 
            : alpha('#ffffff', 0.8),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${mode === 'dark' ? alpha('#ffffff', 0.08) : alpha('#000000', 0.05)}`,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: mode === 'dark' 
              ? '0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 18px 36px -18px rgba(0, 0, 0, 0.5)'
              : '0 30px 60px -12px rgba(0, 0, 0, 0.1), 0 18px 36px -18px rgba(0, 0, 0, 0.05)',
            borderColor: mode === 'dark' ? alpha('#ffffff', 0.2) : alpha('#000000', 0.1),
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' 
            ? alpha('#020617', 0.7) 
            : alpha('#ffffff', 0.7),
          backdropFilter: 'blur(20px)',
          color: mode === 'dark' ? '#f8fafc' : '#0f172a',
          boxShadow: 'none',
          borderBottom: `1px solid ${mode === 'dark' ? alpha('#ffffff', 0.08) : alpha('#000000', 0.05)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const theme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
