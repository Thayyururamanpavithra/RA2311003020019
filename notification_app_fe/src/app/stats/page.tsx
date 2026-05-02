"use client";

import React, { useMemo } from 'react';
import { 
  Typography, Box, Grid, Paper, Button, useTheme, 
  alpha, Stack, Divider 
} from '@mui/material';
import { 
  Download, BarChart2, PieChart as PieIcon, 
  TrendingUp, Clock, FileText 
} from 'lucide-react';
import { useNotificationsContext } from '@/context/NotificationContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Log } from 'logging_middleware';

export default function StatsPage() {
  const { notifications } = useNotificationsContext();
  const theme = useTheme();

  React.useEffect(() => {
    Log("frontend", "info", "page", "Stats page chart rendered");
  }, []);

  // Data for Volume over Time
  const volumeData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    return last7Days.map(day => {
      const count = notifications.filter(n => isSameDay(new Date(n.timestamp), day)).length;
      return {
        date: format(day, 'MMM dd'),
        count
      };
    });
  }, [notifications]);

  // Data for Type Distribution
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

  // Data for Hourly Activity
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
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Analytics</Typography>
          <Typography variant="body1" color="text.secondary">
            Insights into campus notification trends and volume.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Download size={18} />}
          onClick={handleExportCSV}
          sx={{ px: 3, py: 1.5 }}
        >
          Export Data
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp size={20} />
              Notification Volume (Last 7 Days)
            </Typography>
            <Box sx={{ height: 400, minHeight: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.5)} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      background: theme.palette.background.paper
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: theme.palette.primary.main, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PieIcon size={20} />
              Composition
            </Typography>
            <Box sx={{ height: 350, minHeight: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={20} />
              Peak Activity Times (24h)
            </Typography>
            <Box sx={{ height: 350, minHeight: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      background: theme.palette.background.paper
                    }} 
                  />
                  <Bar dataKey="count" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
