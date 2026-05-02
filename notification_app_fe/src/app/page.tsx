"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { 
  Typography, Grid, Box, Button, Paper, alpha, 
  useTheme, Skeleton, Chip, Tooltip, IconButton
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useNotificationsContext } from '@/context/NotificationContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationModal } from '@/components/notifications/NotificationModal';
import { Toast } from '@/components/common/Toast';
import Link from 'next/link';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis,
  AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Log } from 'logging_middleware';

export default function DashboardPage() {
  const { notifications, unreadCount, viewedIds, markAsRead, loading, nextRefreshIn, refresh } = useNotificationsContext();
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as any });
  const theme = useTheme();

  useEffect(() => {
    Log("frontend", "info", "page", "Dashboard loaded");
  }, []);

  const stats = useMemo(() => {
    Log("frontend", "info", "state", `Calculating dashboard stats for ${notifications.length} notifications`);
    return {
      total: notifications.length,
      placement: notifications.filter(n => n.type === 'Placement').length,
      result: notifications.filter(n => n.type === 'Result').length,
      event: notifications.filter(n => n.type === 'Event').length,
      unread: unreadCount,
    };
  }, [notifications, unreadCount]);

  const barData = useMemo(() => [
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
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -2, mb: 1 }}>
            Campus Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Welcome to your centralized notification hub.
            </Typography>
            <Chip 
              icon={
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <LocalActivityRoundedIcon sx={{ fontSize: 16 }} />
                </motion.div>
              }
              label={`Live updates in ${nextRefreshIn}s`} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Tooltip title="Force refresh data">
            <IconButton 
              onClick={() => {
                refresh();
                setToast({ open: true, message: 'Dashboard updated!', severity: 'success' });
              }}
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <RefreshRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            component={Link} 
            href="/all" 
            endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 800 }}
          >
            Go to Inbox
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { title: "Total Alerts", value: stats.total, icon: NotificationsRoundedIcon, color: theme.palette.primary.main, delay: 0 },
          { title: "Placements", value: stats.placement, icon: WorkRoundedIcon, color: "#10b981", delay: 0.1 },
          { title: "Exam Results", value: stats.result, icon: EmojiEventsRoundedIcon, color: "#3b82f6", delay: 0.2 },
          { title: "Events", value: stats.event, icon: EventRoundedIcon, color: "#f59e0b", delay: 0.3 },
          { title: "Unread", value: stats.unread, icon: ErrorOutlineRoundedIcon, color: "#ef4444", delay: 0.4 },
        ].map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
            {loading && notifications.length === 0 ? (
              <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 6 }} />
            ) : (
              <StatCard {...item} />
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 6, height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TrendingUpRoundedIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />
                Volume Analysis
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {['Daily', 'Weekly'].map(t => (
                  <Chip key={t} label={t} size="small" variant={t === 'Daily' ? 'filled' : 'outlined'} sx={{ fontWeight: 700 }} />
                ))}
              </Box>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontWeight: 600, fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: theme.palette.text.secondary, fontWeight: 600, fontSize: 12 }} 
                  />
                  <RechartsTooltip 
                    cursor={{ fill: alpha(theme.palette.primary.main, 0.05) }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      background: theme.palette.background.paper
                    }} 
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 6, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Recent Activity
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer' }} component={Link} href="/all">
                View All
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AnimatePresence mode="popLayout">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((n, i) => (
                    <NotificationCard 
                      key={n.id} 
                      notification={n} 
                      isNew={!viewedIds.has(n.id)} 
                      onClick={setSelectedNotification}
                      delay={i * 0.1}
                    />
                  ))
                ) : (
                  [1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 4 }} />
                  ))
                )}
              </AnimatePresence>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <NotificationModal 
        notification={selectedNotification} 
        allNotifications={notifications}
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
