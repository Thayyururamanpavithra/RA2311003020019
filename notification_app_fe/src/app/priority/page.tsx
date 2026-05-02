"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Typography, Box, Grid, Slider, Paper, alpha, 
  useTheme, Chip, Tooltip, IconButton, Divider, Button
} from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useNotificationsContext } from '@/context/NotificationContext';
import { usePrioritySort } from '@/hooks/usePrioritySort';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationModal } from '@/components/notifications/NotificationModal';
import { Notification } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Log } from 'logging_middleware';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function PriorityInboxPage() {
  const { notifications, loading, viewedIds, markAsRead, refresh } = useNotificationsContext();
  const [n, setN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const theme = useTheme();

  // Use advanced sorting hook
  const sortedNotifications = usePrioritySort(notifications, n);

  useEffect(() => {
    Log("frontend", "info", "page", `Priority inbox loaded with N=${n}`);
  }, [n]);

  const filteredTopN = useMemo(() => {
    if (typeFilter === 'All') return sortedNotifications;
    return sortedNotifications.filter(n => n.type === typeFilter);
  }, [sortedNotifications, typeFilter]);

  const chartData = useMemo(() => {
    const types = ['Placement', 'Result', 'Event'];
    return types.map(t => ({
      name: t,
      value: sortedNotifications.filter(n => n.type === t).length,
      color: t === 'Placement' ? '#10b981' : t === 'Result' ? '#3b82f6' : '#f59e0b'
    }));
  }, [sortedNotifications]);

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: <EmojiEventsRoundedIcon sx={{ fontSize: 22, color: "#fbbf24" }} />, label: "GOLD #1", color: "#fbbf24" };
    if (index === 1) return { icon: <MilitaryTechRoundedIcon sx={{ fontSize: 22, color: "#94a3b8" }} />, label: "SILVER #2", color: "#94a3b8" };
    if (index === 2) return { icon: <StarRoundedIcon sx={{ fontSize: 22, color: "#b45309" }} />, label: "BRONZE #3", color: "#b45309" };
    return { icon: null, label: `#${index + 1}`, color: theme.palette.text.secondary };
  };

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>Priority Inbox</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Focus on what matters most with our AI-driven priority system.
        </Typography>

        <Paper 
          sx={{ 
            p: 4, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            borderRadius: 6,
            mb: 6,
            boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.4)}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
            <BoltRoundedIcon sx={{ fontSize: 220 }} />
          </Box>
          
          <Grid container spacing={4} sx={{ alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Top-N Intelligent Ranking</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, maxWidth: 500 }}>
                Showing the top {n} notifications based on base weight, recency, and impact analysis.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Adjust Ranking Depth
                  </Typography>
                  <Slider
                    value={n}
                    min={5}
                    max={50}
                    step={5}
                    onChange={(e, v) => setN(v as number)}
                    valueLabelDisplay="auto"
                    sx={{ 
                      color: 'white',
                      '& .MuiSlider-thumb': {
                        width: 24,
                        height: 24,
                        backgroundColor: '#fff',
                        '&:before': { boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)' },
                      },
                      '& .MuiSlider-track': { height: 8, borderRadius: 4 },
                      '& .MuiSlider-rail': { height: 8, borderRadius: 4, opacity: 0.3 }
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1 }}>{n}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8 }}>LIMIT</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 3, bgcolor: alpha('#fff', 0.15), borderRadius: 4, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoRoundedIcon sx={{ fontSize: 18 }} />
                  Algorithm V2.1
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">Base Weight</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>60%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">Recency Score</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>30%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">Keyword Urgency</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>10%</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
                  Real-time recalculation every 30s
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ mb: 4, display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
            {['All', 'Placement', 'Result', 'Event'].map((type) => (
              <Chip
                key={type}
                label={type}
                onClick={() => setTypeFilter(type)}
                color={typeFilter === type ? "primary" : "default"}
                variant={typeFilter === type ? "filled" : "outlined"}
                sx={{ fontWeight: 800, px: 2, height: 44, borderRadius: 3 }}
              />
            ))}
          </Box>

          <Box sx={{ position: 'relative' }}>
            <AnimatePresence mode="popLayout">
              {filteredTopN.map((notification, index) => {
                const badge = getRankBadge(index);
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Box sx={{ position: 'relative', mb: 3 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: -60,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: { xs: 'none', xl: 'flex' },
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.5,
                          width: 50
                        }}
                      >
                        {badge.icon || <Typography variant="h6" color="text.disabled" sx={{ fontWeight: 900 }}>{index + 1}</Typography>}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 900, 
                            color: badge.color,
                            textAlign: 'center',
                            fontSize: '0.65rem'
                          }}
                        >
                          {badge.label.split(' ')[0]}
                        </Typography>
                      </Box>
                      
                      <NotificationCard
                        notification={notification}
                        isNew={!viewedIds.has(notification.id)}
                        onClick={setSelectedNotification}
                      />

                      <Tooltip title={`Priority Score: ${notification.priorityScore?.toFixed(0)}. Click to see full breakdown.`}>
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            right: 15, 
                            top: 15, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1.5,
                            color: 'primary.main',
                            cursor: 'help'
                          }}
                        >
                          <BarChartRoundedIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>
                            {notification.priorityScore?.toFixed(0)}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'sticky', top: 100 }}>
            <Paper sx={{ p: 4, borderRadius: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartRoundedIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />
                Priority Distribution
              </Typography>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {chartData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 6, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: 'primary.main' }}>
                Why Priority Matters?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Students receive an average of 25 notifications daily. Our ranking ensures you never miss a critical placement opportunity or exam result among the noise of general campus events.
              </Typography>
              <Button 
                variant="text" 
                color="primary" 
                endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                sx={{ mt: 2, fontWeight: 800, p: 0 }}
              >
                Learn More
              </Button>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <NotificationModal 
        notification={selectedNotification} 
        allNotifications={sortedNotifications}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={markAsRead}
        onNavigate={setSelectedNotification}
      />
    </Box>
  );
}
