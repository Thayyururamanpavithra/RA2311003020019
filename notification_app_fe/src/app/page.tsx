"use client";

import React, { useMemo } from 'react';
import { Typography, Grid, Box, Button, Paper, alpha, useTheme, Skeleton } from '@mui/material';
import { 
  Bell, Briefcase, Trophy, Calendar, 
  ArrowRight, Activity, TrendingUp 
} from 'lucide-react';
import { useNotificationsContext } from '@/context/NotificationContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationModal } from '@/components/notifications/NotificationModal';
import Link from 'next/link';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis 
} from 'recharts';
import { motion } from 'framer-motion';
import { Log } from 'logging_middleware';

export default function DashboardPage() {
  const { notifications, unreadCount, viewedIds, markAsRead, loading } = useNotificationsContext();
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);
  const theme = useTheme();

  React.useEffect(() => {
    Log("frontend", "info", "page", "Dashboard loaded");
  }, []);

  const stats = useMemo(() => {
    Log("frontend", "info", "state", `Calculating dashboard stats for ${notifications.length} notifications`);
    const counts = {
      total: notifications.length,
      placement: notifications.filter(n => n.type === 'Placement').length,
      result: notifications.filter(n => n.type === 'Result').length,
      event: notifications.filter(n => n.type === 'Event').length,
      unread: unreadCount,
    };
    return counts;
  }, [notifications, unreadCount]);

  const chartData = useMemo(() => [
    { name: 'Placement', value: stats.placement, color: '#10b981' },
    { name: 'Result', value: stats.result, color: '#3b82f6' },
    { name: 'Event', value: stats.event, color: '#f59e0b' },
  ], [stats]);

  const recentNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [notifications]);

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1, mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening on campus.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          component={Link} 
          href="/all" 
          endIcon={<ArrowRight size={18} />}
          sx={{ px: 3, py: 1.5 }}
        >
          View All
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { title: "Total", value: stats.total, icon: Activity, color: theme.palette.primary.main, delay: 0 },
          { title: "Placements", value: stats.placement, icon: Briefcase, color: "#10b981", delay: 0.1 },
          { title: "Results", value: stats.result, icon: Trophy, color: "#3b82f6", delay: 0.2 },
          { title: "Events", value: stats.event, icon: Calendar, color: "#f59e0b", delay: 0.3 },
          { title: "Unread", value: stats.unread, icon: Bell, color: "#ef4444", delay: 0.4 },
        ].map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
            {loading && notifications.length === 0 ? (
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4 }} />
            ) : (
              <StatCard {...item} />
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp size={20} />
              Distribution by Type
            </Typography>
            <Box sx={{ height: 350, minHeight: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>
              Recent Activity
            </Typography>
            <Box>
              {recentNotifications.map((n, i) => (
                <NotificationCard 
                  key={n.id} 
                  notification={n} 
                  isNew={!viewedIds.has(n.id)} 
                  onClick={setSelectedNotification}
                  delay={i * 0.1}
                />
              ))}
              <Button 
                component={Link} 
                href="/all" 
                fullWidth 
                sx={{ mt: 2, py: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05) }}
              >
                View Full Feed
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <NotificationModal 
        notification={selectedNotification} 
        onClose={() => setSelectedNotification(null)}
        onMarkRead={markAsRead}
      />
    </Box>
  );
}
