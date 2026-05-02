"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Typography, Box, Grid, TextField, InputAdornment, 
  Chip, Stack, Skeleton, Pagination, MenuItem, Select,
  FormControl, InputLabel, Button, alpha, useTheme, Paper
} from '@mui/material';
import { Search, Filter, RefreshCw, XCircle } from 'lucide-react';
import { useNotificationsContext } from '@/context/NotificationContext';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationModal } from '@/components/notifications/NotificationModal';
import { Notification } from '@/types';
import { Log } from 'logging_middleware';

export default function AllNotificationsPage() {
  const { notifications, loading, viewedIds, markAsRead, refresh } = useNotificationsContext();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const theme = useTheme();

  useEffect(() => {
    Log("frontend", "info", "page", "All notifications page loaded");
  }, []);

  const filtered = useMemo(() => {
    let result = [...notifications];

    // Filter by Type
    if (typeFilter !== 'All') {
      result = result.filter(n => n.type === typeFilter);
    }

    // Filter by Search
    if (search) {
      result = result.filter(n => n.message.toLowerCase().includes(search.toLowerCase()));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === 'Oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortBy === 'Priority') return b.priorityScore - a.priorityScore;
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

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Notifications</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and filter all campus alerts.
          </Typography>
        </Box>
        <Button 
          startIcon={<RefreshCw size={18} />} 
          onClick={() => refresh()}
          disabled={loading}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }
              }}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {['All', 'Placement', 'Result', 'Event'].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setPage(1);
                  }}
                  color={typeFilter === type ? "primary" : "default"}
                  variant={typeFilter === type ? "filled" : "outlined"}
                  sx={{ fontWeight: 600 }}
                />
              ))}
              <Box sx={{ flexGrow: 1 }} />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="Newest">Newest</MenuItem>
                  <MenuItem value="Oldest">Oldest</MenuItem>
                  <MenuItem value="Priority">Priority</MenuItem>
                </Select>
              </FormControl>
              {(search || typeFilter !== 'All') && (
                <Button 
                  startIcon={<XCircle size={18} />} 
                  color="error" 
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 4 }} />
          ))}
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No notifications found.</Typography>
          <Button onClick={handleClearFilters} sx={{ mt: 2 }}>Reset Filters</Button>
        </Box>
      ) : (
        <Box>
          {paginated.map((n, i) => (
            <NotificationCard 
              key={n.id} 
              notification={n} 
              isNew={!viewedIds.has(n.id)} 
              onClick={setSelectedNotification}
              delay={i * 0.05}
            />
          ))}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Items per page:</Typography>
              <Select
                value={itemsPerPage}
                size="small"
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, v) => setPage(v)} 
              color="primary" 
              size="large"
            />
          </Box>
        </Box>
      )}

      <NotificationModal 
        notification={selectedNotification} 
        onClose={() => setSelectedNotification(null)}
        onMarkRead={markAsRead}
      />
    </Box>
  );
}
