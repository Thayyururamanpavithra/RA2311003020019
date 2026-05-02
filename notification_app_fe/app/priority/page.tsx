"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Typography, CircularProgress, Box, FormControl, 
  InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { fetchNotifications, Notification } from '../../utils/api';
import { sortNotifications } from '../../utils/sort';
import { NotificationCard } from '../../components/NotificationCard';
import { Log } from 'logging_middleware';

export default function PriorityInboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  
  const [limit, setLimit] = useState<number>(10);
  const [typeFilter, setTypeFilter] = useState<string>("All");

  useEffect(() => {
    const loadViewed = () => {
      try {
        const stored = localStorage.getItem('viewedNotifications');
        if (stored) setViewedIds(new Set(JSON.parse(stored)));
      } catch (e) {}
    };
    loadViewed();
    
    Log("frontend", "info", "page", "Priority inbox page loaded");
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

  const handleView = (id: string) => {
    const newViewed = new Set(viewedIds);
    newViewed.add(id);
    setViewedIds(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
  };

  const processedNotifications = useMemo(() => {
    // First sort all notifications by priority algorithm
    const sorted = sortNotifications(notifications);
    
    // Then apply type filter if necessary
    const filtered = typeFilter === 'All' 
      ? sorted 
      : sorted.filter(n => n.type === typeFilter);
      
    // Finally limit
    const topN = filtered.slice(0, limit);
    Log("frontend", "info", "component", `Priority inbox rendered with top ${limit}`);
    return topN;
  }, [notifications, limit, typeFilter]);

  const handleTypeChange = (e: any) => {
    const newType = e.target.value;
    Log("frontend", "debug", "hook", `Filter changed to ${newType} type`);
    setTypeFilter(newType);
  };

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
        Priority Inbox
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Show Top N</InputLabel>
          <Select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            label="Show Top N"
          >
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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

      {processedNotifications.length === 0 ? (
        <Alert severity="info">No priority notifications found.</Alert>
      ) : (
        processedNotifications.map(n => (
          <NotificationCard 
            key={n.id} 
            notification={n} 
            isNew={!viewedIds.has(n.id)} 
            onView={handleView} 
          />
        ))
      )}
    </Box>
  );
}
