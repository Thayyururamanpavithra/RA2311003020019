"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Typography, CircularProgress, Box, FormControl, 
  InputLabel, Select, MenuItem, Pagination, Alert
} from '@mui/material';
import { fetchNotifications, Notification } from '../utils/api';
import { NotificationCard } from '../components/NotificationCard';
import { Log } from 'logging_middleware';
import { useSearchParams, useRouter } from 'next/navigation';

function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeFilter = searchParams.get('notification_type') || 'All';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);

  useEffect(() => {
    const loadViewed = () => {
      try {
        const stored = localStorage.getItem('viewedNotifications');
        if (stored) setViewedIds(new Set(JSON.parse(stored)));
      } catch (e) {}
    };
    loadViewed();
    
    Log("frontend", "info", "page", "All notifications page loaded");
    const loadData = async () => {
      try {
        const data = await fetchNotifications();
        if (data && data.length > 0) {
          setNotifications(data);
        } else {
          Log("frontend", "warn", "hook", "No notifications returned from API");
        }
      } catch (err) {
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTypeChange = (e: any) => {
    const newType = e.target.value;
    Log("frontend", "debug", "hook", `Filter changed to ${newType} type`);
    const params = new URLSearchParams(searchParams.toString());
    if (newType === 'All') params.delete('notification_type');
    else params.set('notification_type', newType);
    params.set('page', '1'); // Reset to first page
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleView = (id: string) => {
    const newViewed = new Set(viewedIds);
    newViewed.add(id);
    setViewedIds(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
  };

  const filtered = useMemo(() => {
    return typeFilter === 'All' 
      ? notifications 
      : notifications.filter(n => n.type === typeFilter);
  }, [notifications, typeFilter]);

  const paginated = useMemo(() => {
    const start = (pageParam - 1) * limitParam;
    return filtered.slice(start, start + limitParam);
  }, [filtered, pageParam, limitParam]);

  const totalPages = Math.ceil(filtered.length / limitParam);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
        All Notifications
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={handleTypeChange}
            label="Filter by Type"
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {paginated.length === 0 ? (
        <Alert severity="info">No notifications found.</Alert>
      ) : (
        paginated.map(n => (
          <NotificationCard 
            key={n.id} 
            notification={n} 
            isNew={!viewedIds.has(n.id)} 
            onView={handleView} 
          />
        ))
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={pageParam} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
}

export default function AllNotificationsPage() {
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <NotificationsContent />
    </React.Suspense>
  );
}
