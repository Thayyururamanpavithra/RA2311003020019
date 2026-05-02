"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, Paper, Button, useTheme, 
  alpha, Stack, Divider, Chip, Tooltip as MuiTooltip, IconButton
} from '@mui/material';
import { 
  Download, BarChart2, PieChart as PieIcon, 
  TrendingUp, Clock, FileText, Info, Share2,
  Calendar, Zap, Bell, CheckCircle2
} from 'lucide-react';
import { useNotificationsContext } from '@/context/NotificationContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Log } from 'logging_middleware';
import { motion } from 'framer-motion';

export default function StatsPage() {
  const { notifications, viewedIds } = useNotificationsContext();
  const theme = useTheme();

  useEffect(() => {
    Log("frontend", "info", "page", "Stats page loaded with charts");
  }, []);

  const volumeData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    return last7Days.map(day => {
      const count = notifications.filter(n => isSameDay(new Date(n.timestamp), day)).length;
      return {
        date: format(day, 'EEE'),
        fullDate: format(day, 'MMM dd'),
        count
      };
    });
  }, [notifications]);

  const typeData = useMemo(() => {
    const counts = {
      Placement: notifications.filter(n => n.type === 'Placement').length,
      Result: notifications.filter(n => n.type === 'Result').length,
      Event: notifications.filter(n => n.type === 'Event').length,
    };
    return [
      { name: 'Placement', value: counts.Placement, color: '#10b981' },
      { name: 'Result', value: counts.Result, color: '#3b82f6' },
      { name: 'Event', value: counts.Event, color: '#f59e0b' },
    ];
  }, [notifications]);

  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => i * 2);
    return hours.map(hour => {
      const count = notifications.filter(n => {
        const h = new Date(n.timestamp).getHours();
        return h >= hour && h < hour + 2;
      }).length;
      return {
        hour: `${hour}:00`,
        count
      };
    });
  }, [notifications]);

  const readRatioData = useMemo(() => {
    const read = viewedIds.size;
    const unread = Math.max(0, notifications.length - read);
    return [
      { name: 'Read', value: read, color: theme.palette.primary.main },
      { name: 'Unread', value: unread, color: alpha(theme.palette.text.disabled, 0.2) }
    ];
  }, [notifications.length, viewedIds.size, theme]);

  const handleExportCSV = () => {
    const headers = "ID,Type,Message,Timestamp,PriorityScore\n";
    const rows = notifications.map(n => 
      `${n.id},${n.type},"${n.message.replace(/"/g, '""')}",${n.timestamp},${n.priorityScore}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus_notifications_export_${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
    Log("frontend", "info", "component", "Data exported as CSV");
  };

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -2, mb: 1 }}>Analytics Insights</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Deep dive into campus notification patterns and engagement metrics.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<Share2 size={18} />}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            Share Report
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Download size={18} />}
            onClick={handleExportCSV}
            sx={{ borderRadius: 3, px: 3, fontWeight: 800 }}
          >
            Export Data
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 6, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TrendingUp size={22} color={theme.palette.primary.main} />
                Volume Trends
              </Typography>
              <Chip label="Live Feed" size="small" color="success" variant="outlined" sx={{ fontWeight: 700, borderRadius: 2 }} />
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.05)} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontWeight: 600, fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: theme.palette.text.secondary, fontWeight: 600, fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      background: theme.palette.background.paper
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={4} sx={{ height: '100%' }}>
            <Paper sx={{ p: 4, borderRadius: 6, flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PieIcon size={20} color={theme.palette.secondary.main} />
                Type Breakdown
              </Typography>
              <Box sx={{ height: 220, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {typeData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 6, bgcolor: alpha(theme.palette.primary.main, 0.03), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle2 size={20} color={theme.palette.primary.main} />
                Read Engagement
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ height: 80, width: 80 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={readRatioData}
                        innerRadius={25}
                        outerRadius={35}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        {readRatioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {Math.round((viewedIds.size / notifications.length) * 100 || 0)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Notifications read
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 4, borderRadius: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Clock size={22} color={theme.palette.primary.main} />
                Activity Density (24h)
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 12, height: 12, bgcolor: theme.palette.secondary.main, borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>Peak Times</Typography>
              </Stack>
            </Box>
            <Box sx={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontWeight: 600, fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontWeight: 600, fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: alpha(theme.palette.secondary.main, 0.05) }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      background: theme.palette.background.paper
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill={theme.palette.secondary.main} 
                    radius={[10, 10, 0, 0]} 
                    animationDuration={2000}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
