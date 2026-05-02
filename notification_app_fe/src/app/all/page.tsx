"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Typography, Box, Grid, TextField, InputAdornment, 
  Chip, Stack, Skeleton, Pagination, MenuItem, Select,
  FormControl, InputLabel, Button, alpha, useTheme, Paper,
  IconButton, Tooltip
} from '@mui/material';
import { Search, Filter, RefreshCw, XCircle, Trash2, History } from 'lucide-react';
import { useNotificationsContext } from '@/context/NotificationContext';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationModal } from '@/components/notifications/NotificationModal';
import { Toast } from '@/components/common/Toast';
import { Notification } from '@/types';
import { Log } from 'logging_middleware';
import { motion, AnimatePresence } from 'framer-motion';

export default function AllNotificationsPage() {
  const { notifications, loading, viewedIds, markAsRead, refresh } = useNotificationsContext();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as any });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const theme = useTheme();

  // Load preferences from localStorage
  useEffect(() => {
    Log("frontend", "info", "page", "All notifications page loaded");
    const savedItemsPerPage = localStorage.getItem('itemsPerPage');
    if (savedItemsPerPage) setItemsPerPage(Number(savedItemsPerPage));
    
    const savedRecent = localStorage.getItem('recentSearches');
    if (savedRecent) setRecentSearches(JSON.parse(savedRecent));
  }, []);

  const handleRefresh = async () => {
    await refresh();
    setToast({ open: true, message: 'Notifications updated successfully!', severity: 'success' });
    Log("frontend", "info", "api", "Manual refresh successful");
  };

  const filtered = useMemo(() => {
    let result = [...notifications];

    if (typeFilter !== 'All') {
      result = result.filter(n => n.type === typeFilter);
    }

    if (search) {
      result = result.filter(n => n.message.toLowerCase().includes(search.toLowerCase()));
    }

    result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === 'Oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortBy === 'Priority') return (b.priorityScore || 0) - (a.priorityScore || 0);
      return 0;
    });

    return result;
  }, [notifications, search, typeFilter, sortBy]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setSortBy('Newest');
    setPage(1);
    Log("frontend", "info", "state", "All filters cleared");
  };

  const handleSearchSubmit = (val: string) => {
    if (val && !recentSearches.includes(val)) {
      const updated = [val, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
    setSearch(val);
  };

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1, mb: 1 }}>All Notifications</Typography>
          <Typography variant="body1" color="text.secondary">
            Browse, search and filter through {notifications.length} campus alerts.
          </Typography>
        </Box>
        <Button 
          variant="contained"
          startIcon={<RefreshCw size={18} className={loading ? 'animate-spin' : ''} />} 
          onClick={handleRefresh}
          disabled={loading}
          sx={{ px: 4, py: 1.5, borderRadius: 3 }}
        >
          {loading ? 'Refreshing...' : 'Refresh Feed'}
        </Button>
      </Box>

      <Paper sx={{ p: 4, mb: 6, borderRadius: 6, background: alpha(theme.palette.background.paper, 0.6), backdropFilter: 'blur(10px)', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(search)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color={theme.palette.primary.main} />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            {recentSearches.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History size={14} color={theme.palette.text.secondary} />
                <Typography variant="caption" color="text.secondary">Recent:</Typography>
                {recentSearches.map((s, i) => (
                  <Chip key={i} label={s} size="small" variant="outlined" onClick={() => setSearch(s)} sx={{ height: 20, fontSize: '0.65rem' }} />
                ))}
              </Box>
            )}
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>Filter:</Typography>
              {['All', 'Placement', 'Result', 'Event'].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setPage(1);
                    Log("frontend", "debug", "component", `Filter changed: type=${type}`);
                  }}
                  color={typeFilter === type ? "primary" : "default"}
                  variant={typeFilter === type ? "filled" : "outlined"}
                  sx={{ 
                    fontWeight: 700, 
                    px: 1, 
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                />
              ))}
              <Box sx={{ flexGrow: 1 }} />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="Newest">Latest First</MenuItem>
                  <MenuItem value="Oldest">Oldest First</MenuItem>
                  <MenuItem value="Priority">Highest Priority</MenuItem>
                </Select>
              </FormControl>
              {(search || typeFilter !== 'All') && (
                <Tooltip title="Clear all filters">
                  <IconButton color="error" onClick={handleClearFilters} sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                    <Trash2 size={18} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {loading && notifications.length === 0 ? (
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 4, animationDelay: `${i * 0.1}s` }} />
          ))}
        </Stack>
      ) : filtered.length === 0 ? (
        <Paper sx={{ py: 12, textAlign: 'center', borderRadius: 6, border: `2px dashed ${theme.palette.divider}`, bgcolor: 'transparent' }}>
          <XCircle size={64} color={theme.palette.text.disabled} style={{ marginBottom: 16 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>No results found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Try adjusting your search keywords or filters.
          </Typography>
          <Button variant="contained" onClick={handleClearFilters} sx={{ px: 4, borderRadius: 3 }}>
            Clear All Filters
          </Button>
        </Paper>
      ) : (
        <Box>
          <AnimatePresence mode="popLayout">
            <Stack spacing={2}>
              {paginated.map((n, i) => (
                <NotificationCard 
                  key={n.id} 
                  notification={n} 
                  isNew={!viewedIds.has(n.id)} 
                  onClick={setSelectedNotification}
                  delay={i * 0.05}
                />
              ))}
            </Stack>
          </AnimatePresence>
          
          <Paper sx={{ mt: 4, p: 2, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Show:</Typography>
              <Select
                value={itemsPerPage}
                size="small"
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setItemsPerPage(val);
                  localStorage.setItem('itemsPerPage', val.toString());
                  setPage(1);
                }}
                sx={{ borderRadius: 2, height: 32 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary">
                Showing {Math.min(filtered.length, (page-1)*itemsPerPage + 1)}-{Math.min(filtered.length, page*itemsPerPage)} of {filtered.length}
              </Typography>
            </Box>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, v) => {
                setPage(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              color="primary" 
              size="medium"
              sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 2 } }}
            />
          </Paper>
        </Box>
      )}

      <NotificationModal 
        notification={selectedNotification} 
        allNotifications={filtered}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={markAsRead}
        onNavigate={setSelectedNotification}
      />

      <Toast 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Box>
  );
}
