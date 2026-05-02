"use client";

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Grid, Switch, FormControlLabel, 
  Select, MenuItem, Button, Divider, Stack, Slider,
  alpha, useTheme, Card, CardContent
} from '@mui/material';
import { 
  Moon, Sun, RefreshCw, Layers, List, 
  Trash2, Bell, ShieldCheck 
} from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { Log } from 'logging_middleware';

export default function SettingsPage() {
  const { mode, toggleTheme } = useAppTheme();
  const theme = useTheme();
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
    Log("frontend", "info", "state", "Settings saved to localStorage");
  };

  const handleClearHistory = () => {
    localStorage.removeItem('viewedNotifications');
    Log("frontend", "info", "state", "Read history cleared");
    window.location.reload();
  };

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Settings</Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your application experience.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Layers size={20} />
                Appearance
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Dark Mode</Typography>
                  <Typography variant="body2" color="text.secondary">Switch between light and dark themes</Typography>
                </Box>
                <FormControlLabel
                  control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
                  label={mode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                />
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RefreshCw size={20} />
                Data Refresh
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Auto-refresh Interval (seconds)</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>How often the application polls for new notifications</Typography>
                <Slider
                  value={refreshInterval}
                  min={10}
                  max={120}
                  step={10}
                  marks={[
                    { value: 10, label: '10s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '1m' },
                    { value: 120, label: '2m' },
                  ]}
                  onChange={(e, v) => setRefreshInterval(v as number)}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Default Items Per Page</Typography>
                  <Typography variant="body2" color="text.secondary">Pagination size for notification lists</Typography>
                </Box>
                <Select
                  value={itemsPerPage}
                  size="small"
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Trash2 size={20} color={theme.palette.error.main} />
                Danger Zone
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Clear Read History</Typography>
                  <Typography variant="body2" color="text.secondary">Reset all notifications to unread status</Typography>
                </Box>
                <Button variant="outlined" color="error" onClick={handleClearHistory}>
                  Clear Data
                </Button>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" size="large" onClick={handleSave} sx={{ px: 4 }}>
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), border: 'none', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldCheck size={20} />
                System Info
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Version</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>2.1.0-advanced</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Environment</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Production</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Logging Status</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>Active</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">API Status</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>Connected</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
