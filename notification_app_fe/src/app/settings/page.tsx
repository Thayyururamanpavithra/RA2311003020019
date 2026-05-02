"use client";

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Grid, Switch, FormControlLabel, 
  Select, MenuItem, Button, Divider, Slider, Chip,
  alpha, useTheme, Card, CardContent, IconButton, Tooltip
} from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import LaptopMacRoundedIcon from '@mui/icons-material/LaptopMacRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useAppTheme } from '@/context/ThemeContext';
import { useNotificationsContext } from '@/context/NotificationContext';
import { Toast } from '@/components/common/Toast';
import { Log } from 'logging_middleware';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { mode, toggleTheme } = useAppTheme();
  const { clearReadHistory } = useNotificationsContext();
  const theme = useTheme();
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as any });

  useEffect(() => {
    const savedInterval = localStorage.getItem('refreshInterval');
    const savedItems = localStorage.getItem('itemsPerPage');
    if (savedInterval) setRefreshInterval(Number(savedInterval));
    if (savedItems) setItemsPerPage(Number(savedItems));
    
    Log("frontend", "info", "page", "Settings page loaded");
  }, []);

  const handleSave = () => {
    localStorage.setItem('refreshInterval', refreshInterval.toString());
    localStorage.setItem('itemsPerPage', itemsPerPage.toString());
    window.dispatchEvent(new Event('local-settings-updated'));
    setToast({ open: true, message: 'Settings saved successfully!', severity: 'success' });
    Log("frontend", "info", "state", "Settings saved to localStorage");
  };

  const onClearHistory = () => {
    clearReadHistory();
    setToast({ open: true, message: 'Read history has been cleared.', severity: 'info' });
    Log("frontend", "info", "state", "Read history cleared from settings page");
  };

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -2, mb: 1 }}>Preferences</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Customize your campus notification experience.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<SaveRoundedIcon fontSize="small" />}
          onClick={handleSave}
          sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800 }}
        >
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LaptopMacRoundedIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />
                Interface & Appearance
              </Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box 
                    onClick={mode === 'light' ? toggleTheme : undefined}
                    sx={{ 
                      p: 3, 
                      borderRadius: 4, 
                      border: `2px solid ${mode === 'dark' ? theme.palette.primary.main : 'transparent'}`,
                      bgcolor: alpha(theme.palette.primary.main, mode === 'dark' ? 0.05 : 0),
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <DarkModeRoundedIcon sx={{ fontSize: 24, color: mode === 'dark' ? theme.palette.primary.main : theme.palette.text.secondary }} />
                      <Switch checked={mode === 'dark'} onChange={toggleTheme} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Dark Vision</Typography>
                    <Typography variant="body2" color="text.secondary">Easy on the eyes in low light</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box 
                    onClick={mode === 'dark' ? toggleTheme : undefined}
                    sx={{ 
                      p: 3, 
                      borderRadius: 4, 
                      border: `2px solid ${mode === 'light' ? theme.palette.primary.main : 'transparent'}`,
                      bgcolor: alpha(theme.palette.primary.main, mode === 'light' ? 0.05 : 0),
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <WbSunnyRoundedIcon sx={{ fontSize: 24, color: mode === 'light' ? theme.palette.primary.main : theme.palette.text.secondary }} />
                      <Switch checked={mode === 'light'} onChange={toggleTheme} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Daylight</Typography>
                    <Typography variant="body2" color="text.secondary">High contrast for bright environments</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BoltRoundedIcon sx={{ fontSize: 22, color: theme.palette.warning.main }} />
                Performance & Updates
              </Typography>
              
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Polling Frequency</Typography>
                    <Typography variant="body2" color="text.secondary">How often to check for new alerts</Typography>
                  </Box>
                  <Chip label={`${refreshInterval} seconds`} color="primary" sx={{ fontWeight: 800, borderRadius: 2 }} />
                </Box>
                <Slider
                  value={refreshInterval}
                  min={10}
                  max={60}
                  step={5}
                  marks={[
                    { value: 10, label: '10s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '60s' },
                  ]}
                  onChange={(e, v) => setRefreshInterval(v as number)}
                  valueLabelDisplay="auto"
                  sx={{ mt: 2 }}
                />
              </Box>

              <Divider sx={{ my: 4, opacity: 0.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Default Pagination</Typography>
                  <Typography variant="body2" color="text.secondary">Notifications shown per page by default</Typography>
                </Box>
                <Select
                  value={itemsPerPage}
                  size="small"
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  sx={{ minWidth: 120, borderRadius: 3, fontWeight: 700 }}
                >
                  <MenuItem value={5}>5 items</MenuItem>
                  <MenuItem value={10}>10 items</MenuItem>
                  <MenuItem value={20}>20 items</MenuItem>
                  <MenuItem value={50}>50 items</MenuItem>
                </Select>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 6, border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`, bgcolor: alpha(theme.palette.error.main, 0.02) }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main' }}>
                <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
                Data & Privacy
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Reset Read History</Typography>
                  <Typography variant="body2" color="text.secondary">This will mark all notifications as unread</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteRoundedIcon fontSize="small" />}
                  onClick={onClearHistory}
                  sx={{ borderRadius: 3, fontWeight: 700 }}
                >
                  Clear History
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Card sx={{ borderRadius: 6, bgcolor: alpha(theme.palette.primary.main, 0.05), border: 'none', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.05 }}>
                <SettingsRoundedIcon sx={{ fontSize: 150 }} />
              </Box>
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <VerifiedUserRoundedIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />
                  System Audit
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {[
                    { label: 'System Version', value: 'v2.1.4-gold', color: 'text.primary' },
                    { label: 'Environment', value: 'Production', color: 'success.main' },
                    { label: 'API Integration', value: 'Connected', color: 'success.main' },
                    { label: 'Audit Logging', value: 'Enabled', color: 'success.main' },
                    { label: 'Encryption', value: 'AES-256', color: 'text.secondary' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{item.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: item.color }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 3 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <InfoRoundedIcon sx={{ fontSize: 14 }} />
                  All settings are stored locally in your browser.
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ p: 4, borderRadius: 6, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsRoundedIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                About Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Notifications are fetched from the central campus server. If you experience delays, try reducing the polling frequency or refreshing manually.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Toast 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Box>
  );
}
